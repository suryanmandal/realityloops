"use client";

import { JSX, useState } from "react";
import {
  FaMagic,
  FaCube,
  FaVrCardboard,
  FaUserAstronaut,
  FaTools,
  FaChevronDown,
} from "react-icons/fa";

interface MenuItem {
  label: string;
  submenu?: string[];
  icon: JSX.Element;
  color?: string;
}

export default function TopNav(): JSX.Element {
  const menus: MenuItem[] = [
    {
      label: "AR Filters & Effects",
      submenu: [
        "Face Filters",
        "Body & Gesture",
        "Filters",
        "Camera FX",
        "Try-On Assets",
      ],
      icon: <FaMagic className="inline mr-2 text-black" />,
    },
    {
      label: "AR Objects & Experiences",
      submenu: ["3D Models", "AR Games", "Object Tracking", "Scene Builder"],
      icon: <FaCube className="inline mr-2 text-black" />,
    },
    {
      label: "VR Environments",
      submenu: ["Virtual Spaces", "360 Tours", "VR Training", "VR Simulations"],
      icon: <FaVrCardboard className="inline mr-2 text-black" />,
    },
    {
      label: "Avatars & Characters for XR",
      submenu: [
        "3D Avatars",
        "Rigged Characters",
        "Animations",
        "Facial Capture",
      ],
      icon: <FaUserAstronaut className="inline mr-2 text-black" />,
    },
    {
      label: "XR Templates & Tools",
      submenu: ["Templates", "Plugins", "Assets", "SDKs"],
      icon: <FaTools className="inline mr-2 text-black" />,
    },
  ];

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHoveringSubmenu, setIsHoveringSubmenu] = useState(false);

  const handleMouseLeave = (menuLabel: string) => {
    setTimeout(() => {
      if (!isHoveringSubmenu) {
        setActiveMenu(null);
      }
    }, 150);
  };

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-white/80 backdrop-blur-md
        border-b border-gray-200
        shadow-sm hover:shadow-md
        transition-shadow
      "
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 py-3 px-4">
        {menus.map((menu) => (
          <div
            key={menu.label}
            className="relative group"
            onMouseEnter={() => setActiveMenu(menu.label)}
            onMouseLeave={() => handleMouseLeave(menu.label)}
          >
            <button
              className={`flex items-center text-sm font-semibold ${
                menu.color ?? "text-black"
              } hover:text-purple-600 transition`}
            >
              {menu.icon}
              {menu.label}
              <FaChevronDown className="ml-1 text-xs" />
            </button>

            {/* Dropdown */}
            {activeMenu === menu.label && menu.submenu && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg py-2 w-52 z-50"
                onMouseEnter={() => setIsHoveringSubmenu(true)}
                onMouseLeave={() => {
                  setIsHoveringSubmenu(false);
                  setActiveMenu(null);
                }}
              >
                {menu.submenu.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:text-purple-600 rounded-md transition duration-150 text-sm"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
