'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileSpreadsheet, Download, FileText, BarChart2, CheckCircle2, Users } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ReportsPage() {
  const { showToast } = useToast();

  const handleDownload = (format: string, reportName: string) => {
    showToast('success', 'Report Exported', `Generated & downloaded ${reportName} in ${format.toUpperCase()} format!`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fleet Reports & Exports</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Generate comprehensive PDF & CSV reports for resale valuation, tax compliance & expense audits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Driver & Duty Route Report</h3>
                <p className="text-xs text-slate-500">Live roster of drivers, assigned vehicles, origins, destinations & departure times</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDownload('pdf', 'Driver Duty & Route Report')}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Vehicle Maintenance Ledger PDF</h3>
                <p className="text-xs text-slate-500">Complete service history, garage bills, and odometer readings</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownload('pdf', 'Vehicle Maintenance Ledger')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Expense & Fuel Analytics CSV</h3>
                <p className="text-xs text-slate-500">Itemized expense statement for accountants & tax filings</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownload('csv', 'Expense Statement')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" /> Export CSV Spreadsheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
