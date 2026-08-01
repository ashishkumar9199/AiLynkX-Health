import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PhotoUpload } from '../components/PhotoUpload';
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
  LogOut,
  Settings,
  Key,
  Clock,
  X,
  Beaker,
  Megaphone,
  Star
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    doctors, 
    addDoctor, 
    editDoctor,
    deleteDoctor, 
    hospitals,
    addHospital,
    editHospital,
    deleteHospital,
    stores, 
    addStore, 
    editStore,
    medicines, 
    addMedicine, 
    appointments, 
    sampleRequests, 
    orders, 
    updateAppointmentStatus, 
    updateSampleStatus, 
    updateOrderStatus,
    labs,
    addLab,
    editLab,
    deleteLab,
    t,
    setPortal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals' | 'stores' | 'appointments' | 'samples' | 'orders' | 'security' | 'labs' | 'feedbacks'>('doctors');

  // Load and manage user feedbacks
  const [feedbacks, setFeedbacks] = useState<any[]>(() => {
    const saved = localStorage.getItem('aily_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Keep feedbacks perfectly synchronized in real-time
  useEffect(() => {
    const syncFeedbacks = () => {
      const saved = localStorage.getItem('aily_feedbacks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(feedbacks)) {
            setFeedbacks(parsed);
          }
        } catch (e) {
          // ignore
        }
      } else if (feedbacks.length > 0) {
        setFeedbacks([]);
      }
    };

    window.addEventListener('storage', syncFeedbacks);
    const interval = setInterval(syncFeedbacks, 1000);

    return () => {
      window.removeEventListener('storage', syncFeedbacks);
      clearInterval(interval);
    };
  }, [feedbacks]);

  // Feedback Filtering States
  const [fbCategoryFilter, setFbCategoryFilter] = useState<string>('all');
  const [fbRatingFilter, setFbRatingFilter] = useState<string>('all');
  const [fbSearchQuery, setFbSearchQuery] = useState<string>('');

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_logged_in') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Security Credentials Modification State
  const [configUsername, setConfigUsername] = useState(() => {
    return localStorage.getItem('admin_username') || 'suailynkxadmin25';
  });
  const [configPassword, setConfigPassword] = useState(() => {
    return localStorage.getItem('admin_password') || 'Shubham@#@#9199@#@#';
  });
  const [configSecretPath, setConfigSecretPath] = useState(() => {
    return localStorage.getItem('admin_secret_path') || 'admin-gate-suk2h2ai';
  });
  const [showConfigPassword, setShowConfigPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const targetUsername = localStorage.getItem('admin_username') || 'suailynkxadmin25';
    const targetPassword = localStorage.getItem('admin_password') || 'Shubham@#@#9199@#@#';

    // Simulate small secure delay for visual feedback
    setTimeout(() => {
      if (adminUsername === targetUsername && adminPassword === targetPassword) {
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

  // Auto logout when the admin switches tabs / hides the page
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        handleAdminLogout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

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
  const [docUsername, setDocUsername] = useState('');
  const [docPassword, setDocPassword] = useState('');

  const [docAddedSuccess, setDocAddedSuccess] = useState(false);

  // States for password editing in Admin list
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [newDocPassword, setNewDocPassword] = useState('');
  const [docStatusTab, setDocStatusTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [hospStatusTab, setHospStatusTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [storeStatusTab, setStoreStatusTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Pharmacy Store Form State
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeLicense, setStoreLicense] = useState('');
  const [storeDelivery, setStoreDelivery] = useState('20-35 mins');
  const [storeUsername, setStoreUsername] = useState('');
  const [storePassword, setStorePassword] = useState('');
  const [storeImage, setStoreImage] = useState('https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80');
  const [storeAddedSuccess, setStoreAddedSuccess] = useState(false);

  // States for pharmacy store password editing in Admin list
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [newStorePassword, setNewStorePassword] = useState('');

  // Medicine Form State
  const [medStoreId, setMedStoreId] = useState<string>('');
  const [medName, setMedName] = useState('');
  const [medCategory, setMedCategory] = useState<'Prescription' | 'OTC' | 'Vitamins' | 'First Aid' | 'Diabetes Care' | 'Personal Care'>('OTC');
  const [medPrice, setMedPrice] = useState<number>(15.00);
  const [medStock, setMedStock] = useState<number>(50);
  const [medRequiresRx, setMedRequiresRx] = useState(false);
  const [medDosageForm, setMedDosageForm] = useState('10 Tablets');
  const [medDesc, setMedDesc] = useState('');

  // Hospital Form State in Admin
  const [hospName, setHospName] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [hospEmail, setHospEmail] = useState('');
  const [hospBio, setHospBio] = useState('');
  const [hospUsername, setHospUsername] = useState('');
  const [hospPassword, setHospPassword] = useState('');
  const [hospImage, setHospImage] = useState('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80');
  const [hospAddedSuccess, setHospAddedSuccess] = useState(false);
  const [hospError, setHospError] = useState('');

  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHospError('');
    setHospAddedSuccess(false);

    if (!hospName.trim() || !hospUsername.trim() || !hospPassword.trim()) {
      setHospError('Please fill in Name, Username, and Password.');
      return;
    }

    addHospital({
      name: hospName.trim(),
      address: hospAddress.trim() || 'Digital Telehealth Network',
      phone: hospPhone.trim() || '+1 (555) 000-0000',
      email: hospEmail.trim() || 'contact@hospital.org',
      bio: hospBio.trim() || 'Licensed hospital center.',
      username: hospUsername.trim().toLowerCase(),
      password: hospPassword.trim(),
      image: hospImage.trim() || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
      approvalStatus: 'approved' as const
    });

    setHospAddedSuccess(true);
    setHospName('');
    setHospAddress('');
    setHospPhone('');
    setHospEmail('');
    setHospBio('');
    setHospUsername('');
    setHospPassword('');

    setTimeout(() => {
      setHospAddedSuccess(false);
    }, 4000);
  };

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
      languages: docLanguages.split(',').map(s => s.trim()),
      username: docUsername.trim() || `doc_${docName.toLowerCase().replace(/\s+/g, '_')}`,
      password: docPassword.trim() || 'password123',
      isActive: true
    });

    setDocAddedSuccess(true);
    setTimeout(() => setDocAddedSuccess(false), 4000);

    // Reset fields
    setDocName('');
    setDocUsername('');
    setDocPassword('');
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
      image: storeImage || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80',
      username: storeUsername.trim() || `pharmacy_${storeName.toLowerCase().replace(/\s+/g, '_')}`,
      password: storePassword.trim() || 'password123',
      isActive: true,
      approvalStatus: 'approved' as const
    });

    setStoreAddedSuccess(true);
    setTimeout(() => setStoreAddedSuccess(false), 4000);
    setStoreName('');
    setStoreUsername('');
    setStorePassword('');
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
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            AiLynkX Admin Portal
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
          id="admin-tab-hospitals"
          onClick={() => setActiveTab('hospitals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'hospitals' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Manage Hospitals ({hospitals ? hospitals.length : 0})
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

        <button
          id="admin-tab-labs"
          onClick={() => setActiveTab('labs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'labs' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Beaker className="w-4 h-4" />
          Partner Laboratories ({labs ? labs.length : 0})
        </button>

        <button
          id="admin-tab-security"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'security' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Access & Security Settings
        </button>

        <button
          id="admin-tab-feedbacks"
          onClick={() => setActiveTab('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'feedbacks' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          User Feedbacks ({feedbacks.length})
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
                <PhotoUpload
                  value={docAvatar}
                  onChange={setDocAvatar}
                  label="Profile Photo Avatar"
                  type="avatar"
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

              {/* Doctor Portal Credentials Section */}
              <div className="p-4 bg-red-50/80 rounded-2xl border border-red-100 space-y-3">
                <span className="font-extrabold text-red-950 block text-[11px] uppercase tracking-wider">
                  🔑 Doctor Portal Access Credentials
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Username *</label>
                    <input
                      type="text"
                      id="admin-doc-username"
                      value={docUsername}
                      onChange={e => setDocUsername(e.target.value)}
                      placeholder="e.g. sarah123"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="text"
                      id="admin-doc-password"
                      value={docPassword}
                      onChange={e => setDocPassword(e.target.value)}
                      placeholder="e.g. secretPass"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                      required
                    />
                  </div>
                </div>
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
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-base">
                Practitioner Directory ({doctors.length})
              </h2>
              
              {/* Approval status filter tabs */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDocStatusTab('pending')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    docStatusTab === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pending ({doctors.filter(d => d.approvalStatus === 'pending').length})
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatusTab('approved')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    docStatusTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Approved ({doctors.filter(d => d.approvalStatus === 'approved' || !d.approvalStatus).length})
                </button>
                <button
                  type="button"
                  onClick={() => setDocStatusTab('rejected')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    docStatusTab === 'rejected'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rejected ({doctors.filter(d => d.approvalStatus === 'rejected').length})
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {(() => {
                const filteredList = doctors.filter(doc => {
                  if (docStatusTab === 'pending') return doc.approvalStatus === 'pending';
                  if (docStatusTab === 'rejected') return doc.approvalStatus === 'rejected';
                  return doc.approvalStatus === 'approved' || !doc.approvalStatus;
                });

                if (filteredList.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium text-xs">
                      No medical practitioners found in this category.
                    </div>
                  );
                }

                return filteredList.map(doc => {
                  const isActive = doc.isActive !== false;
                  const isEditingPassword = editingDocId === doc.id;

                  const handleToggleActive = () => {
                    editDoctor({
                      ...doc,
                      isActive: !isActive
                    });
                  };

                  const handleSavePassword = () => {
                    if (!newDocPassword.trim()) return;
                    editDoctor({
                      ...doc,
                      password: newDocPassword.trim()
                    });
                    setEditingDocId(null);
                    setNewDocPassword('');
                  };

                  const handleApprove = () => {
                    editDoctor({
                      ...doc,
                      approvalStatus: 'approved'
                    });
                  };

                  const handleReject = () => {
                    editDoctor({
                      ...doc,
                      approvalStatus: 'rejected'
                    });
                  };

                  return (
                    <div key={doc.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 text-xs">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 mt-0.5 animate-in fade-in" />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                              {doc.approvalStatus === 'pending' && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">Pending Approval</span>
                              )}
                              {doc.approvalStatus === 'rejected' && (
                                <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Rejected</span>
                              )}
                            </div>
                            <p className="text-[11px] text-blue-700 font-semibold">{doc.specialty} • ${doc.fee}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="text-[10px] text-slate-400">User: <strong className="text-slate-600 font-semibold">{doc.username || 'N/A'}</strong></span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] text-slate-400 font-medium">Experience: <strong className="text-slate-600 font-semibold">{doc.experienceYears} Years</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {doc.approvalStatus === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={handleApprove}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={handleReject}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : doc.approvalStatus === 'rejected' ? (
                            <button
                              type="button"
                              onClick={handleApprove}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Approve Profile
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={handleToggleActive}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                                  isActive 
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                                title={isActive ? 'Deactivate Doctor Portal' : 'Activate Doctor Portal'}
                              >
                                {isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isEditingPassword) {
                                    setEditingDocId(null);
                                  } else {
                                    setEditingDocId(doc.id);
                                    setNewDocPassword(doc.password || '');
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-bold border border-slate-200 text-[10px] uppercase cursor-pointer"
                                title="Change Doctor Password"
                              >
                                Password
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteDoctor(doc.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Doctor Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Doctor Bio and Qualifications detail block for Pending or Rejected */}
                      {(doc.approvalStatus === 'pending' || doc.approvalStatus === 'rejected') && (
                        <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
                          <div><strong>Qualifications:</strong> {doc.qualifications}</div>
                          <div><strong>Hospital / Clinic:</strong> {doc.hospital}</div>
                          <div><strong>Office Address:</strong> {doc.address}</div>
                          <div><strong>Languages Spoken:</strong> {Array.isArray(doc.languages) ? doc.languages.join(', ') : doc.languages}</div>
                          <div className="pt-1.5 border-t border-slate-200 font-medium">
                            <strong>Biography:</strong> {doc.bio}
                          </div>
                        </div>
                      )}

                      {/* Status Badge for Approved */}
                      {(!doc.approvalStatus || doc.approvalStatus === 'approved') && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className={`font-bold text-[10px] uppercase ${isActive ? 'text-emerald-700' : 'text-red-700'}`}>
                            {isActive ? 'Portal Active & Listings Open' : 'PORTAL DEACTIVATED PERMANENTLY'}
                          </span>
                        </div>
                      )}

                      {/* Password Edit Mode */}
                      {isEditingPassword && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Set New Password</label>
                            <input
                              type="text"
                              value={newDocPassword}
                              onChange={e => setNewDocPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                            />
                          </div>
                          <div className="flex items-end gap-1 mt-4">
                            <button
                              type="button"
                              onClick={handleSavePassword}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDocId(null)}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
      )}

      {/* Tab: Hospitals Management */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Hospital Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              Add Hospital / Clinic Center
            </h2>

            {hospError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                {hospError}
              </div>
            )}
            {hospAddedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl">
                ✓ Hospital added successfully to network!
              </div>
            )}

            <form onSubmit={handleAddHospitalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={hospName}
                  onChange={e => setHospName(e.target.value)}
                  placeholder="e.g. St. Jude Heart Institute"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Address</label>
                <input
                  type="text"
                  value={hospAddress}
                  onChange={e => setHospAddress(e.target.value)}
                  placeholder="e.g. 101 Medical Dr"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={hospPhone}
                    onChange={e => setHospPhone(e.target.value)}
                    placeholder="+1..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={hospEmail}
                    onChange={e => setHospEmail(e.target.value)}
                    placeholder="contact@..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Slogan</label>
                <textarea
                  rows={2}
                  value={hospBio}
                  onChange={e => setHospBio(e.target.value)}
                  placeholder="Specialties, facilities..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div>
                <PhotoUpload
                  value={hospImage}
                  onChange={setHospImage}
                  label="Hospital Image Photo"
                  type="hospital"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Username *</label>
                  <input
                    type="text"
                    required
                    value={hospUsername}
                    onChange={e => setHospUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Password *</label>
                  <input
                    type="password"
                    required
                    value={hospPassword}
                    onChange={e => setHospPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-55 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="admin-add-hospital-btn"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-2xl shadow transition-all cursor-pointer mt-2"
              >
                Add Hospital to Network
              </button>
            </form>
          </div>

          {/* Hospitals List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <span>Hospital Registries</span>
                <span className="text-[10px] bg-red-100 text-red-800 font-black px-2 py-0.5 rounded-full uppercase">
                  {hospitals ? hospitals.length : 0} Total
                </span>
              </h2>

              {/* Status Tabs */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setHospStatusTab('pending')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hospStatusTab === 'pending'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pending ({hospitals.filter(h => h.approvalStatus === 'pending').length})
                </button>
                <button
                  type="button"
                  onClick={() => setHospStatusTab('approved')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hospStatusTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Approved ({hospitals.filter(h => h.approvalStatus === 'approved' || !h.approvalStatus).length})
                </button>
                <button
                  type="button"
                  onClick={() => setHospStatusTab('rejected')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    hospStatusTab === 'rejected'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rejected ({hospitals.filter(h => h.approvalStatus === 'rejected').length})
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {(() => {
                const filteredHospList = hospitals.filter(h => {
                  if (hospStatusTab === 'pending') return h.approvalStatus === 'pending';
                  if (hospStatusTab === 'rejected') return h.approvalStatus === 'rejected';
                  return h.approvalStatus === 'approved' || !h.approvalStatus;
                });

                if (filteredHospList.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium text-xs">
                      No clinical center records found in this category.
                    </div>
                  );
                }

                return filteredHospList.map(h => {
                  const registeredDoctors = doctors.filter(
                    d => d.hospitalId === h.id || d.hospital.toLowerCase() === h.name.toLowerCase()
                  );
                  const isActive = h.isActive !== false;

                  const handleToggleActive = () => {
                    editHospital({
                      ...h,
                      isActive: !isActive
                    });
                  };

                  const handleApprove = () => {
                    editHospital({
                      ...h,
                      approvalStatus: 'approved'
                    });
                  };

                  const handleReject = () => {
                    editHospital({
                      ...h,
                      approvalStatus: 'rejected'
                    });
                  };

                  return (
                    <div key={h.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 text-xs flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                        <div className="flex gap-3 items-start">
                          <img 
                            src={h.image} 
                            alt={h.name} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 mt-1"
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="font-extrabold text-sm text-slate-900">{h.name}</h4>
                              {h.approvalStatus === 'pending' && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">Pending Admin Approval</span>
                              )}
                              {h.approvalStatus === 'rejected' && (
                                <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Rejected</span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-blue-700">{h.address}</p>
                            <p className="text-[10px] text-slate-500">{h.bio}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-600 font-semibold pt-1">
                              <span>Phone: {h.phone}</span>
                              <span>•</span>
                              <span>Email: {h.email}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-medium pt-1">
                              <span>User: <strong className="text-slate-600 font-semibold">{h.username || 'N/A'}</strong></span>
                              <span>•</span>
                              <span>Pass: <strong className="text-slate-600 font-semibold">{h.password || 'N/A'}</strong></span>
                            </div>
                            <div className="pt-2">
                              <span className="bg-red-50 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                                {registeredDoctors.length} Specialists Registered
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end md:self-start shrink-0">
                          {h.approvalStatus === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={handleApprove}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={handleReject}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : h.approvalStatus === 'rejected' ? (
                            <button
                              type="button"
                              onClick={handleApprove}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={handleToggleActive}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-colors cursor-pointer ${
                                  isActive 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            id={`admin-delete-hospital-${h.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove hospital ${h.name}? This will remove their admin access but preserve doctors they added.`)) {
                                deleteHospital(h.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Hospital"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {(!h.approvalStatus || h.approvalStatus === 'approved') && (
                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className={`font-bold text-[10px] uppercase ${isActive ? 'text-emerald-700' : 'text-red-700'}`}>
                            {isActive ? 'Hospital Account Active' : 'HOSPITAL SUSPENDED BY ADMIN'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
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

              {/* Store Portal Credentials Section */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                <span className="font-extrabold text-amber-950 block text-[11px] uppercase tracking-wider">
                  🔑 Pharmacy/Lab Partner Credentials
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Store Username *</label>
                    <input
                      type="text"
                      id="admin-store-username"
                      value={storeUsername}
                      onChange={e => setStoreUsername(e.target.value)}
                      placeholder="e.g. medcentral"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Store Password *</label>
                    <input
                      type="text"
                      id="admin-store-password"
                      value={storePassword}
                      onChange={e => setStorePassword(e.target.value)}
                      placeholder="e.g. storePass123"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <PhotoUpload
                  value={storeImage}
                  onChange={setStoreImage}
                  label="Pharmacy/Lab Photo"
                  type="store"
                />
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
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                <span>Pharmacy & Lab Stores</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full uppercase">
                  {stores.length} Total
                </span>
              </h2>

              {/* Status Tabs */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setStoreStatusTab('pending')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    storeStatusTab === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pending ({stores.filter(s => s.approvalStatus === 'pending').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStoreStatusTab('approved')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    storeStatusTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Approved ({stores.filter(s => s.approvalStatus === 'approved' || !s.approvalStatus).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStoreStatusTab('rejected')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    storeStatusTab === 'rejected'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Rejected ({stores.filter(s => s.approvalStatus === 'rejected').length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(() => {
                const filteredStoresList = stores.filter(s => {
                  if (storeStatusTab === 'pending') return s.approvalStatus === 'pending';
                  if (storeStatusTab === 'rejected') return s.approvalStatus === 'rejected';
                  return s.approvalStatus === 'approved' || !s.approvalStatus;
                });

                if (filteredStoresList.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium text-xs">
                      No pharmacy or diagnostic labs found in this category.
                    </div>
                  );
                }

                return filteredStoresList.map(s => {
                  const isActive = s.isActive !== false;
                  const isEditingPassword = editingStoreId === s.id;

                  const handleToggleActive = () => {
                    editStore({
                      ...s,
                      isActive: !isActive
                    });
                  };

                  const handleSavePassword = () => {
                    if (!newStorePassword.trim()) return;
                    editStore({
                      ...s,
                      password: newStorePassword.trim()
                    });
                    setEditingStoreId(null);
                    setNewStorePassword('');
                  };

                  const handleApprove = () => {
                    editStore({
                      ...s,
                      approvalStatus: 'approved'
                    });
                  };

                  const handleReject = () => {
                    editStore({
                      ...s,
                      approvalStatus: 'rejected'
                    });
                  };

                  return (
                    <div key={s.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-sm">{s.name}</h4>
                            {s.approvalStatus === 'pending' && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">Pending Admin Approval</span>
                            )}
                            {s.approvalStatus === 'rejected' && (
                              <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Rejected</span>
                            )}
                          </div>
                          <p className="text-slate-500 mt-0.5">{s.address} • License: {s.licenseNumber}</p>
                          <p className="text-[10px] text-blue-700 font-semibold">Delivery Time: {s.deliveryTime || 'N/A'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400">User: <strong className="text-slate-600 font-semibold">{s.username || 'N/A'}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400">Pass: <strong className="text-slate-600 font-semibold">{s.password || 'N/A'}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {s.approvalStatus === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={handleApprove}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={handleReject}
                                className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : s.approvalStatus === 'rejected' ? (
                            <button
                              type="button"
                              onClick={handleApprove}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={handleToggleActive}
                                className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase border transition-colors cursor-pointer ${
                                  isActive 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              if (isEditingPassword) {
                                setEditingStoreId(null);
                              } else {
                                setEditingStoreId(s.id);
                                setNewStorePassword(s.password || '');
                              }
                            }}
                            className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                          >
                            Password
                          </button>
                        </div>
                      </div>

                      {(!s.approvalStatus || s.approvalStatus === 'approved') && (
                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className={`font-bold text-[10px] uppercase ${isActive ? 'text-emerald-700' : 'text-red-700'}`}>
                            {isActive ? 'Pharmacy Store Active' : 'DEACTIVATED BY ADMIN'}
                          </span>
                        </div>
                      )}

                      {isEditingPassword && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 mt-1">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">New Password</label>
                            <input
                              type="text"
                              value={newStorePassword}
                              onChange={e => setNewStorePassword(e.target.value)}
                              placeholder="Store password"
                              className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                            />
                          </div>
                          <div className="flex items-end gap-1 mt-4">
                            <button
                              onClick={handleSavePassword}
                              className="px-3 py-2 bg-amber-600 text-white hover:bg-amber-700 font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStoreId(null)}
                              className="px-2 py-2 bg-slate-200 hover:bg-slate-300 font-bold rounded-lg text-[10px] uppercase text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
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
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[11px] mt-2 block"
                  >
                    Assign Technician & Mark Collected
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Access & Security Settings */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Access & Portal Routing Controls</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Configure your administrator login username, credentials, and the custom url string that activates this admin interface.
              </p>
            </div>
          </div>

          {securitySuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-start gap-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p>Security configurations updated successfully!</p>
                <p className="font-medium text-emerald-700/80 mt-0.5">
                  New Admin credentials are now active. The portal can be unlocked via the secret hash: <span className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-bold">#{configSecretPath}</span>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            setSecuritySuccess(false);
            
            localStorage.setItem('admin_username', configUsername.trim());
            localStorage.setItem('admin_password', configPassword);
            localStorage.setItem('admin_secret_path', configSecretPath.trim());
            
            setSecuritySuccess(true);
            setTimeout(() => {
              setSecuritySuccess(false);
            }, 5000);
          }} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={configUsername}
                    onChange={e => setConfigUsername(e.target.value)}
                    placeholder="e.g. suailynkxadmin25"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showConfigPassword ? "text" : "password"}
                    required
                    value={configPassword}
                    onChange={e => setConfigPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-mono text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfigPassword(!showConfigPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfigPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold">
                Custom Secret Portal Path
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 font-mono text-slate-400 font-bold">#/</span>
                <input
                  type="text"
                  required
                  value={configSecretPath}
                  onChange={e => setConfigSecretPath(e.target.value)}
                  placeholder="admin-gate-suk2h2ai"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-mono font-bold text-red-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
                Type this exact value in your browser hash path to reveal the Admin Portal when logged out. For example, navigating to <code className="font-bold text-slate-600 bg-slate-100 px-1 py-0.5 rounded">#/your-secret-path</code> or <code className="font-bold text-slate-600 bg-slate-100 px-1 py-0.5 rounded">/your-secret-path</code> will immediately prompt authentication.
              </p>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl text-[11px] text-red-800 space-y-1">
              <span className="font-extrabold uppercase flex items-center gap-1.5 text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
                Critical Security Reminder
              </span>
              <p className="leading-relaxed font-medium">
                Once saved, current active and future login sessions will validate against these updated records. Please store these credentials and secret portal path safely.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Security Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 8: Laboratories Management */}
      {activeTab === 'labs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Laboratory Form */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-red-600" />
              Direct Add Diagnostic Lab
            </h2>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Manually register and instantly authorize a clinical diagnostic or imaging facility without the standard review queue.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              
              const name = formData.get('labName') as string;
              const licenseNumber = formData.get('labLicense') as string;
              const phone = formData.get('labPhone') as string;
              const address = formData.get('labAddress') as string;
              const username = formData.get('labUsername') as string;
              const password = formData.get('labPassword') as string;

              if (!name || !licenseNumber || !phone || !address || !username || !password) {
                alert('Please fill out all laboratory registration inputs.');
                return;
              }

              addLab({
                name,
                licenseNumber,
                phone,
                address,
                username: username.toLowerCase().trim(),
                password,
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
                isActive: true,
                approvalStatus: 'approved'
              });

              form.reset();
              alert('Laboratory registered and authorized successfully!');
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Center Name *</label>
                <input
                  name="labName"
                  type="text"
                  required
                  placeholder="e.g. Apex Diagnostics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Medical License ID *</label>
                <input
                  name="labLicense"
                  type="text"
                  required
                  placeholder="e.g. LAB-2026-9088"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Center Contact Phone *</label>
                <input
                  name="labPhone"
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 293-8099"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Facility Address *</label>
                <input
                  name="labAddress"
                  type="text"
                  required
                  placeholder="e.g. 708 Medical Ave, Plaza B"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Portal Username *</label>
                  <input
                    name="labUsername"
                    type="text"
                    required
                    placeholder="e.g. apex"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Secure Password *</label>
                  <input
                    name="labPassword"
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow transition-colors"
              >
                Create & Authorize Lab
              </button>
            </form>
          </div>

          {/* Manage Registered Laboratories */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              Registered Diagnostic Lab Partners ({labs ? labs.length : 0})
            </h2>

            <div className="space-y-4">
              {!labs || labs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                  <Beaker className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">No partner labs registered yet.</p>
                </div>
              ) : (
                labs.map(lab => {
                  const isApproved = lab.approvalStatus === 'approved';
                  
                  return (
                    <div key={lab.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={lab.image}
                          alt={lab.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200/60"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-xs text-slate-800">{lab.name}</h4>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {lab.approvalStatus || 'PENDING'}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-500 font-medium">
                            📍 {lab.address} | 📞 {lab.phone}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            License No: <span className="font-mono text-slate-600">{lab.licenseNumber}</span> | Username: <span className="text-slate-600 font-semibold">{lab.username}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        {!isApproved ? (
                          <button
                            onClick={() => {
                              editLab({ ...lab, approvalStatus: 'approved' });
                              alert(`${lab.name} approved successfully!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Approve Lab
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              editLab({ ...lab, approvalStatus: 'pending' });
                              alert(`${lab.name} access set to pending review.`);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Set Pending
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            if (confirm(`Are you absolutely sure you want to delete and permanently revoke access for ${lab.name}?`)) {
                              deleteLab(lab.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                          title="Revoke and Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab 9: User Feedbacks Management */}
      {activeTab === 'feedbacks' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & Stats Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
                AiLynkX Portal Feedback Core
              </span>
              <h1 className="text-2xl font-black text-white">
                User Feedbacks & Experience Insights
              </h1>
              <p className="text-slate-300 text-xs mt-1 max-w-xl">
                Review ratings, compliment details, suggestions, and user bug reports transmitted from the floating feedback trigger.
              </p>
            </div>
            
            {feedbacks.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete and wipe out all registered feedback logs from local storage? This action cannot be undone.")) {
                    localStorage.removeItem('aily_feedbacks');
                    setFeedbacks([]);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 self-end md:self-center shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Feedbacks
              </button>
            )}
          </div>

          {/* Stats Cards Section */}
          {feedbacks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">{feedbacks.length}</span>
                <span className="text-[10px] text-slate-500 font-medium">From patients & visitors</span>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Average Rating</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {(feedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / feedbacks.length).toFixed(1)}
                  </span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Out of 5.0 maximum</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bugs & Technical Issues</span>
                <span className="text-2xl font-black text-red-600 block mt-1">
                  {feedbacks.filter(f => f.category === 'Bug Report' || f.category === 'Technical Issue / Bug').length}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Need administrator review</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Compliments & Praise</span>
                <span className="text-2xl font-black text-emerald-600 block mt-1">
                  {feedbacks.filter(f => f.category === 'Compliment' || f.category === 'Compliment / Praise').length}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Highly rated experiences</span>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center text-xs justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Search user, email or content..."
                  value={fbSearchQuery}
                  onChange={(e) => setFbSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div>
                <select
                  value={fbCategoryFilter}
                  onChange={(e) => setFbCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-red-600 font-bold text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="Suggestion">Suggestions</option>
                  <option value="Compliment">Compliments</option>
                  <option value="Bug Report">Bug Reports</option>
                  <option value="Other">Other / General</option>
                </select>
              </div>

              <div>
                <select
                  value={fbRatingFilter}
                  onChange={(e) => setFbRatingFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-red-600 font-bold text-slate-700"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars or more</option>
                  <option value="3">3 Stars or more</option>
                  <option value="2">2 Stars or less</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-bold whitespace-nowrap self-end sm:self-auto">
              Showing {feedbacks.filter(f => {
                const matchesSearch = fbSearchQuery.trim() === '' || 
                  (f.name || '').toLowerCase().includes(fbSearchQuery.toLowerCase()) || 
                  (f.email || '').toLowerCase().includes(fbSearchQuery.toLowerCase()) || 
                  (f.message || '').toLowerCase().includes(fbSearchQuery.toLowerCase());
                
                let matchesCategory = true;
                if (fbCategoryFilter !== 'all') {
                  matchesCategory = (f.category || '').toLowerCase().includes(fbCategoryFilter.toLowerCase()) ||
                                    (f.category === 'Bug Report' && fbCategoryFilter === 'Bug Report');
                }

                let matchesRating = true;
                if (fbRatingFilter !== 'all') {
                  const r = f.rating || 5;
                  if (fbRatingFilter === '5') matchesRating = r === 5;
                  else if (fbRatingFilter === '4') matchesRating = r >= 4;
                  else if (fbRatingFilter === '3') matchesRating = r >= 3;
                  else if (fbRatingFilter === '2') matchesRating = r <= 2;
                }

                return matchesSearch && matchesCategory && matchesRating;
              }).length} of {feedbacks.length} items
            </div>
          </div>

          {/* Feedback list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.length === 0 ? (
              <div className="md:col-span-2 text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-4">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <Megaphone className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800">No Feedback Received Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    When visitors submit suggestions or technical issues from the floating feedback modal, they will immediately appear here.
                  </p>
                </div>
              </div>
            ) : (
              feedbacks.filter(f => {
                const matchesSearch = fbSearchQuery.trim() === '' || 
                  (f.name || '').toLowerCase().includes(fbSearchQuery.toLowerCase()) || 
                  (f.email || '').toLowerCase().includes(fbSearchQuery.toLowerCase()) || 
                  (f.message || '').toLowerCase().includes(fbSearchQuery.toLowerCase());
                
                let matchesCategory = true;
                if (fbCategoryFilter !== 'all') {
                  matchesCategory = (f.category || '').toLowerCase().includes(fbCategoryFilter.toLowerCase());
                }

                let matchesRating = true;
                if (fbRatingFilter !== 'all') {
                  const r = f.rating || 5;
                  if (fbRatingFilter === '5') matchesRating = r === 5;
                  else if (fbRatingFilter === '4') matchesRating = r >= 4;
                  else if (fbRatingFilter === '3') matchesRating = r >= 3;
                  else if (fbRatingFilter === '2') matchesRating = r <= 2;
                }

                return matchesSearch && matchesCategory && matchesRating;
              }).map((item, idx) => {
                const isBug = item.category === 'Bug Report' || item.category === 'Technical Issue / Bug';
                const isCompliment = item.category === 'Compliment' || item.category === 'Compliment / Praise';
                
                return (
                  <div 
                    key={item.id || idx} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-xs relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Rating & Category */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isBug 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : isCompliment 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {item.category || 'Suggestion'}
                        </span>
                        
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${
                                star <= (item.rating || 5)
                                  ? 'text-amber-500 fill-amber-500' 
                                  : 'text-slate-200'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Message Content */}
                      <p className="text-slate-700 text-xs leading-relaxed font-semibold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4 select-all">
                        "{item.message}"
                      </p>
                    </div>

                    {/* Sender details */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 text-[11px]">
                      <div className="space-y-0.5 text-left">
                        <h4 className="font-extrabold text-slate-800">{item.name || 'Anonymous User'}</h4>
                        <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline font-medium block">
                          {item.email || 'N/A'}
                        </a>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          ⏱️ {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (confirm("Dismiss and delete this feedback entry?")) {
                            const updated = feedbacks.filter((f, i) => (f.id ? f.id !== item.id : i !== idx));
                            localStorage.setItem('aily_feedbacks', JSON.stringify(updated));
                            setFeedbacks(updated);
                          }
                        }}
                        className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 rounded-xl transition-all cursor-pointer"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
