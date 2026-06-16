"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
// ✅ Lucide icons (only icons, NOT charts)
import { TrendingUp, FileText, Users, Star } from "lucide-react";

// ✅ Recharts (all chart components)
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
//Assuming Recharts is installed
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 100000 },
  { month: "Feb", revenue: 150000 },
  { month: "Mar", revenue: 120000 },
  { month: "Apr", revenue: 200000 },
  { month: "May", revenue: 250000 },
  { month: "Jun", revenue: 350000 },
];

const popularItemsData = [
  { item: "Pizza", orders: 250 },
  { item: "Burger", orders: 200 },
  { item: "Pasta", orders: 180 },
  { item: "Salad", orders: 150 },
  { item: "Steak", orders: 120 },
];

const metrics = [
  {
    id: 1,
    icon: TrendingUp,
    value: "₹2.4M",
    label: "Total Revenue",
    change: "+12%",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: FileText,
    value: "1,847",
    label: "Total Orders",
    change: "+8%",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    icon: Users,
    value: "3,245",
    label: "Total Customers",
    change: "+15%",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    change: "+0.3",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Analytics"
          subtitle="View your restaurant performance metrics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-6">
          {metrics.map((metric) => (
            <div key={metric.id} className={`bg-white rounded-lg shadow-sm p-6 ${metric.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/20`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-500">vs last month</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-gray-500">{metric.label}</div>
              <div className={`text-sm font-semibold ${metric.color} flex items-center`}>
                <span>{metric.change}</span>
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <RechartsCartesianGrid strokeDasharray="3 3" />
                <RechartsXAxis dataKey="month" />
                <RechartsYAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <RechartsTooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <RechartsLine type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={popularItemsData}>
                <RechartsCartesianGrid strokeDasharray="3 3" />
                <RechartsXAxis dataKey="item" />
                <RechartsYAxis />
                <RechartsTooltip />
                <RechartsBar dataKey="orders" fill="#3B82F6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
