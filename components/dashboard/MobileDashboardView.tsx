'use client';

import React from 'react';
import Link from 'next/link';
import { useGarage } from '@/context/GarageContext';
import { formatCurrency, getDaysRemaining, getExpiryStatus } from '@/lib/utils';
import {
  Car,
  Users,
  FileText,
  Wrench,
  Plus,
  AlertTriangle,
  Receipt,
  Bell,
  ChevronRight,
  ShieldAlert,
  Building2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export function MobileDashboardView() {
  const { vehicles, documents, expenses, reminders, openModal, settings } = useGarage();

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.length;

  const expiringDocs = documents.filter((d) => {
    const days = getDaysRemaining(d.expiryDate);
    return days <= 30;
  });

  const docsDueCount = expiringDocs.length;
  const totalExpenseSum = expenses.reduce((acc, e) => acc + e.amount, 0);

  const activeReminders = reminders.filter((r) => !r.completed);

  const quickActions = [
    { title: 'Challans', icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-100', href: '/challans' },
    { title: 'Documents', icon: FileText, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', href: '/documents' },
    { title: 'Services', icon: Wrench, color: 'text-blue-600 bg-blue-50 border-blue-100', href: '/services' },
    { title: 'Expenses', icon: Receipt, color: 'text-amber-600 bg-amber-50 border-amber-100', href: '/expenses' },
    { title: 'Drivers', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', href: '/drivers' },
    { title: 'Reminders', icon: Bell, color: 'text-sky-600 bg-sky-50 border-sky-100', href: '/reminders' },
    { title: 'Vendors', icon: Building2, color: 'text-purple-600 bg-purple-50 border-purple-100', href: '/service-providers' },
    { title: 'Reports', icon: FileSpreadsheet, color: 'text-teal-600 bg-teal-50 border-teal-100', href: '/reports' },
  ];

  return (
    <div className="md:hidden space-y-6">
      {/* Mobile Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
              MyGarage Dashboard
            </span>
            <h2 className="text-lg font-black text-white tracking-tight mt-0.5">
              Welcome back, {settings.name} 👋
            </h2>
          </div>

          <button
            onClick={() => openModal('vehicle')}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Quick Summary Pill Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold">
            <Car className="w-4 h-4 text-blue-400" />
            <span>{totalVehicles} Vehicles</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1.5 font-semibold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{docsDueCount} Expiries Due</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid (2x4) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
          <span className="text-[10px] font-bold text-blue-600">8 Modules</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                href={act.href}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${act.color} border flex items-center justify-center shadow-2xs group-active:scale-95 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
                  {act.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Stack for Mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Fleet</span>
          <div className="text-2xl font-black text-slate-900">{totalVehicles}</div>
          <div className="text-[11px] font-semibold text-emerald-600">{activeVehicles} Active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Spent</span>
          <div className="text-xl font-black text-slate-900 truncate">
            {formatCurrency(totalExpenseSum, settings.currency)}
          </div>
          <div className="text-[11px] font-semibold text-blue-600">YTD Expense</div>
        </div>
      </div>

      {/* Critical Reminders / Urgent Alerts Card List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Urgent Alerts</h3>
          <Link href="/reminders" className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {expiringDocs.length === 0 && activeReminders.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 space-y-1">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800">All Systems Compliant</p>
            <p className="text-[11px] text-slate-400">No overdue documents or pending urgent reminders.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {expiringDocs.map((doc) => {
              const veh = vehicles.find((v) => v.id === doc.vehicleId);
              const days = getDaysRemaining(doc.expiryDate);
              const isExpired = days < 0;

              return (
                <div
                  key={doc.id}
                  className={`p-3 rounded-xl flex items-center justify-between border ${
                    isExpired ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isExpired ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.type} Renewal</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {veh ? veh.registrationNumber : 'Fleet'} &bull; {veh ? veh.name : doc.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      isExpired ? 'bg-rose-600' : 'bg-amber-500'
                    }`}
                  >
                    {isExpired ? 'EXPIRED' : `${days} days`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
