'use client';

import React from 'react';
import { usePWA } from '@/context/PWAContext';
import { Download, X, Smartphone } from 'lucide-react';

export function InstallAppBanner() {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    isBannerDismissed,
    dismissBanner,
    openInstallModal,
    installApp,
    isIOS
  } = usePWA();

  // Don't show if already installed, in standalone mode, or dismissed
  if (isStandalone || isInstalled || isBannerDismissed) {
    return null;
  }

  // Show if installable or iOS
  if (!canInstall && !isIOS) {
    return null;
  }

  const handleAction = async () => {
    if (isIOS) {
      openInstallModal();
    } else {
      await installApp();
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/images/webrajya_logo_badge.png"
            alt="WebRajya My Garage"
            className="w-11 h-11 rounded-xl shadow-md border border-blue-500/40 shrink-0 bg-[#08192E] object-contain"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                Install My Garage
              </h4>
              <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[9px] font-bold shrink-0">
                APP
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              Add to Home Screen for fast offline vehicle & doc access
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAction}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Install</span>
          </button>

          <button
            onClick={dismissBanner}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
