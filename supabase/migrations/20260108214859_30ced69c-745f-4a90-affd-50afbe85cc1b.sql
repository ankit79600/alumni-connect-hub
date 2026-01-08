
-- Create connections table for follow/connect system
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Users can view all connections (public network)
CREATE POLICY "Connections are viewable by authenticated users"
ON public.connections
FOR SELECT
USING (true);

-- Users can follow others
CREATE POLICY "Users can create their own connections"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can delete their own connections"
ON public.connections
FOR DELETE
USING (auth.uid() = follower_id);
