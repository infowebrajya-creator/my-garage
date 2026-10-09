'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useGarage } from '@/context/GarageContext';
import { TripRecord, TripStatus } from '@/types';
import { Navigation, Play, CheckCircle2, MapPin, User, Car, Edit2, Trash2, Zap, ArrowRightLeft } from 'lucide-react';
import LicensePlate from '@/components/ui/LicensePlate';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripToCompleteId?: string;
  tripToEdit?: TripRecord | null;
}

// Default popular intercity routes for Nandan Travels
const POPULAR_ROUTES = [
  { origin: 'Seoni Depot', destination: 'Indore ISBT', label: 'Seoni ➔ Indore' },
  { origin: 'Indore ISBT', destination: 'Seoni Depot', label: 'Indore ➔ Seoni' },
  { origin: 'Balaghat Terminal', destination: 'Indore ISBT', label: 'Balaghat ➔ Indore' },
  { origin: 'Balaghat Terminal', destination: 'Seoni Depot', label: 'Balaghat ➔ Seoni' },
  { origin: 'Nagpur Airport Corridor', destination: 'Seoni Depot', label: 'Nagpur ➔ Seoni' },
  { origin: 'Seoni Depot', destination: 'Nagpur Airport Corridor', label: 'Seoni ➔ Nagpur' },
  { origin: 'Seoni Depot', destination: 'Bhopal Intercity Hub', label: 'Seoni ➔ Bhopal' },
  { origin: 'Bhopal Intercity Hub', destination: 'Seoni Depot', label: 'Bhopal ➔ Seoni' },
  { origin: 'Seoni Depot', destination: 'Jabalpur Railway Corridor', label: 'Seoni ➔ Jabalpur' },
];

const POPULAR_CITIES = [
  'Seoni',
  'Indore',
  'Balaghat',
  'Nagpur',
  'Jabalpur',
  'Bhopal',
  'Chhindwara',
  'Mandla',
  'Gwalior',
  'Raipur',
  'Katni',
];

