"use client";

import { useAuth } from "@/context";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/utils";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";

interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  staffMembers: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
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
    description: string;
  };
  restaurantId: {
    _id: string;
    restaurantName: string;
    ownerName: string;
    email: string;
  } | string;
  status: string;
  stock: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  preparationTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function RestaurantDetail() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Fetch restaurant details
        const restaurantResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          setRestaurant(restaurantData.data.restaurant);
        } else {
          console.error('Failed to fetch restaurant');
        }

        // Fetch products for this restaurant
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/products/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.data.products || []);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching restaurant or products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex min-h-screen bg-[#e6e7e9]">
          <Sidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto text-center py-8">Loading restaurant details...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!restaurant) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex min-h-screen bg-[#e6e7e9]">
          <Sidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto text-center py-8">Restaurant not found</div>
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
                onClick={() => router.push('/admin/dashboard')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{restaurant.restaurantName}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Restaurant Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Owner:</span> {restaurant.ownerName}</p>
                    <p><span className="font-medium">Email:</span> {restaurant.email}</p>
                    <p><span className="font-medium">Phone:</span> {restaurant.phone}</p>
                    <p><span className="font-medium">Address:</span> {restaurant.address}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        restaurant.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Created:</span> {formatDate(restaurant.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Role:</span> {restaurant.role}</p>
                    <p><span className="font-medium">Email Verified:</span> {restaurant.isEmailVerified ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Last Login:</span> {formatDate(restaurant.lastLogin)}</p>
                    <p><span className="font-medium">Staff Members:</span> {restaurant.staffMembers.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              
              {products.length === 0 ? (
                <div className="text-center py-8">No products found for this restaurant</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.categoryId.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{product.price} (MRP: ₹{product.mrp})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.isVegetarian ? 'Veg' : 'Non-Veg'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => router.push(`/admin/product/${product._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}