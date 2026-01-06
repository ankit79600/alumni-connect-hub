import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MentorshipRequest } from "@/hooks/useMentorship";
import { formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";

interface MentorshipRequestCardProps {
  request: MentorshipRequest;
  isAlumni: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function MentorshipRequestCard({ request, isAlumni, onAccept, onReject }: MentorshipRequestCardProps) {
  const profile = isAlumni ? request.mentee_profile : request.mentor_profile;
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    accepted: "bg-green-500/10 text-green-600 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile?.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{profile?.full_name || "Unknown User"}</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.current_position} {profile?.current_company && `at ${profile.current_company}`}
                </p>
              </div>
              <Badge className={statusColors[request.status]} variant="outline">
                {request.status}
              </Badge>
            </div>

            {request.message && (
              <p className="text-sm mt-2 p-2 bg-muted rounded-md italic">"{request.message}"</p>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </span>

              {isAlumni && request.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onReject?.(request.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => onAccept?.(request.id)}>
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
