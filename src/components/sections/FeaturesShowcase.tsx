import { motion } from "framer-motion";
import { Card3D } from "@/components/3d/Card3D";
import {
  Users,
  Calendar,
  Briefcase,
  MessageSquare,
  Award,
  Heart,
  Sparkles,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Smart Directory",
    description: "AI-powered search to find alumni by skills, industry, location, or interests.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Calendar,
    title: "Events & Reunions",
    description: "Discover and RSVP to exclusive alumni events, webinars, and reunions.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Job Board",
    description: "Exclusive opportunities from alumni-owned companies and partners.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Connect directly with alumni for mentorship and networking.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Award,
    title: "Success Stories",
    description: "Get inspired by alumni achievements and their journey to success.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Heart,
    title: "Give Back",
    description: "Support students through donations and scholarship programs.",
    color: "from-red-500 to-pink-500",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Alumni Connected" },
  { icon: Globe, value: "120+", label: "Countries" },
  { icon: TrendingUp, value: "$2M+", label: "Raised" },
  { icon: Zap, value: "5K+", label: "Jobs Posted" },
];

export function FeaturesShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Stay Connected</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to foster meaningful connections
            and opportunities for our alumni community.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card3D className="group h-full">
                <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/50 transition-colors relative overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-full blur-3xl" 
                    style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                  
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary mx-auto mb-3 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
