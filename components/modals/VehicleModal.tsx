'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Vehicle, VehicleType, FuelType } from '@/types';
import { useGarage } from '@/context/GarageContext';
import { Car, Bike, Sparkles, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit?: Vehicle | null;
}

export function VehicleModal({ isOpen, onClose, vehicleToEdit }: VehicleModalProps) {
  const { addVehicle, updateVehicle } = useGarage();

  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType>('Car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometer, setOdometer] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // mParivahan Live Verification State
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [parivahanRto, setParivahanRto] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setName(vehicleToEdit.name);
      setType(vehicleToEdit.type);
      setBrand(vehicleToEdit.brand);
      setModel(vehicleToEdit.model);
      setRegistrationNumber(vehicleToEdit.registrationNumber);
      setFuelType(vehicleToEdit.fuelType);
      setYear(vehicleToEdit.year);
      setPurchaseDate(vehicleToEdit.purchaseDate);
      setOdometer(vehicleToEdit.odometer);
      setNotes(vehicleToEdit.notes || '');
      setImageUrl(vehicleToEdit.imageUrl || '');
      setIsVerified(vehicleToEdit.isParivahanVerified ?? true);
      setParivahanRto(vehicleToEdit.parivahanRto || 'RTO Seoni (MP-22)');
    } else {
      setName('');
      setType('Bus');
      setBrand('');
      setModel('');
      setRegistrationNumber('');
      setFuelType('Diesel');
      setYear(new Date().getFullYear());
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setOdometer(0);
      setNotes('');
      setImageUrl('');
      setIsVerified(null);
      setParivahanRto('');
      setVerificationMessage('');
    }
  }, [vehicleToEdit, isOpen]);

  const handleVerifyParivahan = async (numToVerify?: string) => {
    const target = numToVerify || registrationNumber;
    if (!target.trim()) return;
    setIsVerifying(true);
    setVerificationMessage('');
    try {
      const res = await fetch('/api/vahan/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNumber: target }),
      });
      const data = await res.json();
      if (data.verified) {
        setIsVerified(true);
        setParivahanRto(data.rtoName);
        setVerificationMessage(`Verified: ${data.rtoName}`);
      } else {
        setIsVerified(false);
        setParivahanRto('');
        setVerificationMessage(data.message || 'Not registered on mParivahan');
      }
    } catch {
      setIsVerified(false);
      setVerificationMessage('Verification check failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !registrationNumber) return;

    // Check verification if not checked yet
    const cleaned = registrationNumber.replace(/\s+/g, '').toUpperCase();
    const isValidFormat = /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(cleaned);
    const finalVerified = isVerified !== null ? isVerified : isValidFormat;
    const finalRto = parivahanRto || (isValidFormat ? `${cleaned.substring(0, 2)}-${cleaned.substring(2, 4)} RTO` : '');

    if (vehicleToEdit) {
      updateVehicle(vehicleToEdit.id, {
        name,
        type,
        brand,
        model,
        registrationNumber: registrationNumber.toUpperCase(),
        fuelType,
        year: Number(year),
        purchaseDate,
        odometer: Number(odometer),
        isParivahanVerified: finalVerified,
        parivahanRto: finalRto,
        notes,
        imageUrl: imageUrl || undefined,
      });
    } else {
      addVehicle({
        name,
        type,
        brand,
        model,
        registrationNumber: registrationNumber.toUpperCase(),
        fuelType,
        year: Number(year),
        purchaseDate,
        odometer: Number(odometer),
        isParivahanVerified: finalVerified,
        parivahanRto: finalRto,
        notes,
        imageUrl: imageUrl || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? 'Edit Vehicle Details' : 'Add New Vehicle'}
      subtitle="Enter vehicle identification, registration, and initial odometer reading"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Vehicle Nickname / Display Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mahindra Thar LX 4x4 or Daily Commuter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Type & Fuel Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Vehicle Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike / Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="Other">Other / Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Fuel Type *
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric (EV)</option>
              <option value="CNG">CNG</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Brand & Model Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              placeholder="e.g. Mahindra, BMW, Honda"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Model Variant
            </label>
            <input
              type="text"
              placeholder="e.g. Thar LX Hard Top, City ZX"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Registration & Manufacturing Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Registration Number *
              </label>
              <button
                type="button"
                onClick={() => handleVerifyParivahan()}
                disabled={isVerifying || !registrationNumber.trim()}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin text-amber-600' : ''}`} />
                Verify MP Parivahan
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. MP 22 BA 2005"
              value={registrationNumber}
              onChange={(e) => {
                const val = e.target.value;
                setRegistrationNumber(val);
                if (val.trim()) {
                  handleVerifyParivahan(val);
                } else {
                  setIsVerified(null);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />

            {/* Live Verification Badge */}
            {isVerified === true && (
              <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>mParivahan Verified ({parivahanRto || 'MP RTO'})</span>
              </div>
            )}
            {isVerified === false && (
              <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Not Verified on mParivahan (Unregistered / Invalid)</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Manufacturing Year
            </label>
            <input
              type="number"
              min="1970"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Purchase Date & Current Odometer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Current Odometer Reading (KM)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 45200"
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Vehicle Photo Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Notes / Modifications
          </label>
          <textarea
            rows={2}
            placeholder="Add any insurance policy notes, custom accessories, or key details..."
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
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            {vehicleToEdit ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
