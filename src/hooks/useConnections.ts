import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export function useConnections(userId?: string) {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<Connection[]>([]);
  const [following, setFollowing] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchConnections();
    }
  }, [targetUserId]);

  const fetchConnections = async () => {
    if (!targetUserId) return;

    setLoading(true);

    const [followersRes, followingRes] = await Promise.all([
      supabase
        .from("connections")
        .select("*")
        .eq("following_id", targetUserId),
      supabase
        .from("connections")
        .select("*")
        .eq("follower_id", targetUserId),
    ]);

    if (followersRes.data) setFollowers(followersRes.data);
    if (followingRes.data) setFollowing(followingRes.data);

    setLoading(false);
  };

  const isFollowing = (profileUserId: string): boolean => {
    if (!user?.id) return false;
    return following.some((c) => c.following_id === profileUserId);
  };

  const follow = async (profileUserId: string) => {
    if (!user?.id) {
      toast({ title: "Error", description: "Please sign in to follow users", variant: "destructive" });
      return { error: new Error("Not authenticated") };
    }

    if (user.id === profileUserId) {
      toast({ title: "Error", description: "You cannot follow yourself", variant: "destructive" });
      return { error: new Error("Cannot follow yourself") };
    }

    const { error } = await supabase.from("connections").insert({
      follower_id: user.id,
      following_id: profileUserId,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Success", description: "You are now following this user" });
    await fetchConnections();
    return { error: null };
  };

  const unfollow = async (profileUserId: string) => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", profileUserId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Success", description: "Unfollowed user" });
    await fetchConnections();
    return { error: null };
  };

  return {
    followers,
    following,
    loading,
    isFollowing,
    follow,
    unfollow,
    refetch: fetchConnections,
    followerCount: followers.length,
    followingCount: following.length,
  };
}
