import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  department?: string;
  graduation_year?: number;
  current_company?: string;
  current_position?: string;
  location?: string;
  linkedin_url?: string;
  twitter_url?: string;
  skills?: string[];
  achievements?: string[];
  activities?: string[];
  is_mentor?: boolean;
}

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchProfile();
    }
  }, [targetUserId]);

  const fetchProfile = async () => {
    if (!targetUserId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", targetUserId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data as Profile);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id || !profile) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    }

    setProfile({ ...profile, ...updates });
    toast({ title: "Success", description: "Profile updated successfully" });
    return { error: null };
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return { error: new Error("Not authenticated"), url: null };

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error", description: uploadError.message, variant: "destructive" });
      return { error: uploadError, url: null };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatar_url = data.publicUrl;

    await updateProfile({ avatar_url });
    return { error: null, url: avatar_url };
  };

  return { profile, loading, updateProfile, uploadAvatar, refetch: fetchProfile };
}
