'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGarage } from '@/context/GarageContext';
import { DocumentStatusBadge, ReminderStatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import LicensePlate from '@/components/ui/LicensePlate';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { formatCurrency, formatDate, getDaysRemaining, getExpiryStatus } from '@/lib/utils';
import {
  Car,
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  FileText,
  Wrench,
  Receipt,
  Bell,
  Edit2,
  Trash2,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Printer,
  QrCode
} from 'lucide-react';
import { VehicleModal } from '../modals/VehicleModal';

interface VehicleDetailsProps {
  vehicleId: string;
}

export function VehicleDetails({ vehicleId }: VehicleDetailsProps) {
  const router = useRouter();
  const {
    vehicles,
    documents,
    services,
    expenses,
    reminders,
    updateVehicle,
    deleteVehicle,
    openModal,
    toggleReminderComplete,
    settings,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'services' | 'expenses' | 'reminders'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  
  // Odometer Quick Update Modal state
  const [showOdometerModal, setShowOdometerModal] = useState(false);
  const [newOdometerVal, setNewOdometerVal] = useState<number>(0);

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-8">
        <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Vehicle Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested vehicle may have been deleted or does not exist.
        </p>
        <Link
          href="/vehicles"
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
        >
          Return to Vehicle List
        </Link>
      </div>
    );
  }

  // Filter vehicle specific sub-data
  const vehicleDocs = documents.filter((d) => d.vehicleId === vehicle.id);
  const vehicleServices = services.filter((s) => s.vehicleId === vehicle.id);
  const vehicleExpenses = expenses.filter((e) => e.vehicleId === vehicle.id);
  const vehicleReminders = reminders.filter((r) => r.vehicleId === vehicle.id);

  const totalSpent = vehicleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalServiceCost = vehicleServices.reduce((sum, s) => sum + s.amount, 0);

  const handleDelete = () => {
    deleteVehicle(vehicle.id);
    router.push('/vehicles');
  };

  const handleOdometerUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOdometerVal > 0) {
      updateVehicle(vehicle.id, { odometer: Number(newOdometerVal) });
      setShowOdometerModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vehicles
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPassportModal(true)}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Digital RC Passport</span>
            <span className="sm:hidden">RC Card</span>
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-2 bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Edit Vehicle</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Vehicle Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white relative">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-800 shrink-0">
              <img
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {vehicle.type} &bull; {vehicle.fuelType}
                </span>
                {vehicle.isParivahanVerified !== false ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> mParivahan Verified ({vehicle.parivahanRto || 'MP RTO'})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" /> Not Verified on mParivahan
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  Built {vehicle.year}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{vehicle.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <LicensePlate number={vehicle.registrationNumber} size="md" isCommercial={vehicle.type === 'Bus'} />
                <span className="text-xs text-slate-300 font-medium">
                  {vehicle.brand} {vehicle.model}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Odometer & Expense Badge */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 self-stretch md:self-auto justify-around">
            <div>
              <span className="text-[10px] text-slate-400 font-medium uppercase block">Odometer</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-lg text-white">{vehicle.odometer.toLocaleString()} KM</span>
                <button
                  onClick={() => {
                    setNewOdometerVal(vehicle.odometer);
                    setShowOdometerModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-slate-700"
                  title="Update Odometer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-700" />

            <div>
              <span className="text-[10px] text-slate-400 font-medium uppercase block">Total Expenses</span>
              <span className="font-bold text-lg text-emerald-400 mt-0.5 block">
                {formatCurrency(totalSpent, settings.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents ({vehicleDocs.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'services'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Service History ({vehicleServices.length})
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Expenses ({vehicleExpenses.length})
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reminders'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            Reminders ({vehicleReminders.length})
          </button>
        </div>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Specs Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs md:col-span-2">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Vehicle Technical Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Brand</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.brand}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Model Variant</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.model}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Registration</span>
                  <div className="mt-1">
                    <LicensePlate number={vehicle.registrationNumber} size="sm" isCommercial={vehicle.type === 'Bus'} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Fuel Engine</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.fuelType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Manufacturing Year</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.year}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Purchase Date</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{formatDate(vehicle.purchaseDate)}</span>
                </div>
              </div>

              {vehicle.notes && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase mb-1">Notes & Modifications</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {vehicle.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Drawer */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Vehicle Actions</h3>
                <p className="text-xs text-slate-500 mb-4">Quick shortcuts for {vehicle.name}</p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => openModal('document', vehicle.id)}
                    className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Upload Document
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openModal('service', vehicle.id)}
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" /> Log Service Record
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openModal('expense', vehicle.id)}
                    className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" /> Log Expense
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openModal('reminder', vehicle.id)}
                    className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Set Reminder
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span>Total Maintenance Spent:</span>
                <span className="font-bold text-slate-900 block text-base mt-0.5">
                  {formatCurrency(totalServiceCost, settings.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Associated Documents</h3>
            <button
              onClick={() => openModal('document', vehicle.id)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>

          {vehicleDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No documents stored for this vehicle yet. Click Upload Document to add RC or Insurance.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicleDocs.map((doc) => {
                const days = getDaysRemaining(doc.expiryDate);
                const status = getExpiryStatus(doc.expiryDate);

                return (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{doc.type}</span>
                        <DocumentStatusBadge status={status} daysRemaining={days} />
                      </div>
                      <p className="text-xs font-mono text-slate-600 mt-1">#{doc.documentNumber}</p>
                      <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                        <p>Issued: {formatDate(doc.issueDate)}</p>
                        <p>Expires: <span className="font-semibold text-slate-800">{formatDate(doc.expiryDate)}</span></p>
                      </div>
                      {doc.fileName && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100 font-medium">
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{doc.fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: SERVICE HISTORY */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Service & Maintenance Records</h3>
            <button
              onClick={() => openModal('service', vehicle.id)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service Log
            </button>
          </div>

          {vehicleServices.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No service logs recorded for this vehicle.
            </div>
          ) : (
            <div className="space-y-3">
              {vehicleServices.map((srv) => (
                <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                        {srv.serviceType}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{srv.garageName}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{srv.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span>Date: {formatDate(srv.serviceDate)}</span>
                      <span>&bull;</span>
                      <span>Odometer: {srv.odometer.toLocaleString()} KM</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-slate-900 block">
                      {formatCurrency(srv.amount, settings.currency)}
                    </span>
                    {srv.nextServiceDate && (
                      <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                        Next Due: {formatDate(srv.nextServiceDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Vehicle Expense History</h3>
            <button
              onClick={() => openModal('expense', vehicle.id)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log Expense
            </button>
          </div>

          {vehicleExpenses.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No expenses logged for this vehicle.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicleExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-medium text-slate-600">{formatDate(exp.date)}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{exp.paymentMethod}</td>
                      <td className="py-3 px-3 text-slate-800">{exp.description}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(exp.amount, settings.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Scheduled Reminders</h3>
            <button
              onClick={() => openModal('reminder', vehicle.id)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Set Reminder
            </button>
          </div>

          {vehicleReminders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No reminders scheduled for this vehicle.
            </div>
          ) : (
            <div className="space-y-3">
              {vehicleReminders.map((rem) => (
                <div key={rem.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => toggleReminderComplete(rem.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className={`font-semibold text-xs ${rem.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {rem.title}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Category: {rem.category} &bull; Due: {rem.dueDate}</p>
                    </div>
                  </div>
                  <ReminderStatusBadge completed={rem.completed} dueDateStr={rem.dueDate} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isEditing && (
        <VehicleModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          vehicleToEdit={vehicle}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete Vehicle?"
          message={`Are you sure you want to delete ${vehicle.name}? All documents, services, and expenses will also be permanently deleted.`}
          confirmLabel="Delete Vehicle"
          isDanger
        />
      )}

      {/* Quick Odometer Modal */}
      {showOdometerModal && (
        <Modal
          isOpen={showOdometerModal}
          onClose={() => setShowOdometerModal(false)}
          title="Update Odometer Reading"
          subtitle={`Current reading: ${vehicle.odometer.toLocaleString()} KM`}
          maxWidth="sm"
        >
          <form onSubmit={handleOdometerUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                New Odometer Reading (KM) *
              </label>
              <input
                type="number"
                required
                min={vehicle.odometer}
                value={newOdometerVal}
                onChange={(e) => setNewOdometerVal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowOdometerModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Odometer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Digital RC Passport Modal */}
      {showPassportModal && (
        <Modal
          isOpen={showPassportModal}
          onClose={() => setShowPassportModal(false)}
          title="Digital Vehicle Passport & RC"
          subtitle="Official Fleet Compliance Document Card"
          maxWidth="md"
        >
          <div className="space-y-5 print:p-0">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    IN
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Ministry of Road Transport & Highways
                    </span>
                    <span className="text-xs font-bold text-white block">Digital Fleet Certificate</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>

              {/* License Plate Display */}
              <div className="flex justify-center py-2">
                <LicensePlate
                  number={vehicle.registrationNumber}
                  size="lg"
                  isCommercial={vehicle.type === 'Bus'}
                />
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vehicle Make / Model</span>
                  <span className="font-bold text-white mt-0.5 block">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Fuel Type</span>
                  <span className="font-bold text-white mt-0.5 block">{vehicle.fuelType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Class / Body Type</span>
                  <span className="font-bold text-white mt-0.5 block">{vehicle.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Manufacture Year</span>
                  <span className="font-bold text-white mt-0.5 block">{vehicle.year}</span>
                </div>
              </div>

              {/* QR Verification Mock & Compliance Footer */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Locker Documents</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vehicleDocs.map((doc) => {
                      const st = getExpiryStatus(doc.expiryDate);
                      return (
                        <span
                          key={doc.id}
                          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            st === 'expired'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {doc.type}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* SVG QR Code Pattern */}
                <div className="bg-white p-1.5 rounded-xl shrink-0">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Print & Close Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setShowPassportModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
