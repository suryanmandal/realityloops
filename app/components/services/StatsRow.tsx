"use client";
export default function StatsRow() {
  const stats = [
    { label: "Awaiting Confirmation", value: 5, badge: "Pending" },
    { label: "Being Prepared", value: 12, badge: "Active" },
    { label: "Ready for Pickup", value: 3, badge: "Ready" },
    { label: "Total Revenue", value: "₹45,280", badge: "Today" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 my-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white p-6 shadow-sm rounded-xl">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 text-3xl font-bold">{s.value}</span>

            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
              {s.badge}
            </span>
          </div>
          <p className="text-gray-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
