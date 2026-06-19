"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { Plus, Edit3, Trash2, Save, X, ExternalLink } from "lucide-react";
import FoodCameraCapture from "@/app/components/services/FoodCameraCapture";

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

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  mrp: string;
  price: string;
  stock: string;
  preparationTime: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  image: File | null;
  arModel: File | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [is3dEnabled, setIs3dEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: "",
    mrp: "",
    price: "",
    stock: "",
    preparationTime: "",
    isAvailable: true,
    isVegetarian: false,
    image: null,
    arModel: null
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Custom 3D generation switcher state and refs
  const arModelInputRef = useRef<HTMLInputElement>(null);
  const [show3dMenu, setShow3dMenu] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraProductId, setCameraProductId] = useState<string>("new");
  const [targetMode, setTargetMode] = useState<"standard" | "premium" | "premium_lite">("standard");
  const [generatedPath, setGeneratedPath] = useState<string | null>(null);
  const [arModelSource, setArModelSource] = useState<"local" | "standard" | "premium" | "premium_lite" | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch products
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (productsResponse.status === 401 || productsResponse.status === 403 || productsResponse.status === 404) {
        localStorage.removeItem("restaurantToken");
        window.location.href = "/services/dashboard/login";
        return;
      }

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }

      const productsResult = await productsResponse.json();
      setProducts(productsResult.data.products);

      // Fetch categories
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesResult = await categoriesResponse.json();
      setCategories(categoriesResult.data.categories);

      // Fetch restaurant account for 3D permission
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleArModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, arModel: e.target.files![0] }));
      setGeneratedPath(null);
      setArModelSource("local");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('mrp', formData.mrp);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('preparationTime', formData.preparationTime);
      formDataToSend.append('isAvailable', formData.isAvailable.toString());
      formDataToSend.append('isVegetarian', formData.isVegetarian.toString());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.arModel) {
        formDataToSend.append('arModel', formData.arModel);
      } else if (generatedPath) {
        formDataToSend.append('arModelPath', generatedPath);
      }

      let response;
      if (editingId) {
        // Update existing product
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product/${editingId}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new product
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        const detailMsg = errorData.errors && Array.isArray(errorData.errors)
          ? errorData.errors.map((e: any) => e.message).join(", ")
          : "";
        throw new Error(detailMsg ? `Validation failed: ${detailMsg}` : (errorData.message || 'Failed to save product'));
      }

      const result = await response.json();
      
      if (editingId) {
        // Update the product in the list
        setProducts(prev => prev.map(prod => prod._id === editingId ? result.data.product : prod));
      } else {
        // Add new product to the list
        setProducts(prev => [result.data.product, ...prev]);
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        mrp: "",
        price: "",
        stock: "",
        preparationTime: "",
        isAvailable: true,
        isVegetarian: false,
        image: null,
        arModel: null
      });
      setShowForm(false);
      setEditingId(null);
      setGeneratedPath(null);
      setArModelSource(null);
      setShow3dMenu(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
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
      const product = result.data.product;
      
      setFormData({
        title: product.title,
        description: product.description,
        categoryId: product.categoryId._id,
        mrp: product.mrp.toString(),
        price: product.price.toString(),
        stock: product.stock.toString(),
        preparationTime: product.preparationTime.toString(),
        isAvailable: product.isAvailable,
        isVegetarian: product.isVegetarian,
        image: null, // We can't pre-populate file input, so we'll leave it empty
        arModel: null
      });
      setEditingId(id);
      setShowForm(true);
      setGeneratedPath(null);
      setArModelSource(null);
      setShow3dMenu(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(id);
    setError(null);

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      // Remove the product from the list
      setProducts(prev => prev.filter(prod => prod._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setGeneratedPath(null);
    setArModelSource(null);
    setShow3dMenu(false);
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      mrp: "",
      price: "",
      stock: "",
      preparationTime: "",
      isAvailable: true,
      isVegetarian: false,
      image: null,
      arModel: null
    });
  };

  if (loading) {
    return (
      <div className="flex">
        <DashboardSidebar />
        <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading products...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Products"
          subtitle="Manage your restaurant products"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Products</h3>
            <button
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  categoryId: "",
                  mrp: "",
                  price: "",
                  stock: "",
                  preparationTime: "",
                  isAvailable: true,
                  isVegetarian: false,
                  image: null,
                  arModel: null
                });
                setEditingId(null);
                setShowForm(true);
                setGeneratedPath(null);
                setArModelSource(null);
                setShow3dMenu(false);
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium mb-4">
                {editingId ? "Edit Product" : "Add New Product"}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MRP *</label>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (min) *</label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Is Available
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Is Vegetarian
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {editingId && !formData.image && (
                      <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                    )}
                  </div>

                  {is3dEnabled ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">3D Model (.glb) *</label>
                      
                      {/* Hidden native file input */}
                      <input
                        type="file"
                        accept=".glb"
                        ref={arModelInputRef}
                        onChange={handleArModelChange}
                        className="hidden"
                      />

                      <div className="relative">
                        {/* Dropdown Backdrop to close menu on click outside */}
                        {show3dMenu && (
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShow3dMenu(false);
                            }}
                          />
                        )}

                        <div
                          onClick={() => setShow3dMenu(!show3dMenu)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer relative z-30"
                        >
                          {/* Mock "Choose file" button */}
                          <div className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded px-2.5 py-1 text-xs font-semibold mr-3 transition-colors pointer-events-none select-none">
                            Choose file
                          </div>
                          
                          {/* File status text */}
                          <span className="text-sm text-gray-500 truncate select-none">
                            {formData.arModel 
                              ? (arModelSource === "standard" 
                                  ? `📸 ${formData.arModel.name} (Standard)` 
                                  : `📂 ${formData.arModel.name}`)
                              : arModelSource === "premium" && generatedPath
                                ? "✨ AI Model Ready (Premium)"
                                : arModelSource === "premium_lite" && generatedPath
                                  ? "⚡ AI Model Ready (Premium lite)"
                                  : "No file chosen"
                            }
                          </span>
                        </div>

                        {/* Dropdown Menu */}
                        {show3dMenu && (
                          <div className="absolute right-0 left-0 mt-1.5 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 text-sm">
                            <button
                              type="button"
                              onClick={() => {
                                arModelInputRef.current?.click();
                                setShow3dMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 cursor-pointer border-b border-gray-100"
                            >
                              <span>📂</span>
                              <span className="font-semibold">Choose local file</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCameraOpen(true);
                                setCameraProductId(editingId ? editingId : "new");
                                setTargetMode("standard");
                                setShow3dMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 cursor-pointer border-b border-gray-100"
                            >
                              <span>📸</span>
                              <span className="font-semibold">Standard gen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCameraOpen(true);
                                setCameraProductId(editingId ? editingId : "new");
                                setTargetMode("premium");
                                setShow3dMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 cursor-pointer border-b border-gray-100"
                            >
                              <span>✨</span>
                              <span className="font-semibold">Premium gen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCameraOpen(true);
                                setCameraProductId(editingId ? editingId : "new");
                                setTargetMode("premium_lite");
                                setShow3dMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 cursor-pointer"
                            >
                              <span>⚡</span>
                              <span className="font-semibold">Premium lite</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId && !formData.arModel && !generatedPath && (
                        <p className="text-xs text-gray-500 mt-1">Leave empty to keep current 3D model</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col justify-center min-h-[74px]">
                      <label className="block text-xs font-semibold text-gray-400 mb-1">3D AR Model (.glb)</label>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-medium">
                        <span>🔒 3D features locked.</span>
                        <span className="text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-bold border border-blue-100">PREMIUM</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">Ask system administrator to enable 3D Model views.</p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      minLength={10}
                      maxLength={1000}
                      placeholder="Enter a mouth-watering description of your dish..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between items-center mt-1 text-[11px]">
                      <span className={`${formData.description.trim().length >= 10 ? 'text-gray-500 font-semibold' : 'text-amber-600 font-bold'}`}>
                        {formData.description.trim().length < 10 
                          ? `⚠️ Must be at least 10 characters (current: ${formData.description.trim().length})`
                          : "✓ Description length valid"}
                      </span>
                      <span className="text-gray-400 font-semibold">{formData.description.length}/1000</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingId ? "Update" : "Create"}</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Create your first product!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{product.title}</h4>
                    <div className="flex space-x-2">
                      <Link
                        href={`/services/dashboard/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className={`p-1 ${deleting === product._id ? 'text-gray-400' : 'text-red-600 hover:text-red-800'}`}
                        title="Delete"
                      >
                        {deleting === product._id ? (
                          <div className="w-4 h-4 border-t-2 border-red-600 border-solid rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Link href={`/services/dashboard/products/${product._id}`} className="block">
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                    {product.image && (
                      <div className="mb-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="font-medium">MRP:</span> ₹{product.mrp}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ₹{product.price}
                    </div>
                    <div>
                      <span className="font-medium">Stock:</span> {product.stock}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {product.preparationTime} min
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {product.isVegetarian ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {product.categoryId.name}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 3D Camera Capture Modal */}
      <FoodCameraCapture
        productId={cameraProductId}
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        initialMode={targetMode}
        onSuccess={(result, mode) => {
          if (editingId) {
            // Since it is an existing product, the backend has already updated it
            // or we uploaded it. Refresh product list.
            fetchData();
          } else {
            if (mode === "standard") {
              // result is a File object containing the GLB
              setFormData(prev => ({ ...prev, arModel: result }));
              setGeneratedPath(null);
              setArModelSource("standard");
            } else {
              // result is the arModelPath string
              setGeneratedPath(result);
              setFormData(prev => ({ ...prev, arModel: null }));
              setArModelSource(mode === "premium" ? "premium" : "premium_lite");
            }
          }
        }}
      />
    </div>
  );
}