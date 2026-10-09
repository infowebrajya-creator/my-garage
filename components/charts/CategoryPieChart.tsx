'use client';

import React from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PieChart as PieIcon } from 'lucide-react';

interface CategoryPieChartProps {
  expenses: Expense[];
  currency?: string;
}

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; fill: string }> = {
  Fuel: { bg: 'bg-emerald-500', fill: '#10B981' },
  'Service & Maintenance': { bg: 'bg-blue-600', fill: '#2563EB' },
  Insurance: { bg: 'bg-indigo-600', fill: '#4F46E5' },
  PUC: { bg: 'bg-amber-500', fill: '#F59E0B' },
  'Road Tax': { bg: 'bg-purple-600', fill: '#9333EA' },
  Repairs: { bg: 'bg-rose-500', fill: '#F43F5E' },
  Accessories: { bg: 'bg-sky-500', fill: '#0EA5E9' },
  Other: { bg: 'bg-slate-400', fill: '#94A3B8' },
};

export function CategoryPieChart({ expenses, currency = 'INR' }: CategoryPieChartProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const categoryList = (Object.keys(categoryTotals) as ExpenseCategory[])
    .map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: totalSpent > 0 ? (categoryTotals[cat] / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900">Spending by Category</h3>
        </div>

        {totalSpent === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            No expenses logged yet
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {categoryList.slice(0, 5).map((item) => {
              const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                      <span className="font-medium text-slate-700">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <span className="text-[11px] text-slate-500 w-10 text-right">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Expenses Logged</span>
        <span className="font-bold text-slate-900 text-sm">{formatCurrency(totalSpent, currency)}</span>
      </div>
    </div>
  );
}
