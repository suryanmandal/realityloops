"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/app/components/PublicNavbar";
import Footer from "@/app/components/Footer";
import { Search, Filter, X, ChevronDown } from "lucide-react";
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

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const categories = Array.from(
    new Set(products.map((p) => JSON.stringify(p.categoryId)))
  ).map((c) => JSON.parse(c));

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

  /* Filters logic (unchanged) */
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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600" />
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
    <div className="bg-gray-50 min-h-screen">
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
          {/* Left Side: Name, Address, Owner */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black">
              {restaurant?.restaurantName}
            </h1>
            <p className="text-sm text-gray-600">📍 {restaurant?.address}</p>
            <p className="text-sm text-gray-600">
              👤 Owner: {restaurant?.ownerName}
            </p>
          </div>

          {/* Right Side: Contact Info */}
          <div className="space-y-1 text-sm text-gray-700 text-right">
            <p>📞 {restaurant?.phone || "Not available"}</p>
            <p>✉️ {restaurant?.email || "Not available"}</p>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS (UNCHANGED UI) */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
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
        {/* PRODUCTS GRID */} {/* PRODUCTS */}
        <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => openProductModal(product)}
              className="min-w-[280px] sm:min-w-0 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer overflow-hidden"
            >
              {" "}
              {/* <img
                src={product.image}
                className="h-44 w-full object-cover"
              />{" "} */}
              <div className="relative h-44 w-full bg-gray-100">
                {product.arModelPath ? (
                  <ModelViewer
                    src={product.arModelPath}
                    poster={product.image}
                    alt={product.title}
                  />
                ) : (
                  <img
                    src={product.image}
                    className="h-44 w-full object-cover rounded-t-xl"
                    alt={product.title}
                  />
                )}
              </div>
              <div className="p-4">
                {" "}
                <h3 className="font-bold">{product.title}</h3>{" "}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {" "}
                  {product.description}{" "}
                </p>{" "}
                <p className="mt-2 font-bold text-lg">₹{product.price}</p>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      </div>
      {/* PRODUCT MODAL */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="relative">
              {/* <img
                src={ selectedProduct.image}
                className="h-40 w-full object-cover"
              /> */}
              <div className="relative h-[320px] sm:h-[260px] bg-gray-100">
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
                className="absolute top-3 right-3 bg-black/70 text-white rounded-full h-9 w-9"
              >
                ✕
              </button>

              {/* Restaurant info */}
              <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl px-4 py-2 shadow">
                <p className="font-bold text-sm">
                  {selectedProduct.restaurantId.restaurantName}
                </p>
                <p className="text-xs text-gray-600">
                  by {selectedProduct.restaurantId.ownerName}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-black">{selectedProduct.title}</h2>

              <p className="text-sm text-gray-600">
                {selectedProduct.categoryId.name}
              </p>

              <div className="flex gap-4 text-sm">
                <span>
                  🌱 {selectedProduct.isVegetarian ? "Vegetarian" : "Non-Veg"}
                </span>
                <span>
                  ✓ {selectedProduct.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="text-gray-500">{selectedProduct.description}</p>

              {/* Price */}
              <div className="flex items-end gap-3 mt-2">
                <span className="text-2xl font-black text-green-700">
                  ₹{selectedProduct.price}
                </span>
                <span className="line-through text-gray-400">
                  ₹{selectedProduct.mrp}
                </span>
                <span className="text-green-600 font-semibold">
                  {Math.round(
                    ((selectedProduct.mrp - selectedProduct.price) /
                      selectedProduct.mrp) *
                      100
                  )}
                  % OFF
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                <div>
                  <p className="text-gray-500">Prep Time</p>
                  <p className="font-semibold">
                    {selectedProduct.preparationTime} min
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-semibold">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">
                    {selectedProduct.status}
                  </p>
                </div>
              </div>

              {/* About */}
              <div className="pt-4 border-t">
                <p className="font-semibold">
                  About {selectedProduct.categoryId.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedProduct.categoryId.description}
                </p>
              </div>

              <button className="w-full mt-4 py-4 bg-green-700 text-white rounded-2xl font-bold">
                ADD +
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
