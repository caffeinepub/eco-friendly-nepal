import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  Edit2,
  ExternalLink,
  Heart,
  Leaf,
  Package,
  Save,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";
import {
  useActiveProducts,
  useEcoPoints,
  useMyOrders,
  useSaveUserProfile,
  useUserProfile,
  useWishlist,
} from "../hooks/useQueries";
import {
  formatDate,
  formatNPR,
  getCategoryImage,
  getOrderStatusColor,
} from "../lib/format";

export function AccountPage() {
  const { data: profile } = useUserProfile();
  const { data: orders } = useMyOrders();
  const { data: wishlist } = useWishlist();
  const { data: ecoPoints } = useEcoPoints();
  const { data: allProducts } = useActiveProducts();
  const { mutate: saveProfile, isPending: savingProfile } =
    useSaveUserProfile();

  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);

  const wishlistProducts =
    wishlist
      ?.map((w) => allProducts?.find((p) => p.id === w.productId))
      .filter(Boolean) ?? [];

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(editName, {
      onSuccess: () => {
        toast.success("Profile saved!");
        setEditing(false);
      },
      onError: () => toast.error("Failed to save profile"),
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-primary mb-8">
        My Account
      </h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="profile" data-ocid="account.profile_tab">
            <User className="h-4 w-4 mr-1" /> Profile
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="account.orders_tab">
            <Package className="h-4 w-4 mr-1" /> Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" data-ocid="account.wishlist_tab">
            <Heart className="h-4 w-4 mr-1" /> Wishlist
          </TabsTrigger>
          <TabsTrigger value="ecopoints" data-ocid="account.ecopoints_tab">
            <Leaf className="h-4 w-4 mr-1" /> Eco Points
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card rounded-xl p-6 shadow-card max-w-md">
            <h2 className="font-heading font-semibold text-lg mb-4">
              Profile Information
            </h2>
            {editing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <Label htmlFor="profileName">Display Name</Label>
                  <Input
                    id="profileName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-primary text-primary-foreground"
                    data-ocid="account.profile_tab"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {savingProfile ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile?.name || "No name set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Account Member
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditName(profile?.name || "");
                    setEditing(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-4">
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12" data-ocid="orders.empty_state">
                <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">
                  No orders yet. Start shopping!
                </p>
                <Link to="/store">
                  <Button className="mt-4 bg-primary text-primary-foreground">
                    Shop Now
                  </Button>
                </Link>
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div
                  key={order.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`orders.item.${i + 1}`}
                  className="bg-card rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-heading font-semibold">
                        Order #{order.id.toString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <p className="font-bold text-primary mt-2 price-format">
                        {formatNPR(order.totalNPR)}
                      </p>
                    </div>
                  </div>
                  {order.trackingCode && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Tracking:{" "}
                        <span className="font-mono font-medium text-foreground">
                          {order.trackingCode}
                        </span>
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12" data-ocid="wishlist.empty_state">
              <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">Your wishlist is empty.</p>
              <Link to="/store">
                <Button className="mt-4 bg-primary text-primary-foreground">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product, i) => (
                <ProductCard
                  key={product!.id.toString()}
                  product={product!}
                  index={i + 1}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Eco Points Tab */}
        <TabsContent value="ecopoints">
          <div className="max-w-lg">
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center mb-6">
              <Leaf className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <p className="text-sm opacity-80 uppercase tracking-wide mb-1">
                Your Eco Points
              </p>
              <p className="font-display text-5xl font-bold">
                {ecoPoints?.toString() ?? "0"}
              </p>
              <p className="text-sm opacity-70 mt-2">points earned</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card mb-4">
              <h3 className="font-heading font-semibold mb-3">
                How to Earn More Points
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Make a purchase — earn 1 point per रु0 spent
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Upload trash cleanup photos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Refer a friend to Eco Friendly Nepal
                </li>
              </ul>
            </div>
            <Link to="/eco-rewards">
              <Button
                className="w-full bg-primary text-primary-foreground"
                data-ocid="account.ecopoints_tab"
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Go to Eco Rewards
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
