import { FaBars } from "react-icons/fa";

export default function DashboardNavbar({ title, subtitle }: { title: string; subtitle: string }) {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Hamburger Toggle Button visible on mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          <p className="text-sm lg:text-base text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Removed notification bell and New Order button */}
      </div>
    </div>
  );
}
