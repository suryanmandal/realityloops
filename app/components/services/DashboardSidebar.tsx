"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBell, FaList, FaUtensils, FaUsers, FaBoxes, FaTruck, FaChartLine, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("Loading...");

  const menu = [
    { name: "Dashboard", icon: <FaBell />, href: "/services/dashboard" },
    { name: "Category", icon: <FaList />, href: "/services/dashboard/category" },
    { name: "Products", icon: <FaUtensils />, href: "/services/dashboard/products" },
    // { name: "Orders", icon: <FaList />, href: "/services/dashboard/orders" },
    // { name: "Staff", icon: <FaUsers />, href: "/services/dashboard/staff" },
    { name: "Settings", icon: <FaCog />, href: "/services/dashboard/settings" },
  ];

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          // If no token, user is not logged in, so we can't fetch restaurant info
          setRestaurantName("Guest User");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setRestaurantName(result.data.restaurant.restaurantName);
        } else {
          setRestaurantName("Unknown Restaurant");
        }
      } catch (error) {
        console.error("Error fetching restaurant name:", error);
        setRestaurantName("Error loading");
      }
    };

    fetchRestaurantName();
  }, []);

  const handleLogout = () => {
    // Clear auth tokens from localStorage
    localStorage.removeItem("restaurantToken");
    localStorage.removeItem("restaurantRefreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    // Redirect to restaurant login page
    router.push("/services/dashboard/login");
  };

  return (
    <div className="w-64 bg-white h-screen shadow-md p-6 fixed flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          🍽️
        </div>
        <div>
          <h2 className="text-xl font-bold">RestaurantOS</h2>
          <p className="text-sm text-gray-500">Management Hub</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout UI Section */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaUserCircle className="w-10 h-10 text-gray-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{restaurantName}</p>
              <p className="text-xs text-gray-500">Restaurant</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
            title="Logout"
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}