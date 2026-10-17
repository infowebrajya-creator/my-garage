'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Navigation,
  Car,
  Users,
  FileText,
  Wrench,
  Receipt,
  AlertCircle,
  Building2,
  FileSpreadsheet,
  MapPin,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Plus,
  Truck,
  Download,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useGarage } from '@/context/GarageContext';
import { useToast } from '@/context/ToastContext';
import { usePWA } from '@/context/PWAContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, settings } = useGarage();
  const { showToast } = useToast();
  const { openInstallModal, isStandalone } = usePWA();

  const navSections = [
    {
      title: 'FLEET MANAGEMENT',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Live GPS Telematics', href: '/tracking', icon: Navigation },
        { name: 'Vehicles', href: '/vehicles', icon: Car },
        { name: 'Drivers', href: '/drivers', icon: Users },
        { name: 'Document Locker', href: '/documents', icon: FileText },
        { name: 'Maintenance', href: '/services', icon: Wrench },
        { name: 'Expenses', href: '/expenses', icon: Receipt },
        { name: 'Challans & Fines', href: '/challans', icon: AlertCircle },
        { name: 'Service Providers', href: '/service-providers', icon: Building2 },
        { name: 'Reports & Export', href: '/reports', icon: FileSpreadsheet },
        { name: 'Branches', href: '/branches', icon: MapPin },
      ],
    },
    {
      title: 'SYSTEM & PREFERENCES',
      items: [
        { name: 'Expiry Reminders', href: '/reminders', icon: Bell },
        { name: 'Billing & Plans', href: '/billing', icon: CreditCard },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help & Support', href: '/support', icon: HelpCircle },
      ],
    },
  ];

  const handleLogout = () => {
    showToast('info', 'Logged Out', 'Mock session ended. Redirecting to sign in...');
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-[#FAF8F5] text-slate-800 flex flex-col h-full shrink-0 select-none border-r border-slate-200/90 relative overflow-hidden shadow-2xs">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/80">
        <Link href="/dashboard" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-xs group-hover:bg-amber-400 transition-colors font-black">
            <Truck className="w-5.5 h-5.5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base">NANDAN TRAVELS</span>
            </div>
            <p className="text-[10px] text-amber-700 font-extrabold tracking-wider uppercase mt-0.5">
              EXPRESS FLEET &bull; MP-22
            </p>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={() => {
            openModal('vehicle');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 border border-blue-600 hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          Add Vehicle
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              {section.title}
            </h4>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* PWA Install Entry */}
      <div className="px-4 py-2.5 border-t border-slate-200/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            openInstallModal();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300/80 text-amber-950 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
            <span>{isStandalone ? 'App Mode Active' : 'Install App'}</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded shadow-2xs">
            PWA
          </span>
        </button>
      </div>

      {/* Bottom User Card & Logout */}
      <div className="p-4 border-t border-slate-200/80 bg-white">
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <img
            src={
              settings.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/30 shadow-2xs"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-extrabold text-slate-900 truncate">{settings.name}</h5>
            <p className="text-[10px] text-slate-500 font-semibold truncate">{settings.email || 'Fleet Administrator'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200/80 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
