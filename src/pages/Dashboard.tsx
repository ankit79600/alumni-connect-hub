import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Briefcase,
  MessageSquare,
  Award,
  Heart,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalAlumni: number;
  upcomingEvents: number;
  activeJobs: number;
  unreadMessages: number;
}

export default function Dashboard() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAlumni: 0,
    upcomingEvents: 0,
    activeJobs: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [alumniCount, eventsCount, jobsCount, messagesCount] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase
            .from("events")
            .select("id", { count: "exact", head: true })
            .gte("event_date", new Date().toISOString()),
          supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", true),
          user
            ? supabase
                .from("messages")
                .select("id", { count: "exact", head: true })
                .eq("receiver_id", user.id)
                .eq("is_read", false)
            : { count: 0 },
        ]);

        setStats({
          totalAlumni: alumniCount.count || 0,
          upcomingEvents: eventsCount.count || 0,
          activeJobs: jobsCount.count || 0,
          unreadMessages: messagesCount.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const quickActions = [
    {
      icon: Users,
      title: "Browse Directory",
      description: "Connect with fellow alumni",
      href: "/directory",
      color: "from-primary to-primary/80",
    },
    {
      icon: Calendar,
      title: "View Events",
      description: "Upcoming reunions & meetups",
      href: "/events",
      color: "from-secondary to-secondary/80",
    },
    {
      icon: Briefcase,
      title: "Job Board",
      description: "Find opportunities",
      href: "/jobs",
      color: "from-accent to-accent/80",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      description: "Check your inbox",
      href: "/messages",
      color: "from-warning to-warning/80",
    },
  ];

  const statCards = [
    { label: "Alumni in Network", value: stats.totalAlumni, icon: Users, trend: "+12%" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar, trend: "+5%" },
    { label: "Active Jobs", value: stats.activeJobs, icon: Briefcase, trend: "+8%" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, trend: null },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your alumni network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={stat.label} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center text-success text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.trend}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-display font-bold">{loading ? "..." : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.href} to={action.href}>
                <Card className="group hover-lift cursor-pointer h-full animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Users, text: "New alumni joined from Class of 2024", time: "2 hours ago" },
                  { icon: Calendar, text: "Annual Alumni Meet scheduled for Dec 28", time: "5 hours ago" },
                  { icon: Briefcase, text: "15 new job postings this week", time: "1 day ago" },
                  { icon: Award, text: "Featured: Alumni Success Story", time: "2 days ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Card */}
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Heart className="h-12 w-12 mb-4 opacity-80" />
                  <h3 className="text-2xl font-display font-bold mb-2">Give Back to Your Community</h3>
                  <p className="opacity-90">
                    Support current students through scholarships, mentorship, or donations. Your
                    contribution makes a difference.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" asChild>
                    <Link to="/donate">
                      Make a Donation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link to="/directory">Become a Mentor</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
