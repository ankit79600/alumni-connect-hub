import { motion } from "framer-motion";
import { InteractiveGlobe } from "@/components/3d/InteractiveGlobe";
import { Globe, MapPin, Building2, Plane } from "lucide-react";

const highlights = [
  { icon: Globe, value: "120+", label: "Countries" },
  { icon: MapPin, value: "500+", label: "Cities" },
  { icon: Building2, value: "10K+", label: "Companies" },
  { icon: Plane, value: "50+", label: "Annual Events" },
];

export function GlobalReachSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                A Truly{" "}
                <span className="gradient-text">Global Network</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our alumni community spans across the globe, creating endless opportunities
                for connections, collaborations, and career growth. Whether you're in
                New York or Tokyo, you're never far from a fellow graduate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg gradient-primary mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-display font-bold gradient-text">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <InteractiveGlobe />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
