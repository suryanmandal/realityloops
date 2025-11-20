export default function DashboardNavbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 016 6v2a2 2 0 002 2h-2l1 4H3l1-4H2a2 2 0 002-2V8a6 6 0 016-6z" />
          </svg>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          + New Order
        </button>
      </div>
    </div>
  );
}
