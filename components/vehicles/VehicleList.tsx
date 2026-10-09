'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGarage } from '@/context/GarageContext';
import { Vehicle } from '@/types';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { VehicleModal } from '@/components/modals/VehicleModal';
import LicensePlate from '@/components/ui/LicensePlate';
import { formatCurrency, getExpiryStatus } from '@/lib/utils';
import {
  Car,
  Plus,
  Search,
  Grid,
  List,
  Edit2,
  Trash2,
  ChevronRight,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  ShieldCheck
} from 'lucide-react';

export function VehicleList() {
  const { vehicles, documents, expenses, deleteVehicle, openModal, settings } = useGarage();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [fuelFilter, setFuelFilter] = useState<string>('All');

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.model.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    const matchesFuel = fuelFilter === 'All' || v.fuelType === fuelFilter;

    return matchesSearch && matchesType && matchesFuel;
  });

  const handleDeleteConfirm = () => {
    if (deletingVehicleId) {
      deleteVehicle(deletingVehicleId);
      setDeletingVehicleId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vehicle Fleet Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal cars, motorcycles, scooters, and registration details
          </p>
        </div>

        <button
          onClick={() => openModal('vehicle')}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 self-start sm:self-auto hover:scale-[1.02] active:scale-95 border border-blue-400/30"
        >
          <Plus className="w-4 h-4 text-white" />
          Add New Vehicle
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle name, registration number, brand, model..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Types</option>
            <option value="Car">Cars</option>
            <option value="Truck">Trucks</option>
            <option value="Trailer">Trailers</option>
            <option value="Bus">Buses & Coaches</option>
            <option value="Van">Vans & Cargo</option>
            <option value="SUV">SUVs</option>
            <option value="Pickup">Pickups</option>
            <option value="Bike">Bikes</option>
            <option value="Scooter">Scooters</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Fuels</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No vehicles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            There are no vehicles matching your filter criteria. Add your first vehicle to get started.
          </p>
          <button
            onClick={() => openModal('vehicle')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Add New Vehicle
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const vDocs = documents.filter((d) => d.vehicleId === vehicle.id);
            const vExpenses = expenses.filter((e) => e.vehicleId === vehicle.id);
            const totalSpent = vExpenses.reduce((sum, e) => sum + e.amount, 0);

            const hasExpired = vDocs.some((d) => getExpiryStatus(d.expiryDate) === 'expired');
            const hasExpiring = vDocs.some((d) => getExpiryStatus(d.expiryDate) === 'expiring_soon');

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="h-44 relative bg-slate-900 overflow-hidden">
                  <img
                    src={
                      vehicle.imageUrl ||
                      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                        {vehicle.type} &bull; {vehicle.fuelType}
                      </span>
                      {vehicle.isParivahanVerified !== false ? (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-md border border-emerald-400/40 flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-white" /> mParivahan Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-md border border-rose-400/40 flex items-center gap-1 shadow-xs">
                          <AlertTriangle className="w-3 h-3 text-white" /> Not Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingVehicle(vehicle)}
                        className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white backdrop-blur-md transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingVehicleId(vehicle.id)}
                        className="p-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-900 text-rose-200 hover:text-white backdrop-blur-md transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base tracking-tight leading-tight truncate">
                        {vehicle.name}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>

                    <LicensePlate number={vehicle.registrationNumber} size="sm" isCommercial={vehicle.type === 'Bus'} />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Odometer</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {vehicle.odometer.toLocaleString()} KM
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Expenses</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {formatCurrency(totalSpent, settings.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {hasExpired ? (
                      <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        Action Required (Expired)
                      </span>
                    ) : hasExpiring ? (
                      <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Locker Valid
                      </span>
                    )}

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="px-3 py-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      Inspect <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Registration Tag</th>
                  <th className="py-3.5 px-4">mParivahan Status</th>
                  <th className="py-3.5 px-4">Type & Fuel</th>
                  <th className="py-3.5 px-4">Odometer</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Locker Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((vehicle) => {
                  const vDocs = documents.filter((d) => d.vehicleId === vehicle.id);
                  const hasExpired = vDocs.some((d) => getExpiryStatus(d.expiryDate) === 'expired');

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Car className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{vehicle.name}</div>
                          <div className="text-[11px] font-medium text-slate-400">
                            {vehicle.brand} {vehicle.model}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <LicensePlate number={vehicle.registrationNumber} size="sm" isCommercial={vehicle.type === 'Bus'} />
                      </td>
                      <td className="py-4 px-4">
                        {vehicle.isParivahanVerified !== false ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Not Verified
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {vehicle.type} &bull; {vehicle.fuelType}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        {vehicle.odometer.toLocaleString()} KM
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{vehicle.year}</td>
                      <td className="py-4 px-4">
                        {hasExpired ? (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                            Expired Docs
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Valid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/vehicles/${vehicle.id}`}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => setEditingVehicle(vehicle)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingVehicleId(vehicle.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingVehicle && (
        <VehicleModal
          isOpen={!!editingVehicle}
          onClose={() => setEditingVehicle(null)}
          vehicleToEdit={editingVehicle}
        />
      )}

      {deletingVehicleId && (
        <ConfirmationDialog
          isOpen={!!deletingVehicleId}
          onClose={() => setDeletingVehicleId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Vehicle?"
          message="Are you sure you want to delete this vehicle? Associated documents, service logs, and expense records will also be removed."
          confirmLabel="Delete Vehicle"
          isDanger
        />
      )}
    </div>
  );
}
