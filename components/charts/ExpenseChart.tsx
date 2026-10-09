'use client';

import React, { useState } from 'react';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  expenses: Expense[];
  currency?: string;
}

export function ExpenseChart({ expenses, currency = 'INR' }: ExpenseChartProps) {
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Group expenses by 6 recent calendar months
  const now = new Date();
  const monthsData = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = MONTH_NAMES[month];

    // Calculate total spent in this month
    const total = expenses.reduce((acc, exp) => {
      const expDate = new Date(exp.date);
      if (expDate.getFullYear() === year && expDate.getMonth() === month) {
        return acc + exp.amount;
      }
      return acc;
    }, 0);

    return { label, total, year, month };
  });

  const maxTotal = Math.max(...monthsData.map((m) => m.total), 1000);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Monthly Expense Breakdown</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Automotive maintenance & operational spending trend</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          Last 6 Months
        </span>
      </div>

      {/* SVG / Flex Bar Chart */}
      <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 relative">
        {monthsData.map((m, idx) => {
          const heightPercent = Math.max((m.total / maxTotal) * 100, 6);
          const isSelected = activeMonth === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setActiveMonth(idx)}
              onMouseLeave={() => setActiveMonth(null)}
            >
              {/* Tooltip on hover */}
              <div
                className={`absolute -top-10 z-20 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {formatCurrency(m.total, currency)}
              </div>

              {/* Bar Fill */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-200 group-hover:bg-blue-500/80'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Month Labels */}
      <div className="flex justify-between gap-3 mt-2 px-2">
        {monthsData.map((m, idx) => (
          <div key={idx} className="flex-1 text-center">
            <span
              className={`text-xs font-medium ${
                activeMonth === idx ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
