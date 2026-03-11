import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactPage } from "./pages/ContactPage";
import { EcoRewardsPage } from "./pages/EcoRewardsPage";
import { FaqPage } from "./pages/FaqPage";
import { HomePage } from "./pages/HomePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ReturnPolicyPage } from "./pages/ReturnPolicyPage";
import { StorePage } from "./pages/StorePage";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
});

const storeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/store",
  component: StorePage,
});

const productRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const accountRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/account",
  component: AccountPage,
});

const ecoRewardsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/eco-rewards",
  component: EcoRewardsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: AdminPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/contact",
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/faq",
  component: FaqPage,
});

const returnPolicyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/return-policy",
  component: ReturnPolicyPage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    storeRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    accountRoute,
    ecoRewardsRoute,
    adminRoute,
    aboutRoute,
    contactRoute,
    faqRoute,
    returnPolicyRoute,
    privacyPolicyRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
