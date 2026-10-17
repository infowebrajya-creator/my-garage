'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  X,
  Download,
  Smartphone
} from 'lucide-react';
import { useGarage } from '@/context/GarageContext';
import { usePWA } from '@/context/PWAContext';
import { getDaysRemaining } from '@/lib/utils';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, documents, reminders, settings, vehicles } = useGarage();
  const { openInstallModal, isStandalone, isInstalled } = usePWA();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchEl = document.getElementById('global-search-input');
        if (searchEl) searchEl.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageInfo = () => {
    if (pathname.startsWith('/vehicles/')) return { title: 'Vehicle Overview', category: 'Fleet Details' };
    switch (pathname) {
      case '/vehicles':
        return { title: 'My Vehicles', category: 'Garage Fleet' };
      case '/tracking':
        return { title: 'Live GPS Telematics', category: 'Route Tracking' };
      case '/documents':
        return { title: 'Document Locker', category: 'Legal & Expiries' };
      case '/services':
        return { title: 'Service History', category: 'Maintenance Ledger' };
      case '/expenses':
        return { title: 'Expense Tracking', category: 'Financial Analytics' };
      case '/reminders':
        return { title: 'Expiry Reminders', category: 'Alerts & Schedules' };
      case '/billing':
        return { title: 'Billing & Plans', category: 'Subscription Tiers' };
      case '/settings':
        return { title: 'Account Settings', category: 'User System' };
      case '/support':
        return { title: 'Help & Support', category: 'Knowledgebase' };
      default:
        return { title: 'Dashboard', category: 'System Overview' };
    }
  };

  const { title, category } = getPageInfo();

  const expiringDocs = documents.filter((d) => {
    const days = getDaysRemaining(d.expiryDate);
    return days <= 30;
  });

  const activeReminders = reminders.filter((r) => !r.completed);
  const notificationCount = expiringDocs.length + activeReminders.length;

  return (
    <header className="h-18 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold tracking-wide uppercase">
            <span>Nandan Travels</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-amber-600 font-extrabold">{category}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{title}</h1>
        </div>
      </div>

      {/* Global Search Input */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search vehicles, documents, expenses, service records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15 text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200/70 border border-slate-300/60 rounded">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Actions: Install App, Notifications & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA Install Button */}
        {isStandalone ? (
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>App Mode</span>
          </span>
        ) : (
          <button
            onClick={openInstallModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            title="Install Nandan Travels as standalone mobile/desktop app"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative border border-transparent hover:border-slate-200 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-md shadow-rose-500/40">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Notifications & Expiries</h4>
                </div>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {notificationCount} Active
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {notificationCount === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <span>All documents and reminders are up to date!</span>
                  </div>
                ) : (
                  <>
                    {expiringDocs.map((doc) => {
                      const days = getDaysRemaining(doc.expiryDate);
                      const veh = vehicles.find((v) => v.id === doc.vehicleId);
                      const isExpired = days < 0;

                      return (
                        <Link
                          key={doc.id}
                          href="/documents"
                          onClick={() => setShowNotifications(false)}
                          className={`p-3 rounded-xl border flex items-start gap-3 transition-all hover:scale-[1.01] ${
                            isExpired
                              ? 'bg-rose-50/70 border-rose-200/90 text-rose-950'
                              : 'bg-amber-50/70 border-amber-200/90 text-amber-950'
                          }`}
                        >
                          <AlertTriangle
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isExpired ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          />
                          <div className="flex-1 text-xs">
                            <div className="font-bold">
                              {veh?.name || 'Vehicle'} - {doc.type}
                            </div>
                            <div className="text-[11px] opacity-80 mt-0.5">
                              {isExpired
                                ? `Expired ${Math.abs(days)} days ago`
                                : `Expiring in ${days} days`}
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    {activeReminders.map((rem) => (
                      <Link
                        key={rem.id}
                        href="/reminders"
                        onClick={() => setShowNotifications(false)}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-start gap-3 transition-colors text-xs"
                      >
                        <Bell className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">{rem.title}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">Due: {rem.dueDate}</div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-center">
                <Link
                  href="/reminders"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Manage All Reminders & Alert Channels &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <img
              src={
                settings.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt="Avatar"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-emerald-600/40 shadow-xs"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-extrabold text-slate-900 leading-none">{settings.name}</div>
              <div className="text-[10px] font-extrabold text-emerald-700 mt-1 leading-none uppercase tracking-wider">
                Fleet Administrator
              </div>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 animate-in zoom-in-95 duration-150">
              <div className="px-3 py-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-extrabold text-slate-900">{settings.name}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{settings.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  Account Owner
                </span>
              </div>

              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-semibold"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/billing"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-semibold"
              >
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>Billing & Subscription</span>
              </Link>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  openInstallModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-amber-700 hover:bg-amber-50 rounded-xl transition-colors font-bold cursor-pointer text-left"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>{isStandalone ? 'App Mode Details' : 'Install App (PWA)'}</span>
              </button>

              <div className="border-t border-slate-100 my-1 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
