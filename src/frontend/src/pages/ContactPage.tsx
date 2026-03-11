import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-primary mb-2">
          Contact Us
        </h1>
        <p className="text-muted-foreground mb-10">
          We'd love to hear from you. Send us a message and we'll respond
          promptly!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground">
                Thank you! We'll get back to you within 24 hours.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cName">Your Name</Label>
                <Input
                  id="cName"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ramesh Sharma"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cEmail">Email Address</Label>
                <Input
                  id="cEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="ramesh@example.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cMessage">Message</Label>
                <Textarea
                  id="cMessage"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us how we can help..."
                  rows={5}
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                data-ocid="contact.submit_button"
              >
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-heading font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">
                    hello@ecofriendlynepal.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Phone / WhatsApp</p>
                  <p className="text-muted-foreground text-sm">
                    +977 9801234567
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Office Address</p>
                  <p className="text-muted-foreground text-sm">
                    Thamel, Ward 26
                    <br />
                    Kathmandu Metropolitan City
                    <br />
                    Bagmati Province, Nepal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-xl p-6">
            <h3 className="font-heading font-semibold mb-2">Business Hours</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Sunday – Friday</span>
                <span className="font-medium text-foreground">
                  9:00 AM – 6:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-foreground">
                  10:00 AM – 4:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
