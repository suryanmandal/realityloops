"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { Save } from "lucide-react";

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
  heroImage?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface UpdateRestaurantData {
  restaurantName: string;
  ownerName: string;
  phone: string;
  address: string;
  heroImage?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<UpdateRestaurantData>({
    restaurantName: "",
    ownerName: "",
    phone: "",
    address: ""
  });
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${process.env.NEXT_PUBLIC_API}/${cleanPath}`;
  };

  useEffect(() => {
    // Cleanup temporary preview URL
    return () => {
      if (heroPreview && heroPreview.startsWith("blob:")) {
        URL.revokeObjectURL(heroPreview);
      }
    };
  }, [heroPreview]);

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      const previewUrl = URL.createObjectURL(file);
      setHeroPreview(previewUrl);
    }
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403 || response.status === 404) {
          localStorage.removeItem("restaurantToken");
          window.location.href = "/services/dashboard/login";
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }

        const result = await response.json();
        const restaurantData = result.data.restaurant;

        setRestaurant(restaurantData);
        setFormData({
          restaurantName: restaurantData.restaurantName,
          ownerName: restaurantData.ownerName,
          phone: restaurantData.phone,
          address: restaurantData.address
        });
        if (restaurantData.heroImage) {
          setHeroPreview(getFullImageUrl(restaurantData.heroImage));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const data = new FormData();
      data.append("restaurantName", formData.restaurantName);
      data.append("ownerName", formData.ownerName);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (heroFile) {
        data.append("heroImage", heroFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update restaurant data');
      }

      const result = await response.json();
      const updatedRestaurant = result.data.restaurant;
      setRestaurant(updatedRestaurant);
      setFormData({
        restaurantName: updatedRestaurant.restaurantName,
        ownerName: updatedRestaurant.ownerName,
        phone: updatedRestaurant.phone,
        address: updatedRestaurant.address
      });
      // Clear files, keep preview from updated response
      setHeroFile(null);
      if (updatedRestaurant.heroImage) {
        setHeroPreview(getFullImageUrl(updatedRestaurant.heroImage));
      }
      setSuccess("Restaurant information updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match");
      setChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setChangingPassword(false);
      return;
    }

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account/change-password`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      const result = await response.json();
      setSuccess("Password changed successfully!");

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while changing password");
      console.error(err);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <DashboardSidebar />
        <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading restaurant information...</div>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex">
        <DashboardSidebar />
        <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="text-red-500">Error: {error || "Failed to load restaurant information"}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Settings"
          subtitle="Manage your restaurant account information"
        />

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">
          <h3 className="text-lg font-semibold mb-6">Restaurant Account Information</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-8">
            {/* Restaurant Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h4 className="text-md font-medium text-gray-900">Restaurant Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={restaurant.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Hero Poster</label>
                  <div className="flex flex-col md:flex-row items-center gap-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="relative w-full md:w-64 h-36 rounded-lg overflow-hidden bg-gray-200 shadow-inner flex items-center justify-center">
                      {heroPreview ? (
                        <img
                          src={heroPreview}
                          alt="Hero Poster Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm flex flex-col items-center">
                          <span className="text-3xl mb-1">🖼️</span>
                          <span>No Hero Image Uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col items-start w-full">
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        This image will be displayed as the main hero background on your customer-facing Immersive Menu.
                        We recommend a high-quality landscape photo (e.g. 1920x1080) for the best visual experience.
                        Allowed formats: JPG, PNG, WEBP, GIF. Max size: 5MB.
                      </p>
                      <label className="relative cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center space-x-2">
                        <span>Browse Image</span>
                        <input
                          type="file"
                          name="heroImage"
                          accept="image/*"
                          onChange={handleHeroImageChange}
                          className="sr-only"
                        />
                      </label>
                      {heroFile && (
                        <span className="text-xs text-blue-600 font-medium mt-2">
                          ✓ Selected file: {heroFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    value={restaurant.status}
                    disabled
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed ${restaurant.status === 'active' ? 'text-green-600' : 'text-red-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                  <input
                    type="text"
                    value={restaurant.isEmailVerified ? 'Yes' : 'No'}
                    disabled
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed ${restaurant.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-900">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {changingPassword ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}