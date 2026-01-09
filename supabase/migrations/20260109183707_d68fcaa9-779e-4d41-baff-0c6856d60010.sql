-- ================================================
-- RLS Policy Update: Alumni/Admin Content Publishing
-- ================================================

-- Drop existing policies that need updating
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Alumni can submit stories" ON public.success_stories;
DROP POLICY IF EXISTS "Approved stories are viewable by all authenticated" ON public.success_stories;
DROP POLICY IF EXISTS "Admins can manage stories" ON public.success_stories;

-- ================================================
-- POSTS TABLE: Only alumni and admin can create
-- ================================================

-- Alumni and admin can create posts
CREATE POLICY "Alumni and admins can create posts"
ON public.posts
FOR INSERT
WITH CHECK (
  (author_id = auth.uid()) AND 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'alumni'::app_role))
);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
ON public.posts
FOR UPDATE
USING (author_id = auth.uid());

-- Authors and admins can delete posts
CREATE POLICY "Authors and admins can delete posts"
ON public.posts
FOR DELETE
USING (author_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- ================================================
-- SUCCESS_STORIES TABLE: No approval needed, direct publish
-- ================================================

-- All authenticated users can view all stories (no approval check)
CREATE POLICY "Stories are viewable by authenticated users"
ON public.success_stories
FOR SELECT
USING (true);

-- Only alumni and admin can create stories
CREATE POLICY "Alumni and admins can create stories"
ON public.success_stories
FOR INSERT
WITH CHECK (
  (alumni_id = auth.uid()) AND 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'alumni'::app_role))
);

-- Authors can update their own stories
CREATE POLICY "Authors can update own stories"
ON public.success_stories
FOR UPDATE
USING (alumni_id = auth.uid());

-- Authors and admins can delete stories
CREATE POLICY "Authors and admins can delete stories"
ON public.success_stories
FOR DELETE
USING (alumni_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));