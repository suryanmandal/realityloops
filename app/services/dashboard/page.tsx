"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Clock, User, ShoppingCart, Package, Users, BarChart3, ChevronRight, Award, ShieldCheck, MapPin, Eye } from "lucide-react";
import Link from "next/link";

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
  is3dEnabled?: boolean;
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
  const [activeTab, setActiveTab] = useState<"ALL" | "IDLE" | "PREPARING" | "READY">("ALL");

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

        if (dashboardResponse.status === 401 || dashboardResponse.status === 403 || dashboardResponse.status === 404) {
          localStorage.removeItem("restaurantToken");
          window.location.href = "/services/dashboard/login";
          return;
        }

        if (!dashboardResponse.ok) {
          const text = await dashboardResponse.text();
          console.error("Dashboard fetch error status:", dashboardResponse.status, "body:", text);
          throw new Error(`Failed to fetch dashboard data: Status ${dashboardResponse.status} - ${text}`);
        }

        const dashboardResult = await dashboardResponse.json();

        // Fetch analytics data
        const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/dashboard/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (analyticsResponse.status === 401 || analyticsResponse.status === 403 || analyticsResponse.status === 404) {
          localStorage.removeItem("restaurantToken");
          window.location.href = "/services/dashboard/login";
          return;
        }

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
        <div className="flex bg-[#fcfcfd] min-h-screen">
          <DashboardSidebar />
          <main className="lg:ml-64 ml-0 p-4 lg:p-8 w-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-10 h-10 border-t-2 border-slate-900 border-solid rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium text-sm tracking-wide">Loading workspace...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="flex bg-[#fcfcfd] min-h-screen">
          <DashboardSidebar />
          <main className="lg:ml-64 ml-0 p-4 lg:p-8 w-full flex items-center justify-center">
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 max-w-md text-center">
              <span className="text-2xl mb-2 block">⚠️</span>
              <h3 className="font-semibold text-red-900">Failed to load dashboard</h3>
              <p className="text-xs text-red-600/80 mt-1">{error || "Connection timed out"}</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const { restaurant, overview, analytics } = dashboardData;

  // Filter orders based on tabs
  const filteredOrders = overview.recentOrders.filter(order => {
    if (activeTab === "ALL") return true;
    return order.status === activeTab;
  });

  const getStatusCount = (status: "ALL" | "IDLE" | "PREPARING" | "READY") => {
    if (status === "ALL") return overview.recentOrders.length;
    return overview.recentOrders.filter(order => order.status === status).length;
  };

  const statusCards = [
    {
      id: 1,
      title: "Active Products",
      count: overview.totalProducts,
      color: "text-slate-800",
      icon: <Package className="w-5 h-5 text-slate-600" />,
      desc: "Menu items in catalog"
    },
    {
      id: 2,
      title: "Menu Categories",
      count: overview.totalCategories,
      color: "text-slate-800",
      icon: <BarChart3 className="w-5 h-5 text-slate-600" />,
      desc: "Product groups managed"
    },
    {
      id: 3,
      title: "Total Orders",
      count: overview.totalOrders,
      color: "text-slate-800",
      icon: <ShoppingCart className="w-5 h-5 text-slate-600" />,
      desc: "Lifetime order count"
    },
    {
      id: 4,
      title: "Total Revenue",
      count: `₹${analytics.totalRevenue.toLocaleString()}`,
      color: "text-blue-600",
      icon: <Award className="w-5 h-5 text-blue-600" />,
      desc: "Calculated earnings"
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex bg-[#f8f9fa] min-h-screen">
        <DashboardSidebar />

        <main className="lg:ml-64 ml-0 p-4 lg:p-8 w-full max-w-[1400px]">
          <DashboardNavbar
            title="Dashboard Overview"
            subtitle={`Welcome back, ${restaurant.ownerName}`}
          />

          {/* Premium Welcome Badge */}
          <div className="mt-8 mb-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded font-semibold text-slate-300">RESTAURANT MANAGEMENT PORTAL</span>
                {restaurant.is3dEnabled && (
                  <span className="text-[10px] bg-blue-500/25 border border-blue-400/35 px-1.5 py-0.5 rounded font-bold text-blue-300 flex items-center gap-1">
                    ✨ 3D IMMERSIVE ACCESS ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{restaurant.restaurantName}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Owner: {restaurant.ownerName}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {restaurant.address || "No address defined"}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/services/dashboard/products" className="bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 border border-slate-200">
                Manage Products
              </Link>
              <Link href="/services/dashboard/settings" className="bg-slate-800 hover:bg-slate-700/60 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 border border-slate-700">
                Portal Settings
              </Link>
            </div>
          </div>

          {/* Elegant Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statusCards.map((card) => (
              <div key={card.id} className="bg-white hover:shadow-md transition duration-200 rounded-2xl p-6 border border-slate-100/90 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{card.title}</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl font-extrabold tracking-tight ${card.color}`}>{card.count}</h3>
                  <p className="text-[10px] font-medium text-slate-400/90 mt-1">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Workspace grid: Live Orders (left) & Account Status (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Orders Box (Inspired by extra_code/dashboard.html) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Live Order Tracker
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Track and update active kitchen orders</p>
                </div>
                
                {/* Dynamic Tab Filter */}
                <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100 gap-1 self-start sm:self-auto">
                  {(["ALL", "IDLE", "PREPARING", "READY"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5
                        ${activeTab === tab 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-900"}`}
                    >
                      {tab === "ALL" ? "All" : tab === "IDLE" ? "Pending" : tab === "PREPARING" ? "Preparing" : "Ready"}
                      <span className={`text-[9px] font-bold px-1 py-0.2 rounded-md 
                        ${activeTab === tab ? "bg-slate-800 text-slate-200" : "bg-slate-200/60 text-slate-600"}`}>
                        {getStatusCount(tab)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order: any) => (
                    <div key={order._id} className="p-6 hover:bg-slate-50/50 transition duration-150 flex items-center justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-slate-900 tracking-tight">{order.orderNumber}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            Table {order.tableNumber}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border
                            ${order.status === 'IDLE' 
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-100' 
                              : order.status === 'PREPARING'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {order.status === 'IDLE' ? 'Awaiting Confirmation' : order.status === 'PREPARING' ? 'Being Prepared' : 'Ready for Pickup'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600">
                          {order.items.map((item: any) => `${item.quantity}x ${item.productName}`).join(', ')}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <p className="text-lg font-black text-slate-900">₹{order.totalAmount}</p>
                        <Link href="/services/dashboard/orders" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1">
                          View details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <span className="text-3xl block mb-2">🍽️</span>
                    <p className="text-sm font-semibold">No orders currently in this status</p>
                    <p className="text-xs text-slate-400 mt-0.5">New incoming client orders will appear in real-time</p>
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Profile Information Box */}
            <div className="space-y-6">
              
              {/* Account Status Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400">Owner ID</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{restaurant.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400">Security Email</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{restaurant.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400">Registered Phone</span>
                    <span className="text-xs font-bold text-slate-800">{restaurant.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400">Email Verification</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded">Verified</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400">Account status</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                      ${restaurant.status === 'active' 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {restaurant.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3D Immersive Feature Info Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>🚀</span>
                  Immersive 3D Engine
                </h3>
                <p className="text-xs text-slate-400/90 leading-relaxed">
                  Provide custom Spatial 3D catalog views of your culinary catalog. Clients can inspect ingredients and sizes using their device cameras (AR views).
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Immersive Engine Status</span>
                  {restaurant.is3dEnabled ? (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.8 rounded-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.8 rounded-lg flex items-center gap-1">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                
                {!restaurant.is3dEnabled && (
                  <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 rounded-lg p-2 border border-slate-100 leading-normal">
                    💡 Permission is controlled by the dashboard administrator. Contact system support to request access.
                  </p>
                )}
              </div>

            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}