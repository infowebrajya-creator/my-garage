'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useGarage } from '@/context/GarageContext';
import { useToast } from '@/context/ToastContext';
import { Users, Download, MapPin, Navigation, Phone, ShieldCheck, Clock, Bus, CheckCircle2, FileText } from 'lucide-react';
import LicensePlate from '@/components/ui/LicensePlate';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DriverReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriverReportModal({ isOpen, onClose }: DriverReportModalProps) {
  const { drivers, trips, vehicles } = useGarage();
  const { showToast } = useToast();

  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Combine driver & active trip data
  const reportData = drivers.map((driver) => {
    // Find active or latest trip for this driver
    const activeTrip = trips.find((t) => t.driverId === driver.id && t.status === 'In Progress');
    const latestTrip = activeTrip || trips.find((t) => t.driverId === driver.id);
    const assignedVeh = vehicles.find((v) => v.id === (activeTrip?.vehicleId || driver.assignedVehicleId));

    const getArrivalTime = () => {
      if (!latestTrip) return 'N/A';
      if (latestTrip.endTime) {
        return new Date(latestTrip.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (latestTrip.startTime) {
        const d = new Date(latestTrip.startTime);
        d.setHours(d.getHours() + 4);
        return `Est. ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return 'N/A';
    };

    return {
      driverId: driver.id,
      driverName: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      status: driver.status,
      experience: driver.experience,
      vehicleName: assignedVeh?.name || driver.assignedVehicleName || 'Unassigned',
      registrationNumber: assignedVeh?.registrationNumber || 'N/A',
      isCommercial: assignedVeh ? (assignedVeh.type === 'Bus' || assignedVeh.type === 'Truck') : true,
      tripPurpose: latestTrip?.purpose || 'No Active Duty',
      fromWhere: latestTrip?.startLocation || 'Seoni Main Depot',
      toWhere: latestTrip?.destination || 'N/A',
      startTime: latestTrip?.startTime ? new Date(latestTrip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      arrivalTime: getArrivalTime(),
      tripStatus: latestTrip?.status || 'Inactive',
    };
  });

  const activeOnTripCount = reportData.filter((d) => d.status === 'On Trip').length;
  const activeInDepotCount = reportData.filter((d) => d.status === 'Active').length;
  const unassignedCount = reportData.filter((d) => d.status === 'Unassigned' || d.status === 'On Leave' || d.vehicleName === 'Unassigned').length;

  const handleDownloadPDF = () => {
    try {
      showToast('info', 'Generating PDF', 'Downloading Nandan Travels Executive Duty Report PDF file...');

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Red Top Accent Header Bar
      doc.setFillColor(220, 38, 38); // Red 600
      doc.rect(0, 0, 297, 18, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('NANDAN TRAVELS • EXPRESS FLEET (MP-22 SEONI)', 14, 12);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${generatedAt}`, 283, 12, { align: 'right' });

      // Document Title & Subhead
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('DAILY DRIVER DUTY ROSTER & ROUTE MANIFEST', 14, 27);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Head Office: Main Bus Stand, Seoni, Madhya Pradesh (RTO: MP-22) • ISO 9001:2025 Fleet Audit', 14, 33);

      // KPI Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 37, 269, 13, 2, 2, 'FD');

      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Roster Drivers: ${drivers.length}`, 20, 45);
      doc.text(`On Intercity Duty: ${activeOnTripCount}`, 90, 45);
      doc.text(`Ready In Depot: ${activeInDepotCount}`, 160, 45);
      doc.text(`Unassigned / Off: ${unassignedCount}`, 230, 45);

      // Data Table
      const tableHeaders = [
        ['Driver Name', 'Phone', 'License (DL)', 'Assigned Vehicle', 'HSRP Plate', 'Trip Purpose', 'Origin (From)', 'Destination (To)', 'Dep. Time', 'Arr. Time', 'Status']
      ];

      const tableRows = reportData.map((d) => [
        d.driverName,
        d.phone,
        d.licenseNumber,
        d.vehicleName,
        d.registrationNumber,
        d.tripPurpose,
        d.fromWhere,
        d.toWhere,
        d.startTime,
        d.arrivalTime,
        d.status,
      ]);

      autoTable(doc, {
        startY: 53,
        head: tableHeaders,
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          4: { fontStyle: 'bold' },
          6: { textColor: [29, 78, 216] },
          7: { textColor: [67, 56, 202] },
          10: { fontStyle: 'bold', halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      });

      // Signature Footer
      const finalY = (doc as any).lastAutoTable.finalY + 12;
      if (finalY < 190) {
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('NANDAN TRAVELS FLEET MANAGEMENT SYSTEM • CONFIDENTIAL & VERIFIED BY mPARIVAHAN RTO LOGS', 14, finalY);

        doc.setDrawColor(148, 163, 184);
        doc.line(180, finalY, 220, finalY);
        doc.text('Depot Operations Master', 180, finalY + 4);

        doc.line(235, finalY, 280, finalY);
        doc.text('Manager Authorization Stamp', 235, finalY + 4);
      }

      const fileName = `Nandan_Travels_Driver_Duty_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      showToast('success', 'PDF File Saved', `Downloaded ${fileName} directly to your device!`);
    } catch (err) {
      console.error('PDF download error:', err);
      showToast('error', 'Download Error', 'Could not generate PDF download.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nandan Travels — Executive Driver & Duty Report"
      subtitle="Official intercity duty roster, assigned fleet routes & driver directory PDF generator"
      maxWidth="6xl"
    >
      <div className="space-y-6">
        {/* Top Actions & Quick Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-red-600 text-white rounded-xl shadow-xs">
              <Bus className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red-400 block">NANDAN TRAVELS • MP-22 SEONI</span>
              <h4 className="text-base font-extrabold text-white">Executive Duty Roster & Route Report</h4>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 active:scale-98"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Printable Executive Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600 block">
                OFFICIAL FLEET OPERATIONS MANIFEST
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                NANDAN TRAVELS (EXPRESS FLEET • MP-22 SEONI)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Head Office: Main Bus Stand, Seoni, Madhya Pradesh (RTO Registration: MP-22)
              </p>
            </div>
            <div className="text-right">
              <span className="px-3.5 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 inline-block shadow-2xs">
                ISO 9001:2025 FLEET AUDIT
              </span>
              <div className="text-xs font-mono text-slate-500 mt-1.5">
                Generated: <strong>{generatedAt}</strong>
              </div>
            </div>
          </div>

          {/* KPI Executive Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-500 block">Total Roster Drivers</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{drivers.length}</span>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center shadow-2xs">
              <span className="text-xs font-bold uppercase text-amber-700 block">On Intercity Duty</span>
              <span className="text-xl font-black text-amber-800 mt-1 block">{activeOnTripCount}</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center shadow-2xs">
              <span className="text-xs font-bold uppercase text-emerald-700 block">Ready In Depot</span>
              <span className="text-xl font-black text-emerald-800 mt-1 block">{activeInDepotCount}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-500 block">Unassigned / Off</span>
              <span className="text-xl font-black text-slate-700 mt-1 block">{unassignedCount}</span>
            </div>
          </div>
        </div>

        {/* Executive Report Data Table */}
        <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white max-h-[65vh] overflow-y-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-900 text-white font-black uppercase text-[11px] tracking-wide">
              <tr>
                <th className="py-3.5 px-4">Driver Name & License</th>
                <th className="py-3.5 px-4">Vehicle & HSRP Plate</th>
                <th className="py-3.5 px-4">Trip Purpose</th>
                <th className="py-3.5 px-4">Origin (From)</th>
                <th className="py-3.5 px-4">Destination (To)</th>
                <th className="py-3.5 px-4">Dep. Time</th>
                <th className="py-3.5 px-4">Arr. Time</th>
                <th className="py-3.5 px-4 text-right">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportData.map((d, idx) => (
                <tr key={d.driverId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="py-2.5 px-4">
                    <div className="font-extrabold text-slate-900">{d.driverName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      DL: <strong>{d.licenseNumber}</strong> • Ph: {d.phone}
                    </div>
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="font-extrabold text-slate-800 text-[11px] mb-1">{d.vehicleName}</div>
                    {d.registrationNumber !== 'N/A' ? (
                      <LicensePlate number={d.registrationNumber} size="sm" isCommercial={d.isCommercial} />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 font-semibold text-slate-800 text-[11px]">
                    {d.tripPurpose}
                  </td>

                  <td className="py-2.5 px-4 font-bold text-blue-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>{d.fromWhere}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-4 font-bold text-indigo-700">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{d.toWhere}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-4 font-mono text-slate-700 font-semibold text-[11px]">
                    {d.startTime}
                  </td>

                  <td className="py-2.5 px-4 font-mono text-emerald-700 font-bold text-[11px]">
                    {d.arrivalTime}
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border inline-block ${
                        d.status === 'On Trip'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : d.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Executive Sign-off Footer Block */}
        <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-end justify-between gap-4">
          <div className="text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">NANDAN TRAVELS FLEET MANAGEMENT SYSTEM &bull; CONFIDENTIAL</p>
            <p>This report is verified with live mParivahan vehicle registry records & RTO trip logs.</p>
          </div>

          <div className="flex items-center gap-8 text-center pt-2">
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] font-bold text-slate-600 block">Depot Operations Master</span>
            </div>
            <div>
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] font-bold text-slate-600 block">Manager Authorization</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
