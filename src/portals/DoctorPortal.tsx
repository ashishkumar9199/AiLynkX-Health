import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/VideoCallModal';
import { Appointment } from '../types';
import { 
  Stethoscope, 
  Video, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  User, 
  Sparkles,
  Download
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { appointments, startVideoCall, activeVideoCall, endVideoCall, updateAppointmentStatus, t } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [filterMode, setFilterMode] = useState<'all' | 'video' | 'clinic'>('all');

  // Filter appointments for selected doctor profile
  const doctorAppointments = appointments.filter(a => {
    const matchesDoc = a.doctorId === selectedDocId || true; // Show all for demo
    const matchesMode = filterMode === 'all' || a.mode === filterMode;
    return matchesDoc && matchesMode;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700">
        <div>
          <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
            Doctor Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Physician Consultation Desk
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Review patient symptoms, launch HD Video Calls, assess uploaded prescription & test PDFs, and issue digital E-Prescriptions.
          </p>
        </div>

        {/* Doctor Selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs shrink-0">
          <label className="block text-[10px] text-emerald-200 uppercase font-bold mb-1">
            Logged in Doctor Profile:
          </label>
          <select
            id="doctor-profile-select"
            value={selectedDocId}
            onChange={e => setSelectedDocId(e.target.value)}
            className="bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold"
          >
            <option value="doc-1">Dr. Sarah Jenkins (Cardiology)</option>
            <option value="doc-2">Dr. Rajesh Sharma (Diabetology)</option>
            <option value="doc-3">Dr. Elena Rostova (Dermatology)</option>
          </select>
        </div>
      </div>

      {/* Mode Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          Today's Patient Queue ({doctorAppointments.length})
        </h2>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            id="doc-filter-all"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            All Appointments
          </button>
          <button
            id="doc-filter-video"
            onClick={() => setFilterMode('video')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'video' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Video Calls Only
          </button>
          <button
            id="doc-filter-clinic"
            onClick={() => setFilterMode('clinic')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'clinic' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Clinic Visits
          </button>
        </div>
      </div>

      {/* Patient Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctorAppointments.map(apt => (
          <div key={apt.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                apt.mode === 'video' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {apt.mode === 'video' ? '🎥 Telehealth Video Call' : '🏥 Hospital Visit'}
              </span>

              <span className="text-xs font-mono font-bold text-slate-400">
                Patient #{apt.id}
              </span>
            </div>

            {/* Patient Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {apt.patientName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {apt.patientAge} Yrs • {apt.patientGender} • {apt.patientPhone}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Slot</span>
                <span className="text-xs font-bold text-blue-800">{apt.timeSlot}</span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">Reported Symptoms:</span>
              <p className="italic">{apt.symptoms}</p>
            </div>

            {/* Uploaded PDF Attachments Assessor */}
            <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2 text-xs">
              <span className="font-extrabold text-blue-950 uppercase text-[10px] block">
                Attached Medical PDFs (Inspectable during call):
              </span>

              <div className="flex flex-wrap gap-2 text-[11px]">
                {apt.prescriptionPdfName && (
                  <a
                    href={apt.prescriptionPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white rounded-xl border border-blue-200 text-blue-700 font-bold flex items-center gap-1.5 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.prescriptionPdfName}</span>
                  </a>
                )}

                {apt.testPdfName && (
                  <a
                    href={apt.testPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white rounded-xl border border-blue-200 text-blue-700 font-bold flex items-center gap-1.5 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span>{apt.testPdfName}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Doctor Actions */}
            <div className="pt-2 flex items-center gap-3">
              {apt.mode === 'video' ? (
                <button
                  id={`doctor-launch-video-btn-${apt.id}`}
                  onClick={() => startVideoCall(apt)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Patient Video Call</span>
                </button>
              ) : (
                <button
                  onClick={() => updateAppointmentStatus(apt.id, 'completed', "Prescription issued during clinic visit.", "Vitals normal.")}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Clinic Visit Completed</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Video Call Modal */}
      {activeVideoCall && (
        <VideoCallModal
          appointment={activeVideoCall}
          onClose={endVideoCall}
        />
      )}

    </div>
  );
};
