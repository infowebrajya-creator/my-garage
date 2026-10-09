'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  FileText,
  Receipt,
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

export function MobileBottomNav({ onOpenMobileMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-none tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* Menu Drawer Button */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-all cursor-pointer"
        >
          <div className="p-1.5 rounded-xl text-slate-500">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[11px] leading-none tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}
