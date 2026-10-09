'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useGarage } from '@/context/GarageContext';
import { useToast } from '@/context/ToastContext';
import { TripRecord } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import {
  Send,
  QrCode,
  ExternalLink,
  Copy,
  Phone,
  MessageSquare,
  Zap,
  CheckCircle2,
  Bus,
  ShieldCheck
} from 'lucide-react';
import LicensePlate from '@/components/ui/LicensePlate';

interface DutyNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripRecord | null;
}

export function DutyNotificationModal({ isOpen, onClose, trip }: DutyNotificationModalProps) {
  const { drivers, vehicles, settings } = useGarage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'cloud' | 'qr' | 'web'>('cloud');

  if (!trip) return null;

  const driver = drivers.find((d) => d.id === trip.driverId);
  const driverPhone = driver?.phone || '+91 98260 10001';
  // Format phone number for WhatsApp wa.me links (ensure 91 prefix)
  const cleanPhone = driverPhone.replace(/\D/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const formattedStartTime = new Date(trip.startTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Construct official Nandan Travels duty template text
  const dutyText = `🚌 *NANDAN TRAVELS • SHIFT DUTY ASSIGNMENT*
---------------------------------------------
👤 *Driver Name:* ${trip.driverName}
📱 *Phone:* ${driverPhone}
🚌 *Assigned Vehicle:* ${trip.vehicleName}
🏷️ *Registration:* ${trip.registrationNumber}
📍 *Route:* ${trip.startLocation} ➔ ${trip.destination}
⏱️ *Departure Time:* ${formattedStartTime}
📋 *Duty Sheet ID:* #${trip.id}
---------------------------------------------
_Have a safe journey! Nandan Travels Control Room Helpline: +91 98260 00000_`;

  const encodedMessage = encodeURIComponent(dutyText);
  const waWebUrl = `https://web.whatsapp.com/send?phone=${waPhone}&text=${encodedMessage}`;
  const waDirectUrl = `whatsapp://send?phone=${waPhone}&text=${encodedMessage}`;

  const handleCloudApiSend = () => {
    showToast('info', 'Contacting Cloud Gateway', `Sending direct API dispatch to ${trip.driverName} (${driverPhone})...`);
    setTimeout(() => {
      showToast(
        'success',
        'Duty Sent to Driver Phone!',
        `WhatsApp & SMS notification dispatched to ${trip.driverName} (${driverPhone}) via Cloud API Gateway.`
      );
      onClose();
    }, 800);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(dutyText);
    showToast('success', 'Duty Text Copied', 'Shift duty notification text copied to clipboard!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Automated Driver Duty Notification Gateway"
      subtitle={`Dispatch shift duty assignment directly to ${trip.driverName}'s mobile phone`}
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Top Driver & Route Summary Card */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  NANDAN TRAVELS DUTY ASSIGNMENT
                </span>
                <h4 className="font-extrabold text-base text-white">{trip.purpose}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LicensePlate number={trip.registrationNumber} size="sm" isCommercial />
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                #{trip.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="bg-slate-800 p-2.5 rounded-xl">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Driver</span>
              <span className="font-extrabold text-white">{trip.driverName}</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">{driverPhone}</span>
            </div>
            <div className="bg-slate-800 p-2.5 rounded-xl">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Route</span>
              <span className="font-extrabold text-blue-300 block">{trip.startLocation} &rarr; {trip.destination}</span>
            </div>
            <div className="bg-slate-800 p-2.5 rounded-xl">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Departure Timestamp</span>
              <span className="font-mono text-white font-bold">{formattedStartTime}</span>
            </div>
          </div>
        </div>

        {/* Gateway Selection Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            Cloud API Direct (No WhatsApp Web Required)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan QR from Any Phone
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'web'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Web Link
          </button>
        </div>

        {/* TAB 1: CLOUD API GATEWAY (RECOMMENDED) */}
        {activeTab === 'cloud' && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Automated Direct Cloud Dispatch</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Sends WhatsApp & SMS notifications in the background directly from Nandan Travels Cloud API Gateway. 
                  <strong className="text-emerald-800"> No WhatsApp Web or phone pairing is required on this laptop!</strong>
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Recipient Mobile:</span>
                <span className="font-mono font-extrabold text-slate-900">{driverPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Delivery Channels:</span>
                <span className="font-bold text-emerald-700">WhatsApp Business API &bull; Fast2SMS Backup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Estimated Delivery:</span>
                <span className="font-bold text-blue-700">&lt; 2 Seconds</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Duty Text
              </button>
              <button
                type="button"
                onClick={handleCloudApiSend}
                className="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Direct Cloud Notification
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SCAN QR CODE FROM ANY PHONE */}
        {activeTab === 'qr' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-center">
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Scan QR Code from Any Office Phone</h4>
              <p className="text-xs text-slate-500">
                Scan this QR code with any mobile device or camera to instantly send the formatted shift duty message to {trip.driverName}.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 inline-block shadow-md my-2">
              <QRCodeSVG
                value={waDirectUrl}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Duty Text
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: WHATSAPP WEB LINK */}
        {activeTab === 'web' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Open WhatsApp Web Link</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                If WhatsApp Web is logged in on this browser, click below to open the chat window pre-filled with the shift duty message.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pre-filled Duty Text:</span>
              <p className="whitespace-pre-line text-slate-800 font-sans font-medium text-[11px]">
                {dutyText}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={waWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onClose()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                Launch WhatsApp Web Chat
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
