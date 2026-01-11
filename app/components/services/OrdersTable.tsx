"use client";

import { useState } from "react";

export default function OrdersTable() {
  const [filter, setFilter] = useState("today");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">

      {/* TOP ROW TITLE + FILTERS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order History</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setFilter("today")}
            className={`px-5 py-2 rounded-lg font-medium ${
              filter === "today"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setFilter("week")}
            className={`px-5 py-2 rounded-lg font-medium ${
              filter === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => setFilter("month")}
            className={`px-5 py-2 rounded-lg font-medium ${
              filter === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-3 text-sm tracking-wide">ORDER ID</th>
            <th className="py-3 text-sm tracking-wide">CUSTOMER</th>
            <th className="py-3 text-sm tracking-wide">ITEMS</th>
            <th className="py-3 text-sm tracking-wide">AMOUNT</th>
            <th className="py-3 text-sm tracking-wide">STATUS</th>
            <th className="py-3 text-sm tracking-wide">TIME</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {/* ROW 1 */}
          <tr className="border-b hover:bg-gray-50 transition">
            <td className="py-4 font-medium">#ORD-1230</td>
            <td>Emma Wilson</td>
            <td>3 items</td>
            <td className="font-semibold">₹2,150</td>
            <td>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2 w-fit">
                <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                Delivered
              </span>
            </td>
            <td>2 hours ago</td>
          </tr>

          {/* ROW 2 */}
          <tr className="border-b hover:bg-gray-50 transition">
            <td className="py-4 font-medium">#ORD-1229</td>
            <td>David Brown</td>
            <td>2 items</td>
            <td className="font-semibold">₹1,450</td>
            <td>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2 w-fit">
                <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                Delivered
              </span>
            </td>
            <td>3 hours ago</td>
          </tr>

          {/* ROW 3 */}
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 font-medium">#ORD-1228</td>
            <td>Lisa Anderson</td>
            <td>5 items</td>
            <td className="font-semibold">₹3,250</td>
            <td>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-2 w-fit">
                <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                Delivered
              </span>
            </td>
            <td>4 hours ago</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
