import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Edit2,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutDashboard,
  Leaf,
  Lock,
  Menu,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OrderStatus, ProductCategory } from "../backend.d";
import type { Product, ProductInput } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useImageUpload } from "../hooks/useImageUpload";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useActiveProducts,
  useAddProduct,
  useAllCustomers,
  useAllOrders,
  useAllTrashReports,
  useAnalytics,
  useDeleteProduct,
  useIsAdmin,
  useToggleProductActive,
  useUpdateOrderStatus,
  useUpdateOrderTracking,
  useUpdateProduct,
  useVerifyTrashReport,
} from "../hooks/useQueries";
import {
  formatDate,
  formatNPR,
  getCategoryLabel,
  getTrashStatusColor,
} from "../lib/format";
import { getSecretParameter } from "../utils/urlParams";

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "trash", label: "Trash Reports", icon: Trash2 },
];

const EMPTY_PRODUCT: ProductInput = {
  name: "",
  description: "",
  stock: 0n,
  imageUrl: "",
  category: ProductCategory.eco,
  priceNPR: 0n,
};

export function AdminPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { login, identity, loginStatus } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductInput>(EMPTY_PRODUCT);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  );
  const [verifyPoints, setVerifyPoints] = useState<Record<string, string>>({});

  // Password login state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [claimingAdmin, setClaimingAdmin] = useState(false);
  const [loginStep, setLoginStep] = useState<"login" | "password">("login");

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadProgress, isUploading } = useImageUpload();

  const { data: products } = useActiveProducts();
  const { data: orders } = useAllOrders();
  const { data: customers } = useAllCustomers();
  const { data: trashReports } = useAllTrashReports();
  const { data: analytics } = useAnalytics();

  const { mutate: addProduct, isPending: addingProduct } = useAddProduct();
  const { mutate: updateProduct, isPending: updatingProduct } =
    useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: toggleActive } = useToggleProductActive();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: updateTracking } = useUpdateOrderTracking();
  const { mutate: verifyReport } = useVerifyTrashReport();

  // Auto-initialize admin when Caffeine editor provides the admin token
  useEffect(() => {
    const adminToken = getSecretParameter("caffeineAdminToken");
    if (!actor || !identity || isAdmin || !adminToken) return;
    actor
      ._initializeAccessControlWithSecret(adminToken)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      })
      .catch(() => {
        // Token may be invalid or admin already assigned; ignore
      });
  }, [actor, identity, isAdmin, queryClient]);

  // When user logs in, advance to password step
  useEffect(() => {
    if (isLoggedIn && !isAdmin && loginStep === "login") {
      setLoginStep("password");
    }
  }, [isLoggedIn, isAdmin, loginStep]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !password) return;
    setClaimingAdmin(true);
    try {
      const success = await actor.claimAdminWithPassword(password);
      if (success) {
        toast.success("Admin access granted!");
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      } else {
        toast.error("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setClaimingAdmin(false);
    }
  }

  if (checkingAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-ocid="admin.loading_state"
      >
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    // Step 1: Not logged in — show Internet Identity login
    if (!isLoggedIn) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen gap-6 px-4"
          data-ocid="admin.error_state"
        >
          <div className="flex flex-col items-center gap-4 text-center max-w-sm w-full">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground text-sm">
              Sign in with Internet Identity first, then enter your admin
              password.
            </p>
            <Button
              size="lg"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin.login_button"
            >
              <Leaf className="h-4 w-4 mr-2" />
              {loginStatus === "logging-in"
                ? "Logging in..."
                : "Login with Internet Identity"}
            </Button>
            <a href="/" className="text-primary underline text-sm">
              Return to Home
            </a>
          </div>
        </div>
      );
    }

    // Step 2: Logged in but not admin — show password form
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-6 px-4"
        data-ocid="admin.error_state"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center max-w-sm w-full"
        >
          <div className="p-4 bg-primary/10 rounded-full">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Enter Admin Password
          </h1>
          <p className="text-muted-foreground text-sm">
            You are logged in. Enter the admin password to access the dashboard.
          </p>

          <form
            onSubmit={handlePasswordLogin}
            className="w-full space-y-3 mt-2"
          >
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="pr-10"
                data-ocid="admin.password_input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={claimingAdmin || !password}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin.password_submit_button"
            >
              {claimingAdmin ? "Verifying..." : "Access Admin Dashboard"}
            </Button>
          </form>

          <a href="/" className="text-primary underline text-sm">
            Return to Home
          </a>
        </motion.div>
      </div>
    );
  }

  function handleImageFileChange(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImageState() {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    let finalImageUrl = productForm.imageUrl;
    if (imageFile) {
      try {
        finalImageUrl = await uploadImage(imageFile);
      } catch {
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }
    const formWithImage = { ...productForm, imageUrl: finalImageUrl };
    if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, input: formWithImage },
        {
          onSuccess: () => {
            toast.success("Product updated!");
            setProductDialogOpen(false);
            setEditingProduct(null);
            setProductForm(EMPTY_PRODUCT);
            clearImageState();
          },
          onError: () => toast.error("Failed to update product"),
        },
      );
    } else {
      addProduct(formWithImage, {
        onSuccess: () => {
          toast.success("Product added!");
          setProductDialogOpen(false);
          setProductForm(EMPTY_PRODUCT);
          clearImageState();
        },
        onError: () => toast.error("Failed to add product"),
      });
    }
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      stock: p.stock,
      imageUrl: p.imageUrl,
      category: p.category,
      priceNPR: p.priceNPR,
    });
    setImagePreview(p.imageUrl || "");
    setImageFile(null);
    setProductDialogOpen(true);
  }

  const statusOptions = Object.values(OrderStatus);
  const currentPreview = imagePreview || productForm.imageUrl;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sidebar-primary">
              Admin Panel
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              data-ocid={`admin.${item.id}_tab`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden w-full cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading font-semibold">Admin Dashboard</span>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl font-bold mb-6">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Orders",
                    value: analytics?.totalOrders?.toString() ?? "0",
                    color: "text-blue-600",
                  },
                  {
                    label: "Total Revenue",
                    value: formatNPR(analytics?.totalRevenueNPR ?? 0n),
                    color: "text-green-600",
                  },
                  {
                    label: "Products",
                    value: products?.length?.toString() ?? "0",
                    color: "text-purple-600",
                  },
                  {
                    label: "Customers",
                    value: customers?.length?.toString() ?? "0",
                    color: "text-orange-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-card rounded-xl p-4 shadow-card"
                  >
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p
                      className={`font-display text-2xl font-bold mt-1 ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              {analytics?.ordersByStatus &&
                analytics.ordersByStatus.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-card">
                    <h3 className="font-heading font-semibold mb-4">
                      Orders by Status
                    </h3>
                    <div className="space-y-3">
                      {analytics.ordersByStatus.map(([status, count]) => {
                        const total = analytics.ordersByStatus.reduce(
                          (s, [, c]) => s + Number(c),
                          0,
                        );
                        const pct =
                          total > 0 ? (Number(count) / total) * 100 : 0;
                        return (
                          <div key={status}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{status}</span>
                              <span className="font-medium">
                                {count.toString()}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </motion.div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Products</h2>
                <Dialog
                  open={productDialogOpen}
                  onOpenChange={(o) => {
                    setProductDialogOpen(o);
                    if (!o) {
                      setEditingProduct(null);
                      setProductForm(EMPTY_PRODUCT);
                      clearImageState();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary text-primary-foreground"
                      data-ocid="admin.add_product_button"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleProductSubmit}
                      className="space-y-4 mt-4"
                    >
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Bamboo Toothbrush Set"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Price (NPR)</Label>
                          <Input
                            type="number"
                            value={productForm.priceNPR.toString()}
                            onChange={(e) =>
                              setProductForm((p) => ({
                                ...p,
                                priceNPR: BigInt(e.target.value || "0"),
                              }))
                            }
                            min="0"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={productForm.stock.toString()}
                            onChange={(e) =>
                              setProductForm((p) => ({
                                ...p,
                                stock: BigInt(e.target.value || "0"),
                              }))
                            }
                            min="0"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(v) =>
                            setProductForm((p) => ({
                              ...p,
                              category: v as ProductCategory,
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ProductCategory).map((c) => (
                              <SelectItem key={c} value={c}>
                                {getCategoryLabel(c)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label>Product Image</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFileChange(file);
                          }}
                        />

                        {/* Dropzone */}
                        <button
                          type="button"
                          data-ocid="admin.product.dropzone"
                          className="mt-1 w-full relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors group text-left"
                          style={{ minHeight: "140px" }}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file?.type.startsWith("image/")) {
                              handleImageFileChange(file);
                            }
                          }}
                        >
                          {currentPreview ? (
                            <>
                              <img
                                src={currentPreview}
                                alt="Product preview"
                                className="w-full h-36 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="text-white text-sm font-medium flex items-center gap-2">
                                  <ImagePlus className="h-4 w-4" />
                                  Change image
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                              <Upload className="h-8 w-8" />
                              <div className="text-center">
                                <p className="text-sm font-medium">
                                  Click or drag image here
                                </p>
                                <p className="text-xs opacity-70">
                                  PNG, JPG, WEBP up to 10MB
                                </p>
                              </div>
                            </div>
                          )}
                        </button>

                        {/* Upload button */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          data-ocid="admin.product.upload_button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          {imageFile ? "Change Image" : "Select Image"}
                        </Button>

                        {/* Progress bar while uploading */}
                        {isUploading && (
                          <div
                            className="mt-2 space-y-1"
                            data-ocid="admin.product.loading_state"
                          >
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Uploading image...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress
                              value={uploadProgress}
                              className="h-1.5"
                            />
                          </div>
                        )}

                        {/* File name indicator */}
                        {imageFile && !isUploading && (
                          <p className="mt-1 text-xs text-muted-foreground truncate">
                            Selected: {imageFile.name}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="submit"
                          disabled={
                            addingProduct || updatingProduct || isUploading
                          }
                          className="flex-1 bg-primary text-primary-foreground"
                          data-ocid="admin.product.submit_button"
                        >
                          {isUploading
                            ? "Uploading..."
                            : addingProduct || updatingProduct
                              ? "Saving..."
                              : editingProduct
                                ? "Save Changes"
                                : "Add Product"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setProductDialogOpen(false)}
                          data-ocid="admin.product.cancel_button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table data-ocid="admin.products_tab">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product, i) => (
                      <TableRow
                        key={product.id.toString()}
                        data-ocid={`admin.products.item.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover bg-muted flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            )}
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getCategoryLabel(product.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="price-format">
                          {formatNPR(product.priceNPR)}
                        </TableCell>
                        <TableCell>{product.stock.toString()}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() =>
                              toggleActive({
                                id: product.id,
                                isActive: !product.isActive,
                              })
                            }
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditProduct(product)}
                              data-ocid={`admin.products.edit_button.${i + 1}`}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteProduct(product.id, {
                                  onSuccess: () =>
                                    toast.success("Product deleted"),
                                })
                              }
                              className="text-destructive hover:text-destructive"
                              data-ocid={`admin.products.delete_button.${i + 1}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl font-bold mb-6">Orders</h2>
              <div className="bg-card rounded-xl shadow-card overflow-x-auto">
                <Table data-ocid="admin.orders_tab">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tracking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order, i) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`admin.orders.item.${i + 1}`}
                      >
                        <TableCell className="font-mono text-sm">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                          {order.userId.toString().slice(0, 12)}...
                        </TableCell>
                        <TableCell className="price-format">
                          {formatNPR(order.totalNPR)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              updateStatus(
                                { orderId: order.id, status: v as OrderStatus },
                                {
                                  onSuccess: () =>
                                    toast.success("Status updated"),
                                },
                              )
                            }
                          >
                            <SelectTrigger className="h-7 text-xs w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Input
                              value={
                                trackingInputs[order.id.toString()] ??
                                order.trackingCode ??
                                ""
                              }
                              onChange={(e) =>
                                setTrackingInputs((prev) => ({
                                  ...prev,
                                  [order.id.toString()]: e.target.value,
                                }))
                              }
                              placeholder="Tracking code"
                              className="h-7 text-xs w-28"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const code =
                                  trackingInputs[order.id.toString()];
                                if (code)
                                  updateTracking(
                                    { orderId: order.id, trackingCode: code },
                                    {
                                      onSuccess: () =>
                                        toast.success("Tracking updated"),
                                    },
                                  );
                              }}
                            >
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Customers */}
          {activeTab === "customers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl font-bold mb-6">
                Customers
              </h2>
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Principal ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.map((principal, i) => (
                      <TableRow
                        key={principal.toString()}
                        data-ocid={`admin.customers.item.${i + 1}`}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {principal.toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Trash Reports */}
          {activeTab === "trash" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl font-bold mb-6">
                Trash Reports
              </h2>
              <div className="space-y-4">
                {!trashReports || trashReports.length === 0 ? (
                  <div
                    className="text-center py-12"
                    data-ocid="admin.trash.empty_state"
                  >
                    <Trash2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground">
                      No trash reports yet.
                    </p>
                  </div>
                ) : (
                  trashReports.map((report, i) => (
                    <div
                      key={report.id.toString()}
                      data-ocid={`admin.trash.item.${i + 1}`}
                      className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 flex-wrap"
                    >
                      <img
                        src={report.imageUrl}
                        alt="Trash"
                        className="w-16 h-16 rounded-lg object-cover bg-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{report.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {report.userId.toString().slice(0, 20)}...
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getTrashStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                      {report.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Points"
                            value={verifyPoints[report.id.toString()] ?? ""}
                            onChange={(e) =>
                              setVerifyPoints((prev) => ({
                                ...prev,
                                [report.id.toString()]: e.target.value,
                              }))
                            }
                            className="h-8 w-20 text-sm"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const pts = verifyPoints[report.id.toString()];
                              if (!pts) {
                                toast.error("Enter points to award");
                                return;
                              }
                              verifyReport(
                                { reportId: report.id, points: BigInt(pts) },
                                {
                                  onSuccess: () =>
                                    toast.success("Report verified!"),
                                },
                              );
                            }}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
