"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { ChevronDown, Bell, Plus } from "lucide-react"; // Assuming Lucide React is installed for icons

interface InventoryItem {
  id: number;
  name: string;
  iconColor: string;
  icon: string; // Simple icon name or emoji for now
  category: string;
  currentStock: number;
  minRequired: number;
  status: "Good Stock" | "Low Stock";
  unit: string;
}

const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Mozzarella Cheese",
    iconColor: "bg-orange-200",
    icon: "🧀",
    category: "Dairy",
    currentStock: 25,
    minRequired: 10,
    status: "Good Stock",
    unit: "kg",
  },
  {
    id: 2,
    name: "Chicken Breast",
    iconColor: "bg-pink-200",
    icon: "🍗",
    category: "Meat",
    currentStock: 8,
    minRequired: 15,
    status: "Low Stock",
    unit: "kg",
  },
  {
    id: 3,
    name: "Fresh Lettuce",
    iconColor: "bg-green-200",
    icon: "🥬",
    category: "Vegetables",
    currentStock: 12,
    minRequired: 8,
    status: "Good Stock",
    unit: "kg",
  },
  {
    id: 4,
    name: "Burger Buns",
    iconColor: "bg-yellow-200",
    icon: "🥖",
    category: "Bakery",
    currentStock: 45,
    minRequired: 30,
    status: "Good Stock",
    unit: "pcs",
  },
];

const statusColors = {
  "Good Stock": "bg-green-100 text-green-800",
  "Low Stock": "bg-red-100 text-red-800",
};

export default function InventoryPage() {
  const handleReorder = (id: number) => {
    console.log(`Reorder item with ID: ${id}`);
    // TODO: Implement reorder functionality (e.g., open modal or navigate to order page)
    alert(`Reorder ${inventoryItems.find(item => item.id === id)?.name}`);
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Inventory"
          subtitle="Track and manage stock levels"
        />

        

        <div className="bg-white mt-6 p-4 rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Levels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Required</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${item.iconColor} rounded flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0`}>
                          {item.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minRequired} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleReorder(item.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}