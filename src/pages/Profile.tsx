import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Briefcase, MapPin, Calendar, Linkedin, Twitter, Mail, 
  Award, Users, Heart, MessageSquare, Edit, Plus, Star
} from "lucide-react";

const skills = ["Leadership", "Product Management", "Data Science", "Machine Learning", "Public Speaking"];
const activities = [
  { type: "event", title: "Attended Annual Alumni Meetup 2024", date: "2 days ago" },
  { type: "connection", title: "Connected with 5 new alumni", date: "1 week ago" },
  { type: "post", title: "Shared a success story", date: "2 weeks ago" },
];

export default function Profile() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("user_id", user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

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
                  <AvatarFallback className="gradient-primary text-primary-foreground text-4xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-4 md:pt-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-display font-bold">
                        {profile?.full_name || user?.email?.split("@")[0]}
                      </h1>
                      <p className="text-muted-foreground">{profile?.current_position || "Alumni Member"}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {profile?.current_company && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{profile.current_company}</span>}
                        {profile?.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profile.location}</span>}
                        {profile?.graduation_year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Class of {profile.graduation_year}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {role && <Badge className="capitalize">{role}</Badge>}
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" />Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Achievements</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg"><div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center"><Star className="h-5 w-5 text-primary-foreground" /></div><div><p className="font-medium">Top Contributor</p><p className="text-sm text-muted-foreground">2024 Alumni Award</p></div></div>
                </CardContent>
              </Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" />Contributions</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Mentored 12 students • Donated to 3 causes</p></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="connections">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Your Network</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">Connect with fellow alumni to grow your network.</p>
                <Button className="mt-4"><Plus className="h-4 w-4 mr-1" />Find Connections</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card><CardHeader><CardTitle>Skills & Endorsements</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{skills.map(skill => <Badge key={skill} variant="secondary" className="py-2">{skill}</Badge>)}</div></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-4">{activities.map((a, i) => <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg"><span>{a.title}</span><span className="text-sm text-muted-foreground">{a.date}</span></div>)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
