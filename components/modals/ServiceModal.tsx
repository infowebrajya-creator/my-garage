'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ServiceRecord, ServiceType } from '@/types';
import { useGarage } from '@/context/GarageContext';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: ServiceRecord | null;
  presetVehicleId?: string;
}

export function ServiceModal({
  isOpen,
  onClose,
  serviceToEdit,
  presetVehicleId,
}: ServiceModalProps) {
  const { vehicles, addService, updateService } = useGarage();

  const [vehicleId, setVehicleId] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometer, setOdometer] = useState<number>(0);
  const [serviceType, setServiceType] = useState<ServiceType>('General Service');
  const [garageName, setGarageName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setVehicleId(serviceToEdit.vehicleId);
      setServiceDate(serviceToEdit.serviceDate);
      setOdometer(serviceToEdit.odometer);
      setServiceType(serviceToEdit.serviceType);
      setGarageName(serviceToEdit.garageName);
      setDescription(serviceToEdit.description);
      setAmount(serviceToEdit.amount);
      setNextServiceDate(serviceToEdit.nextServiceDate || '');
      setNotes(serviceToEdit.notes || '');
    } else {
      const selectedVId = presetVehicleId || (vehicles[0]?.id || '');
      setVehicleId(selectedVId);
      setServiceDate(new Date().toISOString().split('T')[0]);
      
      const v = vehicles.find((x) => x.id === selectedVId);
      setOdometer(v?.odometer || 0);

      setServiceType('General Service');
      setGarageName('');
      setDescription('');
      setAmount(0);
      setNextServiceDate('');
      setNotes('');
    }
  }, [serviceToEdit, presetVehicleId, vehicles, isOpen]);

  // Update suggested odometer when vehicle selection changes
  const handleVehicleChange = (vId: string) => {
    setVehicleId(vId);
    const v = vehicles.find((x) => x.id === vId);
    if (v && !serviceToEdit) {
      setOdometer(v.odometer);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !garageName || !description) return;

    if (serviceToEdit) {
      updateService(serviceToEdit.id, {
        vehicleId,
        serviceDate,
        odometer: Number(odometer),
        serviceType,
        garageName,
        description,
        amount: Number(amount),
        nextServiceDate: nextServiceDate || undefined,
        notes,
      });
    } else {
      addService({
        vehicleId,
        serviceDate,
        odometer: Number(odometer),
        serviceType,
        garageName,
        description,
        amount: Number(amount),
        nextServiceDate: nextServiceDate || undefined,
        notes,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={serviceToEdit ? 'Edit Service Record' : 'Add Service Record'}
      subtitle="Log periodic maintenance, oil changes, repairs, and next service interval"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Vehicle *
          </label>
          <select
            required
            value={vehicleId}
            onChange={(e) => handleVehicleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Odometer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Service Date *
            </label>
            <input
              type="date"
              required
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Odometer Reading at Service (KM) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Service Type & Garage Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Service Type *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="General Service">General Service</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Tyre Replacement">Tyre Replacement</option>
              <option value="Battery">Battery Service</option>
              <option value="Repair">Repair Work</option>
              <option value="Other">Other Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Garage / Service Centre Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Navnit Motors BMW, Shell Auto, Local Workshop"
              value={garageName}
              onChange={(e) => setGarageName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Cost & Next Service Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Total Invoice Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 18500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Next Due Service Date (Optional)
            </label>
            <input
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Detailed Work Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Work Done / Description *
          </label>
          <textarea
            rows={2}
            required
            placeholder="e.g. Engine oil replaced with 5W-40 Synthetic, replaced oil filter, spark plugs, wheel balancing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Mechanic Recommendations / Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Brake pads at 70% life, front tyre tread good."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
          >
            {serviceToEdit ? 'Save Record' : 'Log Service'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
