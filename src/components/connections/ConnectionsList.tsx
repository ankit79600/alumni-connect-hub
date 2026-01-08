import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowButton } from "./FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  current_position?: string;
  current_company?: string;
}

interface ConnectionsListProps {
  userId: string;
  followerCount: number;
  followingCount: number;
}

export function ConnectionsList({ userId, followerCount, followingCount }: ConnectionsListProps) {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectionProfiles();
  }, [userId]);

  const fetchConnectionProfiles = async () => {
    setLoading(true);

    // Fetch followers (people who follow this user)
    const { data: followerConnections } = await supabase
      .from("connections")
      .select("follower_id")
      .eq("following_id", userId);

    // Fetch following (people this user follows)
    const { data: followingConnections } = await supabase
      .from("connections")
      .select("following_id")
      .eq("follower_id", userId);

    const followerIds = followerConnections?.map((c) => c.follower_id) || [];
    const followingIds = followingConnections?.map((c) => c.following_id) || [];

    // Fetch profiles for followers
    if (followerIds.length > 0) {
      const { data: followerProfiles } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, avatar_url, current_position, current_company")
        .in("user_id", followerIds);
      setFollowers(followerProfiles || []);
    }

    // Fetch profiles for following
    if (followingIds.length > 0) {
      const { data: followingProfiles } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, avatar_url, current_position, current_company")
        .in("user_id", followingIds);
      setFollowing(followingProfiles || []);
    }

    setLoading(false);
  };

  const ProfileCard = ({ profile }: { profile: Profile }) => (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{profile.full_name}</p>
          {(profile.current_position || profile.current_company) && (
            <p className="text-xs text-muted-foreground">
              {profile.current_position}
              {profile.current_position && profile.current_company && " at "}
              {profile.current_company}
            </p>
          )}
        </div>
      </div>
      <FollowButton profileUserId={profile.user_id} variant="outline" size="sm" />
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <Users className="h-12 w-12 mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="followers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Followers ({followerCount})</TabsTrigger>
            <TabsTrigger value="following">Following ({followingCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="mt-4 space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : followers.length > 0 ? (
              followers.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
            ) : (
              <EmptyState message="No followers yet" />
            )}
          </TabsContent>
          <TabsContent value="following" className="mt-4 space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : following.length > 0 ? (
              following.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
            ) : (
              <EmptyState message="Not following anyone yet" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
