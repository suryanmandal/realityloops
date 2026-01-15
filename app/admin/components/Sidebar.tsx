'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: {
    name?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/admin/dashboard" 
              className={`block px-4 py-2 rounded ${isActive('/admin/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <div className="mb-4">
          <p className="text-sm font-medium">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-400">Admin User</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}