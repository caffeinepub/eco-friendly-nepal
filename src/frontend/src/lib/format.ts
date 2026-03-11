export function formatNPR(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `रु ${num.toLocaleString("en-IN")}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getCategoryImage(category: string): string {
  switch (category) {
    case "eco":
      return "/assets/generated/product-bamboo.dim_600x600.jpg";
    case "herbal":
      return "/assets/generated/product-herbal.dim_600x600.jpg";
    case "sustainable":
      return "/assets/generated/product-sustainable.dim_600x600.jpg";
    default:
      return "/assets/generated/product-bamboo.dim_600x600.jpg";
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "eco":
      return "Eco Products";
    case "herbal":
      return "Herbal Products";
    case "sustainable":
      return "Daily Sustainable";
    default:
      return category;
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getTrashStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "verified":
      return "bg-blue-100 text-blue-800";
    case "rewarded":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
