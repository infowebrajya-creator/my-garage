'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MapPin, Plus, Building2, Truck, Users } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BranchesPage() {
  const { showToast } = useToast();

  const branches = [
    {
      id: 'br-1',
      name: 'Main Branch - Logistics Hub',
      city: 'Mumbai',
      address: 'Plot 104, Transport Nagar, Kalamboli, Navi Mumbai',
      vehiclesCount: 14,
      driversCount: 10,
      manager: 'Ravi Kumar',
    },
    {
      id: 'br-2',
      name: 'South Region Branch',
      city: 'Bengaluru',
      address: 'Electronic City Phase 2, Hosur Road, Bengaluru',
      vehiclesCount: 6,
      driversCount: 5,
      manager: 'Suresh Patil',
    },
    {
      id: 'br-3',
      name: 'North Region Branch',
      city: 'Delhi NCR',
      address: 'Sanjay Gandhi Transport Nagar, GT Karnal Road, Delhi',
      vehiclesCount: 4,
      driversCount: 3,
      manager: 'Anil Kumar',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fleet Branches & Terminals</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage multi-location branch hubs, vehicle allocation, and local transport managers
            </p>
          </div>

          <button
            onClick={() => showToast('info', 'Add Branch', 'Opening branch creation form...')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Branch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold border border-slate-200">
                  {b.city}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{b.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{b.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicles</span>
                    <span className="font-extrabold text-slate-900 text-xs">{b.vehiclesCount} Units</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Drivers</span>
                    <span className="font-extrabold text-slate-900 text-xs">{b.driversCount} Staff</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
