'use client';

import React, { useState } from 'react';
import { HelpCircle, BookOpen, ShieldCheck, Mail, Phone, ExternalLink, Car, Search } from 'lucide-react';

export function HelpSupportView() {
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      title: 'How to manage PUC emission test renewals',
      category: 'Documents',
      desc: 'Learn how to set up automatic 6-month or 12-month PUC renewal reminders for BS4 and BS6 engines.',
    },
    {
      title: 'Tracking zero-dep insurance policies',
      category: 'Insurance',
      desc: 'Keep track of NCB (No Claim Bonus) percentages and bumper-to-bumper coverage add-ons in your locker.',
    },
    {
      title: 'Exporting complete vehicle history for buyers',
      category: 'Resale',
      desc: 'Generate a downloadable CSV spreadsheet of all service invoices and mileage logs when selling your car.',
    },
    {
      title: 'Updating odometer mileage readings',
      category: 'Maintenance',
      desc: 'Keep odometer readings updated to receive accurate periodic oil change and tire rotation recommendations.',
    }
  ];

  const filteredGuides = guides.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            WebRajya Customer Care
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2">Help & Support Knowledgebase</h2>
          <p className="text-xs text-slate-300 mt-1">
            Find quick answers to common vehicle documentation, maintenance tracking, and subscription questions.
          </p>

          <div className="mt-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help topics, guides, or maintenance tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
              {guide.category}
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">{guide.title}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{guide.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact WebRajya Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Need direct assistance from WebRajya?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Our automotive technical team is available 24/7 for support.</p>
          </div>
        </div>

        <a
          href="mailto:support@webrajya.com"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          Contact WebRajya Support <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
