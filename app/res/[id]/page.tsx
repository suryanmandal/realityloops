"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/app/components/PublicNavbar";
import Footer from "@/app/components/Footer";
import { Search, Filter, X, ChevronDown } from "lucide-react";

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
}

export default function RestaurantPage() {
    const { id } = useParams();
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isVegetarian, setIsVegetarian] = useState<boolean | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories
    const categories = Array.from(
        new Set(products.map((p) => JSON.stringify(p.categoryId)))
    ).map((c) => JSON.parse(c));

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch restaurant details
                const resResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/api/v1/public/restaurants`
                );
                const resData = await resResponse.json();
                if (resData.success) {
                    const foundRestaurant = resData.data.restaurants.find(
                        (r: Restaurant) => r._id === id
                    );
                    setRestaurant(foundRestaurant);
                }

                // Fetch products
                const productsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/api/v1/public/products?restaurantId=${id}`
                );
                const productsData = await productsResponse.json();
                if (productsData.success) {
                    setProducts(productsData.data.products);
                    setFilteredProducts(productsData.data.products);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter((p) => p.categoryId._id === selectedCategory);
        }

        // Vegetarian filter
        if (isVegetarian !== null) {
            filtered = filtered.filter((p) => p.isVegetarian === isVegetarian);
        }

        // Available filter
        if (isAvailable !== null) {
            filtered = filtered.filter((p) => p.isAvailable === isAvailable);
        }

        // Price filter
        if (minPrice) {
            filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal: any = a[sortBy as keyof Product];
            let bVal: any = b[sortBy as keyof Product];

            if (sortBy === "price" || sortBy === "preparationTime") {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            if (sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
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
            <div className="min-h-screen bg-gray-50">
                <PublicNavbar />
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
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
        <div className="min-h-screen bg-gray-50">
            <PublicNavbar />

            {/* Restaurant Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {restaurant.restaurantName}
                            </h1>
                            <p className="text-gray-600 mb-1">Owner: {restaurant.ownerName}</p>
                            <p className="text-gray-500 text-sm">{restaurant.address}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">{restaurant.phone}</p>
                            <p className="text-sm text-gray-500">{restaurant.email}</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
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
                                        aria-label={`Sort order: ${sortOrder === "asc" ? "ascending" : "descending"}`}
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

                {/* Products Grid */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => router.push(`/product/${product._id}`)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 transform hover:scale-105"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                    {product.arModelPath && (
                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                                            3D
                                        </div>
                                    )}
                                    {!product.isAvailable && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Unavailable
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {product.title}
                                        </h3>
                                        <div
                                            className={`ml-2 w-3 h-3 rounded-full flex-shrink-0 ${product.isVegetarian ? "bg-green-500" : "bg-red-500"
                                                }`}
                                            title={product.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                                        ></div>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="text-xs text-gray-500 mb-3">
                                        {product.categoryId.name}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{product.price}
                                            </span>
                                            {product.mrp > product.price && (
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                    ₹{product.mrp}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {product.preparationTime} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500 text-lg">No products found</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
