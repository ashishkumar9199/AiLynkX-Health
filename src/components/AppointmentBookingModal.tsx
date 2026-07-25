import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';
import { 
  X, 
  Video, 
  Building2, 
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface Props {
  doctor: Doctor | null;
  onClose: () => void;
}

export const AppointmentBookingModal: React.FC<Props> = ({ doctor, onClose }) => {
  const { bookAppointment, t, setPortal } = useApp();

  const [mode, setMode] = useState<'video' | 'clinic'>('video');
  const [date, setDate] = useState('2026-07-26');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<number>(32);
  const [patientGender, setPatientGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');

  const [prescriptionFile, setPrescriptionFile] = useState<{ name: string; url: string } | null>(null);
  const [testPdfFile, setTestPdfFile] = useState<{ name: string; url: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  if (!doctor) return null;

  // File Handlers
  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleTestPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestPdfFile({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  // Submit Booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim() || !patientPhone.trim()) {
      alert("Please provide patient full name and phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const createdApt = await bookAppointment({
        patientName,
        patientPhone,
        patientEmail: patientEmail || 'patient@example.com',
        patientAge: Number(patientAge) || 30,
        patientGender,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorAvatar: doctor.avatar,
        mode,
        date,
        timeSlot,
        symptoms: symptoms || 'General Consultation',
        prescriptionPdfName: prescriptionFile?.name,
        prescriptionPdfUrl: prescriptionFile?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        testPdfName: testPdfFile?.name,
        testPdfUrl: testPdfFile?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      });

      setBookingSuccess(createdApt.id);
    } catch (err) {
      console.error(err);
      alert("Error booking appointment. Please try again.");
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
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={doctor.avatar} 
              alt={doctor.name} 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md" 
            />
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">
                Book Consultation with {doctor.name}
              </h2>
              <p className="text-xs text-blue-200">
                {doctor.specialty} • {doctor.hospital}
              </p>
            </div>
          </div>
          <button 
            id="close-booking-modal-btn"
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {bookingSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Appointment Confirmed!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your appointment ID is <strong>#{bookingSuccess}</strong> with {doctor.name} on <strong>{date} at {timeSlot}</strong> ({mode === 'video' ? 'Video Call' : 'Clinic Visit'}).
              </p>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium text-left max-w-md mx-auto space-y-1">
                <p>• Medical records & PDFs attached will be available to the doctor during your consultation.</p>
                <p>• You can join your Video Call directly from your Patient Dashboard.</p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  id="view-in-patient-portal-btn"
                  onClick={() => {
                    onClose();
                    setPortal('patient');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Go to Patient Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Consultation Mode */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="select-mode-video"
                    onClick={() => setMode('video')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                      mode === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${mode === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold">Online Video Call</span>
                      <span className="text-[11px] text-slate-500">$ {doctor.fee} • Telehealth</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    id="select-mode-clinic"
                    onClick={() => setMode('clinic')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                      mode === 'clinic'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${mode === 'clinic' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold">In-Person Clinic Visit</span>
                      <span className="text-[11px] text-slate-500">$ {doctor.fee} • Hospital</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    id="booking-date-input"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Available Time Slot
                  </label>
                  <select
                    id="booking-timeslot-select"
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    {doctor.availability.map((slot, i) => (
                      <option key={i} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Patient Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Patient Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="patient-fullname-input"
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
                      id="patient-phone-input"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      id="patient-age-input"
                      value={patientAge}
                      onChange={e => setPatientAge(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Gender
                    </label>
                    <select
                      id="patient-gender-select"
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="patient-email-input"
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Symptoms / Primary Reason for Consultation
                  </label>
                  <textarea
                    rows={2}
                    id="patient-symptoms-input"
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    placeholder="Describe any current pain, duration of fever, or questions for doctor..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800"
                  ></textarea>
                </div>
              </div>

              {/* 4. Upload Prescription & Test PDFs for Doctor Assessment */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-700" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-950">
                    Upload Records for Doctor Review (Optional)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Upload existing prescriptions or lab test PDFs. The doctor will review these live in the Video Consultation side panel!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Prescription Upload */}
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Existing Prescription PDF / Image
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handlePrescriptionUpload}
                      className="text-[11px] text-slate-500 w-full"
                    />
                    {prescriptionFile && (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        ✓ {prescriptionFile.name}
                      </p>
                    )}
                  </div>

                  {/* Lab Test PDF Upload */}
                  <div className="bg-white p-3 rounded-xl border border-blue-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Lab Test Report PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleTestPdfUpload}
                      className="text-[11px] text-slate-500 w-full"
                    />
                    {testPdfFile && (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        ✓ {testPdfFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="cancel-booking-btn"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-booking-btn"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? 'Confirming...' : `Confirm & Book ($${doctor.fee})`}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
