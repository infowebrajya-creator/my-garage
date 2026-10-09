'use client';

import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { DocumentRecord, DocumentType, ExpiryStatus, Vehicle } from '@/types';
import { DocumentStatusBadge } from '@/components/ui/StatusBadge';
import { DocumentModal } from '@/components/modals/DocumentModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { formatDate, getDaysRemaining, getExpiryStatus } from '@/lib/utils';
import LicensePlate from '@/components/ui/LicensePlate';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Layers,
  Grid,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export function DocumentLocker() {
  const { documents, vehicles, deleteDocument, openModal } = useGarage();

  const [viewMode, setViewMode] = useState<'byVehicle' | 'grid'>('byVehicle');
  const [searchFilter, setSearchFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const veh = vehicles.find((v) => v.id === doc.vehicleId);
    const days = getDaysRemaining(doc.expiryDate);
    const status = getExpiryStatus(doc.expiryDate);

    const matchesSearch =
      doc.documentNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (veh && veh.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (veh && veh.registrationNumber.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesVehicle = vehicleFilter === 'All' || doc.vehicleId === vehicleFilter;
    const matchesType = typeFilter === 'All' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || status === statusFilter;

    return matchesSearch && matchesVehicle && matchesType && matchesStatus;
  });

  // Group filtered documents by vehicle number / ID
  const vehicleGroups: { vehicle: Vehicle | null; docs: DocumentRecord[] }[] = [];

  vehicles.forEach((veh) => {
    const vehDocs = filteredDocuments.filter((d) => d.vehicleId === veh.id);
    if (vehicleFilter === 'All' || vehicleFilter === veh.id) {
      if (vehDocs.length > 0 || vehicleFilter === veh.id) {
        vehicleGroups.push({ vehicle: veh, docs: vehDocs });
      }
    }
  });

  // Include unassigned documents group if any exist
  const unassignedDocs = filteredDocuments.filter((d) => !d.vehicleId || !vehicles.some((v) => v.id === d.vehicleId));
  if (unassignedDocs.length > 0 && (vehicleFilter === 'All' || vehicleFilter === 'unassigned')) {
    vehicleGroups.push({ vehicle: null, docs: unassignedDocs });
  }

  const handleDeleteConfirm = () => {
    if (deletingDocId) {
      deleteDocument(deletingDocId);
      setDeletingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Folder className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vehicle Document Locker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Categorized legal document locker organized by vehicle registration number (RC, Insurance, PUC, Road Tax & Fitness)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('byVehicle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'byVehicle'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              By Vehicle Plate
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              All Grid
            </button>
          </div>

          <button
            onClick={() => openModal('document')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>
      </div>

      {/* Search & Vehicle Number Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document number, vehicle registration tag (e.g. MP 22 BA 2005)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Vehicle Number Select Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Vehicle Numbers ({vehicles.length})</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} &bull; {v.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Document Types</option>
            <option value="Insurance">Insurance</option>
            <option value="PUC">PUC</option>
            <option value="RC">RC</option>
            <option value="Driving Licence">Driving Licence</option>
            <option value="Road Tax">Road Tax</option>
            <option value="Fitness Certificate">Fitness Certificate</option>
            <option value="Other">Other</option>
          </select>

          {/* Expiry Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Expiry Statuses</option>
            <option value="valid">Valid</option>
            <option value="expiring_soon">Expiring Soon (&le;30 days)</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: CATEGORIZED BY VEHICLE NUMBER (DEFAULT) */}
      {viewMode === 'byVehicle' ? (
        <div className="space-y-6">
          {vehicleGroups.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">No Documents Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                There are no documents matching your vehicle registration number or search filter.
              </p>
              <button
                onClick={() => openModal('document')}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Add Document
              </button>
            </div>
          ) : (
            vehicleGroups.map((group) => {
              const veh = group.vehicle;
              const hasExpiring = group.docs.some((d) => getDaysRemaining(d.expiryDate) <= 30);
              const hasExpired = group.docs.some((d) => getDaysRemaining(d.expiryDate) < 0);

              return (
                <div
                  key={veh ? veh.id : 'unassigned'}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4"
                >
                  {/* Vehicle Categorized Folder Header */}
                  <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {veh ? (
                        <LicensePlate
                          number={veh.registrationNumber}
                          size="md"
                          isCommercial={veh.type === 'Bus' || veh.type === 'Truck'}
                        />
                      ) : (
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded-lg font-bold">
                          Unassigned
                        </span>
                      )}

                      <div>
                        <h3 className="font-black text-white text-base tracking-tight">
                          {veh ? veh.name : 'General Documents'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                          <span>{group.docs.length} Documents Logged</span>
                          {veh && <span>&bull; {veh.brand} {veh.model}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Health Indicator Badge */}
                      {hasExpired ? (
                        <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          Contains Expired Docs
                        </span>
                      ) : hasExpiring ? (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Expiring Soon
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          All Documents Valid
                        </span>
                      )}

                      {veh && (
                        <button
                          onClick={() => openModal('document', veh.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Doc
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Documents Grid */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {group.docs.map((doc) => {
                      const days = getDaysRemaining(doc.expiryDate);
                      const status = getExpiryStatus(doc.expiryDate);

                      return (
                        <div
                          key={doc.id}
                          className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                                  <FileText className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs">{doc.type}</h4>
                                  <span className="text-[10px] font-mono text-slate-500 font-bold block mt-0.5">
                                    #{doc.documentNumber}
                                  </span>
                                </div>
                              </div>

                              <DocumentStatusBadge status={status} daysRemaining={days} />
                            </div>

                            {/* Dates Box */}
                            <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-slate-400 text-[9px] font-bold block uppercase">Issued Date</span>
                                <span className="font-semibold text-slate-700 text-[11px]">{formatDate(doc.issueDate)}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[9px] font-bold block uppercase">Expiry Date</span>
                                <span className="font-extrabold text-slate-900 text-[11px]">{formatDate(doc.expiryDate)}</span>
                              </div>
                            </div>

                            {doc.notes && (
                              <p className="text-[11px] text-slate-500 mt-2 bg-white/70 p-2 rounded-lg italic border border-slate-200/60">
                                &quot;{doc.notes}&quot;
                              </p>
                            )}
                          </div>

                          {/* Footer Controls */}
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500 font-bold">
                              {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days} days remaining`}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingDoc(doc)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                                title="Edit Document Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingDocId(doc.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW MODE 2: FLAT ALL DOCUMENTS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const veh = vehicles.find((v) => v.id === doc.vehicleId);
            const days = getDaysRemaining(doc.expiryDate);
            const status = getExpiryStatus(doc.expiryDate);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{doc.type}</h4>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          #{doc.documentNumber}
                        </span>
                      </div>
                    </div>

                    <DocumentStatusBadge status={status} daysRemaining={days} />
                  </div>

                  {/* Vehicle Registration Plate Tag */}
                  <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Assigned Vehicle:</span>
                    {veh ? (
                      <LicensePlate number={veh.registrationNumber} size="sm" isCommercial={veh.type === 'Bus' || veh.type === 'Truck'} />
                    ) : (
                      <span className="font-bold text-slate-500">Unassigned</span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Issued</span>
                      <span className="font-semibold text-slate-700">{formatDate(doc.issueDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Expires</span>
                      <span className="font-bold text-slate-900">{formatDate(doc.expiryDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold">
                    {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days} days left`}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDoc(doc)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingDocId(doc.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingDoc && (
        <DocumentModal
          isOpen={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          documentToEdit={editingDoc}
        />
      )}

      {/* Delete Confirmation */}
      {deletingDocId && (
        <ConfirmationDialog
          isOpen={!!deletingDocId}
          onClose={() => setDeletingDocId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Document?"
          message="Are you sure you want to remove this document record from your locker?"
          confirmLabel="Delete Document"
          isDanger
        />
      )}
    </div>
  );
}
