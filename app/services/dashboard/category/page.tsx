"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";

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

interface FormData {
  name: string;
  description: string;
  image: File | null;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image: null
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      setCategories(result.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingId) {
        // Update existing category
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category/${editingId}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new category
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      const result = await response.json();
      
      if (editingId) {
        // Update the category in the list
        setCategories(prev => prev.map(cat => cat._id === editingId ? result.data.category : cat));
      } else {
        // Add new category to the list
        setCategories(prev => [result.data.category, ...prev]);
      }

      // Reset form
      setFormData({ name: "", description: "", image: null });
      setShowForm(false);
      setEditingId(null);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      const result = await response.json();
      const category = result.data.category;
      
      setFormData({
        name: category.name,
        description: category.description,
        image: null // We can't pre-populate file input, so we'll leave it empty
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeleting(id);
    setError(null);

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/category/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      // Remove the category from the list
      setCategories(prev => prev.filter(cat => cat._id !== id));
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
    setFormData({ name: "", description: "", image: null });
  };

  if (loading) {
    return (
      <div className="flex">
        <DashboardSidebar />
        <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading categories...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Categories"
          subtitle="Manage your restaurant categories"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Categories</h3>
            <button
              onClick={() => {
                setFormData({ name: "", description: "", image: null });
                setEditingId(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium mb-4">
                {editingId ? "Edit Category" : "Add New Category"}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={deleting === category._id}
                        className={`p-1 ${deleting === category._id ? 'text-gray-400' : 'text-red-600 hover:text-red-800'}`}
                        title="Delete"
                      >
                        {deleting === category._id ? (
                          <div className="w-4 h-4 border-t-2 border-red-600 border-solid rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  
                  {category.image && (
                    <div className="mb-3">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}