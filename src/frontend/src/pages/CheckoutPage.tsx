import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle,
  CreditCard,
  MapPin,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type DeliveryZone, PaymentMethod } from "../backend.d";
import {
  useActiveProducts,
  useCart,
  useDeliveryZones,
  usePlaceOrder,
} from "../hooks/useQueries";
import { formatNPR, getCategoryImage } from "../lib/format";

const PAYMENT_METHODS = [
  {
    id: PaymentMethod.cashOnDelivery,
    label: "Cash on Delivery",
    icon: Banknote,
    desc: "Pay when you receive",
  },
  {
    id: PaymentMethod.esewa,
    label: "eSewa",
    icon: Smartphone,
    desc: "Nepal's #1 digital wallet",
  },
  {
    id: PaymentMethod.khalti,
    label: "Khalti",
    icon: Smartphone,
    desc: "Fast mobile payment",
  },
  {
    id: PaymentMethod.card,
    label: "Debit/Credit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard accepted",
  },
];

export function CheckoutPage() {
  const { data: cart } = useCart();
  const { data: products } = useActiveProducts();
  const { data: zones } = useDeliveryZones();
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    deliveryZone: "" as DeliveryZone | "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cashOnDelivery,
  );
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const cartItems =
    cart
      ?.map((item) => {
        const product = products?.find((p) => p.id === item.productId);
        return { ...item, product };
      })
      .filter((i) => i.product) ?? [];

  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.product!.priceNPR) * Number(i.quantity),
    0,
  );
  const shipping = zones?.find(([n]) => n === form.deliveryZone)?.[1] ?? 0n;
  const total = subtotal + Number(shipping);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.deliveryZone) {
      toast.error("Please select a delivery zone");
      return;
    }
    const addr = `${form.name}, ${form.phone}, ${form.address}, ${form.district}`;
    placeOrder(
      {
        paymentMethod,
        deliveryAddress: addr,
        deliveryZone: form.deliveryZone as DeliveryZone,
      },
      {
        onSuccess: (id) => {
          setOrderId(id);
          toast.success("Order placed successfully!");
        },
        onError: () => toast.error("Failed to place order. Please try again."),
      },
    );
  }

  if (orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            Order Placed!
          </h1>
          <p className="text-muted-foreground mb-4">
            Your eco-friendly order is confirmed.
          </p>
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-bold text-xl text-primary">
              #{orderId.toString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {paymentMethod === PaymentMethod.cashOnDelivery
              ? "Our delivery partner will contact you soon. Payment on delivery."
              : "Please complete your payment to confirm the order."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/account">
              <Button variant="outline">View My Orders</Button>
            </Link>
            <Link to="/store">
              <Button className="bg-primary text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary mb-8">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ramesh Sharma"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="9801234567"
                    required
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Thamel, Ward 26, Near Hotel"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={form.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    placeholder="Kathmandu"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Delivery Zone</Label>
                  <Select
                    value={form.deliveryZone}
                    onValueChange={(v) => handleChange("deliveryZone", v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select delivery zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones?.map(([name, cost]) => (
                        <SelectItem key={name} value={name}>
                          {name} (+{formatNPR(cost)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-heading font-bold text-lg mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    data-ocid={`checkout.payment.${pm.id === PaymentMethod.cashOnDelivery ? "cod" : pm.id}_button`}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === pm.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <pm.icon
                        className={`h-5 w-5 ${paymentMethod === pm.id ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-medium text-sm">{pm.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {pm.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-20">
              <h2 className="font-heading font-bold text-lg mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId.toString()}
                    className="flex items-center gap-3 text-sm"
                  >
                    <img
                      src={
                        item.product!.imageUrl ||
                        getCategoryImage(item.product!.category)
                      }
                      alt={item.product!.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">
                        {item.product!.name}
                      </p>
                      <p className="text-muted-foreground">
                        x{item.quantity.toString()}
                      </p>
                    </div>
                    <span className="price-format">
                      {formatNPR(
                        Number(item.product!.priceNPR) * Number(item.quantity),
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="price-format">{formatNPR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="price-format">
                    {formatNPR(Number(shipping))}
                  </span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-primary price-format">
                  {formatNPR(total)}
                </span>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="checkout.place_order_button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
