'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Reminder, ReminderCategory, Priority } from '@/types';
import { useGarage } from '@/context/GarageContext';
import { Bell, Info } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderToEdit?: Reminder | null;
  presetVehicleId?: string;
}

export function ReminderModal({
  isOpen,
  onClose,
  reminderToEdit,
  presetVehicleId,
}: ReminderModalProps) {
  const { vehicles, addReminder, updateReminder } = useGarage();

  const [vehicleId, setVehicleId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('Insurance renewal');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>('High');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (reminderToEdit) {
      setVehicleId(reminderToEdit.vehicleId);
      setTitle(reminderToEdit.title);
      setCategory(reminderToEdit.category);
      setDueDate(reminderToEdit.dueDate);
      setPriority(reminderToEdit.priority);
      setNotes(reminderToEdit.notes || '');
    } else {
      setVehicleId(presetVehicleId || (vehicles[0]?.id || ''));
      setTitle('');
      setCategory('Insurance renewal');
      
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 14);
      setDueDate(defaultDue.toISOString().split('T')[0]);
      setPriority('High');
      setNotes('');
    }
  }, [reminderToEdit, presetVehicleId, vehicles, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !title || !dueDate) return;

    if (reminderToEdit) {
      updateReminder(reminderToEdit.id, {
        vehicleId,
        title,
        category,
        dueDate,
        priority,
        notes,
      });
    } else {
      addReminder({
        vehicleId,
        title,
        category,
        dueDate,
        priority,
        notes,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reminderToEdit ? 'Edit Expiry Reminder' : 'Set New Reminder'}
      subtitle="Schedule alerts for document renewals, oil changes, or road tax deadlines"
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

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Reminder Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Renew HDFC Comprehensive Insurance or Wheel Alignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReminderCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Insurance renewal">Insurance renewal</option>
              <option value="PUC renewal">PUC renewal</option>
              <option value="Road tax">Road tax</option>
              <option value="Vehicle servicing">Vehicle servicing</option>
              <option value="Fitness certificate">Fitness certificate</option>
              <option value="Custom">Custom reminder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Priority Level *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="High">High (Critical Expiry)</option>
              <option value="Medium">Medium (Scheduled Task)</option>
              <option value="Low">Low (General Checkup)</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Due Date *
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Notification Alert Info */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Automated Notification Status:</span>
            <p className="mt-0.5 text-amber-700/90">
              In-app countdowns & priority flags are active now. Automated Email, SMS, and WhatsApp dispatchers will become active once Supabase triggers are connected.
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Reminders & Notes
          </label>
          <textarea
            rows={2}
            placeholder="Add phone numbers of garage, policy numbers, or checklist..."
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
            <Bell className="w-4 h-4" />
            {reminderToEdit ? 'Save Reminder' : 'Set Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
