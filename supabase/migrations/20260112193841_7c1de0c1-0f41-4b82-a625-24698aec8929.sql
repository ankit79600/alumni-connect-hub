-- Create validation function for text length limits
CREATE OR REPLACE FUNCTION public.validate_text_length()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate based on the table name
  CASE TG_TABLE_NAME
    WHEN 'posts' THEN
      IF LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Title too long (max 200 characters)';
      END IF;
      IF LENGTH(NEW.content) > 50000 THEN
        RAISE EXCEPTION 'Content too long (max 50,000 characters)';
      END IF;
    WHEN 'messages' THEN
      IF LENGTH(NEW.content) > 5000 THEN
        RAISE EXCEPTION 'Message too long (max 5,000 characters)';
      END IF;
    WHEN 'jobs' THEN
      IF LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Job title too long (max 200 characters)';
      END IF;
      IF NEW.description IS NOT NULL AND LENGTH(NEW.description) > 10000 THEN
        RAISE EXCEPTION 'Job description too long (max 10,000 characters)';
      END IF;
    WHEN 'success_stories' THEN
      IF LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Story title too long (max 200 characters)';
      END IF;
      IF LENGTH(NEW.story) > 20000 THEN
        RAISE EXCEPTION 'Story content too long (max 20,000 characters)';
      END IF;
    WHEN 'events' THEN
      IF LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Event title too long (max 200 characters)';
      END IF;
      IF NEW.description IS NOT NULL AND LENGTH(NEW.description) > 5000 THEN
        RAISE EXCEPTION 'Event description too long (max 5,000 characters)';
      END IF;
  END CASE;
  
  RETURN NEW;
END;
$$;

-- Create triggers for each table
CREATE TRIGGER validate_posts_length
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_text_length();

CREATE TRIGGER validate_messages_length
  BEFORE INSERT OR UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_text_length();

CREATE TRIGGER validate_jobs_length
  BEFORE INSERT OR UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_text_length();

CREATE TRIGGER validate_success_stories_length
  BEFORE INSERT OR UPDATE ON public.success_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_text_length();

CREATE TRIGGER validate_events_length
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_text_length();