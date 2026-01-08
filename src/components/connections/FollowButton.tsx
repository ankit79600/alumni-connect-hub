import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useAuth } from "@/lib/auth";

interface FollowButtonProps {
  profileUserId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FollowButton({ profileUserId, variant = "default", size = "default" }: FollowButtonProps) {
  const { user } = useAuth();
  const { isFollowing, follow, unfollow } = useConnections();
  const [loading, setLoading] = useState(false);

  const isCurrentlyFollowing = isFollowing(profileUserId);

  // Don't show button for own profile
  if (user?.id === profileUserId) return null;

  const handleClick = async () => {
    setLoading(true);
    if (isCurrentlyFollowing) {
      await unfollow(profileUserId);
    } else {
      await follow(profileUserId);
    }
    setLoading(false);
  };

  return (
    <Button
      variant={isCurrentlyFollowing ? "outline" : variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCurrentlyFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
