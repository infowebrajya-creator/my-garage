'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGarage } from '@/context/GarageContext';
import {
  Users,
  Plus,
  Phone,
  ShieldCheck,
  Search,
  Play,
  CheckCircle2,
  Navigation,
  Gauge,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  UserCheck,
  Edit2,
  FileSpreadsheet
} from 'lucide-react';
import LicensePlate from '@/components/ui/LicensePlate';
import { TripModal } from '@/components/modals/TripModal';
import { DriverModal } from '@/components/modals/DriverModal';
import { DriverReportModal } from '@/components/modals/DriverReportModal';
import { TripRecord } from '@/types';
import { DutyNotificationModal } from '@/components/modals/DutyNotificationModal';
import { MessageSquare, Send } from 'lucide-react';

export default function DriversPage() {
  const { drivers, trips, vehicles } = useGarage();

  const [activeTab, setActiveTab] = useState<'roster' | 'drivers'>('roster');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('Today');

  // Modals state
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [tripToCompleteId, setTripToCompleteId] = useState<string | undefined>(undefined);
  const [tripToEdit, setTripToEdit] = useState<TripRecord | null>(null);
  const [notifyTrip, setNotifyTrip] = useState<TripRecord | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.assignedVehicleName && d.assignedVehicleName.toLowerCase().includes(search.toLowerCase())) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.driverName.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      t.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase());

    const tripDateStr = t.startTime ? t.startTime.split('T')[0] : '';

    let matchesDate = true;
    if (dateFilter === 'Today') matchesDate = tripDateStr === todayStr;
    if (dateFilter === 'Yesterday') matchesDate = tripDateStr === yesterdayStr;

    if (statusFilter === 'All') return matchesSearch && matchesDate;
    return matchesSearch && matchesDate && t.status === statusFilter;
  });

  const activeTripsCount = trips.filter((t) => t.status === 'In Progress').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Hero Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Driver Duty Roster & Trip Sheet Logger
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Assign drivers to fleet vehicles, track start and final odometer readings, calculate trip distances, and manage commercial license compliance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Driver Duty Report
            </button>
            <button
              onClick={() => {
                setTripToCompleteId(undefined);
                setShowTripModal(true);
              }}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Start New Trip Duty
            </button>
            <button
              onClick={() => setShowDriverModal(true)}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              Onboard Driver
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-px">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-3 text-xs font-extrabold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'roster'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Trip Sheet Ledger ({trips.length})
              {activeTripsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-mono font-bold animate-pulse">
                  {activeTripsCount} Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-4 py-3 text-xs font-extrabold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'drivers'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Driver Directory ({drivers.length})
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'roster'
                  ? 'Search driver, vehicle, registration tag or destination...'
                  : 'Search driver name, phone, license or vehicle...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          {activeTab === 'roster' && (
            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
              {/* Date Selector Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-black uppercase text-slate-400 px-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Date:
                </span>
                {['Today', 'Yesterday', 'All'].map((dt) => (
                  <button
                    key={dt}
                    onClick={() => setDateFilter(dt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      dateFilter === dt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {dt === 'All' ? 'All Dates' : dt}
                  </button>
                ))}
              </div>

              {/* Duty Status Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {['All', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: TRIP SHEET & DUTY ROSTER LEDGER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
                <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 text-base">No Trip Sheets Found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Start a new duty shift to log start and end odometer readings.
                </p>
                <button
                  onClick={() => {
                    setTripToCompleteId(undefined);
                    setShowTripModal(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  Start New Trip Duty
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTrips.map((trip) => {
                  const veh = vehicles.find((v) => v.id === trip.vehicleId);
                  const isCommercial = veh ? (veh.type === 'Bus' || veh.type === 'Truck' as any) : false;

                  return (
                    <div
                      key={trip.id}
                      className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                    >
                      {/* Trip Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400 font-extrabold uppercase">
                              #{trip.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                trip.status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {trip.status}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-slate-900 text-base mt-1">
                            {trip.purpose}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            Driver: <strong className="text-slate-800">{trip.driverName}</strong>
                          </p>
                        </div>

                        {/* HSRP Plate & Edit Action */}
                        <div className="shrink-0 flex items-center gap-2">
                          <LicensePlate
                            number={trip.registrationNumber}
                            size="sm"
                            isCommercial={isCommercial}
                          />
                          <button
                            onClick={() => setTripToEdit(trip)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Edit Trip Sheet Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Route Banner */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                            <MapPin className="w-4 h-4 shrink-0" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Route</span>
                            <span className="font-extrabold text-slate-900 text-xs">
                              {trip.startLocation} &rarr; {trip.destination}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Vehicle</span>
                          <span className="font-bold text-slate-800 text-xs truncate max-w-[130px] block">
                            {trip.vehicleName}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-600 flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>
                            {new Date(trip.startTime).toISOString().split('T')[0] === todayStr ? 'Today' : new Date(trip.startTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} &bull; {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setNotifyTrip(trip)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Send WhatsApp & SMS Duty Notification"
                          >
                            <Send className="w-3.5 h-3.5 text-blue-600" />
                            Notify Driver
                          </button>

                          {trip.status === 'In Progress' ? (
                            <button
                              onClick={() => {
                                setTripToCompleteId(trip.id);
                                setShowTripModal(true);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Close Duty Shift
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                              Duty Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DRIVER DIRECTORY */}
        {activeTab === 'drivers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDrivers.map((drv) => (
              <div
                key={drv.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-100">
                      {drv.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{drv.name}</h3>
                      <a
                        href={`tel:${drv.phone}`}
                        className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 mt-0.5 font-medium"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {drv.phone}
                      </a>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      drv.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : drv.status === 'On Trip'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {drv.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">License No:</span>
                    <span className="font-mono font-bold text-slate-800">{drv.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">License Expiry:</span>
                    <span className="font-bold text-slate-800">{drv.licenseExpiry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Experience:</span>
                    <span className="font-bold text-slate-800">{drv.experience}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 font-semibold">Assigned Fleet Vehicle:</span>
                    <span className="font-extrabold text-indigo-600 truncate max-w-[140px]">
                      {drv.assignedVehicleName || 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Modals */}
      {(showTripModal || tripToEdit) && (
        <TripModal
          isOpen={showTripModal || !!tripToEdit}
          onClose={() => {
            setShowTripModal(false);
            setTripToCompleteId(undefined);
            setTripToEdit(null);
          }}
          tripToCompleteId={tripToCompleteId}
          tripToEdit={tripToEdit}
        />
      )}

      {showDriverModal && (
        <DriverModal
          isOpen={showDriverModal}
          onClose={() => setShowDriverModal(false)}
        />
      )}

      {showReportModal && (
        <DriverReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {notifyTrip && (
        <DutyNotificationModal
          isOpen={!!notifyTrip}
          onClose={() => setNotifyTrip(null)}
          trip={notifyTrip}
        />
      )}
    </AppLayout>
  );
}
