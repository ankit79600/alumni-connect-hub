-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view RSVPs" ON public.event_rsvps;

-- Create a more restrictive SELECT policy
-- Users can see their own RSVPs, event creators can see RSVPs for their events, admins can see all
CREATE POLICY "Users can view own RSVPs or admins and event creators can view all"
ON public.event_rsvps
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_rsvps.event_id 
    AND events.created_by = auth.uid()
  )
);