'use client';

import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { ServiceRecord, ServiceType } from '@/types';
import { ServiceModal } from '@/components/modals/ServiceModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Gauge,
  Building,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

export function ServiceHistory() {
  const { services, vehicles, deleteService, openModal, settings } = useGarage();

  const [searchFilter, setSearchFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [inspectingService, setInspectingService] = useState<ServiceRecord | null>(null);

  // Filters
  const filteredServices = services.filter((srv) => {
    const veh = vehicles.find((v) => v.id === srv.vehicleId);

    const matchesSearch =
      srv.garageName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.serviceType.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (veh && veh.name.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesVehicle = vehicleFilter === 'All' || srv.vehicleId === vehicleFilter;
    const matchesType = typeFilter === 'All' || srv.serviceType === typeFilter;

    return matchesSearch && matchesVehicle && matchesType;
  });

  const totalServiceSpent = filteredServices.reduce((sum, s) => sum + s.amount, 0);

  const handleDeleteConfirm = () => {
    if (deletingServiceId) {
      deleteService(deletingServiceId);
      setDeletingServiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Stat Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service & Maintenance History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track garage visits, periodic oil changes, tyre replacements, and invoice receipts
          </p>
        </div>

        <button
          onClick={() => openModal('service')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log New Service
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search garage name, work description, service type..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Service Types</option>
            <option value="General Service">General Service</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Tyre Replacement">Tyre Replacement</option>
            <option value="Battery">Battery</option>
            <option value="Repair">Repair</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Service Record Timeline */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No service records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            Log your garage visits to keep an accurate service ledger for resale value.
          </p>
          <button
            onClick={() => openModal('service')}
            className="px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Log New Service
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredServices.length} service entries</span>
            <span>Total Filtered Cost: <strong className="text-slate-900">{formatCurrency(totalServiceSpent, settings.currency)}</strong></span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
            {filteredServices.map((srv) => {
              const veh = vehicles.find((v) => v.id === srv.vehicleId);

              return (
                <div key={srv.id} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-2xs">
                    <Wrench className="w-3 h-3" />
                  </div>

                  {/* Card Container */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {srv.serviceType}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{srv.garageName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Vehicle: <strong className="text-slate-800">{veh?.name || 'N/A'}</strong> ({veh?.registrationNumber})
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-base font-extrabold text-slate-900 block">
                          {formatCurrency(srv.amount, settings.currency)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {formatDate(srv.serviceDate)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-4">
                      {srv.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-4 text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          {srv.odometer.toLocaleString()} KM
                        </span>
                        {srv.nextServiceDate && (
                          <span className="flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                            <Clock className="w-3.5 h-3.5" /> Next Due: {formatDate(srv.nextServiceDate)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectingService(srv)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Receipt Details
                        </button>
                        <button
                          onClick={() => setEditingService(srv)}
                          className="p-1 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingServiceId(srv.id)}
                          className="p-1 text-rose-400 hover:text-rose-600 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspect Detail Modal */}
      {inspectingService && (
        <Modal
          isOpen={!!inspectingService}
          onClose={() => setInspectingService(null)}
          title="Service Record Details"
          subtitle={`Invoice receipt from ${inspectingService.garageName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Service Date</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{formatDate(inspectingService.serviceDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Odometer</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inspectingService.odometer.toLocaleString()} KM</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Amount Paid</span>
                <span className="font-bold text-emerald-600 text-sm mt-0.5 block">{formatCurrency(inspectingService.amount, settings.currency)}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Service & Work Description</h4>
              <p className="p-3 bg-white border border-slate-200 rounded-xl leading-relaxed text-slate-700">
                {inspectingService.description}
              </p>
            </div>

            {inspectingService.notes && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Garage Mechanic Notes</h4>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl italic text-slate-600">
                  {inspectingService.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingService && (
        <ServiceModal
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          serviceToEdit={editingService}
        />
      )}

      {/* Delete Confirmation */}
      {deletingServiceId && (
        <ConfirmationDialog
          isOpen={!!deletingServiceId}
          onClose={() => setDeletingServiceId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Service Log?"
          message="Are you sure you want to delete this service record?"
          confirmLabel="Delete Service"
          isDanger
        />
      )}
    </div>
  );
}
