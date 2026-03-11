import { Globe, Heart, Leaf, Target } from "lucide-react";
import { motion } from "motion/react";

const TEAM = [
  {
    name: "Aarav Shrestha",
    role: "Founder & CEO",
    bio: "Passionate environmentalist from Kathmandu, Aarav started Eco Friendly Nepal to make sustainable living accessible to all Nepalis.",
  },
  {
    name: "Shreya Rai",
    role: "Head of Sourcing",
    bio: "With deep roots in community farming in Ilam, Shreya ensures every product is ethically sourced from Nepali suppliers.",
  },
  {
    name: "Dipesh Tamang",
    role: "Tech Lead",
    bio: "A software engineer from Pokhara who believes technology can be a force for environmental good across Nepal.",
  },
];

const STATS = [
  { value: "2,500+", label: "Happy Customers" },
  { value: "150+", label: "Eco Products" },
  { value: "77", label: "Districts Reached" },
  { value: "5T+", label: "Plastic Diverted" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Leaf className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Mission for a Greener Nepal
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Eco Friendly Nepal was born from a simple belief: that every
              Nepali deserves access to sustainable, eco-friendly products that
              protect our beautiful mountains, rivers, and communities. We're
              building a future where sustainable living is the norm, not the
              exception.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display text-4xl font-bold">{stat.value}</p>
                <p className="opacity-70 mt-1 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To make eco-friendly products affordable and accessible to every household in Nepal, from Kathmandu to the most remote mountain villages.",
              },
              {
                icon: Globe,
                title: "Our Vision",
                text: "A Nepal where zero-waste living is mainstream, where local eco-businesses thrive, and where our Himalayan environment is protected for future generations.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Transparency, community-first sourcing, environmental stewardship, and genuine care for the people and landscapes of Nepal.",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-2xl text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-heading font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
