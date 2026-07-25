import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, PharmacyStore, MedicineItem } from '../types';
import { 
  ShieldCheck, 
  UserPlus, 
  Store, 
  Pill, 
  Calendar, 
  TestTube2, 
  PackageCheck, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Video,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    doctors, 
    addDoctor, 
    deleteDoctor, 
    stores, 
    addStore, 
    medicines, 
    addMedicine, 
    appointments, 
    sampleRequests, 
    orders, 
    updateAppointmentStatus, 
    updateSampleStatus, 
    updateOrderStatus,
    t,
    setPortal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'doctors' | 'stores' | 'appointments' | 'samples' | 'orders'>('doctors');

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_logged_in') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Simulate small secure delay for visual feedback
    setTimeout(() => {
      if (adminUsername === 'suailynkxadmin25' && adminPassword === 'Shubham@#@#9199@#@#') {
        setIsAuthenticated(true);
        localStorage.setItem('is_admin_logged_in', 'true');
        setAdminUsername('');
        setAdminPassword('');
      } else {
        setLoginError('Invalid username or password. Please try again.');
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_admin_logged_in');
    window.location.hash = '';
    setPortal('landing');
  };

  // Doctor Form State
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiologist');
  const [docQualifications, setDocQualifications] = useState('MD, Board Certified');
  const [docExperience, setDocExperience] = useState<number>(12);
  const [docFee, setDocFee] = useState<number>(75);
  const [docModes, setDocModes] = useState<('video' | 'clinic')[]>(['video', 'clinic']);
  const [docAvatar, setDocAvatar] = useState('https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80');
  const [docHospital, setDocHospital] = useState('City General Medical Center');
  const [docAddress, setDocAddress] = useState('100 Health Way, Suite 400');
  const [docBio, setDocBio] = useState('Experienced specialist dedicated to patient wellness and digital telehealth consultations.');
  const [docLanguages, setDocLanguages] = useState('English, Spanish');

  const [docAddedSuccess, setDocAddedSuccess] = useState(false);

  // Pharmacy Store Form State
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeLicense, setStoreLicense] = useState('');
  const [storeDelivery, setStoreDelivery] = useState('20-35 mins');
  const [storeAddedSuccess, setStoreAddedSuccess] = useState(false);

  // Medicine Form State
  const [medStoreId, setMedStoreId] = useState<string>('');
  const [medName, setMedName] = useState('');
  const [medCategory, setMedCategory] = useState<'Prescription' | 'OTC' | 'Vitamins' | 'First Aid' | 'Diabetes Care' | 'Personal Care'>('OTC');
  const [medPrice, setMedPrice] = useState<number>(15.00);
  const [medStock, setMedStock] = useState<number>(50);
  const [medRequiresRx, setMedRequiresRx] = useState(false);
  const [medDosageForm, setMedDosageForm] = useState('10 Tablets');
  const [medDesc, setMedDesc] = useState('');

  // Submit Doctor Form
  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim()) return;

    addDoctor({
      name: docName,
      specialty: docSpecialty,
      qualifications: docQualifications,
      experienceYears: Number(docExperience),
      fee: Number(docFee),
      consultationModes: docModes,
      availability: ['09:00 AM', '11:30 AM', '02:30 PM', '05:00 PM'],
      avatar: docAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
      hospital: docHospital,
      address: docAddress,
      bio: docBio,
      languages: docLanguages.split(',').map(s => s.trim())
    });

    setDocAddedSuccess(true);
    setTimeout(() => setDocAddedSuccess(false), 4000);

    // Reset fields
    setDocName('');
  };

  // Submit Pharmacy Store Form
  const handleAddStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    addStore({
      name: storeName,
      address: storeAddress || 'Main Street, City Center',
      phone: storePhone || '+1 (800) 555-0100',
      licenseNumber: storeLicense || `PH-${Math.floor(10000 + Math.random() * 90000)}`,
      deliveryTime: storeDelivery,
      image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80'
    });

    setStoreAddedSuccess(true);
    setTimeout(() => setStoreAddedSuccess(false), 4000);
    setStoreName('');
  };

  // Submit Medicine Product Form
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const targetStore = stores.find(s => s.id === medStoreId) || stores[0];

    addMedicine({
      storeId: targetStore?.id || 'store-1',
      storeName: targetStore?.name || 'MediCare Central Pharmacy',
      name: medName,
      category: medCategory,
      price: Number(medPrice),
      stock: Number(medStock),
      requiresPrescription: medRequiresRx,
      dosageForm: medDosageForm,
      description: medDesc || 'Quality pharmaceutical formulation.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
    });

    setMedName('');
    alert("Medicine added to store catalogue!");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
        <div className="bg-gradient-to-br from-red-700 via-red-800 to-blue-950 text-white p-8 text-center relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            AiLynk<span className="text-red-400 font-serif italic text-2xl">X</span> Health
          </h2>
          <p className="text-xs text-red-100/80 uppercase tracking-widest font-bold mt-1">
            Secure Admin Gateway
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="p-8 space-y-6">
          {loginError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  id="admin-username-input"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  id="admin-password-input"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Access</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                setPortal('landing');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel & Return Home</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-red-600 animate-in fade-in duration-300">
        <div>
          <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
            {t('adminPanel')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Platform Administration Hub
          </h1>
          <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-xl">
            Add doctors (which immediately appear on the landing page), add pharmacy stores & medicines, monitor appointments, and track sample collections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              window.location.hash = '';
              setPortal('landing');
            }}
            className="bg-white text-red-900 hover:bg-red-50 font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all text-center cursor-pointer"
          >
            View Live Landing Page →
          </button>
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 border border-red-500 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold gap-1">
        <button
          id="admin-tab-doctors"
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'doctors' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Add & Manage Doctors ({doctors.length})
        </button>

        <button
          id="admin-tab-stores"
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'stores' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          Add Pharmacy Stores & Inventory ({stores.length})
        </button>

        <button
          id="admin-tab-appointments"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'appointments' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          All Bookings ({appointments.length})
        </button>

        <button
          id="admin-tab-samples"
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'samples' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          Home Lab Requests ({sampleRequests.length})
        </button>
      </div>

      {/* Tab 1: Doctors Management */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Doctor Form */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-red-600" />
              Add Doctor Details (Appears on Landing Page)
            </h2>

            {docAddedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Doctor added successfully! Now visible on Landing Page directory.</span>
              </div>
            )}

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  id="admin-doc-name"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    id="admin-doc-specialty"
                    value={docSpecialty}
                    onChange={e => setDocSpecialty(e.target.value)}
                    placeholder="e.g. Cardiologist, Dermatologist"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    id="admin-doc-qualifications"
                    value={docQualifications}
                    onChange={e => setDocQualifications(e.target.value)}
                    placeholder="e.g. MD (Harvard), FACC"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    id="admin-doc-experience"
                    value={docExperience}
                    onChange={e => setDocExperience(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    id="admin-doc-fee"
                    value={docFee}
                    onChange={e => setDocFee(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Profile Photo Avatar URL</label>
                <input
                  type="url"
                  id="admin-doc-avatar"
                  value={docAvatar}
                  onChange={e => setDocAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    id="admin-doc-hospital"
                    value={docHospital}
                    onChange={e => setDocHospital(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    id="admin-doc-languages"
                    value={docLanguages}
                    onChange={e => setDocLanguages(e.target.value)}
                    placeholder="English, Spanish, Hindi"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio & Medical Specialization</label>
                <textarea
                  rows={2}
                  id="admin-doc-bio"
                  value={docBio}
                  onChange={e => setDocBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <button
                type="submit"
                id="save-doctor-btn"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Save Doctor Profile to Landing Page
              </button>

            </form>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-6 space-y-3">
            <h2 className="font-extrabold text-slate-900 text-base">
              Existing Doctors Directory ({doctors.length})
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {doctors.map(doc => (
                <div key={doc.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] text-blue-700 font-semibold">{doc.specialty} • ${doc.fee}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDoctor(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Pharmacy Stores & Inventory */}
      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Pharmacy Store */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              Add Pharmacy Store
            </h2>

            {storeAddedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl">
                ✓ Pharmacy store added to public store directory!
              </div>
            )}

            <form onSubmit={handleAddStoreSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  id="admin-store-name"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="e.g. CarePlus 24/7 Pharmacy"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Address</label>
                <input
                  type="text"
                  id="admin-store-address"
                  value={storeAddress}
                  onChange={e => setStoreAddress(e.target.value)}
                  placeholder="101 Commercial St"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="admin-store-phone"
                    value={storePhone}
                    onChange={e => setStorePhone(e.target.value)}
                    placeholder="+1 (800)..."
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">License No</label>
                  <input
                    type="text"
                    id="admin-store-license"
                    value={storeLicense}
                    onChange={e => setStoreLicense(e.target.value)}
                    placeholder="PH-2026-99"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="save-store-btn"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Save Pharmacy Store
              </button>
            </form>

            {/* Add Medicine Product Form */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="font-extrabold text-xs uppercase text-slate-800">Add Medicine Product to Store</h3>
              
              <form onSubmit={handleAddMedicineSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Target Store</label>
                  <select
                    id="admin-med-store-select"
                    value={medStoreId}
                    onChange={e => setMedStoreId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                    <input
                      type="text"
                      id="admin-med-name"
                      value={medName}
                      onChange={e => setMedName(e.target.value)}
                      placeholder="e.g. Paracetamol 650mg"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="admin-med-price"
                      value={medPrice}
                      onChange={e => setMedPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="admin-med-rx"
                    checked={medRequiresRx}
                    onChange={e => setMedRequiresRx(e.target.checked)}
                  />
                  <label htmlFor="admin-med-rx" className="font-bold text-slate-700">Requires Doctor Prescription</label>
                </div>

                <button
                  type="submit"
                  id="save-medicine-btn"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Add Medicine to Store
                </button>
              </form>
            </div>

          </div>

          {/* Stores & Medicine List */}
          <div className="lg:col-span-6 space-y-3">
            <h2 className="font-extrabold text-slate-900 text-base">
              Existing Pharmacy Stores ({stores.length})
            </h2>

            <div className="space-y-3">
              {stores.map(s => (
                <div key={s.id} className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-1">
                  <h4 className="font-bold text-slate-900">{s.name}</h4>
                  <p className="text-slate-500">{s.address} • License: {s.licenseNumber}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-3">
          <h2 className="font-extrabold text-slate-900 text-base">All Patient Appointments Overview</h2>
          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a.id} className="p-4 bg-white rounded-2xl border border-slate-200 text-xs flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900">{a.patientName}</span> with <span className="text-blue-700 font-bold">{a.doctorName}</span>
                  <p className="text-slate-500 mt-0.5">{a.date} ({a.timeSlot}) • Mode: {a.mode.toUpperCase()}</p>
                </div>

                <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Samples */}
      {activeTab === 'samples' && (
        <div className="space-y-3">
          <h2 className="font-extrabold text-slate-900 text-base">Home Lab Sample Requests</h2>
          <div className="space-y-3">
            {sampleRequests.length === 0 ? (
              <p className="text-slate-500 text-xs py-4">No home sample requests pending.</p>
            ) : (
              sampleRequests.map(s => (
                <div key={s.id} className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Request #{s.id} - {s.patientName}</span>
                    <span className="text-emerald-700 uppercase">{s.status}</span>
                  </div>
                  <p className="text-slate-600">Tests: {s.selectedTests.join(', ')}</p>
                  <p className="text-slate-500">Address: {s.patientAddress} ({s.preferredDate})</p>

                  <button
                    onClick={() => updateSampleStatus(s.id, 'sample-collected', 'Rahul S.', '+1-800-LAB-TECH')}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[11px]"
                  >
                    Assign Technician & Mark Collected
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
