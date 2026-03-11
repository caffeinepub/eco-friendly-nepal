import { Shield } from "lucide-react";
import { motion } from "motion/react";

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-display text-4xl font-bold text-primary">
            Privacy Policy
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>
      </motion.div>

      <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, such as your name,
            delivery address, phone number, and email address when you create an
            account or place an order. We also collect your Internet Identity
            principal for authentication purposes.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfill your orders</li>
            <li>To send order updates and delivery notifications</li>
            <li>To manage your account and eco rewards</li>
            <li>To improve our platform and services</li>
            <li>To send newsletters if you have subscribed</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            3. Data Storage on the Internet Computer
          </h2>
          <p>
            Eco Friendly Nepal operates on the Internet Computer blockchain.
            Your data is stored in canister smart contracts, which are
            decentralized and censorship-resistant. This means your data is not
            stored on centralized servers.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            4. Sharing Your Information
          </h2>
          <p>
            We do not sell your personal information. We share your delivery
            address with our logistics partners only to fulfill your orders. We
            do not share your data with advertisers.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            5. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            Contact us at hello@ecofriendlynepal.com to exercise these rights.
            You may also unsubscribe from newsletters at any time.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            6. Security
          </h2>
          <p>
            We use Internet Identity for secure, passwordless authentication.
            Your credentials are never stored on our platform. All data
            transmissions are encrypted via HTTPS.
          </p>
        </section>
        <section>
          <h2 className="font-heading font-semibold text-base text-foreground mb-2">
            7. Contact
          </h2>
          <p>
            Privacy questions:{" "}
            <strong className="text-foreground">
              hello@ecofriendlynepal.com
            </strong>
          </p>
        </section>
      </div>
    </div>
  );
}