export function TripModal({ isOpen, onClose, tripToCompleteId, tripToEdit }: TripModalProps) {
  const { vehicles, drivers, trips, startTrip, completeTrip, updateTrip, deleteTrip } = useGarage();

  // Target trip for completion or editing
  const tripToComplete = trips.find((t) => t.id === tripToCompleteId);
  const activeEditTrip = tripToEdit || (tripToComplete ? null : null);

  // Form states
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [purpose, setPurpose] = useState('Nandan Intercity Duty');
  const [startLocation, setStartLocation] = useState('Seoni Depot');
  const [destination, setDestination] = useState('Indore ISBT');
  const [status, setStatus] = useState<TripStatus>('In Progress');
  const [startOdometer, setStartOdometer] = useState<number>(0);
  const [endOdometer, setEndOdometer] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Auto populate on open or edit
  useEffect(() => {
    if (tripToEdit) {
      setSelectedDriverId(tripToEdit.driverId);
      setSelectedVehicleId(tripToEdit.vehicleId);
      setPurpose(tripToEdit.purpose);
      setStartLocation(tripToEdit.startLocation);
      setDestination(tripToEdit.destination);
      setStatus(tripToEdit.status);
      setStartOdometer(tripToEdit.startOdometer);
      setEndOdometer(tripToEdit.endOdometer || 0);
      setNotes(tripToEdit.notes || '');
    } else if (!tripToComplete) {
      if (drivers.length > 0 && !selectedDriverId) {
        setSelectedDriverId(drivers[0].id);
      }
      if (vehicles.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(vehicles[0].id);
      }
      setPurpose('Nandan Intercity Duty');
      setStartLocation('Seoni Depot');
      setDestination('Indore ISBT');
      setStatus('In Progress');
      setNotes('');
    }
  }, [isOpen, tripToEdit, tripToComplete, drivers, vehicles]);

  const applyPresetRoute = (origin: string, dest: string) => {
    setStartLocation(origin);
    setDestination(dest);
  };

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const drv = drivers.find((d) => d.id === selectedDriverId);
    const veh = vehicles.find((v) => v.id === selectedVehicleId);

    if (!drv || !veh) return;

    startTrip({
      driverId: drv.id,
      driverName: drv.name,
      vehicleId: veh.id,
      vehicleName: veh.name,
      registrationNumber: veh.registrationNumber,
      startOdometer: veh.odometer,
      purpose,
      startLocation,
      destination,
      notes,
    });

    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripToEdit) return;

    const drv = drivers.find((d) => d.id === selectedDriverId);
    const veh = vehicles.find((v) => v.id === selectedVehicleId);

    updateTrip(tripToEdit.id, {
      driverId: drv ? drv.id : tripToEdit.driverId,
      driverName: drv ? drv.name : tripToEdit.driverName,
      vehicleId: veh ? veh.id : tripToEdit.vehicleId,
      vehicleName: veh ? veh.name : tripToEdit.vehicleName,
      registrationNumber: veh ? veh.registrationNumber : tripToEdit.registrationNumber,
      purpose,
      startLocation,
      destination,
      status,
      startOdometer: Number(startOdometer),
      endOdometer: endOdometer ? Number(endOdometer) : null,
      notes,
    });

    onClose();
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripToComplete) return;

    completeTrip(tripToComplete.id, 0, notes);
    onClose();
  };

  const handleDelete = () => {
    if (tripToEdit) {
      deleteTrip(tripToEdit.id);
      onClose();
    }
  };

  // Render Mode 1: Complete Existing Trip Duty
  if (tripToComplete) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Complete Driver Duty Shift"
        subtitle={`Duty #${tripToComplete.id} • ${tripToComplete.driverName}`}
        maxWidth="md"
      >
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                <span className="font-extrabold text-sm text-white">{tripToComplete.vehicleName}</span>
              </div>
              <LicensePlate number={tripToComplete.registrationNumber} size="sm" isCommercial />
            </div>

            <div className="bg-slate-800 p-3 rounded-xl text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Origin &rarr; Destination</span>
              <span className="font-bold text-white block mt-0.5">
                {tripToComplete.startLocation} &rarr; {tripToComplete.destination}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duty / Shift Remarks (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter trip status, toll/fuel receipts logged, or delivery handover notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Close Duty Shift
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // Render Mode 2: Edit Existing Trip Details
  if (tripToEdit) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Trip Sheet Details"
        subtitle={`Editing Duty Sheet #${tripToEdit.id}`}
        maxWidth="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <datalist id="nandan-cities-list">
            {POPULAR_CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>

          {/* Quick Route Presets Bar */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Select Nandan Route Preset:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_ROUTES.slice(0, 6).map((route) => (
                <button
                  key={route.label}
                  type="button"
                  onClick={() => applyPresetRoute(route.origin, route.destination)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    startLocation === route.origin && destination === route.destination
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose / Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duty / Trip Title *
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Nandan Intercity Duty"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-900"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Trip Duty Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TripStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
            >
              <option value="In Progress">In Progress (Active Shift)</option>
              <option value="Completed">Completed (Shift Closed)</option>
              <option value="Scheduled">Scheduled (Upcoming)</option>
            </select>
          </div>

          {/* Driver & Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assigned Driver *
              </label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                {drivers.map((drv) => (
                  <option key={drv.id} value={drv.id}>
                    {drv.name} ({drv.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assigned Vehicle *
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Origin Location *
              </label>
              <input
                type="text"
                required
                list="nandan-cities-list"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="e.g. Seoni Depot"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Destination *
              </label>
              <input
                type="text"
                required
                list="nandan-cities-list"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Indore ISBT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duty Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter duty comments or route instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Delete Trip Sheet
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Save Trip Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }

  // Render Mode 3: Start New Trip Duty Form
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Driver Duty Assignment"
      subtitle="Assign driver to vehicle with destination & trip purpose"
      maxWidth="lg"
    >
      <form onSubmit={handleStartSubmit} className="space-y-4">
        <datalist id="nandan-cities-list">
          {POPULAR_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        {/* Quick Route Preset Options (Chips & Dropdown) */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              Select Default Route Option:
            </span>

            {/* Dropdown Route Selector */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const [orig, dest] = e.target.value.split('|');
                  applyPresetRoute(orig, dest);
                }
              }}
              className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Choose Intercity Route --</option>
              {POPULAR_ROUTES.map((route) => (
                <option key={route.label} value={`${route.origin}|${route.destination}`}>
                  {route.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Route Chips */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.label}
                type="button"
                onClick={() => applyPresetRoute(route.origin, route.destination)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                  startLocation === route.origin && destination === route.destination
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <span>{route.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Driver Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Assign Driver *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20"
            >
              {drivers.map((drv) => (
                <option key={drv.id} value={drv.id}>
                  {drv.name} ({drv.phone}) &bull; Status: {drv.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Assign Vehicle *
          </label>
          <div className="relative">
            <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duty Purpose */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Duty / Trip Purpose *
          </label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Nandan Intercity Duty"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Origin Location *
            </label>
            <input
              type="text"
              required
              list="nandan-cities-list"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="e.g. Seoni Depot"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Destination *
            </label>
            <input
              type="text"
              required
              list="nandan-cities-list"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Indore ISBT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Duty Assignment
          </button>
        </div>
      </form>
    </Modal>
  );
}
