import React from 'react';
import { ExpiryStatus, Priority } from '@/types';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

interface ExpiryBadgeProps {
  status: ExpiryStatus;
  daysRemaining?: number;
  className?: string;
}

export function DocumentStatusBadge({ status, daysRemaining, className = '' }: ExpiryBadgeProps) {
  if (status === 'expired') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        Expired {daysRemaining !== undefined && Math.abs(daysRemaining) > 0 ? `(${Math.abs(daysRemaining)}d ago)` : ''}
      </span>
    );
  }

  if (status === 'expiring_soon') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Expiring Soon {daysRemaining !== undefined ? `(${daysRemaining}d left)` : ''}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${className}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      Valid {daysRemaining !== undefined && daysRemaining < 365 ? `(${daysRemaining}d left)` : ''}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'High') {
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
        High
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
        Medium
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
      Low
    </span>
  );
}

export function ReminderStatusBadge({ completed, dueDateStr }: { completed: boolean; dueDateStr: string }) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
        Completed
      </span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const isOverdue = due.getTime() < today.getTime();

  if (isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        Overdue
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      <Clock className="w-3.5 h-3.5 text-blue-600" />
      Upcoming
    </span>
  );
}
