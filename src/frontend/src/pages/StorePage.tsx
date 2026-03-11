import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product } from "../backend.d";
import { ProductCategory } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useActiveProducts } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "eco", label: "Eco Products" },
  { value: "herbal", label: "Herbal Products" },
  { value: "sustainable", label: "Daily Sustainable" },
];

export function StorePage() {
  const { data: allProducts, isLoading } = useActiveProducts();
  const { actor } = useActor();
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      if (!actor) return;
      setSearching(true);
      try {
        const results = await actor.searchProductsByName(searchTerm);
        setSearchResults(results);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, actor]);

  let displayProducts: Product[] = searchResults ?? allProducts ?? [];
  if (!searchResults && category !== "all") {
    displayProducts = displayProducts.filter((p) => p.category === category);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-primary mb-2">
          Our Products
        </h1>
        <p className="text-muted-foreground">
          Eco-friendly products for a sustainable Nepal
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-ocid="store.search_input"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{displayProducts.length} products</span>
        </div>
      </div>

      {/* Category Tabs */}
      {!searchTerm && (
        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                data-ocid="store.category.tab"
                className="text-sm"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Products Grid */}
      {isLoading || searching ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="store.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-muted rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded" />
                <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayProducts.map((product, i) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              index={i + 1}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16" data-ocid="store.empty_state">
          <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h3 className="font-heading font-semibold text-lg mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "No products in this category yet."}
          </p>
        </div>
      )}
    </div>
  );
}
