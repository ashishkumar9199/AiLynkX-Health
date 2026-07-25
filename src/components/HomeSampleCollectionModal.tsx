import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialLabTests } from '../data/initialData';
import { 
  X, 
  TestTube2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileCheck,
  ShieldCheck,
  Upload
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const HomeSampleCollectionModal: React.FC<Props> = ({ onClose }) => {
  const { requestHomeSample, t, setPortal } = useApp();

  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(['test-1']);
  const [preferredDate, setPreferredDate] = useState('2026-07-26');
  const [preferredTime, setPreferredTime] = useState('08:30 AM');
  
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [requisitionPdf, setRequisitionPdf] = useState<{ name: string; url: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const toggleTest = (id: string) => {
    setSelectedTestIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectedTests = initialLabTests.filter(t => selectedTestIds.includes(t.id));
  const totalAmount = selectedTests.reduce((acc, curr) => acc + curr.price, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRequisitionPdf({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTestIds.length === 0) {
      alert("Please select at least one lab test.");
      return;
    }

    if (!patientName.trim() || !patientPhone.trim() || !patientAddress.trim()) {
      alert("Please enter full name, phone number, and address for home sample collection.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await requestHomeSample({
        patientName,
        patientPhone,
        patientAddress,
        selectedTests: selectedTests.map(t => t.name),
        preferredDate,
        preferredTime,
        requisitionPdfName: requisitionPdf?.name,
        requisitionPdfUrl: requisitionPdf?.url,
        totalAmount
      });

      setCreatedRequestId(res.id);
    } catch (err) {
      console.error(err);
      alert("Error submitting sample collection request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-blue-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <TestTube2 className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">
                {t('homeSampleTitle')}
              </h2>
              <p className="text-xs text-red-100">
                {t('homeSampleSubtitle')}
              </p>
            </div>
          </div>
          <button 
            id="close-sample-modal-btn"
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/10 hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {createdRequestId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Sample Pickup Request Scheduled!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Request ID <strong>#{createdRequestId}</strong> confirmed for <strong>{preferredDate} at {preferredTime}</strong> at <i>"{patientAddress}"</i>.
              </p>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 font-medium text-left max-w-md mx-auto space-y-1">
                <p>• Phlebotomist will arrive with sterile sample tubes & cold chain box.</p>
                <p>• Digital report will be uploaded directly to your Patient Dashboard within 12-24 hours.</p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  id="view-sample-status-btn"
                  onClick={() => {
                    onClose();
                    setPortal('patient');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Track Sample Status in Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Select Lab Tests */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Diagnostic Lab Tests
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {initialLabTests.map(test => {
                    const isSelected = selectedTestIds.includes(test.id);
                    return (
                      <div
                        key={test.id}
                        id={`select-test-${test.id}`}
                        onClick={() => toggleTest(test.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/90 ring-1 ring-blue-600/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">
                            {test.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {test.preparation}
                          </span>
                        </div>
                        <span className="text-xs font-black text-blue-700 shrink-0">
                          ${test.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Patient Pickup Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Address & Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      id="sample-patient-name"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="sample-patient-phone"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Home Address for Technician Visit *
                  </label>
                  <textarea
                    rows={2}
                    id="sample-patient-address"
                    value={patientAddress}
                    onChange={e => setPatientAddress(e.target.value)}
                    placeholder="House no., Street name, Landmark, City & Zip Code"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="sample-date"
                      value={preferredDate}
                      onChange={e => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Preferred Time
                    </label>
                    <select
                      id="sample-time"
                      value={preferredTime}
                      onChange={e => setPreferredTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    >
                      <option value="07:30 AM">07:30 AM (Fasting)</option>
                      <option value="08:30 AM">08:30 AM (Fasting)</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Doctor's Requisition Note (Optional Upload) */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Doctor's Lab Requisition Note / Prescription PDF (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="text-[11px] text-slate-500 w-full"
                />
                {requisitionPdf && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ Attached: {requisitionPdf.name}
                  </p>
                )}
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Total Lab Fee:</span>
                  <span className="text-2xl font-black text-blue-950">${totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-home-sample-btn"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? 'Requesting...' : 'Submit Sample Request'}
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
