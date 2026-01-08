
-- Create mentorship_sessions table
CREATE TABLE public.mentorship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'missed', 'cancelled')),
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentorship_feedback table
CREATE TABLE public.mentorship_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.mentorship_sessions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewee_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, reviewer_id)
);

-- Enable RLS
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for mentorship_sessions
CREATE POLICY "Users can view their own sessions"
ON public.mentorship_sessions
FOR SELECT
USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Mentors can create sessions for accepted requests"
ON public.mentorship_sessions
FOR INSERT
WITH CHECK (
  mentor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.mentorship_requests
    WHERE id = request_id AND mentor_id = auth.uid() AND status = 'accepted'
  )
);

CREATE POLICY "Participants can update session status"
ON public.mentorship_sessions
FOR UPDATE
USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Mentors can delete their sessions"
ON public.mentorship_sessions
FOR DELETE
USING (mentor_id = auth.uid());

-- RLS policies for mentorship_feedback
CREATE POLICY "Users can view feedback for their sessions"
ON public.mentorship_feedback
FOR SELECT
USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE POLICY "Session participants can leave feedback"
ON public.mentorship_feedback
FOR INSERT
WITH CHECK (
  reviewer_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.mentorship_sessions
    WHERE id = session_id AND status = 'completed' AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_mentorship_sessions_updated_at
BEFORE UPDATE ON public.mentorship_sessions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_sessions;
