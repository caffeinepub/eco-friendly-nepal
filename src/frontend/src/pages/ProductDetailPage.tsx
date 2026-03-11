import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  Leaf,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReview,
  useAddToCart,
  useAddToWishlist,
  useProductById,
  useProductReviews,
  useRemoveFromWishlist,
  useWishlist,
} from "../hooks/useQueries";
import {
  formatDate,
  formatNPR,
  getCategoryImage,
  getCategoryLabel,
} from "../lib/format";

export function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const productId = BigInt(id ?? "0");

  const { data: product, isLoading } = useProductById(productId);
  const { data: reviews } = useProductReviews(productId);
  const { data: wishlist } = useWishlist();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { mutate: addReview, isPending: reviewPending } = useAddReview();
  const { identity } = useInternetIdentity();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const isInWishlist = wishlist?.some((w) => w.productId === productId);

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12 animate-pulse"
        data-ocid="product.loading_state"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Product Not Found
        </h2>
        <Link to="/store">
          <Button>Back to Store</Button>
        </Link>
      </div>
    );
  }

  const imgSrc = product.imageUrl || getCategoryImage(product.category);
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  function handleAddToCart() {
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    addToCart(
      { productId, quantity: BigInt(quantity) },
      {
        onSuccess: () => toast.success("Added to cart!"),
        onError: () => toast.error("Failed to add to cart"),
      },
    );
  }

  function handleWishlist() {
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(productId, {
        onSuccess: () => toast.success("Removed from wishlist"),
      });
    } else {
      addToWishlist(productId, {
        onSuccess: () => toast.success("Added to wishlist!"),
      });
    }
  }

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login to review");
      return;
    }
    addReview(
      { productId, rating: BigInt(reviewRating), comment: reviewComment },
      {
        onSuccess: () => {
          toast.success("Review submitted!");
          setReviewComment("");
          setReviewRating(5);
        },
        onError: () => toast.error("Failed to submit review"),
      },
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/store"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-2xl overflow-hidden shadow-card"
        >
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div>
            <Badge variant="secondary" className="mb-2">
              {getCategoryLabel(product.category)}
            </Badge>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {product.name}
            </h1>
          </div>

          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary price-format">
              {formatNPR(product.priceNPR)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${product.stock > 0n ? "bg-green-500" : "bg-red-500"}`}
            />
            <span
              className={`text-sm font-medium ${product.stock > 0n ? "text-green-700" : "text-red-600"}`}
            >
              {product.stock > 0n
                ? `In Stock (${product.stock.toString()} available)`
                : "Out of Stock"}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-lg font-bold hover:bg-secondary transition-colors rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-lg font-bold hover:bg-secondary transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0n}
              data-ocid="product.add_to_cart_button"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleWishlist}
            data-ocid="product.wishlist_button"
            className={`w-full ${isInWishlist ? "border-red-400 text-red-500" : "border-border"}`}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-red-500" : ""}`}
            />
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>

          <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
            <Leaf className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              This product is eco-certified and supports local Nepali
              communities.
            </p>
          </div>
        </motion.div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="font-display text-2xl font-bold mb-6">
          Customer Reviews
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <div
                key={review.id.toString()}
                className="bg-card rounded-xl p-4 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= Number(review.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">
            No reviews yet. Be the first to review!
          </p>
        )}

        {identity && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-secondary/30 rounded-xl p-6"
          >
            <h3 className="font-heading font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setReviewRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience with this product..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="mb-4"
              required
              rows={3}
            />
            <Button
              type="submit"
              disabled={reviewPending}
              data-ocid="product.review_submit_button"
              className="bg-primary text-primary-foreground"
            >
              {reviewPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
