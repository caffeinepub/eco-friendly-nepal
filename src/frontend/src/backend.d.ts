import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface ProductInput {
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: ProductCategory;
    priceNPR: bigint;
}
export interface WishlistItem {
    productId: ProductId;
    addedAt: bigint;
}
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
    priceNPR: bigint;
}
export interface TrashReport {
    id: bigint;
    status: TrashReportStatus;
    userId: Principal;
    createdAt: bigint;
    imageUrl: string;
    location: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    trackingCode?: string;
    deliveryAddress: string;
    shippingCostNPR: bigint;
    paymentMethod: PaymentMethod;
    userId: Principal;
    createdAt: bigint;
    deliveryZone: DeliveryZone;
    totalNPR: bigint;
    items: Array<OrderItem>;
}
export interface Analytics {
    totalRevenueNPR: bigint;
    ordersByStatus: Array<[OrderStatus, bigint]>;
    totalOrders: bigint;
}
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface Review {
    id: bigint;
    userId: Principal;
    createdAt: bigint;
    productId: ProductId;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: ProductId;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    stock: bigint;
    imageUrl: string;
    category: ProductCategory;
    priceNPR: bigint;
}
export enum DeliveryZone {
    terai = "terai",
    hilly = "hilly",
    kathmanduValley = "kathmanduValley",
    mountain = "mountain"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PaymentMethod {
    cashOnDelivery = "cashOnDelivery",
    card = "card",
    esewa = "esewa",
    khalti = "khalti"
}
export enum ProductCategory {
    eco = "eco",
    herbal = "herbal",
    sustainable = "sustainable"
}
export enum TrashReportStatus {
    verified = "verified",
    pending = "pending",
    rewarded = "rewarded"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productInput: ProductInput): Promise<bigint>;
    addReview(productId: ProductId, rating: bigint, comment: string): Promise<bigint>;
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    addToWishlist(productId: ProductId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardEcoPoints(user: Principal, points: bigint): Promise<void>;
    changeAdminPassword(newPassword: string): Promise<void>;
    claimAdminWithPassword(password: string): Promise<boolean>;
    clearCart(): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    getActiveProducts(): Promise<Array<Product>>;
    getAllCustomers(): Promise<Array<Principal>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllTrashReports(): Promise<Array<TrashReport>>;
    getAnalytics(): Promise<Analytics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getDeliveryZones(): Promise<Array<[string, bigint]>>;
    getMyEcoPoints(): Promise<bigint>;
    getMyOrders(): Promise<Array<Order>>;
    getMyTrashReports(): Promise<Array<TrashReport>>;
    getMyWishlist(): Promise<Array<WishlistItem>>;
    getNewsletterSubscribers(): Promise<Array<[string, bigint]>>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getProductById(productId: ProductId): Promise<Product | null>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getReviewsForProduct(productId: ProductId): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(paymentMethod: PaymentMethod, deliveryAddress: string, deliveryZone: DeliveryZone): Promise<bigint>;
    removeFromCart(productId: ProductId): Promise<void>;
    removeFromWishlist(productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProductsByName(searchTerm: string): Promise<Array<Product>>;
    submitTrashReport(imageUrl: string, location: string): Promise<bigint>;
    subscribeNewsletter(email: string): Promise<void>;
    toggleProductActive(productId: ProductId, isActive: boolean): Promise<void>;
    updateCartItemQuantity(productId: ProductId, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateOrderTracking(orderId: bigint, trackingCode: string): Promise<void>;
    updateProduct(productId: ProductId, productInput: ProductInput): Promise<void>;
    verifyTrashReport(reportId: bigint, pointsToAward: bigint): Promise<void>;
}
