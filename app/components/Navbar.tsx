"use client";

import React, { useState } from "react";
import { FaSearch, FaBell, FaChevronDown, FaBars } from "react-icons/fa";



const Navbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isHoveringSubmenu, setIsHoveringSubmenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const handleMouseLeave = (menu: string) => {
    setTimeout(() => {
      if (!isHoveringSubmenu) setOpenMenu(null);
    }, 150);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop&crop=center"
              alt="Logo"
              className="h-8 w-8 rounded-md"
            />
            <span className="text-xl font-bold text-gray-900">Reality Loops</span>
          </div>

          {/* Search Bar  */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 relative">
            {[
              {
                label: "Explore",
                items: [
                  "Browse Categories",
                  "Featured Projects",
                  "Top Rated",
                  "New Arrivals",
                ],
              },
              {
                label: "Freelance",
                items: [
                  "Find Freelancers",
                  "Post a Project",
                  "Freelancer Directory",
                  "Skills & Categories",
                ],
              },
              {
                label: "Agencies",
                items: [
                  "Browse Agencies",
                  "Agency Services",
                  "Enterprise Solutions",
                  "Partner Program",
                ],
              },
            ].map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.label)}
                onMouseLeave={() => handleMouseLeave(menu.label)}
              >
                <button className="flex items-center text-gray-700 hover:text-purple-600 font-medium">
                  {menu.label} <FaChevronDown className="ml-1 text-xs" />
                </button>

                {openMenu === menu.label && (
                  <div
                    className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[70]"
                    onMouseEnter={() => setIsHoveringSubmenu(true)}
                    onMouseLeave={() => {
                      setIsHoveringSubmenu(false);
                      setOpenMenu(null);
                    }}
                  >
                    <div className="py-2">
                      {menu.items.map((item, i) => (
                        <a
                          key={i}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-purple-600  rounded-md transition"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Become a Seller Button */}
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
              Become a Seller
            </button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Search (Mobile) */}
            <button className="md:hidden text-gray-500 hover:text-gray-700">
              <FaSearch className="text-lg" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <FaBell className="text-gray-500 text-lg hover:text-gray-700 cursor-pointer" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            {/* Profile Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <FaChevronDown className="text-xs hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-500">john@example.com</p>
                    </div>

                    {[
                      { label: "My Profile", icon: "👤" },
                      { label: "My Projects", icon: "💼" },
                      { label: "Settings", icon: "⚙️" },
                      { label: "Help & Support", icon: "❓" },
                    ].map((item, i) => (
                      <a
                        key={i}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </a>
                    ))}

                    <div className="border-t border-gray-100 mt-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition"
                      >
                        🚪 Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {["Explore", "Freelance", "Agencies"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="block text-gray-700 hover:text-purple-600 font-medium py-2"
              >
                {item}
              </a>
            ))}
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 mt-3">
              Become a Seller
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
