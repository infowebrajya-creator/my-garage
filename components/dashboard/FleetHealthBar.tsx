'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Wrench, AlertTriangle, ArrowRight } from 'lucide-react';

interface FleetHealthBarProps {
  total: number;
  active: number;
  maintenance: number;
  due: number;
}

export function FleetHealthBar({ total, active, maintenance, due }: FleetHealthBarProps) {
  const safeTotal = total || (active + maintenance + due);
  const activePct = safeTotal > 0 ? Math.round((active / safeTotal) * 100) : 0;
  const maintPct = safeTotal > 0 ? Math.round((maintenance / safeTotal) * 100) : 0;
  const duePct = safeTotal > 0 ? Math.max(0, 100 - activePct - maintPct) : 0;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-slate-900">Fleet Health & Status Overview</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time breakdown across {total} registered fleet vehicles
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <Link
            href="/reminders"
            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-200/80 transition-colors flex items-center gap-1"
          >
            <span>{due} Action Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Multi-Segment Fleet Health Bar */}
      <div className="h-3.5 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200/60">
        <div
          style={{ width: `${activePct}%` }}
          className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
          title={`Active: ${active} vehicles (${activePct}%)`}
        />
        <div
          style={{ width: `${maintPct}%` }}
          className="bg-amber-500 h-full transition-all duration-500"
          title={`Maintenance: ${maintenance} vehicles (${maintPct}%)`}
        />
        <div
          style={{ width: `${duePct}%` }}
          className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
          title={`Expiries: ${due} vehicles (${duePct}%)`}
        />
      </div>

      {/* Breakdown Metrics Pills */}
      <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Fleet</span>
            <span className="font-extrabold text-slate-900">{active} <span className="text-slate-400 font-normal">({activePct}%)</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">In Repair</span>
            <span className="font-extrabold text-slate-900">{maintenance} <span className="text-slate-400 font-normal">({maintPct}%)</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Permit Due</span>
            <span className="font-extrabold text-slate-900">{due} <span className="text-slate-400 font-normal">({duePct}%)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
