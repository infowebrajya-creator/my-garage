'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, CheckCircle2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Clock, BarChart3, Car } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function LoginView() {
  const router = useRouter();
  const { showToast } = useToast();

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('aryan@webrajya.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Welcome Back', 'Successfully signed into MyGarage Fleet Dashboard');
    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    showToast('info', 'Google Single Sign-On', 'Redirecting via Google Enterprise OAuth...');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Panel - Hero Showcase matching Design Spec */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              MyGarage
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold border border-blue-400/30">
                Enterprise
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Complete Vehicle & Fleet Management For Your Business
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Streamline your fleet operations, documents & driver telemetry in one place.
          </h2>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3.5 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Manage your vehicles</h4>
                <p className="text-xs text-slate-400">Track trucks, buses, cars & bikes with real-time status</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Track documents and renewals</h4>
                <p className="text-xs text-slate-400">Insurance, PUC, Fitness certificates & Road Tax alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Monitor expenses and servicing</h4>
                <p className="text-xs text-slate-400">Fuel logs, maintenance expenses & garage invoices</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Keep your fleet running smoothly</h4>
                <p className="text-xs text-slate-400">Automated reminders & driver assignment workflows</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Commercial Fleet Showcase Image & Testimonial */}
        <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800">
          <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-700 shadow-2xl">
            <img
              src="/images/fleet_hero_truck_bus.jpg"
              alt="Commercial Fleet Trucks and Buses"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Trusted by 500+ growing fleet businesses
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form matching Design Spec */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white text-slate-900">
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">MyGarage</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Fleet Management System
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8 my-auto">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Sign in to your MyGarage account</p>
          </div>

          {/* Tab Switcher: Email vs Phone */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === 'phone'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative px-3 bg-white text-xs font-semibold text-slate-400 uppercase">
              or continue with
            </span>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center pt-4 text-xs font-semibold text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
              Register your business
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} MyGarage Fleet Management. All rights reserved.
        </div>
      </div>
    </div>
  );
}
