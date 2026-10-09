'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types';
import { useGarage } from '@/context/GarageContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  presetVehicleId?: string;
}

export function ExpenseModal({
  isOpen,
  onClose,
  expenseToEdit,
  presetVehicleId,
}: ExpenseModalProps) {
  const { vehicles, addExpense, updateExpense } = useGarage();

  const [vehicleId, setVehicleId] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Fuel');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setVehicleId(expenseToEdit.vehicleId);
      setCategory(expenseToEdit.category);
      setAmount(expenseToEdit.amount);
      setDate(expenseToEdit.date);
      setPaymentMethod(expenseToEdit.paymentMethod);
      setDescription(expenseToEdit.description);
      setNotes(expenseToEdit.notes || '');
    } else {
      setVehicleId(presetVehicleId || (vehicles[0]?.id || ''));
      setCategory('Fuel');
      setAmount(0);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setDescription('');
      setNotes('');
    }
  }, [expenseToEdit, presetVehicleId, vehicles, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !amount || !description) return;

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        vehicleId,
        category,
        amount: Number(amount),
        date,
        paymentMethod,
        description,
        notes,
      });
    } else {
      addExpense({
        vehicleId,
        category,
        amount: Number(amount),
        date,
        paymentMethod,
        description,
        notes,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense Record' : 'Log New Expense'}
      subtitle="Track fuel fill-ups, insurance premiums, accessories, and maintenance costs"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Assign to Vehicle *
          </label>
          <select
            required
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Expense Category & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Fuel">Fuel</option>
              <option value="Service & Maintenance">Service & Maintenance</option>
              <option value="Insurance">Insurance</option>
              <option value="PUC">PUC</option>
              <option value="Road Tax">Road Tax</option>
              <option value="Repairs">Repairs</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 3500"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
            />
          </div>
        </div>

        {/* Expense Date & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Transaction Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Short Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Full Tank Petrol Shell V-Power or GFX Floor Mats"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Additional Notes
          </label>
          <textarea
            rows={2}
            placeholder="Add fuel quantity (litres), vendor invoice number, or mileage calculations..."
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
            {expenseToEdit ? 'Save Expense' : 'Log Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
