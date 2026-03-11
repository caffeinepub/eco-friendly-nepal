import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddToCart,
  useAddToWishlist,
  useWishlist,
} from "../hooks/useQueries";
import { formatNPR, getCategoryImage, getCategoryLabel } from "../lib/format";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { data: wishlist } = useWishlist();

  const isInWishlist = wishlist?.some((w) => w.productId === product.id);
  const imgSrc = product.imageUrl || getCategoryImage(product.category);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(
      { productId: product.id, quantity: 1n },
      {
        onSuccess: () => toast.success(`${product.name} added to cart!`),
        onError: () => toast.error("Failed to add to cart"),
      },
    );
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login to save to wishlist");
      return;
    }
    addToWishlist(product.id, {
      onSuccess: () => toast.success("Added to wishlist!"),
      onError: () => toast.error("Failed to update wishlist"),
    });
  }

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id.toString() }}
      data-ocid={`store.product.item.${index}`}
      className="group block"
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <button
            type="button"
            onClick={handleWishlist}
            data-ocid="product.wishlist_button"
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </button>
          {product.stock === 0n && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-foreground text-sm font-medium px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-sm line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {getCategoryLabel(product.category)}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3 w-3 ${s <= 4 ? "fill-amber-400 text-amber-400" : "text-muted"}`}
              />
            ))}
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <span className="font-display font-bold text-primary text-lg price-format">
              {formatNPR(product.priceNPR)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0n}
              data-ocid="product.add_to_cart_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
