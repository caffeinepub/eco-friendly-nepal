import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";

export function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <RotateCcw className="h-8 w-8 text-primary" />
          <h1 className="font-display text-4xl font-bold text-primary">
            Return Policy
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>
      </motion.div>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            7-Day Return Window
          </h2>
          <p>
            We accept returns within 7 days of delivery. To be eligible for a
            return, the item must be unused, in the same condition that you
            received it, and in its original packaging.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            Non-Returnable Items
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Perishable goods such as herbal teas or food products once opened
            </li>
            <li>Intimate or sanitary goods</li>
            <li>Downloadable products</li>
            <li>Items marked as final sale</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            How to Initiate a Return
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Email us at{" "}
              <strong className="text-foreground">
                hello@ecofriendlynepal.com
              </strong>{" "}
              with your order ID and reason for return
            </li>
            <li>Our team will review your request within 1 business day</li>
            <li>
              If approved, we'll arrange a pickup or provide return shipping
              instructions
            </li>
            <li>
              Refund is processed within 5 business days of receiving the
              returned item
            </li>
          </ol>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            Refunds
          </h2>
          <p>
            Refunds are issued to the original payment method. eSewa and Khalti
            refunds are processed within 3-5 business days. COD refunds are made
            via bank transfer or eSewa.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            Damaged or Defective Items
          </h2>
          <p>
            If your item arrives damaged or defective, please photograph it
            immediately and contact us within 48 hours of delivery. We will
            replace the item or issue a full refund at no additional cost.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
            Contact Us
          </h2>
          <p>
            For return queries:{" "}
            <strong className="text-foreground">
              hello@ecofriendlynepal.com
            </strong>{" "}
            | +977 9801234567
          </p>
        </section>
      </div>
    </div>
  );
}
