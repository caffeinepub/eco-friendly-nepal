import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Leaf,
  Mail,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";
import { useActiveProducts, useSubscribeNewsletter } from "../hooks/useQueries";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Kathmandu",
    text: "Excellent eco products! The bamboo toothbrush kit arrived quickly and I love knowing I'm helping the environment. Will definitely order again.",
    rating: 5,
  },
  {
    name: "Bikash Adhikari",
    location: "Pokhara",
    text: "The herbal products are amazing. Pure, natural, and effective. Eco Friendly Nepal is truly changing how we shop sustainably.",
    rating: 5,
  },
  {
    name: "Sita Thapa",
    location: "Lalitpur",
    text: "Fast delivery to Lalitpur and great packaging. Love the reusable bags. The eco points system is a brilliant idea!",
    rating: 4,
  },
];

const features = [
  {
    icon: Leaf,
    title: "100% Eco Products",
    desc: "Every product is certified eco-friendly, sustainably sourced, and biodegradable.",
  },
  {
    icon: Truck,
    title: "Free Delivery रु2000+",
    desc: "Free shipping across Nepal on all orders above रु2,000. Fast and reliable.",
  },
  {
    icon: Award,
    title: "Earn Eco Points",
    desc: "Get rewarded for every eco action. Upload trash photos and earn bonus points!",
  },
  {
    icon: Shield,
    title: "Support Nepal",
    desc: "Every purchase supports local Nepali suppliers and environmental initiatives.",
  },
];

export function HomePage() {
  const { data: products, isLoading } = useActiveProducts();
  const { mutate: subscribe, isPending: subscribing } =
    useSubscribeNewsletter();
  const [email, setEmail] = useState("");

  const featuredProducts = products?.slice(0, 6) ?? [];

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    subscribe(email, {
      onSuccess: () => {
        toast.success("Subscribed! Welcome to the green community 🌿");
        setEmail("");
      },
      onError: () => toast.error("Subscription failed. Please try again."),
    });
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="Eco Friendly Nepal Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium text-sm tracking-wide uppercase">
                Eco Friendly Nepal
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Shop Eco.
              <br />
              Live Green.
              <br />
              <span className="text-accent">Save Nepal.</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Discover sustainable, eco-friendly products delivered right to
              your doorstep across Nepal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/store">
                <Button
                  size="lg"
                  data-ocid="home.hero_shop_button"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-foreground"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-primary mb-2">
              Why Choose Eco Friendly Nepal
            </h2>
            <p className="text-muted-foreground">
              Making sustainable living accessible for every Nepali
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-1">
                Hand-picked sustainable products for you
              </p>
            </div>
            <Link to="/store">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-muted rounded-xl aspect-square animate-pulse"
                />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Products coming soon! Check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-primary mb-2">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              Real reviews from real eco warriors across Nepal
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }, (_, s) => (
                    <Star
                      key={`star-${t.name}-${s}`}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-heading font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location}, Nepal
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-3xl font-bold mb-2">
              Join the Green Movement
            </h2>
            <p className="opacity-80 mb-8 max-w-md mx-auto">
              Subscribe for eco tips, new product alerts, and exclusive
              discounts for Nepal's green community.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="home.newsletter_input"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 flex-1"
                required
              />
              <Button
                type="submit"
                disabled={subscribing}
                data-ocid="home.newsletter_submit_button"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold whitespace-nowrap"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
