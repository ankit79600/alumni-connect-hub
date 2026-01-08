import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Profile } from "./useProfile";

export interface MentorshipSession {
  id: string;
  request_id: string;
  mentor_id: string;
  mentee_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "upcoming" | "completed" | "missed" | "cancelled";
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  mentor_profile?: Profile;
  mentee_profile?: Profile;
  feedback?: MentorshipFeedback[];
}

export interface MentorshipFeedback {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export function useMentorshipSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("mentorship_sessions")
      .select("*")
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching sessions:", error);
      setLoading(false);
      return;
    }

    if (!data) {
      setSessions([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for all users in sessions
    const userIds = new Set<string>();
    data.forEach((s) => {
      userIds.add(s.mentor_id);
      userIds.add(s.mentee_id);
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", Array.from(userIds));

    // Fetch feedback for all sessions
    const sessionIds = data.map((s) => s.id);
    const { data: feedbackData } = await supabase
      .from("mentorship_feedback")
      .select("*")
      .in("session_id", sessionIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
    const feedbackMap = new Map<string, MentorshipFeedback[]>();
    feedbackData?.forEach((f) => {
      const existing = feedbackMap.get(f.session_id) || [];
      existing.push(f as MentorshipFeedback);
      feedbackMap.set(f.session_id, existing);
    });

    const enrichedSessions = data.map((s) => ({
      ...s,
      status: s.status as MentorshipSession["status"],
      mentor_profile: profileMap.get(s.mentor_id) as Profile | undefined,
      mentee_profile: profileMap.get(s.mentee_id) as Profile | undefined,
      feedback: feedbackMap.get(s.id) || [],
    }));

    setSessions(enrichedSessions as MentorshipSession[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchSessions();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("mentorship-sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mentorship_sessions" },
        () => fetchSessions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  const scheduleSession = async (
    requestId: string,
    mentorId: string,
    menteeId: string,
    scheduledAt: Date,
    durationMinutes: number = 30,
    meetingLink?: string,
    notes?: string
  ) => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("mentorship_sessions").insert({
      request_id: requestId,
      mentor_id: mentorId,
      mentee_id: menteeId,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: durationMinutes,
      meeting_link: meetingLink,
      notes: notes,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Session Scheduled", description: "Mentorship session has been scheduled" });
    fetchSessions();
    return { error: null };
  };

  const updateSessionStatus = async (sessionId: string, status: MentorshipSession["status"]) => {
    const { error } = await supabase
      .from("mentorship_sessions")
      .update({ status })
      .eq("id", sessionId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Success", description: `Session marked as ${status}` });
    fetchSessions();
    return { error: null };
  };

  const submitFeedback = async (
    sessionId: string,
    revieweeId: string,
    rating: number,
    feedbackText?: string
  ) => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("mentorship_feedback").insert({
      session_id: sessionId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      feedback: feedbackText,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already Submitted", description: "You've already submitted feedback for this session", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return { error };
    }

    toast({ title: "Feedback Submitted", description: "Thank you for your feedback!" });
    fetchSessions();
    return { error: null };
  };

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const missedSessions = sessions.filter((s) => s.status === "missed");

  return {
    sessions,
    upcomingSessions,
    completedSessions,
    missedSessions,
    loading,
    scheduleSession,
    updateSessionStatus,
    submitFeedback,
    refetch: fetchSessions,
  };
}
