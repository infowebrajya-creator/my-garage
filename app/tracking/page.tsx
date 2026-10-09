'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGarage } from '@/context/GarageContext';
import LicensePlate from '@/components/ui/LicensePlate';
import { DutyNotificationModal } from '@/components/modals/DutyNotificationModal';
import { TripRecord } from '@/types';
import {
  Navigation,
  Activity,
  Gauge,
  Zap,
  MapPin,
  Bus,
  ShieldCheck,
  AlertTriangle,
  Send,
  Fuel,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  Phone
} from 'lucide-react';

export default function TrackingPage() {
  const { vehicles, trips, drivers } = useGarage();
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifyTrip, setNotifyTrip] = useState<TripRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live GPS Telematics simulated metrics per active vehicle
  const activeTrips = trips.filter((t) => t.status === 'In Progress');

  // Simulated GPS Telematics Data generator
  const trackingData = activeTrips.map((trip, idx) => {
    const veh = vehicles.find((v) => v.id === trip.vehicleId);
    const drv = drivers.find((d) => d.id === trip.driverId);
    
    // Dynamic simulated metrics based on vehicle index
    const baseSpeed = 68 + (idx * 3) % 18;
    const isOverSpeeding = baseSpeed > 80;
    const progressPct = 40 + ((idx * 17) % 55);
    const fuelLevelPct = 88 - ((idx * 6) % 35);
    const fuelLiters = Math.round((fuelLevelPct / 100) * 400);
    const mileageKmpl = (4.6 + (idx * 0.2) % 1.2).toFixed(1);

    // Profitability estimations
    const ticketRevenue = 28500 + (idx * 3200) % 15000;
    const fuelExpense = Math.round(ticketRevenue * 0.38);
    const tollExpense = 1450 + (idx * 200) % 800;
    const driverAllowance = 1200;
    const netProfit = ticketRevenue - fuelExpense - tollExpense - driverAllowance;

    return {
      trip,
      vehicle: veh,
      driver: drv,
      speedKmh: baseSpeed,
      isOverSpeeding,
      progressPct,
      fuelLevelPct,
      fuelLiters,
      mileageKmpl,
      ticketRevenue,
      fuelExpense,
      tollExpense,
      driverAllowance,
      netProfit,
      gpsStatus: isOverSpeeding ? 'Speed Alert ⚠️' : 'Route Signal Lock 🟢',
      checkpoint: progressPct > 70 ? 'Approaching Destination' : progressPct > 40 ? 'Midway Transit' : 'Depot Departure',
    };
  });

  const filteredTracking = trackingData.filter((item) => {
    const matchesSearch =
      item.trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trip.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedRouteFilter === 'All') return matchesSearch;
    if (selectedRouteFilter === 'SpeedAlert') return matchesSearch && item.isOverSpeeding;
    return matchesSearch && item.trip.startLocation.includes(selectedRouteFilter);
  });

  const totalNetProfit = trackingData.reduce((sum, item) => sum + item.netProfit, 0);
  const avgFleetSpeed = Math.round(
    trackingData.reduce((sum, item) => sum + item.speedKmh, 0) / (trackingData.length || 1)
  );

  const handleRefreshGPS = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header Hero */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
                <Navigation className="w-5 h-5" />
              </span>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                NANDAN TRAVELS • MP-22 SEONI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live GPS Fleet Telematics & Net Profit Ledger
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Real-time GPS tracking across intercity corridors (*Seoni ➔ Indore ➔ Nagpur ➔ Jabalpur*), live speed limit gauges, fuel level monitors, and per-trip net profit calculations.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <button
              onClick={handleRefreshGPS}
              className={`px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh GPS Feed
            </button>
          </div>
        </div>

        {/* Executive Real-Time Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Active Vehicles On Route</span>
              <Bus className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{activeTrips.length} Buses</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% GPS Lock Active
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Avg Intercity Fleet Speed</span>
              <Gauge className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{avgFleetSpeed} km/h</div>
            <span className="text-[11px] text-slate-500 font-medium">
              Speed Limit: 80 km/h Highway Max
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Fleet Fuel Level Avg</span>
              <Fuel className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">79% (316L)</div>
            <span className="text-[11px] text-indigo-600 font-bold">
              Avg Mileage: 4.9 Km/L
            </span>
          </div>

          <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-md shadow-emerald-600/20 space-y-1">
            <div className="flex items-center justify-between text-emerald-200 text-xs font-bold uppercase">
              <span>Current Shift Net Profit</span>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">₹{totalNetProfit.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-emerald-100 font-medium block">
              After Fuel, Tolls & Driver Allowances
            </span>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driver, vehicle, registration plate or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {['All', 'Seoni', 'Indore', 'SpeedAlert'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedRouteFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedRouteFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f === 'SpeedAlert' ? 'Speed Warnings ⚠️' : f === 'All' ? 'All Routes' : `${f} Depot`}
              </button>
            ))}
          </div>
        </div>

        {/* Live GPS Telematics Fleet Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredTracking.map((item) => (
            <div
              key={item.trip.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs hover:shadow-md transition-all space-y-4 ${
                item.isOverSpeeding ? 'border-rose-300 ring-2 ring-rose-500/20' : 'border-slate-200/80'
              }`}
            >
              {/* Header: Driver, Vehicle & Plate */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">
                      {item.trip.vehicleName}
                    </span>
                    {item.isOverSpeeding && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full uppercase animate-pulse">
                        Over-speeding ⚠️
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <span>Driver: <strong className="text-slate-800">{item.trip.driverName}</strong></span>
                    {item.driver && (
                      <a href={`tel:${item.driver.phone}`} className="text-blue-600 hover:underline flex items-center gap-0.5 ml-2 font-mono">
                        <Phone className="w-3 h-3" /> {item.driver.phone}
                      </a>
                    )}
                  </p>
                </div>

                <div className="shrink-0">
                  <LicensePlate
                    number={item.trip.registrationNumber}
                    size="sm"
                    isCommercial={true}
                  />
                </div>
              </div>

              {/* Highway Route Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-black text-slate-900 text-xs">
                      {item.trip.startLocation} &rarr; {item.trip.destination}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-600 text-[11px]">
                    {item.checkpoint}
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Route Transit Progress</span>
                    <span className="text-blue-600">{item.progressPct}% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                      style={{ width: `${item.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Telematics Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Live Speed</span>
                  <span className={`text-sm font-black ${item.isOverSpeeding ? 'text-rose-600' : 'text-slate-900'}`}>
                    {item.speedKmh} km/h
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Fuel Tank Level</span>
                  <span className="text-sm font-black text-indigo-700">
                    {item.fuelLevelPct}% ({item.fuelLiters}L)
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Engine Mileage</span>
                  <span className="text-sm font-black text-emerald-700">
                    {item.mileageKmpl} Km/L
                  </span>
                </div>
              </div>

              {/* Financial Profitability Calculation Box */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Gross Ticket Revenue:</span>
                  <span>₹{item.ticketRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Deductions (Fuel: ₹{item.fuelExpense} | Toll: ₹{item.tollExpense} | Driver: ₹{item.driverAllowance}):</span>
                  <span className="text-rose-600">-₹{(item.fuelExpense + item.tollExpense + item.driverAllowance).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200/80 font-black text-xs text-emerald-900">
                  <span>Net Trip Profit:</span>
                  <span className="text-sm text-emerald-700">₹{item.netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Departure: {new Date(item.trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                  onClick={() => setNotifyTrip(item.trip)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  WhatsApp Driver Duty
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Duty Dispatch Modal */}
      {notifyTrip && (
        <DutyNotificationModal
          isOpen={!!notifyTrip}
          onClose={() => setNotifyTrip(null)}
          trip={notifyTrip}
        />
      )}
    </AppLayout>
  );
}
