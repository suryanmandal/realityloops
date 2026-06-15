'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';

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
    <div className="w-64 bg-[#0f172a] text-gray-100 flex flex-col justify-between border-r border-[#1e293b] select-none h-screen sticky top-0 shrink-0">
      <div>
        {/* Title / Logo Header */}
        <div className="p-6 border-b border-[#1e293b] flex items-center space-x-3 bg-[#1e293b]/20">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
            RL
          </div>
          <div>
            <h2 className="text-base font-black tracking-wider text-white uppercase">RealityLoops</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-none mt-0.5">Control Panel</p>
          </div>
        </div>
        
        {/* Navigation Section */}
        <nav className="p-4 mt-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">System Navigation</p>
          <ul className="space-y-1.5">
            <li>
              <Link 
                href="/admin/dashboard" 
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive('/admin/dashboard') 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-[#1e293b]/50 border border-transparent'
                }`}
              >
                <LayoutDashboard className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${isActive('/admin/dashboard') ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}`} />
                <span>Dashboard Vault</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Bottom Profile & Logout Box */}
      <div className="p-6 border-t border-[#1e293b] bg-[#1e293b]/10 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold text-sm">
            A
          </div>
          <div className="truncate flex-1">
            <p className="text-sm font-bold text-white leading-none truncate">{user?.name || "System Admin"}</p>
            <p className="text-[10px] font-medium text-gray-500 truncate mt-1">{user?.email || "admin@realityloops.com"}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full bg-[#1e293b] hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/30 text-gray-300 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent flex items-center justify-center space-x-2 group cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          <span>Exit Panel</span>
        </button>
      </div>
    </div>
  );
}