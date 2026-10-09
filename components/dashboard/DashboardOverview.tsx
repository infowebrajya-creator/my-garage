'use client';

import React from 'react';
import Link from 'next/link';
import { useGarage } from '@/context/GarageContext';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, getDaysRemaining } from '@/lib/utils';
import {
  Car,
  Users,
  FileText,
  Wrench,
  AlertTriangle,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  UserPlus,
  Receipt,
  FileCheck,
  Shield
} from 'lucide-react';

import { MobileDashboardView } from './MobileDashboardView';
import { FleetHealthBar } from './FleetHealthBar';
import { LicensePlate } from '@/components/ui/LicensePlate';

export function DashboardOverview() {
  const {
    vehicles,
    documents,
    services,
    expenses,
    reminders,
    drivers,
    settings,
    openModal,
  } = useGarage();

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.length;
  const inactiveVehicles = 0;

  const totalDrivers = drivers ? drivers.length : 0;
  const unassignedDrivers = drivers ? drivers.filter((d) => d.status === 'Unassigned').length : 0;

  const docsDue = documents.filter((d) => {
    const days = getDaysRemaining(d.expiryDate);
    return days <= 30;
  }).length;
  
  const docsOverdue = documents.filter((d) => {
    const days = getDaysRemaining(d.expiryDate);
    return days < 0;
  }).length;

  const maintenanceDue = services.length;
  const maintenanceOverdue = 0;

  const totalExpenseSum = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <>
      {/* Mobile Dashboard View */}
      <MobileDashboardView />

      {/* Desktop Dashboard View */}
      <div className="hidden md:block space-y-6">
        {/* Top Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h2>
            <p className="text-xs text-slate-500 mt-1">
              Welcome back, <strong className="text-slate-800">{settings.name}</strong>! Operational metrics for your fleet today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-100/80 rounded-xl text-xs font-bold text-slate-700 border border-slate-200/80">
              📅 01 Oct 2026 - 31 Oct 2026
            </div>
            <button
              onClick={() => openModal('vehicle')}
              className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Bespoke Fleet Health Summary Bar */}
        <FleetHealthBar
          total={totalVehicles}
          active={activeVehicles}
          maintenance={0}
          due={docsDue}
        />

      {/* KPI Cards Grid matching Design Spec #2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Vehicles */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Vehicles</span>
            <div className="text-3xl font-black text-slate-900">{totalVehicles}</div>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
              <span className="text-emerald-600 font-extrabold">{activeVehicles} Active</span>
              <span>&bull;</span>
              <span className="text-slate-400">{inactiveVehicles} Inactive</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Active Drivers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Drivers</span>
            <div className="text-3xl font-black text-slate-900">{totalDrivers}</div>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
              <span className="text-amber-600 font-extrabold">{unassignedDrivers} Unassigned</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Documents Due */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Documents Due</span>
            <div className="text-3xl font-black text-slate-900">{docsDue}</div>
            <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{docsOverdue} Overdue</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Maintenance Due */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maintenance Due</span>
            <div className="text-3xl font-black text-slate-900">{maintenanceDue}</div>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{maintenanceOverdue} Overdue</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: Vehicle Status Donut & Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Status Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Vehicle Status</h3>
            <span className="text-xs font-bold text-slate-400">Total: {totalVehicles}</span>
          </div>

          <div className="flex items-center justify-center py-4 relative">
            {/* Custom Donut Visual */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {totalVehicles > 0 && (
                  <path
                    className="text-emerald-500"
                    strokeDasharray="100, 100"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                )}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900">{totalVehicles}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Active</span>
              </div>
              <div className="text-slate-900 font-bold">{activeVehicles} <span className="text-slate-400 font-normal">({totalVehicles > 0 ? 100 : 0}%)</span></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-700">Under Maintenance</span>
              </div>
              <div className="text-slate-900 font-bold">0 <span className="text-slate-400 font-normal">(0%)</span></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-slate-700">Inactive</span>
              </div>
              <div className="text-slate-900 font-bold">0 <span className="text-slate-400 font-normal">(0%)</span></div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders Widget matching Design Spec */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Upcoming Reminders</h3>
              <p className="text-xs text-slate-400">Critical document & service deadlines</p>
            </div>
            <Link href="/reminders" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {documents.length === 0 && reminders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <Shield className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                <p className="font-bold text-slate-700 text-sm">No Pending Reminders</p>
                <p className="text-[11px] text-slate-400">All fleet documents and maintenance schedules are up to date.</p>
              </div>
            ) : (
              documents.map((doc) => {
                const veh = vehicles.find((v) => v.id === doc.vehicleId);
                const days = getDaysRemaining(doc.expiryDate);
                const isExpired = days < 0;

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      isExpired
                        ? 'bg-rose-50/70 border-rose-100'
                        : days <= 30
                        ? 'bg-amber-50/70 border-amber-100'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isExpired
                            ? 'bg-rose-100 text-rose-600'
                            : days <= 30
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.type} expires</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {veh && <LicensePlate number={veh.registrationNumber} size="sm" />}
                          <span className="text-[11px] text-slate-500 font-semibold">&bull; {veh ? veh.name : doc.type}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs font-bold shadow-xs ${
                        isExpired ? 'bg-rose-600' : 'bg-amber-500'
                      }`}
                    >
                      {isExpired ? 'EXPIRED' : `${days} days`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Monthly Expenses Chart & Recent Activities Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expenses Chart Container */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Monthly Expenses</h3>
              <p className="text-xs text-slate-400">Total YTD: <strong className="text-slate-800">{formatCurrency(totalExpenseSum, settings.currency)}</strong></p>
            </div>
            <Link href="/expenses" className="text-xs font-bold text-blue-600 hover:underline">
              View Report
            </Link>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-56 flex items-end justify-between gap-2 pt-8 px-2">
            {[
              { month: 'Jan', amount: 45000, height: '35%' },
              { month: 'Feb', amount: 62000, height: '50%' },
              { month: 'Mar', amount: 78000, height: '60%' },
              { month: 'Apr', amount: 51000, height: '40%' },
              { month: 'May', amount: 89000, height: '70%' },
              { month: 'Jun', amount: 110000, height: '85%' },
              { month: 'Jul', amount: 64000, height: '52%' },
              { month: 'Aug', amount: 72000, height: '58%' },
              { month: 'Sep', amount: 95000, height: '75%' },
              { month: 'Oct', amount: 125000, height: '95%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 rounded-t-lg h-44 relative flex items-end justify-center overflow-hidden">
                  <div
                    style={{ height: bar.height }}
                    className="w-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-300 rounded-t-lg"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Activities</h3>
            <Link href="/services" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-900">Maintenance record added</h5>
                <p className="text-[11px] text-slate-500">MH12AB1234 &bull; Tata Ace</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">2 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-900">Expense added - Fuel</h5>
                <p className="text-[11px] text-slate-500">MH12CD5678 &bull; ₹4,500</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">5 hours ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-900">Document uploaded - Insurance</h5>
                <p className="text-[11px] text-slate-500">MH12EF9012 &bull; HDFC ERGO</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">1 day ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-900">New driver added</h5>
                <p className="text-[11px] text-slate-500">Suresh Patil &bull; Commercial License</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
}
