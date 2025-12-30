import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Briefcase, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-primary-foreground space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center backdrop-blur-sm"
          >
            <Sparkles className="h-10 w-10" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-display font-bold">
            Ready to Join the Community?
          </h2>
          
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Connect with thousands of alumni worldwide. Find mentors, discover opportunities,
            and be part of something bigger.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: Users, label: "50K+ Alumni" },
              { icon: Briefcase, label: "5K+ Jobs" },
              { icon: Calendar, label: "100+ Events/Year" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg h-14 px-10 rounded-full shadow-lg"
              asChild
            >
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-14 px-10 rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/directory">Explore Directory</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
