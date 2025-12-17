import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import {
  GraduationCap,
  Users,
  Calendar,
  Briefcase,
  Heart,
  Award,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
} from "lucide-react";

const stats = [
  { label: "Alumni Connected", value: "50,000+", icon: Users },
  { label: "Events Hosted", value: "1,200+", icon: Calendar },
  { label: "Jobs Posted", value: "5,000+", icon: Briefcase },
  { label: "Donations Raised", value: "$2M+", icon: Heart },
];

const features = [
  {
    icon: Users,
    title: "Alumni Directory",
    description: "Connect with fellow graduates across generations. Search by batch, department, or location.",
  },
  {
    icon: Calendar,
    title: "Events & Reunions",
    description: "Stay updated with alumni events, workshops, and reunions. RSVP and network.",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    description: "Exclusive job postings from alumni-owned companies and partner organizations.",
  },
  {
    icon: MessageSquare,
    title: "Networking",
    description: "Direct messaging with alumni for mentorship, guidance, and professional connections.",
  },
  {
    icon: Award,
    title: "Success Stories",
    description: "Inspiring stories of alumni achievements and their journey after graduation.",
  },
  {
    icon: Heart,
    title: "Give Back",
    description: "Support current students through donations and scholarship programs.",
  },
];

export default function Landing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to your Alumni Network</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Connect, Grow &{" "}
              <span className="gradient-text">Succeed Together</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Join thousands of alumni in the most vibrant community. Network with graduates,
              find opportunities, and give back to your alma mater.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" className="gradient-primary text-lg h-12 px-8" asChild>
                <Link to="/auth?mode=signup">
                  Join the Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>

            {/* Floating Badge */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="inline-flex items-center gap-4 p-4 rounded-2xl glass-card">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium ring-2 ring-background"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Join 50,000+ Alumni</p>
                  <p className="text-xs text-muted-foreground">Already in the network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="glass-card hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Stay Connected</span>
            </h2>
            <p className="text-muted-foreground">
              A comprehensive platform designed to foster meaningful connections
              and opportunities for our alumni community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczItNCA0LTRjMiAwIDQgMiA0IDJzMi0yIDQtMmMyIDAgNCAyIDQgMnMtMiA0LTQgNGMtMiAwLTQtMi00LTJzLTIgMi00IDJjLTIgMC00LTItNC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground space-y-6">
            <Globe className="h-16 w-16 mx-auto opacity-80" />
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Ready to Reconnect?
            </h2>
            <p className="text-lg opacity-90">
              Join our thriving alumni community today. Whether you're looking to network,
              mentor, or find your next opportunity, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg h-12 px-8" asChild>
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/directory">Explore Directory</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
