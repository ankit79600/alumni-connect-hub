import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MentorshipSession } from "@/hooks/useMentorshipSessions";
import { format, isPast, formatDistanceToNow } from "date-fns";
import { Calendar, Clock, ExternalLink, MessageSquare, CheckCircle, XCircle, Star } from "lucide-react";

interface SessionCardProps {
  session: MentorshipSession;
  isMentor: boolean;
  currentUserId: string;
  onMarkCompleted?: (id: string) => void;
  onMarkMissed?: (id: string) => void;
  onLeaveFeedback?: (session: MentorshipSession) => void;
}

export function SessionCard({
  session,
  isMentor,
  currentUserId,
  onMarkCompleted,
  onMarkMissed,
  onLeaveFeedback,
}: SessionCardProps) {
  const profile = isMentor ? session.mentee_profile : session.mentor_profile;
  const scheduledDate = new Date(session.scheduled_at);
  const isSessionPast = isPast(scheduledDate);
  const hasLeftFeedback = session.feedback?.some((f) => f.reviewer_id === currentUserId);

  const statusConfig = {
    upcoming: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Calendar },
    completed: { color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
    missed: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
    cancelled: { color: "bg-muted text-muted-foreground border-muted", icon: XCircle },
  };

  const config = statusConfig[session.status];
  const StatusIcon = config.icon;

  const averageRating = session.feedback?.length
    ? session.feedback.reduce((sum, f) => sum + f.rating, 0) / session.feedback.length
    : null;

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

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium">{profile?.full_name || "Unknown User"}</h4>
                <p className="text-sm text-muted-foreground">
                  {isMentor ? "Mentee" : "Mentor"} • {profile?.current_position}
                </p>
              </div>
              <Badge className={config.color} variant="outline">
                <StatusIcon className="h-3 w-3 mr-1" />
                {session.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(scheduledDate, "PPP")}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(scheduledDate, "p")} ({session.duration_minutes} min)
              </div>
            </div>

            {session.meeting_link && (
              <a
                href={session.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              >
                <ExternalLink className="h-3 w-3" />
                Join Meeting
              </a>
            )}

            {session.notes && (
              <p className="text-sm mt-2 p-2 bg-muted rounded-md">
                <MessageSquare className="h-3 w-3 inline mr-1" />
                {session.notes}
              </p>
            )}

            {averageRating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({session.feedback?.length} review{session.feedback?.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {session.status === "upcoming" && isSessionPast && isMentor && (
                <>
                  <Button size="sm" onClick={() => onMarkCompleted?.(session.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Completed
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onMarkMissed?.(session.id)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Mark Missed
                  </Button>
                </>
              )}

              {session.status === "completed" && !hasLeftFeedback && (
                <Button size="sm" variant="outline" onClick={() => onLeaveFeedback?.(session)}>
                  <Star className="h-4 w-4 mr-1" />
                  Leave Feedback
                </Button>
              )}

              {session.status === "completed" && hasLeftFeedback && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Feedback Submitted
                </Badge>
              )}
            </div>

            {session.status === "upcoming" && !isSessionPast && (
              <p className="text-xs text-muted-foreground mt-2">
                {formatDistanceToNow(scheduledDate, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
