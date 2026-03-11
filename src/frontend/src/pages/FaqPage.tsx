import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const FAQS = [
  {
    q: "How long does delivery take across Nepal?",
    a: "Kathmandu Valley orders are delivered within 1-2 business days. Terai region takes 2-4 days. Hilly areas and mountain regions may take 4-7 business days depending on road conditions.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), eSewa, Khalti, and Debit/Credit Cards (Visa & Mastercard). COD is available across all delivery zones.",
  },
  {
    q: "Are all your products truly eco-friendly and certified?",
    a: "Yes! Every product on our platform is vetted for eco-friendliness. We prioritize biodegradable materials, sustainable sourcing, and local Nepali suppliers. Product listings include certification details.",
  },
  {
    q: "How do I return a product?",
    a: "You can return any product within 7 days of delivery if it is unused, in original packaging, and defective or not as described. Contact us at hello@ecofriendlynepal.com with your order ID to initiate a return.",
  },
  {
    q: "What are Eco Points and how do I use them?",
    a: "Eco Points are our reward currency. You earn them by shopping, submitting trash cleanup reports, and referring friends. Points can be redeemed for discounts on future purchases through your account dashboard.",
  },
  {
    q: "Do you deliver to all 77 districts of Nepal?",
    a: "Yes! We deliver to all 77 districts. Delivery costs vary by zone: Kathmandu Valley, Terai, Hilly, and Mountain regions are priced separately. Remote mountain areas may have longer delivery times.",
  },
  {
    q: "How does the Trash Cleanup Rewards program work?",
    a: "Take a photo of litter you find or clean up in your area, upload it via our Eco Rewards page with your location. Our team verifies submissions and awards you eco points within 2-3 business days.",
  },
  {
    q: "Can I track my order in real time?",
    a: "Yes! Once your order is shipped, you'll receive a tracking code in your account under 'My Orders'. You can use this to track your package through our logistics partner.",
  },
];

export function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-primary mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mb-10">
          Everything you need to know about shopping with Eco Friendly Nepal.
        </p>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.q}
            value={faq.q}
            className="bg-card rounded-xl px-4 shadow-xs border-none"
          >
            <AccordionTrigger className="font-heading font-medium text-left hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
