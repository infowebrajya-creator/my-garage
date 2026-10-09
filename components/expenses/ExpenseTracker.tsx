'use client';

import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Expense, ExpenseCategory } from '@/types';
import { ExpenseModal } from '@/components/modals/ExpenseModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { ExpenseChart } from '@/components/charts/ExpenseChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { exportToCSV, formatCurrency, formatDate } from '@/lib/utils';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export function ExpenseTracker() {
  const { expenses, vehicles, deleteExpense, openModal, settings } = useGarage();

  const [searchFilter, setSearchFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Filter logic
  const filteredExpenses = expenses.filter((exp) => {
    const veh = vehicles.find((v) => v.id === exp.vehicleId);

    const matchesSearch =
      exp.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      exp.paymentMethod.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (veh && veh.name.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesVehicle = vehicleFilter === 'All' || exp.vehicleId === vehicleFilter;
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;

    return matchesSearch && matchesVehicle && matchesCategory;
  });

  const totalExpenseSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDeleteConfirm = () => {
    if (deletingExpenseId) {
      deleteExpense(deletingExpenseId);
      setDeletingExpenseId(null);
    }
  };

  const handleCSVExport = () => {
    const exportRows = filteredExpenses.map((exp) => {
      const veh = vehicles.find((v) => v.id === exp.vehicleId);
      return {
        Date: exp.date,
        Vehicle: veh ? veh.name : 'N/A',
        Registration: veh ? veh.registrationNumber : 'N/A',
        Category: exp.category,
        Amount: exp.amount,
        PaymentMethod: exp.paymentMethod,
        Description: exp.description,
        Notes: exp.notes || '',
      };
    });

    exportToCSV('MyGarage_Vehicle_Expenses', exportRows);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vehicle Expense Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor fuel bills, insurance premiums, accessory purchases, and maintenance spending
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCSVExport}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            title="Export to CSV Spreadsheet"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={() => openModal('expense')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Expense
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense description, payment method, category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Vehicle Filter */}
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Categories</option>
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
      </div>

      {/* Visual Expense Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart expenses={filteredExpenses} currency={settings.currency} />
        </div>
        <div>
          <CategoryPieChart expenses={filteredExpenses} currency={settings.currency} />
        </div>
      </div>

      {/* Detailed Expense Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Expense Transaction Ledger</h3>
          <span className="text-xs font-semibold text-slate-500">
            Total Spent: <strong className="text-slate-900">{formatCurrency(totalExpenseSum, settings.currency)}</strong>
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No expenses logged for the selected filter criteria.
          </div>
        ) : (
          <>
            {/* Mobile Card List (Visible on Mobile Screens < 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredExpenses.map((exp) => {
                const veh = vehicles.find((v) => v.id === exp.vehicleId);

                return (
                  <div key={exp.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 font-extrabold text-[10px] border border-teal-200 uppercase tracking-wide">
                        {exp.category}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(exp.amount, settings.currency)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{exp.description}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium">
                        <span>{veh?.name || 'N/A'} ({veh?.registrationNumber})</span>
                        <span>{formatDate(exp.date)}</span>
                      </div>
                    </div>

                    {exp.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                        &quot;{exp.notes}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">Method: {exp.paymentMethod}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingExpense(exp)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md font-bold text-[10px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingExpenseId(exp.id)}
                          className="px-2 py-1 text-rose-600 hover:text-rose-800 bg-rose-50 rounded-md font-bold text-[10px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on Medium+ Screens >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((exp) => {
                    const veh = vehicles.find((v) => v.id === exp.vehicleId);

                    return (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          {formatDate(exp.date)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {veh?.name || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-100">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {exp.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 text-slate-800">
                          {exp.description}
                          {exp.notes && (
                            <span className="block text-[11px] text-slate-400 italic">
                              {exp.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                          {formatCurrency(exp.amount, settings.currency)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingExpense(exp)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingExpenseId(exp.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <ExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expenseToEdit={editingExpense}
        />
      )}

      {/* Delete Confirmation */}
      {deletingExpenseId && (
        <ConfirmationDialog
          isOpen={!!deletingExpenseId}
          onClose={() => setDeletingExpenseId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Expense Record?"
          message="Are you sure you want to remove this expense entry?"
          confirmLabel="Delete Expense"
          isDanger
        />
      )}
    </div>
  );
}
