import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let storage = Map.empty<Text, Storage.ExternalBlob>();

  type ProductId = Nat;
  type ProductCategory = { #eco; #herbal; #sustainable };
  type DeliveryZone = { #kathmanduValley; #hilly; #terai; #mountain };
  type PaymentMethod = {
    #cashOnDelivery;
    #esewa;
    #khalti;
    #card;
  };
  type OrderStatus = { #pending; #confirmed; #shipped; #delivered; #cancelled };
  type TrashReportStatus = { #pending; #verified; #rewarded };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    category : ProductCategory;
    priceNPR : Nat;
    stock : Nat;
    imageUrl : Text;
    isActive : Bool;
    createdAt : Int;
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    priceNPR : Nat;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    totalNPR : Nat;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    deliveryAddress : Text;
    deliveryZone : DeliveryZone;
    shippingCostNPR : Nat;
    trackingCode : ?Text;
    createdAt : Int;
  };

  public type Review = {
    id : Nat;
    productId : ProductId;
    userId : Principal;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

  public type TrashReport = {
    id : Nat;
    userId : Principal;
    imageUrl : Text;
    location : Text;
    status : TrashReportStatus;
    createdAt : Int;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    category : ProductCategory;
    priceNPR : Nat;
    stock : Nat;
    imageUrl : Text;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type WishlistItem = {
    productId : ProductId;
    addedAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Analytics = {
    totalOrders : Nat;
    totalRevenueNPR : Nat;
    ordersByStatus : [(OrderStatus, Nat)];
  };

  // State
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let reviews = Map.empty<Nat, Review>();
  let wishlists = Map.empty<Principal, [WishlistItem]>();
  let carts = Map.empty<Principal, [CartItem]>();
  let trashReports = Map.empty<Nat, TrashReport>();
  let ecoPoints = Map.empty<Principal, Nat>();
  let newsletterEmails = Map.empty<Text, Int>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId : Nat = 1;
  var nextOrderId : Nat = 1;
  var nextReviewId : Nat = 1;
  var nextTrashReportId : Nat = 1;

  // Admin password for direct login (can be changed by admin)
  stable var adminPassword : Text = "EcoNepal2024";

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let deliveryZones = Map.fromIter<Text, Nat>([
    ("Kathmandu Valley", 100),
    ("Hilly", 150),
    ("Terai", 120),
    ("Mountain", 200),
  ].values());

  // Seed sample products
  private func seedProducts() {
    let sampleProducts : [Product] = [
      {
        id = 1;
        name = "Himalayan Hemp Bag";
        description = "Eco-friendly bag made from Himalayan hemp";
        category = #eco;
        priceNPR = 1200;
        stock = 50;
        imageUrl = "https://example.com/hemp-bag.jpg";
        isActive = true;
        createdAt = Time.now();
      },
      {
        id = 2;
        name = "Organic Turmeric Powder";
        description = "Pure organic turmeric from Nepal hills";
        category = #herbal;
        priceNPR = 500;
        stock = 100;
        imageUrl = "https://example.com/turmeric.jpg";
        isActive = true;
        createdAt = Time.now();
      },
      {
        id = 3;
        name = "Bamboo Toothbrush Set";
        description = "Sustainable bamboo toothbrush pack of 4";
        category = #sustainable;
        priceNPR = 800;
        stock = 75;
        imageUrl = "https://example.com/bamboo-brush.jpg";
        isActive = true;
        createdAt = Time.now();
      },
      {
        id = 4;
        name = "Lokta Paper Notebook";
        description = "Handmade notebook from Nepali lokta paper";
        category = #eco;
        priceNPR = 650;
        stock = 60;
        imageUrl = "https://example.com/lokta-notebook.jpg";
        isActive = true;
        createdAt = Time.now();
      },
      {
        id = 5;
        name = "Himalayan Herbal Tea";
        description = "Traditional Nepali herbal tea blend";
        category = #herbal;
        priceNPR = 900;
        stock = 120;
        imageUrl = "https://example.com/herbal-tea.jpg";
        isActive = true;
        createdAt = Time.now();
      },
      {
        id = 6;
        name = "Recycled Cotton Tote";
        description = "Sustainable tote bag from recycled cotton";
        category = #sustainable;
        priceNPR = 1500;
        stock = 40;
        imageUrl = "https://example.com/cotton-tote.jpg";
        isActive = true;
        createdAt = Time.now();
      },
    ];

    for (product in sampleProducts.values()) {
      products.add(product.id, product);
    };
    nextProductId := 7;
  };

  // Initialize with sample data
  seedProducts();

  // ============ Admin Password Login ============

  // Claim admin role by providing the correct password.
  // Caller must be logged in with Internet Identity (non-anonymous).
  public shared ({ caller }) func claimAdminWithPassword(password : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    if (password != adminPassword) { return false };
    // Grant admin role regardless of previous state
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  // Allow the current admin to change the admin password
  public shared ({ caller }) func changeAdminPassword(newPassword : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can change the admin password");
    };
    if (newPassword.size() < 6) {
      Runtime.trap("Password must be at least 6 characters");
    };
    adminPassword := newPassword;
  };

  // ============ User Profile Functions ============

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============ Product Management (Admin Only) ============

  public shared ({ caller }) func addProduct(productInput : ProductInput) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let product = {
      id = nextProductId;
      name = productInput.name;
      description = productInput.description;
      category = productInput.category;
      priceNPR = productInput.priceNPR;
      stock = productInput.stock;
      imageUrl = productInput.imageUrl;
      isActive = true;
      createdAt = Time.now();
    };
    products.add(product.id, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, productInput : ProductInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct = {
          existingProduct with
          name = productInput.name;
          description = productInput.description;
          category = productInput.category;
          priceNPR = productInput.priceNPR;
          stock = productInput.stock;
          imageUrl = productInput.imageUrl;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func toggleProductActive(productId : ProductId, isActive : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can toggle product status");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct = {
          existingProduct with
          isActive = isActive;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  // ============ Product Browsing (Public) ============

  public query func getActiveProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isActive });
  };

  public query func getProductById(productId : ProductId) : async ?Product {
    products.get(productId);
  };

  public query func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(func(p) { p.isActive and p.category == category });
  };

  public query func searchProductsByName(searchTerm : Text) : async [Product] {
    products.values().toArray().filter(func(p) { 
      p.isActive and p.name.contains(#text searchTerm)
    });
  };

  // ============ Cart Management (User Only) ============

  public shared ({ caller }) func addToCart(productId : ProductId, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (not product.isActive) {
          Runtime.trap("Product is not active");
        };
        if (product.stock < quantity) {
          Runtime.trap("Insufficient stock");
        };
      };
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    // Check if product already in cart
    let cartArray = existingCart.map(func(item) {
      if (item.productId == productId) {
        { productId = item.productId; quantity = item.quantity + quantity };
      } else {
        item;
      };
    });

    // If product not found in cart, add it
    let productExists = existingCart.find(func(item) { item.productId == productId });
    let updatedCart = switch (productExists) {
      case (null) {
        existingCart.concat([{ productId; quantity }]);
      };
      case (?_) { cartArray };
    };

    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    let updatedCart = existingCart.filter(func(item) { item.productId != productId });
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : ProductId, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    if (quantity == 0) {
      Runtime.trap("Use removeFromCart to remove items");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    let updatedCart = existingCart.map(func(item) {
      if (item.productId == productId) {
        { productId = item.productId; quantity };
      } else {
        item;
      };
    });

    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

    carts.remove(caller);
  };

  // ============ Order Management ============

  public shared ({ caller }) func placeOrder(paymentMethod : PaymentMethod, deliveryAddress : Text, deliveryZone : DeliveryZone) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { 
        if (cart.size() == 0) {
          Runtime.trap("Cart is empty");
        };
        cart;
      };
    };

    // Validate stock and build order items
    var orderItems : [OrderItem] = [];
    var totalAmount : Nat = 0;

    for (cartItem in cart.values()) {
      switch (products.get(cartItem.productId)) {
        case (null) { Runtime.trap("Product not found: " # cartItem.productId.toText()) };
        case (?product) {
          if (not product.isActive) {
            Runtime.trap("Product is not active: " # product.name);
          };
          if (product.stock < cartItem.quantity) {
            Runtime.trap("Insufficient stock for: " # product.name);
          };

          let itemTotal = product.priceNPR * cartItem.quantity;
          totalAmount += itemTotal;

          orderItems := orderItems.concat([{
            productId = cartItem.productId;
            quantity = cartItem.quantity;
            priceNPR = product.priceNPR;
          }]);

          // Deduct stock
          let updatedProduct = {
            product with
            stock = product.stock - cartItem.quantity;
          };
          products.add(product.id, updatedProduct);
        };
      };
    };

    let shippingCost = switch (deliveryZone) {
      case (#kathmanduValley) { 100 };
      case (#hilly) { 150 };
      case (#terai) { 120 };
      case (#mountain) { 200 };
    };

    let order = {
      id = nextOrderId;
      userId = caller;
      items = orderItems;
      totalNPR = totalAmount + shippingCost;
      paymentMethod;
      status = #pending;
      deliveryAddress;
      deliveryZone;
      shippingCostNPR = shippingCost;
      trackingCode = null;
      createdAt = Time.now();
    };

    orders.add(order.id, order);
    nextOrderId += 1;
    carts.remove(caller);
    
    order.id;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };

    orders.values().toArray().filter(func(o) { o.userId == caller });
  };

  public query ({ caller }) func getOrderById(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  // Admin: View all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  // Admin: Update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with
          status = status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Admin: Update tracking code
  public shared ({ caller }) func updateOrderTracking(orderId : Nat, trackingCode : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update tracking");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with
          trackingCode = ?trackingCode;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // ============ Wishlist Management (User Only) ============

  public shared ({ caller }) func addToWishlist(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlist");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let existingWishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };

    // Check if already in wishlist
    let alreadyExists = existingWishlist.find(func(item) { item.productId == productId });
    if (alreadyExists != null) {
      Runtime.trap("Product already in wishlist");
    };

    let newItem : WishlistItem = {
      productId;
      addedAt = Time.now();
    };

    let updatedWishlist = existingWishlist.concat([newItem]);
    wishlists.add(caller, updatedWishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlist");
    };

    let existingWishlist = switch (wishlists.get(caller)) {
      case (null) { Runtime.trap("Wishlist is empty") };
      case (?wishlist) { wishlist };
    };

    let updatedWishlist = existingWishlist.filter(func(item) { item.productId != productId });
    wishlists.add(caller, updatedWishlist);
  };

  public query ({ caller }) func getMyWishlist() : async [WishlistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wishlist");
    };

    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
  };

  // ============ Reviews ============

  public shared ({ caller }) func addReview(productId : ProductId, rating : Nat, comment : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let review = {
      id = nextReviewId;
      productId;
      userId = caller;
      rating;
      comment;
      createdAt = Time.now();
    };

    reviews.add(review.id, review);
    nextReviewId += 1;
    review.id;
  };

  public query func getReviewsForProduct(productId : ProductId) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.productId == productId });
  };

  // ============ Eco Points ============

  public query ({ caller }) func getMyEcoPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view eco points");
    };

    switch (ecoPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  public shared ({ caller }) func awardEcoPoints(user : Principal, points : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can award eco points");
    };

    let currentPoints = switch (ecoPoints.get(user)) {
      case (null) { 0 };
      case (?pts) { pts };
    };

    ecoPoints.add(user, currentPoints + points);
  };

  // ============ Trash Reports ============

  public shared ({ caller }) func submitTrashReport(imageUrl : Text, location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit trash reports");
    };

    let report = {
      id = nextTrashReportId;
      userId = caller;
      imageUrl;
      location;
      status = #pending;
      createdAt = Time.now();
    };
    trashReports.add(report.id, report);
    nextTrashReportId += 1;
    report.id;
  };

  public query ({ caller }) func getMyTrashReports() : async [TrashReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their trash reports");
    };

    trashReports.values().toArray().filter(func(r) { r.userId == caller });
  };

  public query ({ caller }) func getAllTrashReports() : async [TrashReport] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all trash reports");
    };

    trashReports.values().toArray();
  };

  public shared ({ caller }) func verifyTrashReport(reportId : Nat, pointsToAward : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify trash reports");
    };

    switch (trashReports.get(reportId)) {
      case (null) { Runtime.trap("Trash report not found") };
      case (?report) {
        if (report.status != #pending) {
          Runtime.trap("Report already processed");
        };

        let updatedReport = {
          report with
          status = #verified;
        };
        trashReports.add(reportId, updatedReport);

        // Award eco points
        let currentPoints = switch (ecoPoints.get(report.userId)) {
          case (null) { 0 };
          case (?pts) { pts };
        };
        ecoPoints.add(report.userId, currentPoints + pointsToAward);

        // Update status to rewarded
        let rewardedReport = {
          updatedReport with
          status = #rewarded;
        };
        trashReports.add(reportId, rewardedReport);
      };
    };
  };

  // ============ Newsletter ============

  public shared func subscribeNewsletter(email : Text) : async () {
    // Public endpoint - no auth required
    if (newsletterEmails.containsKey(email)) {
      Runtime.trap("Email already subscribed");
    };

    newsletterEmails.add(email, Time.now());
  };

  public query ({ caller }) func getNewsletterSubscribers() : async [(Text, Int)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view newsletter subscribers");
    };

    newsletterEmails.entries().toArray();
  };

  // ============ Delivery Zones (Public) ============

  public query func getDeliveryZones() : async [(Text, Nat)] {
    deliveryZones.entries().toArray();
  };

  // ============ Admin Analytics ============

  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let allOrders = orders.values().toArray();
    let totalOrders = allOrders.size();
    
    var totalRevenue : Nat = 0;
    for (order in allOrders.values()) {
      totalRevenue += order.totalNPR;
    };

    // Count orders by status
    var pendingCount : Nat = 0;
    var confirmedCount : Nat = 0;
    var shippedCount : Nat = 0;
    var deliveredCount : Nat = 0;
    var cancelledCount : Nat = 0;

    for (order in allOrders.values()) {
      switch (order.status) {
        case (#pending) { pendingCount += 1 };
        case (#confirmed) { confirmedCount += 1 };
        case (#shipped) { shippedCount += 1 };
        case (#delivered) { deliveredCount += 1 };
        case (#cancelled) { cancelledCount += 1 };
      };
    };

    {
      totalOrders;
      totalRevenueNPR = totalRevenue;
      ordersByStatus = [
        (#pending, pendingCount),
        (#confirmed, confirmedCount),
        (#shipped, shippedCount),
        (#delivered, deliveredCount),
        (#cancelled, cancelledCount),
      ];
    };
  };

  public query ({ caller }) func getAllCustomers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all customers");
    };

    // Get unique user principals from orders
    let customerSet = Map.empty<Principal, Bool>();
    for (order in orders.values()) {
      customerSet.add(order.userId, true);
    };

    customerSet.keys().toArray();
  };
};
