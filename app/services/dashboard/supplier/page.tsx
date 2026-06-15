"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import { Bell, Plus, Edit, ShoppingCart } from "lucide-react"; // Assuming Lucide React is installed for icons

interface Supplier {
  id: number;
  name: string;
  category: string;
  status: "Active";
  contact: string;
  phone: string;
  email: string;
  lastOrder: string;
  icon: string; // Icon component or name
  iconColor: string;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Fresh Farms Co.",
    category: "Vegetables & Fruits",
    status: "Active",
    contact: "Rajesh Kumar",
    phone: "+91 98765 11111",
    email: "contact@freshfarms.com",
    lastOrder: "2 days ago",
    icon: "Truck", // Use Lucide Truck
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    name: "Prime Meats Ltd.",
    category: "Meat & Poultry",
    status: "Active",
    contact: "Amit Sharma",
    phone: "+91 98765 22222",
    email: "orders@primemeats.com",
    lastOrder: "1 day ago",
    icon: "Chicken", // Use Lucide Chicken
    iconColor: "text-red-500",
  },
  {
    id: 3,
    name: "Dairy Delights",
    category: "Dairy Products",
    status: "Active",
    contact: "Priya Patel",
    phone: "+91 98765 33333",
    email: "info@dairydelights.com",
    lastOrder: "3 days ago",
    icon: "Milk", // Use Lucide Milk
    iconColor: "text-yellow-500",
  },
  {
    id: 4,
    name: "Beverage World",
    category: "Drinks & Beverages",
    status: "Active",
    contact: "Vikram Singh",
    phone: "+91 98765 44444",
    email: "sales@beverageworld.com",
    lastOrder: "5 days ago",
    icon: "Wine", // Use Lucide Wine for bottle
    iconColor: "text-purple-500",
  },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
};

export default function SupplierManagementPage() {
  const handlePlaceOrder = (id: number) => {
    console.log(`Place order with supplier ID: ${id}`);
    // TODO: Implement place order functionality (e.g., open modal or navigate to order page)
    alert(`Place order with ${suppliers.find(supplier => supplier.id === id)?.name}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit supplier with ID: ${id}`);
    // TODO: Implement edit functionality (e.g., open modal or navigate to edit page)
    alert(`Edit ${suppliers.find(supplier => supplier.id === id)?.name}`);
  };

  const renderIcon = (icon: string, color: string) => {
    const IconComponent = {
      Truck: () => <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-.867 12.142A2 2 0 0117.42 21H5.58a2 2 0 01-1.713-1.858L3 7m13.5 0h2.5m0 0V5a1 1 0 00-1-1h-6a1 1 0 00-1 1v2h6zM4 7h1v2H4V7z" /></svg>,
      Chicken: () => <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-.867 12.142A2 2 0 0117.42 21H5.58a2 2 0 01-1.713-1.858L3 7m13.5 0h2.5m0 0V5a1 1 0 00-1-1h-6a1 1 0 00-1 1v2h6zM4 7h1v2H4V7z" /></svg>, // Placeholder, adjust for chicken
      Milk: () => <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      Wine: () => <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8V7a2 2 0 00-1-1.73l-7-4a2 2 0 00-2.94 0l-7 4A2 2 0 003 7v1m14 0h2m-2 0h-2m-2 0h2m-2-2h4a2 2 0 002 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 002-2h4" /></svg>,
    }[icon] || (() => <div className={`w-6 h-6 ${color} rounded`}>?</div>);

    return <IconComponent />;
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Supplier Management"
          subtitle="Manage your supplier relationships"
        />

        
      

        <div className="grid grid-cols-2 gap-6 mt-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {renderIcon(supplier.icon, supplier.iconColor)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{supplier.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[supplier.status]}`}>
                      {supplier.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{supplier.category}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {supplier.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {supplier.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {supplier.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Last Order: {supplier.lastOrder}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handlePlaceOrder(supplier.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Place Order</span>
                    </button>
                    <button
                      onClick={() => handleEdit(supplier.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                      title="Edit supplier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}