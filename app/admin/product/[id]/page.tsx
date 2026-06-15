"use client";

import { useAuth } from "@/context";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/utils";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// DYNAMIC IMPORT: This prevents "window is not defined" errors
// It loads the Model3DViewer component ONLY on the client side
const Model3DViewer = dynamic(() => import("@/components/Model3DViewer"), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Loading 3D Component...</div>
});

interface Product {
    _id: string;
    title: string;
    description: string;
    mrp: number;
    price: number;
    image: string;
    arModelPath?: string;
    categoryId: {
        _id: string;
        name: string;
        description: string;
    };
    restaurantId: {
        _id: string;
        restaurantName: string;
        ownerName: string;
        email: string;
    };
    status: string;
    stock: number;
    isVegetarian: boolean;
    isAvailable: boolean;
    preparationTime: number;
    createdAt: string;
    updatedAt: string;
}

export default function ProductDetail() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/product/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProduct(data.data.product);
                } else if (response.status === 401 || response.status === 403) {
                    logout();
                    router.push('/admin/login');
                    return;
                } else {
                    console.error('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    const token = localStorage.getItem('adminToken');
                    if (!token) {
                        logout();
                        router.push('/admin/login');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, logout, router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['model/gltf-binary', 'model/gltf+json', 'model/fbx', 'model/obj', 'application/octet-stream'];
            if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(glb|gltf|fbx|obj)$/)) {
                setUploadStatus({
                    type: 'error',
                    message: 'Invalid file type. Please upload a 3D model file (GLB, GLTF, FBX, or OBJ).'
                });
                return;
            }

            if (file.size > 50 * 1024 * 1024) {
                setUploadStatus({
                    type: 'error',
                    message: 'File size exceeds 50MB limit.'
                });
                return;
            }

            setSelectedFile(file);
            setUploadStatus(null);
        }
    };

    const handleModelUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadStatus({
                type: 'error',
                message: 'Please select a 3D model file to upload.'
            });
            return;
        }

        if (!product?._id) return;

        setUploading(true);
        setUploadStatus(null);

        try {
            const formData = new FormData();
            formData.append('model', selectedFile);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/upload/3d-model/${product._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: formData,
            });

            if (response.status === 401 || response.status === 403) {
                logout();
                router.push('/admin/login');
                return;
            }

            const result = await response.json();

            if (response.ok) {
                setUploadStatus({
                    type: 'success',
                    message: '3D model uploaded successfully!'
                });

                // Refresh product
                const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/product/${product._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    },
                });

                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    setProduct(updatedData.data.product);
                }
            } else {
                setUploadStatus({
                    type: 'error',
                    message: result.message || 'Failed to upload 3D model.'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                type: 'error',
                message: 'An error occurred during upload. Please try again.'
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['admin']}>
                <div className="flex min-h-screen bg-[#e6e7e9]">
                    <Sidebar user={user} onLogout={handleLogout} />
                    <div className="flex-1 p-8">
                        <div className="max-w-6xl mx-auto text-center py-8">Loading product details...</div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!product) {
        return (
            <ProtectedRoute allowedRoles={['admin']}>
                <div className="flex min-h-screen bg-[#e6e7e9]">
                    <Sidebar user={user} onLogout={handleLogout} />
                    <div className="flex-1 p-8">
                        <div className="max-w-6xl mx-auto text-center py-8">Product not found</div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="flex min-h-screen bg-[#e6e7e9]">
                <Sidebar user={user} onLogout={handleLogout} />

                <div className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6">
                            <button
                                onClick={() => router.back()}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                &larr; Back
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Product Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Description</p>
                                            <p className="font-medium">{product.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Price</p>
                                                <p className="font-medium">?{product.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">MRP</p>
                                                <p className="font-medium">?{product.mrp}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Stock</p>
                                                <p className="font-medium">{product.stock}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Preparation Time</p>
                                                <p className="font-medium">{product.preparationTime} mins</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Availability</p>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.isAvailable ? 'Available' : 'Not Available'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Type</p>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isVegetarian
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Category</p>
                                                <p className="font-medium">{product.categoryId.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Restaurant Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Restaurant Name</p>
                                            <p className="font-medium">{product.restaurantId.restaurantName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Owner Name</p>
                                            <p className="font-medium">{product.restaurantId.ownerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{product.restaurantId.email}</p>
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-semibold mb-4 mt-6">Additional Details</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Created</p>
                                            <p className="font-medium">{formatDate(product.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="font-medium">{formatDate(product.updatedAt)}</p>
                                        </div>
                                    </div>

                                    {product.image && (
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-500 mb-2">Product Image</p>
                                            <img
                                                src={product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API}/${product.image}`}
                                                alt={product.title}
                                                className="max-w-full h-auto rounded-lg border"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3D Model Upload Section */}
                            <div className="mt-8 border-t pt-8">
                                <h2 className="text-xl font-semibold mb-4">3D Model Management</h2>
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                    <form onSubmit={handleModelUpload} className="space-y-4">
                                        <div>
                                            <label htmlFor="modelFile" className="block text-sm font-medium text-gray-700 mb-1">
                                                Upload 3D Model File
                                            </label>
                                            <input
                                                type="file"
                                                id="modelFile"
                                                name="modelFile"
                                                accept=".glb,.gltf,.fbx,.obj"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Accepted formats: GLB, GLTF, FBX, OBJ (Max 50MB)
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className={`px-4 py-2 rounded-lg text-white font-medium ${uploading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                            >
                                                {uploading ? 'Uploading...' : product.arModelPath ? 'Update 3D Model' : 'Upload 3D Model'}
                                            </button>

                                            {uploadStatus && (
                                                <div className={`text-sm px-3 py-1 rounded ${uploadStatus.type === 'success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {uploadStatus.message}
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* 3D Model Viewer Section */}
                                {product.arModelPath && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">3D Model Preview</h3>
                                        <div style={{ height: '400px' }}>
                                            <Model3DViewer
                                                src={product.arModelPath}
                                                alt={`3D model of ${product.title}`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}