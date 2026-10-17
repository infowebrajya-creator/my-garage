'use client';

import React from 'react';
import { usePWA } from '@/context/PWAContext';
import {
  X,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Zap,
  WifiOff,
  Bell,
  Smartphone,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function InstallAppModal() {
  const {
    isInstallModalOpen,
    closeInstallModal,
    installApp,
    isInstalled,
    isStandalone,
    isIOS
  } = usePWA();

  if (!isInstallModalOpen) return null;

  const handleInstallClick = async () => {
    await installApp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-950 via-[#08192E] to-blue-950 p-6 text-white relative">
          <button
            onClick={closeInstallModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src="/images/webrajya_logo_badge.png"
              alt="WebRajya My Garage Icon"
              className="w-16 h-16 rounded-2xl shadow-xl border-2 border-blue-500/40 object-contain bg-[#08192E]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                  PWA Ready
                </span>
                {isStandalone && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Installed
                  </span>
                )}
              </div>
              <h2 className="text-lg font-extrabold text-white mt-1 leading-snug">
                WebRajya My Garage
              </h2>
              <p className="text-xs text-blue-200/90 font-medium">
                Vehicle &bull; Documents &bull; Reminders
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {isStandalone || isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-emerald-950">
                Application is Installed!
              </h3>
              <p className="text-xs text-emerald-800">
                WebRajya My Garage is running in standalone mode on your device. You can launch it directly from your Home Screen or App Drawer anytime.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Install on iOS (iPhone / iPad)</span>
                  Apple Safari requires manual 2-tap install from the browser menu:
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    Tap the <strong className="text-slate-900 inline-flex items-center gap-1">Share button <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /></strong> in the bottom Safari toolbar.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" /></strong>.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    Tap <strong className="text-slate-900">Add</strong> in the top-right corner to complete installation.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome / Edge / Desktop */
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Install WebRajya My Garage as a standalone application on your mobile device or computer for instant access, offline document checking, and fullscreen experience.
              </p>

              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-5 h-5 text-white" />
                <span>Install WebRajya My Garage App</span>
              </button>
            </div>
          )}

          {/* Benefits Feature Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-slate-900 block">Fast Launch</span>
                <span className="text-slate-500">Opens instantly with no browser URL bar</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <WifiOff className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-slate-900 block">Offline Mode</span>
                <span className="text-slate-500">View fleet docs even without internet</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <Bell className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-slate-900 block">Expiry Alerts</span>
                <span className="text-slate-500">Timely insurance & RTO fitness alerts</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-slate-900 block">Secure Storage</span>
                <span className="text-slate-500">Encrypted local cache on your device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Version 1.2.0 • PWA Standard</span>
          <button
            onClick={closeInstallModal}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
