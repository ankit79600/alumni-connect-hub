-- Add mentorship-related tables and enhanced profile fields

-- Create mentorship_requests table
CREATE TABLE public.mentorship_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

-- Enable RLS
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Policies for mentorship_requests
CREATE POLICY "Users can view their own mentorship requests"
ON public.mentorship_requests
FOR SELECT
USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "UG students can create mentorship requests"
ON public.mentorship_requests
FOR INSERT
WITH CHECK (
  mentee_id = auth.uid() AND
  has_role(auth.uid(), 'student'::app_role) AND
  has_role(mentor_id, 'alumni'::app_role)
);

CREATE POLICY "Mentors can update request status"
ON public.mentorship_requests
FOR UPDATE
USING (mentor_id = auth.uid());

CREATE POLICY "Users can delete their own requests"
ON public.mentorship_requests
FOR DELETE
USING (mentee_id = auth.uid() OR mentor_id = auth.uid());

-- Add new fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS activities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for mentorship_requests updated_at
CREATE TRIGGER update_mentorship_requests_updated_at
BEFORE UPDATE ON public.mentorship_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();