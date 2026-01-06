import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Profile } from "./useProfile";

export interface MentorshipRequest {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  created_at: string;
  updated_at: string;
  mentor_profile?: Profile;
  mentee_profile?: Profile;
}

export function useMentorship() {
  const { user, role } = useAuth();
  const [mentors, setMentors] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_mentor", true);

    setMentors((data as Profile[]) || []);
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) return;

    const column = role === "alumni" ? "mentor_id" : "mentee_id";
    const { data } = await supabase
      .from("mentorship_requests")
      .select("*")
      .eq(column, user.id)
      .order("created_at", { ascending: false });

    if (!data) {
      setRequests([]);
      return;
    }

    // Fetch profiles for all users in requests
    const userIds = new Set<string>();
    data.forEach((r) => {
      userIds.add(r.mentor_id);
      userIds.add(r.mentee_id);
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", Array.from(userIds));

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const enrichedRequests = data.map((r) => ({
      ...r,
      mentor_profile: profileMap.get(r.mentor_id) as Profile | undefined,
      mentee_profile: profileMap.get(r.mentee_id) as Profile | undefined,
    }));

    setRequests(enrichedRequests as MentorshipRequest[]);
    setLoading(false);
  }, [user?.id, role]);

  useEffect(() => {
    fetchMentors();
    fetchRequests();
  }, [fetchMentors, fetchRequests]);

  const sendRequest = async (mentorId: string, message?: string) => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("mentorship_requests").insert({
      mentor_id: mentorId,
      mentee_id: user.id,
      message,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already Requested", description: "You've already sent a request to this mentor", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return { error };
    }

    toast({ title: "Request Sent", description: "Your mentorship request has been sent" });
    fetchRequests();
    return { error: null };
  };

  const updateRequestStatus = async (requestId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("mentorship_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Success", description: `Request ${status}` });
    fetchRequests();
    return { error: null };
  };

  const toggleMentorStatus = async () => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const currentProfile = mentors.find((m) => m.user_id === user.id);
    const newStatus = !currentProfile?.is_mentor;

    const { error } = await supabase
      .from("profiles")
      .update({ is_mentor: newStatus })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Success", description: newStatus ? "You're now a mentor!" : "Mentor status removed" });
    fetchMentors();
    return { error: null };
  };

  return { mentors, requests, loading, sendRequest, updateRequestStatus, toggleMentorStatus, refetch: fetchRequests };
}
