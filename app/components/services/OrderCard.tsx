"use client";
export default function OrderCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">#ORD-1234</h3>
        <span className="text-xl font-bold text-green-600">₹1,250</span>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        • 2x Pizza  
        • 1x Mojito  
        • 1x Sundae
      </p>

      <div className="flex gap-3 mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          ✔ Accept
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
          ✖ Reject
        </button>
      </div>
    </div>
  );
}
