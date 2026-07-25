import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIPrescriptionAnalyzer } from '../components/AIPrescriptionAnalyzer';
import { DoctorCard } from '../components/DoctorCard';
import { AppointmentBookingModal } from '../components/AppointmentBookingModal';
import { HomeSampleCollectionModal } from '../components/HomeSampleCollectionModal';
import { Chatbot } from '../components/Chatbot';
import { Doctor } from '../types';
import { 
  Stethoscope, 
  Sparkles, 
  TestTube2, 
  Pill, 
  PhoneCall, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  Activity
} from 'lucide-react';

export const LandingPortal: React.FC = () => {
  const { doctors, stores, medicines, setPortal, t, setActiveBookingDoctor, activeBookingDoctor } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<'all' | 'video' | 'clinic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Filter Doctors (added by admin)
  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesMode = selectedMode === 'all' || doc.consultationModes.includes(selectedMode);
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesMode && matchesSearch;
  });

  const specialtiesList = ['All', 'Cardiologist', 'Internal Medicine & Diabetology', 'Dermatologist & Cosmetologist', 'Orthopedic Specialist', 'Pediatrician & Child Health'];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-blue-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-12 space-y-6">
            


            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-book-doctor-btn"
                onClick={() => {
                  const elem = document.getElementById('doctors-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{t('consultDoctors')}</span>
              </button>

              <button
                id="hero-ai-analyzer-btn"
                onClick={() => {
                  const elem = document.getElementById('prescription-analyzer-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-blue-950 hover:bg-blue-50 font-extrabold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 text-sm border border-blue-200"
              >
                <Sparkles className="w-5 h-5 text-red-600" />
                <span>{t('prescriptionAnalyzer')}</span>
              </button>
            </div>

            {/* Key Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-blue-700/60 max-w-lg text-xs">
              <div>
                <span className="block text-xl font-extrabold text-white">100%</span>
                <span className="text-blue-200 text-[11px]">Verified Doctors</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">24/7</span>
                <span className="text-blue-200 text-[11px]">Video Consults</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">Home</span>
                <span className="text-blue-200 text-[11px]">Sample Pickup</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <button
          id="quick-action-book"
          onClick={() => {
            const elem = document.getElementById('doctors-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
            {t('bookAppointment')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Video Call or Clinic Visit
          </p>
        </button>

        <button
          id="quick-action-analyzer"
          onClick={() => {
            const elem = document.getElementById('prescription-analyzer-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-red-500 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-red-700">
            {t('prescriptionAnalyzer')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            AI record & PDF scanner
          </p>
        </button>

        <button
          id="quick-action-sample"
          onClick={() => setIsSampleModalOpen(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TestTube2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700">
            {t('homeSample')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Doorstep phlebotomist
          </p>
        </button>

        <button
          id="quick-action-pharmacy"
          onClick={() => setPortal('pharmacy')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-700">
            {t('orderMedicines')}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            From admin stores
          </p>
        </button>

      </section>

      {/* AI Prescription Analyzer Component */}
      <AIPrescriptionAnalyzer />

      {/* Doctors Section (Added by Admin) */}
      <section id="doctors-section" className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-600 block mb-1">
              Verified Medical Panel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              {t('doctorsTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('doctorsSubtitle')}
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                id="search-doctors-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search doctor or specialty..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                id="filter-mode-all"
                onClick={() => setSelectedMode('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                All Modes
              </button>
              <button
                id="filter-mode-video"
                onClick={() => setSelectedMode('video')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'video' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Video Call
              </button>
              <button
                id="filter-mode-clinic"
                onClick={() => setSelectedMode('clinic')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'clinic' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Clinic Visit
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => setActiveBookingDoctor(doctor)}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-700 font-bold text-sm">
              No doctors found matching criteria.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Admin can add new doctor profiles anytime in the Admin Portal!
            </p>
          </div>
        )}
      </section>

      {/* Home Sample Collection Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <TestTube2 className="w-3.5 h-3.5 text-yellow-300" />
            Lab Test at Doorstep
          </div>
          <h3 className="text-2xl font-black text-white">
            Apply for Home Sample Collection
          </h3>
          <p className="text-emerald-100 text-xs leading-relaxed">
            Certified phlebotomist will visit your home for blood & urine sample collection. Reports uploaded to your Patient Dashboard within 24 hours.
          </p>
        </div>

        <button
          id="request-home-sample-banner-btn"
          onClick={() => setIsSampleModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all shrink-0 text-sm"
        >
          Apply for Home Collection
        </button>
      </section>

      {/* Modals */}
      {activeBookingDoctor && (
        <AppointmentBookingModal
          doctor={activeBookingDoctor}
          onClose={() => setActiveBookingDoctor(null)}
        />
      )}

      {isSampleModalOpen && (
        <HomeSampleCollectionModal
          onClose={() => setIsSampleModalOpen(false)}
        />
      )}

      {/* Floating Medical Chatbot */}
      <Chatbot />

    </div>
  );
};

export const DoctorCardComponent = DoctorCard;
