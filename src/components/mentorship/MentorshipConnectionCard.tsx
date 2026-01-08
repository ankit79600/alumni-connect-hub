import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MentorshipRequest } from "@/hooks/useMentorship";
import { MentorshipSession } from "@/hooks/useMentorshipSessions";
import { formatDistanceToNow } from "date-fns";
import { Calendar, MessageSquare, Star } from "lucide-react";

interface MentorshipConnectionCardProps {
  request: MentorshipRequest;
  sessions: MentorshipSession[];
  isMentor: boolean;
  onScheduleSession?: () => void;
  onMessage?: () => void;
}

export function MentorshipConnectionCard({
  request,
  sessions,
  isMentor,
  onScheduleSession,
  onMessage,
}: MentorshipConnectionCardProps) {
  const profile = isMentor ? request.mentee_profile : request.mentor_profile;
  
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  
  // Calculate average rating from all session feedback
  const allFeedback = sessions.flatMap((s) => s.feedback || []);
  const averageRating = allFeedback.length
    ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {profile?.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{profile?.full_name || "Unknown User"}</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.current_position} {profile?.current_company && `at ${profile.current_company}`}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                Active
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{completedSessions.length} sessions completed</span>
              </div>
              {upcomingSessions.length > 0 && (
                <div className="flex items-center gap-1 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span>{upcomingSessions.length} upcoming</span>
                </div>
              )}
              {averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Connected {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {isMentor && (
                <Button size="sm" onClick={onScheduleSession}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Session
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={onMessage}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
