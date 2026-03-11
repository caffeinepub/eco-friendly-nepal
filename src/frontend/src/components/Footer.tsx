import { Link } from "@tanstack/react-router";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-accent" />
              <span className="font-display font-bold text-lg">
                Eco Friendly Nepal
              </span>
            </div>
            <p className="text-sm opacity-70 mb-4">
              Bringing sustainable, eco-friendly products to every doorstep in
              Nepal.
            </p>
            <div className="flex gap-3">
              <span className="opacity-60 cursor-default">
                <SiFacebook className="h-5 w-5" />
              </span>
              <span className="opacity-60 cursor-default">
                <SiInstagram className="h-5 w-5" />
              </span>
              <span className="opacity-60 cursor-default">
                <SiX className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">
              Shop
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link
                  to="/store"
                  className="hover:opacity-100 transition-opacity"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:opacity-100 transition-opacity"
                >
                  Eco Products
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:opacity-100 transition-opacity"
                >
                  Herbal Products
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:opacity-100 transition-opacity"
                >
                  Sustainable Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">
              Help
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link
                  to="/faq"
                  className="hover:opacity-100 transition-opacity"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="hover:opacity-100 transition-opacity"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:opacity-100 transition-opacity"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">
              Contact
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hello@ecofriendlynepal.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+977 9801234567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Thamel, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm opacity-60">
          <p>&copy; {year} Eco Friendly Nepal. All rights reserved.</p>
          <p>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              className="underline hover:opacity-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
