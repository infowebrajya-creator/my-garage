import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-blue-600',
  badge,
  onClick,
}: StatCardProps) {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-xs',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-xs',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80 shadow-xs',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const badgeDots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-2xl ${iconBgColor} ${iconTextColor} transition-transform group-hover:scale-110 duration-300 shadow-xs`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        {badge && (
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
              badgeStyles[badge.variant]
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeDots[badge.variant]} animate-pulse`} />
            {badge.text}
          </span>
        )}
      </div>

      <div className="mt-5 relative z-10">
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{title}</h4>
        <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
