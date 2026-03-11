import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useActiveProducts,
  useCart,
  useDeliveryZones,
  useRemoveFromCart,
  useUpdateCartItem,
} from "../hooks/useQueries";
import { formatNPR, getCategoryImage } from "../lib/format";

export function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { data: products } = useActiveProducts();
  const { data: zones } = useDeliveryZones();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const [selectedZone, setSelectedZone] = useState("");

  const cartItems =
    cart
      ?.map((item) => {
        const product = products?.find((p) => p.id === item.productId);
        return { ...item, product };
      })
      .filter((item) => item.product) ?? [];

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product!.priceNPR) * Number(item.quantity);
  }, 0);

  const shippingCost =
    zones?.find(([name]) => name === selectedZone)?.[1] ?? 0n;
  const total = subtotal + Number(shippingCost);

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12 animate-pulse"
        data-ocid="cart.loading_state"
      >
        <div className="h-8 bg-muted rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Add some eco-friendly products to get started!
        </p>
        <Link to="/store">
          <Button className="bg-primary text-primary-foreground">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, i) => (
            <motion.div
              key={item.productId.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`cart.item.${i + 1}`}
              className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4"
            >
              <img
                src={
                  item.product!.imageUrl ||
                  getCategoryImage(item.product!.category)
                }
                alt={item.product!.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to="/product/$id"
                  params={{ id: item.productId.toString() }}
                  className="font-heading font-semibold hover:text-primary transition-colors line-clamp-1"
                >
                  {item.product!.name}
                </Link>
                <p className="text-primary font-bold mt-1 price-format">
                  {formatNPR(item.product!.priceNPR)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newQty = Number(item.quantity) - 1;
                    if (newQty < 1) {
                      removeFromCart(item.productId, {
                        onSuccess: () => toast.success("Removed from cart"),
                      });
                    } else {
                      updateQuantity({
                        productId: item.productId,
                        quantity: BigInt(newQty),
                      });
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity.toString()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity({
                      productId: item.productId,
                      quantity: BigInt(Number(item.quantity) + 1),
                    })
                  }
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold price-format">
                  {formatNPR(
                    Number(item.product!.priceNPR) * Number(item.quantity),
                  )}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(item.productId, {
                      onSuccess: () => toast.success("Removed from cart"),
                    })
                  }
                  className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl p-6 shadow-card sticky top-20">
            <h2 className="font-heading font-bold text-lg mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium price-format">
                  {formatNPR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivery Zone</span>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger
                    className="w-36 h-8 text-xs"
                    data-ocid="cart.zone_select"
                  >
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones?.map(([name, cost]) => (
                      <SelectItem key={name} value={name}>
                        {name} ({formatNPR(cost)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedZone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium price-format">
                    {formatNPR(shippingCost)}
                  </span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-primary price-format">
                {formatNPR(total)}
              </span>
            </div>
            <Link to="/checkout">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Free delivery on orders above रु2,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
