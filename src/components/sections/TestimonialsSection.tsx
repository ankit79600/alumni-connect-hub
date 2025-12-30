import { motion } from "framer-motion";
import { Card3D } from "@/components/3d/Card3D";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechVentures",
    batch: "Class of 2015",
    image: "SC",
    quote: "The alumni network opened doors I never knew existed. Found my co-founder here!",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Senior Engineer, Google",
    batch: "Class of 2018",
    image: "MR",
    quote: "Got my dream job through a connection I made at an alumni event. Forever grateful.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Venture Partner, Sequoia",
    batch: "Class of 2012",
    image: "PS",
    quote: "I've mentored 20+ students through this platform. Giving back has never been easier.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Founder, EduTech Inc",
    batch: "Class of 2016",
    image: "JW",
    quote: "The AI suggestions helped me find the perfect mentor for my startup journey.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Loved by <span className="gradient-text">50,000+ Alumni</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our community members have to say about their experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card3D className="group">
                <div className="bg-card border border-border rounded-xl p-6 h-full relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  
                  <p className="text-foreground mb-6 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-primary">{testimonial.batch}</p>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
