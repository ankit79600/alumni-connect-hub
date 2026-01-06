import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditDialog } from "@/components/profile/ProfileEditDialog";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, MapPin, Calendar, Linkedin, Twitter, Mail,
  Award, Users, Heart, MessageSquare, Edit, Plus, Star, Loader2, ExternalLink
} from "lucide-react";

export default function Profile() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, refetch } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden mb-6">
            <div className="h-32 gradient-primary" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-4xl font-bold">
                    {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-4 md:pt-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-display font-bold">
                        {profile.full_name || user.email?.split("@")[0]}
                      </h1>
                      <p className="text-muted-foreground">{profile.current_position || "Alumni Member"}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {profile.current_company && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />{profile.current_company}
                          </span>
                        )}
                        {profile.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />{profile.location}
                          </span>
                        )}
                        {profile.graduation_year && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />Class of {profile.graduation_year}
                          </span>
                        )}
                      </div>
                      {/* Social Links */}
                      <div className="flex gap-2 mt-3">
                        {profile.linkedin_url && (
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <Linkedin className="h-4 w-4 mr-1" />LinkedIn
                            </Button>
                          </a>
                        )}
                        {profile.twitter_url && (
                          <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <Twitter className="h-4 w-4 mr-1" />Twitter
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {role && <Badge className="capitalize">{role}</Badge>}
                      {profile.is_mentor && <Badge variant="secondary">Mentor</Badge>}
                      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                        <Edit className="h-4 w-4 mr-1" />Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              {profile.bio && (
                <p className="mt-6 text-muted-foreground">{profile.bio}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <div className="space-y-3">
                      {profile.achievements.map((ach, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                            <Star className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <p className="font-medium">{ach}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No achievements added yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Track your mentorship and donations here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="py-2 px-3">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills added yet. Click Edit to add your skills.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />All Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements && profile.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {profile.achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                          <Star className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <p className="font-medium">{ach}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No achievements yet. Click Edit to add your achievements.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.activities && profile.activities.length > 0 ? (
                  <div className="space-y-4">
                    {profile.activities.map((activity, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <ProfileEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile}
          onUpdate={refetch}
        />
      </div>
    </Layout>
  );
}
