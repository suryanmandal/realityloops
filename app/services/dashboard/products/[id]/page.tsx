"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { ArrowLeft, Eye, Download, RotateCcw } from "lucide-react";
import ModelViewerComponent from "@/components/ModelViewer";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArModel, setShowArModel] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
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

        // No need to load model viewer since we're using iframe
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
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

                {product.arModelPath && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">3D Model</h3>
                    <div className="relative bg-gray-100 rounded-lg p-4 h-96">
                      {/* 3D model display */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                        {product.arModelPath ? (
                          <ModelViewerComponent
                            src={product.arModelPath}
                            title={product.title}
                            price={product.price}
                            description={product.description}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <p className="text-gray-500 font-medium">No 3D Model Available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
      </main>
    </div>
  );
}