'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DocumentRecord, DocumentType } from '@/types';
import { useGarage } from '@/context/GarageContext';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: DocumentRecord | null;
  presetVehicleId?: string;
}

export function DocumentModal({
  isOpen,
  onClose,
  documentToEdit,
  presetVehicleId,
}: DocumentModalProps) {
  const { vehicles, addDocument, updateDocument } = useGarage();

  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState<DocumentType>('Insurance');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Default expiry date 1 year from today
  const defaultExpiry = new Date();
  defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
  const [expiryDate, setExpiryDate] = useState(defaultExpiry.toISOString().split('T')[0]);
  
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (documentToEdit) {
      setVehicleId(documentToEdit.vehicleId);
      setType(documentToEdit.type);
      setDocumentNumber(documentToEdit.documentNumber);
      setIssueDate(documentToEdit.issueDate);
      setExpiryDate(documentToEdit.expiryDate);
      setFileName(documentToEdit.fileName || '');
      setNotes(documentToEdit.notes || '');
    } else {
      setVehicleId(presetVehicleId || (vehicles[0]?.id || ''));
      setType('Insurance');
      setDocumentNumber('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      setExpiryDate(exp.toISOString().split('T')[0]);
      setFileName('');
      setNotes('');
    }
  }, [documentToEdit, presetVehicleId, vehicles, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !documentNumber || !expiryDate) return;

    if (documentToEdit) {
      updateDocument(documentToEdit.id, {
        vehicleId,
        type,
        documentNumber,
        issueDate,
        expiryDate,
        fileName: fileName || `${type}_${documentNumber}.pdf`,
        notes,
      });
    } else {
      addDocument({
        vehicleId,
        type,
        documentNumber,
        issueDate,
        expiryDate,
        fileName: fileName || `${type}_${documentNumber}.pdf`,
        notes,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={documentToEdit ? 'Edit Document' : 'Upload Vehicle Document'}
      subtitle="Store RC, Insurance, PUC, or tax renewal documents in your secure local locker"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Assign to Vehicle *
          </label>
          <select
            required
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Document Type & Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Document Category *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DocumentType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Insurance">Insurance Policy</option>
              <option value="PUC">PUC (Pollution Certificate)</option>
              <option value="RC">RC (Registration Certificate)</option>
              <option value="Driving Licence">Driving Licence</option>
              <option value="Road Tax">Road Tax Receipt</option>
              <option value="Fitness Certificate">Fitness Certificate</option>
              <option value="Other">Other Document</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Policy / Document Serial Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. POL-HDFC-994821 or PUC-883719"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Issue Date & Expiry Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Issue Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Document File Selector UI */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Attach Document File (PDF / Image)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors bg-slate-50/50">
            <input
              type="file"
              id="doc-file-input"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            <label htmlFor="doc-file-input" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-blue-500 mb-1" />
              <span className="text-xs font-semibold text-slate-800">
                {fileName ? fileName : 'Click to select a file from device'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PDF, JPG, PNG up to 10MB (Metadata stored locally)
              </span>
            </label>
          </div>
        </div>

        {/* Local storage note */}
        <div className="bg-slate-100 rounded-lg p-3 flex items-start gap-2.5 text-xs text-slate-600">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            Document metadata and file references are persisted locally in browser localStorage. Real cloud file uploads will be connected when Supabase backend is configured.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Notes / Coverage Remarks
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Zero Dep insurance cover, NCB 35%, includes engine protection..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
          >
            {documentToEdit ? 'Save Document' : 'Add Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
