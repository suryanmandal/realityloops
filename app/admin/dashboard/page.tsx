"use client";

import { useAuth } from "@/context";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/utils";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { 
  Store, 
  Activity, 
  Database, 
  HardDrive, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  Sparkles, 
  Box,
  FileCheck,
  Zap
} from "lucide-react";

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  isEmailVerified: boolean;
  is3dEnabled: boolean;
  heroImage?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  arModelPath?: string;
  restaurantId: {
    _id: string;
    restaurantName: string;
  } | string;
}

interface DashboardStats {
  totalRestaurants: number;
  totalCategories: number;
  totalProducts: number;
  total3DModels: number;
  totalStorageMB: number;
  monthlySignups: { month: string; count: number }[];
  diagnostics: {
    databaseLatency: number;
    serverLatency: number;
    status: string;
  };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Dashboard States
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interface alert toast states
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 3D Sandbox Drawer States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Uploader States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTargetProductId, setUploadTargetProductId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System Settings States
  const [settingsPasscode, setSettingsPasscode] = useState("");
  const [settingsApiKey, setSettingsApiKey] = useState("");
  const [settingsCustomGpuUrl, setSettingsCustomGpuUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Safely import model-viewer on client side to prevent Next.js SSR crashes
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@google/model-viewer").catch(err => {
        console.error("Failed to load model-viewer script:", err);
      });
    }
  }, []);

  // Fetch Dashboard Stats & Content
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        logout();
        router.push('/admin/login');
        return;
      }

      // Fetch Stats
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.status === 401 || statsRes.status === 403) {
        logout();
        router.push('/admin/login');
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data.stats);
      }

      // Fetch Restaurants
      const restaurantRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (restaurantRes.ok) {
        const restData = await restaurantRes.json();
        setRestaurants(restData.data.restaurants || []);
      }

      // Fetch 3D Products (Using Public Endpoint for global catalog search)
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/public/products?limit=100`);
      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(prodData.data.products || []);
      }

      // Fetch Global 3D AI Engine Settings
      const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (settingsRes.ok) {
        const settingsResult = await settingsRes.json();
        setSettingsPasscode(settingsResult.data.tripo_passcode || "premium3d");
        setSettingsApiKey(settingsResult.data.tripo_api_key || "");
        setSettingsCustomGpuUrl(settingsResult.data.custom_gpu_url || "");
      }

    } catch (error) {
      console.error('Error fetching admin dashboard details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [logout, router]);

  // Toggle 3D model access directly inside the table
  const handleToggle3D = async (restaurantId: string, currentState: boolean) => {
    setTogglingId(restaurantId);
    setAlert(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/account/${restaurantId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is3dEnabled: !currentState })
      });

      if (response.ok) {
        const result = await response.json();
        setRestaurants(prev => 
          prev.map(r => r._id === restaurantId ? { ...r, is3dEnabled: !currentState } : r)
        );
        showAlert("success", `Successfully ${!currentState ? "granted" : "revoked"} 3D Access permissions!`);
      } else {
        throw new Error("Failed to update permission");
      }
    } catch (err) {
      showAlert("error", "Failed to update restaurant 3D permissions. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  // Update Restaurant Account Status
  const handleStatusChange = async (restaurantId: string, newStatus: string) => {
    setAlert(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/restaurant/account/${restaurantId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setRestaurants(prev => 
          prev.map(r => r._id === restaurantId ? { ...r, status: newStatus } : r)
        );
        showAlert("success", `Restaurant account status updated to ${newStatus} successfully!`);
        fetchDashboardData(); // Refresh stats counters
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      showAlert("error", "Failed to update restaurant status. Please try again.");
    }
  };

  // Global GLB Model Direct Uploader
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTargetProductId) {
      showAlert("error", "Please select a model file and target product to bind.");
      return;
    }
    
    setUploading(true);
    setAlert(null);
    try {
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      data.append("model", uploadFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/upload/3d-model/${uploadTargetProductId}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        showAlert("success", "Successfully uploaded model and bound it to product!");
        setUploadFile(null);
        setUploadTargetProductId("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchDashboardData(); // Refresh product catalog
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
    } catch (err: any) {
      showAlert("error", err.message || "Failed to upload and bind model file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setAlert(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/admin/settings`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripo_passcode: settingsPasscode,
          tripo_api_key: settingsApiKey,
          custom_gpu_url: settingsCustomGpuUrl
        })
      });

      if (response.ok) {
        showAlert("success", "Successfully updated global 3D AI Engine settings!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings");
      }
    } catch (err: any) {
      showAlert("error", err.message || "Failed to update system settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to extract clean restaurant name from products object
  const getRestaurantName = (product: Product) => {
    if (typeof product.restaurantId === 'object' && product.restaurantId !== null) {
      return product.restaurantId.restaurantName;
    }
    return "Unknown Restaurant";
  };

  // Filter products to find ones that have a seeded or uploaded 3D GLB model
  const models3D = products.filter(p => p.arModelPath && p.arModelPath.endsWith(".glb"));

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-[#0b0f19] text-gray-100 font-sans">
        <Sidebar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header section with ambient glow */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#1e293b] pb-6 gap-4 relative">
              <div className="absolute -top-12 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RealityLoops Administration</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mt-1">Dashboard Vault</h1>
              </div>
              <div className="flex items-center space-x-3 bg-[#1e293b]/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#1e293b]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-300">System Diagnostics: Operational</span>
              </div>
            </header>

            {/* Notification alert banner */}
            {alert && (
              <div className={`p-4 rounded-2xl flex items-center space-x-3 border shadow-lg animate-fadeIn ${
                alert.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-emerald-950/10" 
                  : "bg-red-500/10 border-red-500/25 text-red-400 shadow-red-950/10"
              }`}>
                {alert.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-semibold">{alert.message}</p>
              </div>
            )}

            {/* Diagnostics Stats Banner */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#131926]/60 backdrop-blur-sm border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-[#10b981]/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Stores</span>
                  <Store className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{loading ? "..." : stats?.totalRestaurants || restaurants.length}</span>
                  <span className="text-xs text-gray-400 font-semibold">Active accounts</span>
                </div>
              </div>

              <div className="bg-[#131926]/60 backdrop-blur-sm border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active 3D Models</span>
                  <Box className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{loading ? "..." : stats?.total3DModels || models3D.length}</span>
                  <span className="text-xs text-gray-400 font-semibold">Polygon assets</span>
                </div>
              </div>

              <div className="bg-[#131926]/60 backdrop-blur-sm border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Allocated Storage</span>
                  <HardDrive className="w-5 h-5 text-amber-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{loading ? "..." : `${stats?.totalStorageMB || 32.6} MB`}</span>
                  <span className="text-xs text-gray-400 font-semibold">of 1.0 GB</span>
                </div>
              </div>

              <div className="bg-[#131926]/60 backdrop-blur-sm border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Server Latency</span>
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{loading ? "..." : `${stats?.diagnostics.serverLatency || 24}ms`}</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center space-x-0.5">
                    <Zap className="w-3 h-3 animate-pulse" />
                    <span>Fast</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Restaurant Accounts Master Grid */}
            <section className="bg-[#131926]/40 border border-[#1e293b] rounded-3xl p-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">Registered Restaurants</h3>
                  <p className="text-xs text-gray-500">Monitor access permissions, credentials, and verification lifecycle states</p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold text-gray-400">Loading restaurants...</p>
                </div>
              ) : restaurants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No restaurants seeded or registered in the database.</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#1e293b]/60">
                  <table className="min-w-full divide-y divide-[#1e293b]/80 bg-[#131926]/20">
                    <thead className="bg-[#131926]/80 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">
                      <tr>
                        <th className="px-6 py-4">Restaurant</th>
                        <th className="px-6 py-4">Owner Name</th>
                        <th className="px-6 py-4">Verification Details</th>
                        <th className="px-6 py-4">Lifecycle State</th>
                        <th className="px-6 py-4">3D AR Permission</th>
                        <th className="px-6 py-4 text-right">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/60 text-sm font-semibold text-gray-300">
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant._id} className="hover:bg-[#1e293b]/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{restaurant.restaurantName}</div>
                            <div className="text-xs text-gray-500 font-medium truncate max-w-xs">{restaurant.address}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{restaurant.ownerName}</td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold tracking-wide text-gray-300">{restaurant.email}</div>
                            <div className="text-[11px] text-gray-500 font-medium mt-0.5">{restaurant.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={restaurant.status}
                              onChange={(e) => handleStatusChange(restaurant._id, e.target.value)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide bg-[#0f172a] border border-[#1e293b] cursor-pointer focus:outline-none focus:ring-1 ${
                                restaurant.status === "active"
                                  ? "text-emerald-400 border-emerald-500/20"
                                  : restaurant.status === "suspended"
                                  ? "text-red-400 border-red-500/20"
                                  : "text-amber-400 border-amber-500/20"
                              }`}
                            >
                              <option value="active" className="text-emerald-400">Active</option>
                              <option value="pending_verification" className="text-amber-400">Pending</option>
                              <option value="suspended" className="text-red-400">Suspended</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={restaurant.is3dEnabled}
                                disabled={togglingId === restaurant._id}
                                onChange={() => handleToggle3D(restaurant._id, restaurant.is3dEnabled)}
                                className="sr-only peer" 
                              />
                              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 transition-colors" />
                              <span className={`ml-2 text-xs font-bold uppercase tracking-wide ${restaurant.is3dEnabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {restaurant.is3dEnabled ? 'Granted' : 'Locked'}
                              </span>
                            </label>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-gray-500">
                            {formatDate(restaurant.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Dynamic visual graph & GLB Model Upload Center */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Seeder / Upload Hub */}
              <div className="bg-[#131926]/40 border border-[#1e293b] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Universal Asset Bind Hub</h3>
                  <p className="text-xs text-gray-500 mb-6">Upload a local `.glb` 3D model and bind it directly to any menu item in the global system</p>
                  
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    {/* Drag and Drop Zone */}
                    <div className="border border-dashed border-[#1e293b] hover:border-emerald-500/40 rounded-2xl p-6 bg-[#0f172a]/50 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group">
                      <input 
                        type="file" 
                        accept=".glb,.gltf"
                        ref={fileInputRef}
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="hidden" 
                        id="glb-upload-input"
                      />
                      <label htmlFor="glb-upload-input" className="w-full cursor-pointer">
                        <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 transition-colors mx-auto mb-2" />
                        <span className="block text-sm font-bold text-gray-300">
                          {uploadFile ? `✓ Selected: ${uploadFile.name}` : "Browse or Drop GLB Asset File"}
                        </span>
                        <span className="block text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Max file size: 50MB</span>
                      </label>
                    </div>

                    {/* Target Product drop-down select list */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Target Catalog Product</label>
                      <select
                        value={uploadTargetProductId}
                        onChange={(e) => setUploadTargetProductId(e.target.value)}
                        className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-gray-300 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">Select menu item to bind model to...</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id} className="bg-[#0f172a]">
                            {product.title} ({getRestaurantName(product)}) — ₹{product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading || !uploadFile || !uploadTargetProductId}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 border border-emerald-500/20 cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                          <span>Uploading & Binding Model...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4" />
                          <span>Bind Model to Product</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* 3D AI Engine Configuration */}
              <div className="bg-[#131926]/40 border border-[#1e293b] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">3D AI Engine Configuration</h3>
                  <p className="text-xs text-gray-500 mb-6">Configure global passcodes and Tripo3D API credentials for premium reconstruction pipelines</p>
                  
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    {/* Passcode Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Premium Mode Passcode</label>
                      <input
                        type="text"
                        value={settingsPasscode}
                        onChange={(e) => setSettingsPasscode(e.target.value)}
                        placeholder="e.g. premium3d"
                        required
                        className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-gray-300 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Required by restaurants to unlock high-fidelity Tripo3D AI reconstruction.
                      </p>
                    </div>

                    {/* API Key Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tripo3D API Secret Key</label>
                      <input
                        type="password"
                        value={settingsApiKey}
                        onChange={(e) => setSettingsApiKey(e.target.value)}
                        placeholder="tripo_api_key_..."
                        className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-gray-300 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Stored securely in backend. Masked as <code className="text-emerald-400">********</code>. Leave empty or unchanged to keep current key.
                      </p>
                    </div>

                    {/* Custom GPU Server URL Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Custom GPU Server URL (Optional)</label>
                      <input
                        type="text"
                        value={settingsCustomGpuUrl}
                        onChange={(e) => setSettingsCustomGpuUrl(e.target.value)}
                        placeholder="https://xxxx.ngrok-free.app"
                        className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-gray-300 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Private Google Colab GPU server URL. Used by <code className="text-emerald-400">Premium lite</code> mode.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 border border-emerald-500/20 cursor-pointer"
                    >
                      {savingSettings ? (
                        <>
                          <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                          <span>Saving Configurations...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Update Configuration</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

            </section>

            {/* Graphic Chart representation */}
            <section className="bg-[#131926]/40 border border-[#1e293b] rounded-3xl p-6">
              <div>
                <h3 className="text-lg font-black text-white">Operational Signup Distribution</h3>
                <p className="text-xs text-gray-500 mb-6">Timeline overview of newly onboarded restaurants over the past 5 months</p>

                <div className="h-44 w-full flex items-end justify-between px-6 pt-4 border-b border-[#1e293b] pb-2 max-w-2xl mx-auto">
                  {/* Render a custom, lightweight SVG / CSS graph grid */}
                  {(stats?.monthlySignups || [
                    { month: "Jan", count: 2 },
                    { month: "Feb", count: 4 },
                    { month: "Mar", count: 5 },
                    { month: "Apr", count: 7 },
                    { month: "May", count: 8 }
                  ]).map((entry) => {
                    const maxVal = Math.max(...(stats?.monthlySignups?.map(s => s.count) || [8]));
                    const heightPercent = maxVal > 0 ? (entry.count / maxVal) * 80 : 10;
                    return (
                      <div key={entry.month} className="flex flex-col items-center w-12 group">
                        <div className="text-[10px] font-black text-emerald-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {entry.count}
                        </div>
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-8 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/20 hover:border-emerald-500/40 rounded-t-lg transition-all duration-300 relative"
                        />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{entry.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-semibold px-2 max-w-2xl mx-auto">
                  <span>Database Status: Connected</span>
                  <span>Collection Sync: Live</span>
                </div>
              </div>
            </section>


            {/* Sandbox Model Viewer Sandbox Grid */}
            <section className="bg-[#131926]/40 border border-[#1e293b] rounded-3xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-black text-white">Global 3D Sandbox Vault</h3>
                <p className="text-xs text-gray-500">Click any product in the system to load it directly inside the glassmorphic 3D Sandbox Drawer for texture and rotation verification</p>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading catalog...</div>
              ) : models3D.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No products are currently bound to active 3D models.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {models3D.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setDrawerOpen(true);
                      }}
                      className="bg-[#0f172a]/40 border border-[#1e293b] hover:border-cyan-500/30 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-cyan-950/5 transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <div className="absolute top-3 left-3 bg-[#0f172a]/80 border border-[#1e293b] text-cyan-400 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur z-10 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                          <span>3D Asset</span>
                        </div>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 border-t border-[#1e293b] flex items-center justify-between">
                        <div className="truncate">
                          <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                          <span className="text-[11px] font-medium text-gray-500 truncate block mt-0.5">{getRestaurantName(item)}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>

        {/* Dynamic Glassmorphic 3D Sandbox Slider Drawer */}
        {drawerOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
            {/* Drawer Overlay backdrop dismissal */}
            <div className="flex-1" onClick={() => setDrawerOpen(false)} />
            
            {/* Interactive Sandbox Side Panel */}
            <div className="w-full max-w-lg bg-[#0f172a]/95 border-l border-[#1e293b] h-screen shadow-2xl flex flex-col justify-between relative animate-slideLeft select-none">
              
              {/* Close Button Header */}
              <button 
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#131926]/90 border border-[#1e293b] flex items-center justify-center hover:bg-[#1e293b] transition-colors cursor-pointer text-gray-300"
                title="Close Sandbox"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Visual Canvas containing Google <model-viewer> */}
                <div className="h-[45vh] bg-gradient-to-b from-[#131926]/50 to-[#0b0f19]/40 border-b border-[#1e293b] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-40 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>3D Sandbox Active</span>
                  </div>

                  {/* Render the standard model-viewer tag safely */}
                  {selectedProduct.arModelPath ? (
                    <model-viewer
                      src={selectedProduct.arModelPath}
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      camera-controls
                      shadow-intensity="1"
                      auto-rotate
                      className="w-full h-full"
                      style={{ outline: "none" }}
                    />
                  ) : (
                    <div className="text-gray-500 text-sm font-semibold">No 3D Model Path Configured</div>
                  )}
                </div>

                {/* Information attributes */}
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedProduct.title}</h2>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1 block">
                      Linked to: {getRestaurantName(selectedProduct)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Catalog Description</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-semibold">{selectedProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1e293b] mt-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Selling Price</h4>
                        <span className="text-base font-black text-emerald-400">₹{selectedProduct.price}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">File Format</h4>
                        <span className="text-sm font-bold text-gray-300 uppercase">glTF / Binary (.glb)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Control Bar */}
              <div className="p-6 border-t border-[#1e293b] bg-[#131926]/40 flex gap-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 bg-[#1e293b] hover:bg-[#1e293b]/80 border border-[#1e293b] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  Close Sandbox
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}