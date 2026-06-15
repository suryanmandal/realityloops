"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/app/components/PublicNavbar";
import Footer from "@/app/components/Footer";
import { Search, Filter, X, ChevronDown, ShoppingCart, Plus, Minus, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ModelViewer from "@/components/Model3DViewer";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  mrp: number;
  price: number;
  image: string;
  categoryId: Category;
  restaurantId: {
    _id: string;
    restaurantName: string;
    ownerName: string;
  };
  status: string;
  stock: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  preparationTime: number;
  arModelPath?: string;
}

interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  arModelPath: string;
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image?: string;
}

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* Filters */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isVegetarian, setIsVegetarian] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  /* Modal */
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* Shopping Cart & Checkout Drawer State */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const categories = Array.from(
    new Set(products.map((p) => JSON.stringify(p.categoryId)))
  ).map((c) => JSON.parse(c));

  // Fetch Restaurant and Products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/public/restaurants`
        );
        const resData = await resResponse.json();
        if (resData.success) {
          const found = resData.data.restaurants.find(
            (r: Restaurant) => r._id === id
          );
          setRestaurant(found);
        }

        const prodResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/public/products?restaurantId=${id}`
        );
        const prodData = await prodResponse.json();
        if (prodData.success) {
          setProducts(prodData.data.products);
          setFilteredProducts(prodData.data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Load cart from localStorage scoped by restaurant ID
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const savedCart = localStorage.getItem(`rl_cart_${id}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }
    }
  }, [id]);

  // Save cart to localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined" && id) {
      localStorage.setItem(`rl_cart_${id}`, JSON.stringify(newCart));
    }
  };

  /* Filters logic */
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery)
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (selectedCategory)
      filtered = filtered.filter((p) => p.categoryId._id === selectedCategory);

    if (isVegetarian !== null)
      filtered = filtered.filter((p) => p.isVegetarian === isVegetarian);

    if (isAvailable !== null)
      filtered = filtered.filter((p) => p.isAvailable === isAvailable);

    if (minPrice) filtered = filtered.filter((p) => p.price >= +minPrice);
    if (maxPrice) filtered = filtered.filter((p) => p.price <= +maxPrice);

    filtered.sort((a: any, b: any) => {
      if (sortOrder === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

    setFilteredProducts(filtered);
  }, [
    products,
    searchQuery,
    selectedCategory,
    isVegetarian,
    isAvailable,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setIsVegetarian(null);
    setIsAvailable(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  /* Shopping Cart Handlers */
  const addToCart = (product: Product) => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      // Redirect to login page with redirect URL back to this page
      router.push(`/restaurant/auth/login?redirect=/res/${id}`);
      return;
    }

    const existingItemIndex = cart.findIndex((item) => item.productId === product._id);
    let newCart = [...cart];

    if (existingItemIndex > -1) {
      const existingItem = cart[existingItemIndex];
      const newQty = existingItem.quantity + 1;
      newCart[existingItemIndex] = {
        ...existingItem,
        quantity: newQty,
        subtotal: +(newQty * product.price).toFixed(2),
      };
    } else {
      newCart.push({
        productId: product._id,
        productName: product.title,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
        image: product.image,
      });
    }

    saveCartToStorage(newCart);
    setShowModal(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const existingItemIndex = cart.findIndex((item) => item.productId === productId);
    if (existingItemIndex === -1) return;

    let newCart = [...cart];
    const existingItem = newCart[existingItemIndex];
    const newQty = existingItem.quantity + delta;

    if (newQty <= 0) {
      newCart.splice(existingItemIndex, 1);
    } else {
      newCart[existingItemIndex] = {
        ...existingItem,
        quantity: newQty,
        subtotal: +(newQty * existingItem.unitPrice).toFixed(2),
      };
    }
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  /* Place Table Order Handler */
  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) {
      alert("Please enter your Table Number to place the order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push(`/restaurant/auth/login?redirect=/res/${id}`);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const totalAmount = +cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);

      const payload = {
        restaurantId: id,
        tableNumber: tableNumber,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
        totalAmount: totalAmount,
        paymentAmount: totalAmount,
        customerNotes: customerNotes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/staff/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPlacedOrderNumber(data.data.order.orderNumber);
        setOrderSuccess(true);
        clearCart();
        setTableNumber("");
        setCustomerNotes("");
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Restaurant not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen relative pb-24">
      <PublicNavbar />

      {/* IMMERSIVE HEADER */}
      <section className="relative h-[280px] overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

        {/* Background Image */}
        <img
          src={
            restaurant?.image ||
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
          }
          className="h-full w-full object-cover"
          alt={restaurant?.restaurantName}
        />

        {/* Info Card */}
        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-3xl bg-white/95 p-5 shadow-2xl flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">
              {restaurant?.restaurantName}
            </h1>
            <p className="text-sm text-gray-600">📍 {restaurant?.address}</p>
            <p className="text-sm text-gray-600">
              👤 Owner: {restaurant?.ownerName}
            </p>
          </div>

          <div className="space-y-1 text-sm text-gray-700 text-right sm:block flex justify-between gap-4">
            <p>📞 {restaurant?.phone || "Not available"}</p>
            <p>✉️ {restaurant?.email || "Not available"}</p>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select category"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vegetarian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={
                    isVegetarian === null ? "" : isVegetarian ? "veg" : "nonveg"
                  }
                  onChange={(e) =>
                    setIsVegetarian(
                      e.target.value === ""
                        ? null
                        : e.target.value === "veg"
                        ? true
                        : false
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select food type"
                >
                  <option value="">All</option>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={
                    isAvailable === null
                      ? ""
                      : isAvailable
                      ? "available"
                      : "unavailable"
                  }
                  onChange={(e) =>
                    setIsAvailable(
                      e.target.value === ""
                        ? null
                        : e.target.value === "available"
                        ? true
                        : false
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select availability"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Sort by"
                  >
                    <option value="createdAt">Date</option>
                    <option value="price">Price</option>
                    <option value="title">Name</option>
                    <option value="preparationTime">Prep Time</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    aria-label={`Sort order: ${
                      sortOrder === "asc" ? "ascending" : "descending"
                    }`}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => openProductModal(product)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 border border-slate-100 flex flex-col h-full group"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {product.arModelPath ? (
                  <ModelViewer
                    src={product.arModelPath}
                    poster={product.image}
                    alt={product.title}
                  />
                ) : (
                  <img
                    src={product.image}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={product.title}
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-black text-xl text-slate-900">₹{product.price}</p>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    🌱 {product.isVegetarian ? "Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-slide-up sm:animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative">
              <div className="relative h-[320px] sm:h-[260px] bg-slate-100">
                {selectedProduct.arModelPath ? (
                  <ModelViewer
                    src={selectedProduct.arModelPath}
                    poster={selectedProduct.image}
                    alt={selectedProduct.title}
                  />
                ) : (
                  <img
                    src={selectedProduct.image}
                    className="w-full h-full object-cover"
                    alt={selectedProduct.title}
                  />
                )}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg backdrop-blur-md transition-all shadow-md"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 bg-white/95 rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 backdrop-blur-md">
                <p className="font-bold text-slate-800 text-sm">
                  {selectedProduct.restaurantId.restaurantName}
                </p>
                <p className="text-xs text-slate-500">
                  by {selectedProduct.restaurantId.ownerName}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                  {selectedProduct.title}
                </h2>
                <p className="text-sm font-semibold text-indigo-600 mt-1">
                  {selectedProduct.categoryId.name}
                </p>
              </div>

              <div className="flex gap-4 text-xs font-bold">
                <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full">
                  🌱 {selectedProduct.isVegetarian ? "Vegetarian" : "Non-Veg"}
                </span>
                <span className={`px-3 py-1 border rounded-full ${
                  selectedProduct.isAvailable 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}>
                  {selectedProduct.isAvailable ? "✓ Available" : "✗ Out of Stock"}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm">
                {selectedProduct.description}
              </p>

              {/* Price */}
              <div className="flex items-end gap-3 py-2">
                <span className="text-3xl font-black text-emerald-600">
                  ₹{selectedProduct.price}
                </span>
                <span className="line-through text-slate-400 text-sm">
                  ₹{selectedProduct.mrp}
                </span>
                <span className="text-emerald-500 bg-emerald-50 text-xs font-bold px-2 py-0.5 rounded border border-emerald-200 animate-pulse">
                  {Math.round(
                    ((selectedProduct.mrp - selectedProduct.price) /
                      selectedProduct.mrp) *
                      100
                  )}
                  % OFF
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Prep Time</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedProduct.preparationTime} mins
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Stock Status</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} left` : "0 left"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                  <p className="font-bold text-emerald-600 text-sm uppercase">
                    {selectedProduct.status}
                  </p>
                </div>
              </div>

              {/* Category About info */}
              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-800 text-sm mb-1">
                  About {selectedProduct.categoryId.name}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {selectedProduct.categoryId.description}
                </p>
              </div>

              <button
                onClick={() => addToCart(selectedProduct)}
                disabled={!selectedProduct.isAvailable}
                className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-green-600/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01]"
              >
                {selectedProduct.isAvailable ? "ADD TO CART" : "OUT OF STOCK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART FAB */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCartDrawer(true)}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-white px-8 py-5 rounded-full shadow-2xl border border-slate-800 transition-all font-bold group animate-bounce-short w-[90%] sm:w-auto justify-center"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-3.5 -right-3.5 bg-indigo-500 text-white rounded-full text-2xs w-5 h-5 flex items-center justify-center border border-slate-950 font-black">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="text-sm">View Table Cart (₹{cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)})</span>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* SHOPPING CART SLIDE-OUT DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex justify-end">
          {/* Backdrop Closer */}
          <div className="absolute inset-0 z-0" onClick={() => setShowCartDrawer(false)} />

          {/* Drawer container */}
          <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-in">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Table Cart</h3>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-semibold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <ShoppingCart className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-lg">Your cart is empty</p>
                    <p className="text-slate-500 text-sm">Add items from the menu to start order.</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 items-center justify-between"
                  >
                    <div className="flex gap-3 items-center flex-1">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800"
                          alt={item.productName}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                          🍔
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate leading-tight">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">₹{item.unitPrice} each</p>
                        <p className="text-sm font-bold text-emerald-400 mt-1">₹{item.subtotal}</p>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-white font-bold text-sm min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Form & Subtotals */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-6">
                {/* Table Number */}
                <div>
                  <label htmlFor="tableNumber" className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
                    Table Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="tableNumber"
                    type="text"
                    required
                    placeholder="e.g. Table 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-700 font-bold"
                  />
                </div>

                {/* Chef Notes */}
                <div>
                  <label htmlFor="customerNotes" className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
                    Special Chef Notes (Optional)
                  </label>
                  <textarea
                    id="customerNotes"
                    rows={2}
                    placeholder="e.g. Extra spicy, no coriander..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-700 text-sm"
                  />
                </div>

                {/* Subtotals info */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Cart Subtotal</span>
                    <span>₹{cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>CGST/SGST (Inclusive)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-white font-extrabold text-base pt-2 border-t border-dashed border-slate-800">
                    <span>Grand Total</span>
                    <span className="text-emerald-400">
                      ₹{cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !tableNumber.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-600/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
                >
                  {isPlacingOrder ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                  ) : (
                    <>
                      Place Order to Kitchen
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDER SUCCESS OVERLAY */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl transform scale-100 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-bounce">
              <Check className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white">Order Placed!</h3>
              <p className="text-slate-400">
                Your order is sent to the restaurant kitchen.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                Order Ticket Number
              </p>
              <p className="text-xl font-mono font-black text-indigo-400 mt-1">
                {placedOrderNumber}
              </p>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(false);
                setShowCartDrawer(false);
              }}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-colors shadow-lg hover:shadow-indigo-500/20"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes bounce-short {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -6px);
          }
        }
        
        @media (min-width: 640px) {
          @keyframes bounce-short-desktop {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .animate-bounce-short {
            animation: bounce-short-desktop 2s infinite ease-in-out;
          }
        }
        
        @media (max-width: 639px) {
          .animate-bounce-short {
            animation: bounce-short 2s infinite ease-in-out;
          }
        }
      `}</style>
    </div>
  );
}
