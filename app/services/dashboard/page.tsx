"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Clock, User, Clock as ClockIcon, ShoppingCart } from "lucide-react";

interface OrderStatusCard {
  id: number;
  title: string;
  count: number;
  color: string;
  bgColor: string;
  
}

interface OrderItem {
  name: string;
  quantity: number;
  icon: string;
}

interface ActiveOrder {
  id: string;
  status: string;
  statusColor: string;
  table: string;
  items: OrderItem[];
  timeAgo: string;
  customer: string;
  price: number;
  actions: string[];
}

const statusCards: OrderStatusCard[] = [
  {
    id: 1,
    title: "Awaiting Confirmation",
    count: 5,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
   
  },
  {
    id: 2,
    title: "Being Prepared",
    count: 12,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
 
  },
  {
    id: 3,
    title: "Ready for Pickup",
    count: 3,
    color: "text-green-600",
    bgColor: "bg-green-50",
  
  },
  {
    id: 4,
    title: "Total Revenue",
    count: 45280,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    
  },
];

const activeOrders: ActiveOrder[] = [
  {
    id: "ORD-1234",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-800 border-orange-200",
    table: "Table 5",
    items: [
      { name: "Margherita Pizza", quantity: 2, icon: "🍕" },
      { name: "Mojito", quantity: 1, icon: "🥤" },
      { name: "Chocolate Sundae", quantity: 1, icon: "🍦" },
    ],
    timeAgo: "5 mins ago",
    customer: "John Doe",
    price: 1250,
    actions: ["Accept", "Cancel"],
  },
  {
    id: "ORD-1235",
    status: "Preparing",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    table: "Table 12",
    items: [
      { name: "Classic Burger", quantity: 1, icon: "🍔" },
      { name: "Chicken Wings", quantity: 1, icon: "🍗" },
    ],
    timeAgo: "12 mins ago",
    customer: "Sarah Smith",
    price: 850,
    actions: ["View Details"],
  },
  {
    id: "ORD-1236",
    status: "Ready",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    table: "Pickup",
    items: [
      { name: "Classic Burger", quantity: 1, icon: "🍔" },
      { name: "Chicken Wings", quantity: 1, icon: "🍗" },
    ],
    timeAgo: "8 mins ago",
    customer: "Mike Johnson",
    price: 950,
    actions: ["View Details"],
  },
];

export default function LiveOrdersPage() {
  const handleAction = (orderId: string, action: string) => {
    console.log(`Action: ${action} for order ${orderId}`);
    // TODO: Implement action logic (e.g., accept, cancel, view details)
    alert(`${action} for order ${orderId}`);
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <DashboardSidebar />

        <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
          <DashboardNavbar
            title="Live Orders "
            subtitle="Manage incoming orders in real-time"
          />

          {/* Status Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8 mt-6">
            {statusCards.map((card) => (
              <div key={card.id} className={`bg-white rounded-lg shadow-sm p-6 ${card.bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl ${card.color}`}></div>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {card.title === "Total Revenue" ? `₹${card.count.toLocaleString()}` : card.count}
                </div>
                <div className="text-sm font-medium text-gray-500">{card.title}</div>
              </div>
            ))}
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900">#{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">{order.table}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">₹{order.price.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{item.icon}</span>
                        <span>{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{order.timeAgo}</span>
                      <User className="w-4 h-4" />
                      <span>{order.customer}</span>
                    </div>
                    <div className="flex space-x-2">
                      {order.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(order.id, action)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            action === "Accept"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : action === "Cancel"
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {action === "Accept" ? "✓ Accept" : action === "Cancel" ? "✕ Cancel" : "View Details"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}