'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useGarage } from '@/context/GarageContext';

import { VehicleModal } from '@/components/modals/VehicleModal';
import { DocumentModal } from '@/components/modals/DocumentModal';
import { ServiceModal } from '@/components/modals/ServiceModal';
import { ExpenseModal } from '@/components/modals/ExpenseModal';
import { ReminderModal } from '@/components/modals/ReminderModal';
import { TripModal } from '@/components/modals/TripModal';

import { MobileBottomNav } from './MobileBottomNav';
import { MobileQuickFab } from './MobileQuickFab';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activeModal, closeModal, modalPresetVehicleId } = useGarage();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] font-sans text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block h-full shrink-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Backdrop Drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-50 md:hidden backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-64 h-full animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Page Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
          {children}

          {/* WebRajya Commercial Fleet Footer */}
          <footer className="pt-8 pb-4 text-center border-t border-slate-200/60 mt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800">Nandan Travels</span> &copy; {new Date().getFullYear()} Express Fleet Operations Management System (MP-22 Seoni).
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 font-medium text-[11px]">
              <span className="hover:text-slate-800 cursor-pointer">RTO Compliance</span>
              <span>&bull;</span>
              <span className="hover:text-slate-800 cursor-pointer">ISO 9001 Audit Log</span>
              <span>&bull;</span>
              <span className="hover:text-slate-800 cursor-pointer">System Support</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Navigation Bar & Quick Action FAB */}
      <MobileBottomNav onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
      <MobileQuickFab />

      {/* Global Action Modals */}
      <VehicleModal
        isOpen={activeModal === 'vehicle'}
        onClose={closeModal}
      />
      <DocumentModal
        isOpen={activeModal === 'document'}
        onClose={closeModal}
        presetVehicleId={modalPresetVehicleId}
      />
      <ServiceModal
        isOpen={activeModal === 'service'}
        onClose={closeModal}
        presetVehicleId={modalPresetVehicleId}
      />
      <ExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={closeModal}
        presetVehicleId={modalPresetVehicleId}
      />
      <ReminderModal
        isOpen={activeModal === 'reminder'}
        onClose={closeModal}
        presetVehicleId={modalPresetVehicleId}
      />
      <TripModal
        isOpen={activeModal === 'trip'}
        onClose={closeModal}
      />
    </div>
  );
}
