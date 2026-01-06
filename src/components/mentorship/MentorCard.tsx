import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";
import { Briefcase, MapPin, GraduationCap } from "lucide-react";

interface MentorCardProps {
  mentor: Profile;
  onRequestMentorship: (mentorId: string) => void;
  requestStatus?: "pending" | "accepted" | "rejected";
  isOwnProfile?: boolean;
}

export function MentorCard({ mentor, onRequestMentorship, requestStatus, isOwnProfile }: MentorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-16 gradient-primary" />
      <CardContent className="pt-0">
        <div className="-mt-10 flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={mentor.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {mentor.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="mt-3 font-semibold text-lg">{mentor.full_name}</h3>
          
          {mentor.current_position && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Briefcase className="h-3 w-3" />
              {mentor.current_position}
            </p>
          )}
          
          {mentor.current_company && (
            <p className="text-sm text-muted-foreground">{mentor.current_company}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {mentor.location && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {mentor.location}
              </Badge>
            )}
            {mentor.graduation_year && (
              <Badge variant="outline" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                Class of {mentor.graduation_year}
              </Badge>
            )}
          </div>

          {mentor.skills && mentor.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 justify-center">
              {mentor.skills.slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {mentor.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{mentor.skills.length - 3}
                </Badge>
              )}
            </div>
          )}

          {mentor.bio && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{mentor.bio}</p>
          )}

          <div className="mt-4 w-full">
            {isOwnProfile ? (
              <Badge className="w-full justify-center py-2">Your Profile</Badge>
            ) : requestStatus === "pending" ? (
              <Badge variant="secondary" className="w-full justify-center py-2">Request Pending</Badge>
            ) : requestStatus === "accepted" ? (
              <Badge className="w-full justify-center py-2 bg-green-600">Mentor Connected!</Badge>
            ) : requestStatus === "rejected" ? (
              <Badge variant="destructive" className="w-full justify-center py-2">Request Declined</Badge>
            ) : (
              <Button className="w-full" onClick={() => onRequestMentorship(mentor.user_id)}>
                Request Mentorship
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
