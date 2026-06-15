export default function DashboardNavbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Removed notification bell and New Order button */}
      </div>
    </div>
  );
}
