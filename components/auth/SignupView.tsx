'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Bus, Car, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function SignupView() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Account Created', 'Welcome to MyGarage by WebRajya!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Left Hero Section with Heavy Truck & Bus Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/truck_and_bus_fleet.jpg"
            alt="Truck and Bus Fleet"
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-blue-950/30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/webrajya_logo_badge.png"
              alt="WebRajya My Garage Logo"
              className="w-13 h-13 object-contain drop-shadow-lg shrink-0"
            />
            <div>
              <h1 className="font-black text-2xl text-white tracking-tight flex items-center gap-2">
                WebRajya
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] uppercase font-bold border border-blue-400/30">
                  My Garage
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Vehicle &bull; Documents &bull; Reminders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Commercial & Personal
          </div>
        </div>

        <div className="relative z-10 max-w-xl space-y-6 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Start managing your fleet in minutes
          </div>

          <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
            Register your trucks, buses, cars & bikes in one unified dashboard.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Free trial included for all fleet sizes. Automated document expiry alerts, service log tracking, and expense analytics out of the box.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-4">
          <div>&copy; {new Date().getFullYear()} WebRajya Technologies. All rights reserved.</div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 bg-slate-900 text-slate-100 relative min-h-screen">
        <div className="lg:hidden relative rounded-3xl overflow-hidden mb-6 border border-slate-800 shadow-2xl">
          <div className="h-44 relative bg-slate-950">
            <img
              src="/images/truck_and_bus_fleet.jpg"
              alt="Trucks and Buses"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src="/images/webrajya_logo_badge.png"
                  alt="WebRajya My Garage Logo"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <span className="font-black text-white text-lg tracking-tight">WebRajya My Garage</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Vehicle &bull; Documents &bull; Reminders
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 my-auto">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-slate-400 mt-1.5">Get started with WebRajya MyGarage Fleet SaaS</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Aryan Rajput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="aryan@webrajya.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group border border-blue-400/20 cursor-pointer"
            >
              Create Fleet Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
