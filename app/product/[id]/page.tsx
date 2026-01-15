"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/app/components/PublicNavbar";
import Footer from "@/app/components/Footer";
import dynamic from "next/dynamic";
import { ArrowLeft, Clock, DollarSign, Package, ChevronLeft, ChevronRight } from "lucide-react";

const Model3DViewer = dynamic(() => import("@/components/Model3DViewer"), {
    ssr: false,
    loading: () => (
        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            Loading 3D Component...
        </div>
    ),
});

interface Product {
    _id: string;
    title: string;
    description: string;
    mrp: number;
    price: number;
    image: string;
    categoryId: {
        _id: string;
        name: string;
        description: string;
    };
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

export default function PublicProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [showImage, setShowImage] = useState(true); // Toggle between image and 3D

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Since there's no single product public endpoint, fetch from restaurant products
                // We'll need to find the product in the list
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/api/v1/public/products?limit=100`
                );
                const data = await response.json();
                if (data.success) {
                    const foundProduct = data.data.products.find(
                        (p: Product) => p._id === id
                    );
                    setProduct(foundProduct);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Auto-toggle between image and 3D every 5 seconds
    useEffect(() => {
        if (product?.arModelPath) {
            const interval = setInterval(() => {
                setShowImage((prev) => !prev);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [product]);

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

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PublicNavbar />
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const discount = product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicNavbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Image/3D Viewer */}
                        <div className="relative bg-gray-100">
                            <div className="sticky top-20 p-8">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner">
                                    {product.arModelPath ? (
                                        <>
                                            {/* Toggle Buttons */}
                                            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                                                <button
                                                    onClick={() => setShowImage(!showImage)}
                                                    className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-white transition-all flex items-center gap-2"
                                                >
                                                    {showImage ? (
                                                        <>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                                                />
                                                            </svg>
                                                            View 3D Model
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            View Image
                                                        </>
                                                    )}
                                                </button>

                                                <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                    {showImage ? "Photo" : "3D Model"}
                                                </div>
                                            </div>

                                            {/* Navigation Arrows */}
                                            <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between z-10 pointer-events-none">
                                                <button
                                                    onClick={() => setShowImage(true)}
                                                    className={`pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all ${showImage ? "opacity-50" : ""
                                                        }`}
                                                    aria-label="Show image"
                                                >
                                                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={() => setShowImage(false)}
                                                    className={`pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all ${!showImage ? "opacity-50" : ""
                                                        }`}
                                                    aria-label="Show 3D model"
                                                >
                                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="relative w-full h-full">
                                                {showImage ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain p-8"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full">
                                                        <Model3DViewer
                                                            src={product.arModelPath}
                                                            alt={`3D model of ${product.title}`}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Indicator Dots */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                <button
                                                    onClick={() => setShowImage(true)}
                                                    className={`w-2 h-2 rounded-full transition-all ${showImage
                                                            ? "bg-indigo-600 w-8"
                                                            : "bg-gray-300 hover:bg-gray-400"
                                                        }`}
                                                    aria-label="Switch to image view"
                                                ></button>
                                                <button
                                                    onClick={() => setShowImage(false)}
                                                    className={`w-2 h-2 rounded-full transition-all ${!showImage
                                                            ? "bg-indigo-600 w-8"
                                                            : "bg-gray-300 hover:bg-gray-400"
                                                        }`}
                                                    aria-label="Switch to 3D view"
                                                ></button>
                                            </div>
                                        </>
                                    ) : (
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain p-8"
                                        />
                                    )}
                                </div>

                                {product.arModelPath && (
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        Auto-switching every 5 seconds • Use arrows or button to control
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="p-8 lg:p-12">
                            {/* Restaurant Info */}
                            <div className="mb-6">
                                <button
                                    onClick={() =>
                                        router.push(`/res/${product.restaurantId._id}`)
                                    }
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block"
                                >
                                    {product.restaurantId.restaurantName} →
                                </button>
                                <span className="text-xs text-gray-500 ml-2">
                                    by {product.restaurantId.ownerName}
                                </span>
                            </div>

                            {/* Title and Category */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {product.title}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {product.categoryId.name}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${product.isVegetarian
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {product.isVegetarian ? "🌱 Vegetarian" : "🍖 Non-Vegetarian"}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${product.isAvailable
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {product.isAvailable ? "✓ Available" : "✗ Unavailable"}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ₹{product.price}
                                    </span>
                                    {product.mrp > product.price && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                ₹{product.mrp}
                                            </span>
                                            <span className="text-lg font-semibold text-green-600">
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                                    <p className="text-sm text-gray-600">Prep Time</p>
                                    <p className="font-bold text-gray-900">{product.preparationTime} min</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <Package className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                                    <p className="text-sm text-gray-600">Stock</p>
                                    <p className="font-bold text-gray-900">
                                        {product.stock > 0 ? product.stock : "Out"}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="font-bold text-gray-900 text-sm">
                                        {product.status}
                                    </p>
                                </div>
                            </div>

                            {/* Category Description */}
                            {product.categoryId.description && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        About {product.categoryId.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {product.categoryId.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
