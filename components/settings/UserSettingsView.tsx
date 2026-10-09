'use client';

import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { UserSettings } from '@/types';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Bell,
  Lock,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function UserSettingsView() {
  const { settings, updateSettings, resetAllData } = useGarage();

  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [currency, setCurrency] = useState(settings.currency);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl || '');

  // Password mock state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      email,
      phone,
      currency,
      dateFormat,
      notifications,
      avatarUrl,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated in local UI session.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Account & System Preferences</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your owner profile, preferred currency formatting, and notification channels
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          Reset Demo Data
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            Personal Information
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Profile Photo Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
                <option value="USD">US Dollar (USD $)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 15/08/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/15/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-08-15)</option>
            </select>
          </div>
        </div>

        {/* WhatsApp & SMS Duty Gateway API Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                WhatsApp & SMS Duty Gateway API Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure background WhatsApp Cloud API credentials so shift notifications send directly to driver mobile phones without needing WhatsApp Web logged in on PC.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase rounded-full">
              Automated API Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                WhatsApp Cloud Provider *
              </label>
              <select
                value={settings.whatsappProvider || 'cloud_api'}
                onChange={(e) =>
                  updateSettings({
                    whatsappProvider: e.target.value as any,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="cloud_api">Meta WhatsApp Cloud API (Direct Background)</option>
                <option value="twilio">Twilio WhatsApp & SMS Gateway</option>
                <option value="ultramsg">UltraMsg Business Cloud</option>
                <option value="qr_direct">Smart QR Code & Web Link (Free Operator Mode)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                API Key / Access Token
              </label>
              <input
                type="password"
                placeholder="EAAG..."
                value={settings.whatsappApiKey || 'nandan_api_token_live_mp22'}
                onChange={(e) => updateSettings({ whatsappApiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={settings.autoSendDutyNotification ?? true}
              onChange={(e) =>
                updateSettings({ autoSendDutyNotification: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Auto-Launch Duty Dispatch Assistant on Assignment</span>
              <span className="text-slate-500">Automatically open the WhatsApp/SMS notification assistant after starting a driver duty sheet</span>
            </div>
          </label>
        </div>

        {/* mParivahan & Sandbox.co.in API Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                mParivahan & Sandbox.co.in G2C API Integration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your Sandbox.co.in developer API key to fetch real-time e-Challan traffic fines and MP-22 RTO registration records directly from Government MoRTH databases.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase rounded-full">
              Option 1 Active
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Sandbox.co.in API Key (`x-api-key`)
                </label>
                <a
                  href="https://sandbox.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Get API Key on Sandbox.co.in ↗
                </a>
              </div>
              <input
                type="password"
                placeholder="key_live_sb_xxxxxxxxxxxxxxxx"
                value={settings.sandboxApiKey || ''}
                onChange={(e) => updateSettings({ sandboxApiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter your key from <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">Sandbox.co.in ➔ G2C APIs ➔ Vahan & eChallan</code>. Leave empty to use pre-configured MP-22 RTO simulation mode.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            Notification Alert Channels (UI Configuration)
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Email Notifications</span>
                <span className="text-slate-500">Receive document expiry warnings in your inbox</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">SMS Text Alerts</span>
                <span className="text-slate-500">Get high priority urgent alerts on your mobile device</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) =>
                  setNotifications({ ...notifications, whatsapp: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">WhatsApp Messages</span>
                <span className="text-slate-500">Receive instant vehicle maintenance alerts on WhatsApp</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Account Preferences
          </button>
        </div>
      </form>

      {/* Security Section (UI Only) */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
          Security & Password Change (Mock UI)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <ConfirmationDialog
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={resetAllData}
          title="Reset Local Demo Data?"
          message="This will clear your browser localStorage and restore the initial sample vehicles, documents, expenses, and service logs."
          confirmLabel="Restore Default Data"
          isDanger
        />
      )}
    </div>
  );
}
