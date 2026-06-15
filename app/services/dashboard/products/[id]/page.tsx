"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { ArrowLeft, Eye, Download, RotateCcw, Camera, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import FoodCameraCapture from "@/app/components/services/FoodCameraCapture";

// DYNAMIC IMPORT: This prevents "window is not defined" errors
// It loads the Model3DViewer component ONLY on the client side
const Model3DViewer = dynamic(() => import("@/components/Model3DViewer"), {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading 3D Component...</div>
});

interface Category {
    _id: string;
    name: string;
    description: string;
    image: string;
    status: string;
    restaurantId: string;
    createdAt: string;
    updatedAt: string;
}

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
    };
    restaurantId: string;
    status: string;
    stock: number;
    isVegetarian: boolean;
    isAvailable: boolean;
    preparationTime: number;
    createdAt: string;
    updatedAt: string;
    arModelPath?: string;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [is3dEnabled, setIs3dEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showArModel, setShowArModel] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);

    useEffect(() => {
        const fetchProductAndAccount = async () => {
            try {
                const token = localStorage.getItem("restaurantToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const result = await response.json();
                setProduct(result.data.product);

                // Fetch restaurant account to check is3dEnabled
                const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (accountResponse.ok) {
                    const accountResult = await accountResponse.json();
                    setIs3dEnabled(accountResult.data.restaurant.is3dEnabled || false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductAndAccount();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex">
                <DashboardSidebar />
                <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
                    <div className="text-lg">Loading product...</div>
                </main>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex">
                <DashboardSidebar />
                <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
                    <div className="text-red-500">Error: {error || "Product not found"}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex">
            <DashboardSidebar />

            <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
                <DashboardNavbar
                    title={product.title}
                    subtitle="Product details"
                />

                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Products
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Image and AR Model */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Product Image</h3>
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-96">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="max-h-80 object-contain rounded-md bg-white p-2"
                                            />
                                        ) : (
                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                                                <span className="text-gray-500">No image available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                 {/* 3D Model AR Section */}
                                <div>
                                    <h3 className="text-lg font-medium mb-2">3D Model & AR Engine</h3>
                                    
                                    {is3dEnabled ? (
                                        product.arModelPath ? (
                                            <div className="space-y-4">
                                                <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200" style={{ height: '400px' }}>
                                                    <Model3DViewer
                                                        src={product.arModelPath}
                                                        alt={`3D model of ${product.title}`}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setCameraOpen(true)}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow cursor-pointer"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                    <span>📸 Snap New Photo & Regenerate 3D Model</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3" style={{ minHeight: '240px' }}>
                                                <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-800">✨ AI 3D Model Engine Active</h4>
                                                    <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                                                        You have 3D generation permissions! Directly snap a photo of your food dish to automatically create a fully textured 3D model.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setCameraOpen(true)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow shadow-emerald-500/10 cursor-pointer"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                    <span>📸 Snap & Generate 3D Model</span>
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        product.arModelPath ? (
                                            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center" style={{ height: '240px' }}>
                                                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3 border border-gray-200 font-bold">
                                                    🔒
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-800">3D Interactive Viewer Locked</h4>
                                                <p className="text-xs text-gray-500 max-w-xs mt-1">This restaurant does not have active 3D Model permissions. Contact your system administrator to enable.</p>
                                            </div>
                                        ) : (
                                            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center" style={{ height: '180px' }}>
                                                <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-2 font-semibold">
                                                    🔒
                                                </div>
                                                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">3D Feature Locked</h4>
                                                <p className="text-xs text-gray-400 mt-1 max-w-xs">Ask system administrator to enable 3D access to unlock immediate camera snapshot generations.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.isAvailable ? 'Available' : 'Not Available'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${product.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                            {product.categoryId.name}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium">Description</h3>
                                    <p className="text-gray-600 mt-1">{product.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700">Price</h4>
                                        <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
                                        <p className="text-sm text-gray-500 line-through">MRP: ₹{product.mrp}</p>
                                        <p className="text-sm text-green-600 font-medium">
                                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700">Stock & Preparation</h4>
                                        <p className="text-lg font-bold text-gray-900">{product.stock} units</p>
                                        <p className="text-sm text-gray-500">{product.preparationTime} min prep time</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700">Created</h4>
                                        <p className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700">Last Updated</h4>
                                        <p className="text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Food snapshot camera capture modal popup */}
                <FoodCameraCapture
                    productId={product._id}
                    isOpen={cameraOpen}
                    onClose={() => setCameraOpen(false)}
                    onSuccess={(updatedProduct) => {
                        setProduct(updatedProduct);
                    }}
                />
            </main>
        </div>
    );
}