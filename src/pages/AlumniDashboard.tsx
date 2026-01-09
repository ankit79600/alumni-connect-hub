import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Calendar, Briefcase, Newspaper, BookOpen, Plus, Loader2, Lock
} from "lucide-react";

interface PostForm {
  title: string;
  content: string;
  category: string;
  location?: string;
  event_date?: string;
  company?: string;
  job_type?: string;
  salary_range?: string;
}

const initialForm: PostForm = {
  title: "",
  content: "",
  category: "news",
  location: "",
  event_date: "",
  company: "",
  job_type: "full-time",
  salary_range: "",
};

export default function AlumniDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<PostForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("event");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const isAlumni = role === "alumni" || role === "admin";

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Error", description: "Title and description are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      if (activeTab === "event") {
        if (!form.event_date) {
          toast({ title: "Error", description: "Event date is required", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const { error } = await supabase.from("events").insert({
          title: form.title,
          description: form.content,
          location: form.location,
          event_date: form.event_date,
          created_by: user?.id,
        });
        if (error) throw error;
        toast({ title: "Success", description: "Event created successfully!" });
      } else if (activeTab === "job") {
        if (!form.company) {
          toast({ title: "Error", description: "Company name is required", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const { error } = await supabase.from("jobs").insert({
          title: form.title,
          description: form.content,
          company: form.company,
          location: form.location,
          job_type: form.job_type,
          salary_range: form.salary_range,
          posted_by: user?.id,
        });
        if (error) throw error;
        toast({ title: "Success", description: "Job posted successfully!" });
      } else if (activeTab === "news") {
        const { error } = await supabase.from("posts").insert({
          title: form.title,
          content: form.content,
          author_id: user?.id,
          post_type: "news",
        });
        if (error) throw error;
        toast({ title: "Success", description: "News article published!" });
      } else if (activeTab === "story") {
        const { error } = await supabase.from("success_stories").insert({
          title: form.title,
          story: form.content,
          alumni_id: user?.id,
        });
        if (error) throw error;
        toast({ title: "Success", description: "Story published successfully!" });
      }

      setForm(initialForm);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  // Non-alumni users see restricted access message
  if (!isAlumni) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Alumni Only</h2>
              <p className="text-muted-foreground">
                This dashboard is exclusively for alumni members to create and share content.
              </p>
              <Button className="mt-4" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold gradient-text">Alumni Dashboard</h1>
            <p className="text-muted-foreground mt-1">Create and share content with the community</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="event" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event
              </TabsTrigger>
              <TabsTrigger value="job" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="story" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Story
              </TabsTrigger>
            </TabsList>

            {/* Event Form */}
            <TabsContent value="event">
              <Card>
                <CardHeader>
                  <CardTitle>Host an Event</CardTitle>
                  <CardDescription>Create a new event for alumni and students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Annual Alumni Meetup" />
                  </div>
                  <div>
                    <Label htmlFor="content">Description</Label>
                    <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Describe your event..." rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event_date">Date & Time</Label>
                      <Input id="event_date" type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Campus Hall or Online" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Form */}
            <TabsContent value="job">
              <Card>
                <CardHeader>
                  <CardTitle>Post a Job</CardTitle>
                  <CardDescription>Share job opportunities with the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google" />
                  </div>
                  <div>
                    <Label htmlFor="content">Job Description</Label>
                    <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Describe the role and responsibilities..." rows={4} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="job_type">Job Type</Label>
                      <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / NYC" />
                    </div>
                    <div>
                      <Label htmlFor="salary_range">Salary Range</Label>
                      <Input id="salary_range" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="$80k - $120k" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Form */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>Share News</CardTitle>
                  <CardDescription>Post updates and announcements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Headline</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="New Partnership Announced" />
                  </div>
                  <div>
                    <Label htmlFor="content">Article Content</Label>
                    <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your news article..." rows={6} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Story Form */}
            <TabsContent value="story">
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Story</CardTitle>
                  <CardDescription>Inspire others with your success story</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Story Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Journey to Becoming a CEO" />
                  </div>
                  <div>
                    <Label htmlFor="content">Your Story</Label>
                    <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Share your journey, challenges, and achievements..." rows={8} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={submitting} size="lg">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {activeTab === "event" ? "Create Event" : activeTab === "job" ? "Post Job" : activeTab === "news" ? "Publish News" : "Submit Story"}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
