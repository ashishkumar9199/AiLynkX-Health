import React from 'react';
import { Doctor } from '../types';
import { 
  Star, 
  Video, 
  Building2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Languages 
} from 'lucide-react';

interface Props {
  doctor: Doctor;
  onBook: () => void;
}

export const DoctorCard: React.FC<Props> = ({ doctor, onBook }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group relative">
      
      {/* Top Header */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img 
            src={doctor.avatar} 
            alt={doctor.name} 
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform" 
          />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Doctor Online Now"></span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{doctor.rating.toFixed(1)}</span>
            <span className="text-slate-400 text-[10px] font-normal">({doctor.reviewCount})</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate">
            {doctor.name}
          </h3>

          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider text-[11px] truncate">
            {doctor.specialty}
          </p>

          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
            {doctor.qualifications}
          </p>
        </div>
      </div>

      {/* Info Details */}
      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate text-xs font-medium">{doctor.hospital}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-medium">{doctor.experienceYears} Years Exp</span>
        </div>

        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate text-[11px] text-slate-500">{doctor.languages.join(', ')}</span>
        </div>
      </div>

      {/* Modes & Fee */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {doctor.consultationModes.includes('video') && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              <Video className="w-3 h-3" /> Video
            </span>
          )}
          {doctor.consultationModes.includes('clinic') && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
              <Building2 className="w-3 h-3" /> Visit
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Fee</span>
          <span className="text-base font-black text-blue-900">${doctor.fee}</span>
        </div>
      </div>

      {/* Book Button */}
      <button
        id={`book-doctor-btn-${doctor.id}`}
        onClick={onBook}
        className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span>Book Appointment</span>
      </button>

    </div>
  );
};
