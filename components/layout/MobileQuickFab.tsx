'use client';

import React, { useState } from 'react';
import { Plus, Fuel, Wrench, FileText, Car, Navigation } from 'lucide-react';
import { useGarage } from '@/context/GarageContext';

export function MobileQuickFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useGarage();

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden print:hidden">
      {/* Expanded Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => handleAction(() => openModal('trip'))}
            className="flex items-center gap-2.5 bg-white text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-all"
          >
            <span>Start Trip Duty</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(() => openModal('expense'))}
            className="flex items-center gap-2.5 bg-white text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-all"
          >
            <span>Log Fuel / Expense</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(() => openModal('service'))}
            className="flex items-center gap-2.5 bg-white text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-all"
          >
            <span>Book Service</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(() => openModal('document'))}
            className="flex items-center gap-2.5 bg-white text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-all"
          >
            <span>Upload Document</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(() => openModal('vehicle'))}
            className="flex items-center gap-2.5 bg-white text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-all"
          >
            <span>Add Vehicle</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Actions"
        className={`w-13 h-13 rounded-full shadow-xl flex items-center justify-center text-white transition-all active:scale-90 ${
          isOpen ? 'bg-slate-900 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[-1]"
        />
      )}
    </div>
  );
}
