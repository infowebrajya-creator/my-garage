'use client';

import React from 'react';

interface LicensePlateProps {
  number: string;
  isCommercial?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LicensePlate({ number, isCommercial = false, size = 'md' }: LicensePlateProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 border',
    md: 'text-xs px-2.5 py-1 gap-1.5 border-2',
    lg: 'text-sm px-3 py-1.5 gap-2 border-2',
  }[size];

  const indSizeClasses = {
    sm: 'text-[7px]',
    md: 'text-[8px]',
    lg: 'text-[9px]',
  }[size];

  return (
    <div
      className={`inline-flex items-center font-mono font-black rounded-lg shadow-2xs tracking-wider uppercase select-none ${sizeClasses} ${
        isCommercial
          ? 'bg-[#FFCC00] text-slate-950 border-slate-900/90'
          : 'bg-white text-slate-900 border-slate-800/80'
      }`}
      title="HSRP Registration Plate"
    >
      {/* HSRP Blue IND Emblem Box */}
      <div className="flex flex-col items-center justify-center leading-none pr-1 border-r border-slate-900/30">
        <span className="w-1.5 h-1.5 rounded-full border border-blue-700 bg-blue-600 inline-block mb-0.5" />
        <span className={`font-black text-blue-900 tracking-tighter ${indSizeClasses}`}>IND</span>
      </div>

      <span>{number}</span>
    </div>
  );
}

export default LicensePlate;
