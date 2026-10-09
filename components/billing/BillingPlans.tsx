'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Info, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function BillingPlans() {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubscribeClick = () => {
    showToast('info', 'Subscription Gateway Notice', 'Payment Gateway integration is coming soon upon Supabase Stripe checkout connection.');
  };

  const faqs = [
    {
      q: 'Will my local vehicle data stay safe after upgrading?',
      a: 'Yes! MyGarage stores all document metadata, service logs, and expense records in your browser localStorage. When you upgrade to WebRajya Pro, your local records seamlessly sync to Supabase Cloud.'
    },
    {
      q: 'How do document expiry reminders work?',
      a: 'In the current frontend build, in-app badges calculate days remaining live. Once Supabase Edge Functions are connected, automated Email, SMS, and WhatsApp alerts will be dispatched 30, 15, and 3 days before document expiration.'
    },
    {
      q: 'Can I export my expense records for tax accounting?',
      a: 'Absolutly! You can export your full vehicle expense history, service receipts, and fuel logs to a CSV spreadsheet with one click from the Expenses module.'
    },
    {
      q: 'Are there any hidden fees or per-vehicle charges?',
      a: 'No hidden fees! The Premium plan includes unlimited vehicles, unlimited document storage, and complete service histories for a flat annual price.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          WebRajya SaaS Licensing
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Flexible Plans for Every Garage Owner
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Start for free to manage personal vehicles or upgrade to WebRajya Premium for unlimited garage tracking and automated alerts.
        </p>

        {/* Cycle Toggle */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900">
              SAVE 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Free Starter
              </span>
              <span className="text-xs text-slate-400 font-medium">Currently Active</span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">₹0</span>
                <span className="text-xs text-slate-500 font-medium">/ forever</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Perfect for individual owners managing up to 2 vehicles.</p>
            </div>

            <hr className="my-6 border-slate-100" />

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 2 Registered Vehicles</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic Document Locker (RC, Insurance, PUC)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic In-App Reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recent Expense History</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Check className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="line-through">Automated Email & WhatsApp Alerts</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Check className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="line-through">CSV Expense Export</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              disabled
              className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl text-xs cursor-default"
            >
              Current Active Plan
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-500/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-bl-xl tracking-wider">
            RECOMMENDED PRO
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                WebRajya Premium
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '₹1,499' : '₹149'}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {billingCycle === 'annual' ? '/ year' : '/ month'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Configurable subscription placeholder for full garage power.</p>
            </div>

            <hr className="my-6 border-slate-800" />

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold text-white">Unlimited Vehicles (Cars, Bikes, Commercial)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Full Document Locker & Expiry Countdowns</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Complete Service & Garage History Ledger</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Advanced Monthly Expense Analytics & Charts</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>One-Click CSV Expense Exporting</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-300">Future Email, SMS & WhatsApp Dispatchers</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <button
              onClick={handleSubscribeClick}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              Upgrade to Premium (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-4">Detailed Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-center">Free Plan</th>
                <th className="py-3 px-4 text-center text-blue-600 font-bold">Premium Yearly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Vehicle Capacity</td>
                <td className="py-3 px-4 text-center text-slate-600">2 Vehicles</td>
                <td className="py-3 px-4 text-center font-bold text-blue-700">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Document Locker</td>
                <td className="py-3 px-4 text-center text-slate-600">Basic</td>
                <td className="py-3 px-4 text-center font-bold text-blue-700">Full Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Service History Tracking</td>
                <td className="py-3 px-4 text-center text-slate-600">Limited</td>
                <td className="py-3 px-4 text-center font-bold text-blue-700">Full Ledger</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Expense CSV Export</td>
                <td className="py-3 px-4 text-center text-slate-400">&mdash;</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Automated Dispatch Alerts</td>
                <td className="py-3 px-4 text-center text-slate-400">&mdash;</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Coming Soon</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-xs text-slate-900 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
