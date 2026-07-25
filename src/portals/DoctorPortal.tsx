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
  Download,
  Lock,
  LogOut,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { doctors, appointments, editDoctor, startVideoCall, activeVideoCall, endVideoCall, updateAppointmentStatus, t } = useApp();

  // Authentication State
  const [loggedInDocId, setLoggedInDocId] = useState<string | null>(() => {
    return localStorage.getItem('logged_in_doctor_id');
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Active filter for patient queue
  const [filterMode, setFilterMode] = useState<'all' | 'video' | 'clinic'>('all');

  // Find currently logged-in doctor
  const currentDoctor = doctors.find(d => d.id === loggedInDocId);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    // Find doctor with matching credentials (case-insensitive for username)
    const foundDoc = doctors.find(
      d => d.username?.toLowerCase() === usernameInput.trim().toLowerCase() && d.password === passwordInput
    );

    if (!foundDoc) {
      setLoginError('Invalid doctor portal username or password. Please try again.');
      return;
    }

    // Check if deactivated
    if (foundDoc.isActive === false) {
      setLoginError('Your doctor ID has been deactivated permanently by the administrator. Portal access is suspended.');
      return;
    }

    // Successful login
    setLoggedInDocId(foundDoc.id);
    localStorage.setItem('logged_in_doctor_id', foundDoc.id);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Logout
  const handleLogout = () => {
    setLoggedInDocId(null);
    localStorage.removeItem('logged_in_doctor_id');
    setIsChangingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess('');
    setPasswordError('');
  };

  // Handle Password Change
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentDoctor) return;

    if (oldPassword !== currentDoctor.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Save updated password
    editDoctor({
      ...currentDoctor,
      password: newPassword
    });

    setPasswordSuccess('Password updated successfully! Keep this password safe.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess('');
    }, 3000);
  };

  // Filter appointments for currently logged in doctor
  const doctorAppointments = appointments.filter(a => {
    if (!currentDoctor) return false;
    
    // Match by doctor id, or if id is missing/generic, match by doctor name
    const matchesDoc = 
      a.doctorId === currentDoctor.id || 
      a.doctorName.toLowerCase().includes(currentDoctor.name.toLowerCase().replace('dr. ', ''));
    
    const matchesMode = filterMode === 'all' || a.mode === filterMode;
    return matchesDoc && matchesMode;
  });

  // Render Login Screen if not authenticated
  if (!currentDoctor || currentDoctor.isActive === false) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Medicare Doctor Portal</h2>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Authorized medical staff access only. Log in using the unique credentials assigned by your portal administrator.
          </p>
        </div>

        {loginError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Doctor Username *</label>
            <input
              type="text"
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              placeholder="e.g. sarah123"
              className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Security Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-slate-300 font-bold tracking-wider"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            Authenticate & Log In
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          Medicare Doctor Portal • Managed Secure Access
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner with doctor details & logout */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700">
        <div className="flex items-center gap-4">
          <img 
            src={currentDoctor.avatar} 
            alt={currentDoctor.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div>
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider mb-1 inline-block">
              Authenticated Doctor Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentDoctor.name}
            </h1>
            <p className="text-emerald-100 text-xs mt-0.5 max-w-xl font-medium">
              Specialist {currentDoctor.specialty} • {currentDoctor.hospital}
            </p>
          </div>
        </div>

        {/* Doctor Actions Quick Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-emerald-300" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Change Password Dropdown Panel */}
      {isChangingPassword && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm max-w-md space-y-4 animate-in slide-in-from-top-4 duration-200">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            Update Portal Password
          </h3>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
              ⚠️ {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[11px]"
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
      {doctorAppointments.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500 rounded-3xl space-y-2">
          <p className="font-bold text-slate-700 text-sm">No scheduled patients in your queue</p>
          <p className="text-xs max-w-xs mx-auto text-slate-400 font-medium">
            You currently do not have any {filterMode === 'all' ? '' : `${filterMode} `}appointments booked for today.
          </p>
        </div>
      ) : (
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
      )}

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
