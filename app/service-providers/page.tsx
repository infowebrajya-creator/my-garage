'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, Plus, Phone, MapPin, Star, Wrench } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ServiceProvidersPage() {
  const { showToast } = useToast();

  const providers = [
    {
      id: 'sp-1',
      name: 'Apex Commercial Truck Care & Workshop',
      category: 'Heavy Truck Service & Engine Overhaul',
      rating: '4.9',
      phone: '+91 98900 12345',
      address: 'Plot 42, MIDC Industrial Zone, Pune',
      specialty: 'Volvo, Scania, Tata Heavy Trucks',
    },
    {
      id: 'sp-2',
      name: 'Star Auto Electricals & Battery Hub',
      category: 'Electrical & Alternator Repairs',
      rating: '4.8',
      phone: '+91 98220 54321',
      address: 'Shop 12, Transport Nagar, Mumbai',
      specialty: 'Commercial Fleets, Starter Motors, Batteries',
    },
    {
      id: 'sp-3',
      name: 'Express Tyre Retreading & Alignment',
      category: 'Tyres & Wheel Alignment',
      rating: '4.7',
      phone: '+91 97660 99887',
      address: 'NH 48 Highway Hub, Bengaluru',
      specialty: 'Heavy Truck & Bus Multi-Axle Tyres',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Providers & Workshops</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified garages, official workshops, and emergency highway service partners
            </p>
          </div>

          <button
            onClick={() => showToast('info', 'Add Partner Garage', 'Opening vendor onboard form...')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Partner Workshop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {p.rating}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">{p.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-1">{p.category}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{p.address}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500">
                Specialty: <strong className="text-slate-800">{p.specialty}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
