"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Clock, User, Clock as ClockIcon, ShoppingCart, Package, Users, BarChart3 } from "lucide-react";

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

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topSellingProducts: any[];
  monthlyRevenue: any[];
}

interface DashboardData {
  restaurant: Restaurant;
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    recentOrders: any[];
  };
  analytics: Analytics;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch dashboard data
        const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardResult = await dashboardResponse.json();

        // Fetch analytics data
        const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/dashboard/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsResult = await analyticsResponse.json();

        // Combine the data
        setDashboardData({
          restaurant: dashboardResult.data.restaurant,
          overview: dashboardResult.data.overview,
          analytics: analyticsResult.data.analytics,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <DashboardSidebar />
          <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading dashboard...</div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <DashboardSidebar />
          <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="text-red-500">Error: {error || "Failed to load dashboard data"}</div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const { restaurant, overview, analytics } = dashboardData;

  // Create status cards based on fetched data
  const statusCards = [
    {
      id: 1,
      title: "Total Products",
      count: overview.totalProducts,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Total Categories",
      count: overview.totalCategories,
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Total Orders",
      count: overview.totalOrders,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      icon: <ShoppingCart className="w-6 h-6" />
    },
    {
      id: 4,
      title: "Total Revenue",
      count: analytics.totalRevenue,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      icon: <BarChart3 className="w-6 h-6" />
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex">
        <DashboardSidebar />

        <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
          <DashboardNavbar
            title="Dashboard"
            subtitle="Restaurant overview and analytics"
          />

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
            {statusCards.map((card) => (
              <div key={card.id} className={`bg-white rounded-lg shadow-sm p-6 ${card.bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color}`}>
                    {card.icon}
                  </div>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {card.title === "Total Revenue" ? `₹${card.count.toLocaleString()}` : card.count}
                </div>
                <div className="text-sm font-medium text-gray-500">{card.title}</div>
              </div>
            ))}
          </div>

          {/* Restaurant Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Restaurant Name</p>
                <p className="font-medium">{restaurant.restaurantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="font-medium">{restaurant.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{restaurant.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{restaurant.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{restaurant.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${restaurant.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {restaurant.status}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {overview.recentOrders.length > 0 ? (
                overview.recentOrders.map((order: any) => (
                  <div key={order._id} className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">{order.orderNumber}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No recent orders</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}