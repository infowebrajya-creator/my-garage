'use client';

import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Reminder, Priority } from '@/types';
import { ReminderStatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { ReminderModal } from '@/components/modals/ReminderModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { formatDate, getDaysRemaining } from '@/lib/utils';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';

export function ReminderManager() {
  const { reminders, vehicles, deleteReminder, toggleReminderComplete, openModal } = useGarage();

  const [tab, setTab] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');

  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingReminderId, setDeletingReminderId] = useState<string | null>(null);

  // Filter logic
  const filteredReminders = reminders.filter((rem) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(rem.dueDate);
    due.setHours(0, 0, 0, 0);

    const isOverdue = due.getTime() < today.getTime() && !rem.completed;

    if (tab === 'upcoming' && (rem.completed || isOverdue)) return false;
    if (tab === 'overdue' && !isOverdue) return false;
    if (tab === 'completed' && !rem.completed) return false;

    if (priorityFilter !== 'All' && rem.priority !== priorityFilter) return false;
    if (vehicleFilter !== 'All' && rem.vehicleId !== vehicleFilter) return false;

    return true;
  });

  const handleDeleteConfirm = () => {
    if (deletingReminderId) {
      deleteReminder(deletingReminderId);
      setDeletingReminderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Expiry & Maintenance Reminders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Never miss insurance renewals, PUC emission tests, or periodic oil change intervals
          </p>
        </div>

        <button
          onClick={() => openModal('reminder')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Reminder
        </button>
      </div>

      {/* Supabase Notification Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-2xl p-4 text-white shadow-sm flex items-start gap-3 border border-blue-800/60">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-blue-200">Automated Notification Infrastructure Notice</h4>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            In-app dashboard countdowns and color status indicators are active right now. Automated Email, SMS, and WhatsApp alerts will be dispatched automatically once Supabase edge functions are enabled.
          </p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reminders ({reminders.length})
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'upcoming' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'overdue' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overdue
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'completed' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Priority & Vehicle Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

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
        </div>
      </div>

      {/* Reminder Cards Grid */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No reminders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            There are no active reminders matching the selected filter.
          </p>
          <button
            onClick={() => openModal('reminder')}
            className="px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Set New Reminder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.map((rem) => {
            const veh = vehicles.find((v) => v.id === rem.vehicleId);
            const days = getDaysRemaining(rem.dueDate);

            return (
              <div
                key={rem.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  rem.completed
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : days < 0
                    ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                    : 'border-slate-200/80 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={rem.completed}
                        onChange={() => toggleReminderComplete(rem.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={rem.priority} />
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {rem.category}
                          </span>
                        </div>
                        <h4
                          className={`font-bold text-sm mt-1.5 ${
                            rem.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {rem.title}
                        </h4>
                      </div>
                    </div>

                    <ReminderStatusBadge completed={rem.completed} dueDateStr={rem.dueDate} />
                  </div>

                  <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Assigned Vehicle:</span>
                    <span className="font-bold text-slate-800">{veh?.name || 'N/A'}</span>
                  </div>

                  {rem.notes && (
                    <p className="text-xs text-slate-600 mt-3 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                      {rem.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Due Date: <strong className="text-slate-900">{formatDate(rem.dueDate)}</strong>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingReminder(rem)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingReminderId(rem.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingReminder && (
        <ReminderModal
          isOpen={!!editingReminder}
          onClose={() => setEditingReminder(null)}
          reminderToEdit={editingReminder}
        />
      )}

      {/* Delete Confirmation */}
      {deletingReminderId && (
        <ConfirmationDialog
          isOpen={!!deletingReminderId}
          onClose={() => setDeletingReminderId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Reminder?"
          message="Are you sure you want to remove this reminder?"
          confirmLabel="Delete Reminder"
          isDanger
        />
      )}
    </div>
  );
}
