import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  PhoneCall, 
  AlertTriangle, 
  X, 
  Ambulance, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Zap,
  Radio
} from 'lucide-react';

export const SosQuickDialModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen } = useApp();
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [activeCallNumber, setActiveCallNumber] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (dispatching && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (dispatching && countdown === 0) {
      setDispatching(false);
      setDispatched(true);
    }
    return () => clearTimeout(timer);
  }, [dispatching, countdown]);

  if (!isSosModalOpen) return null;

  const handleTriggerGpsSos = () => {
    setDispatching(true);
    setDispatched(false);
    setCountdown(5);
  };

  const handleSimulateCall = (num: string, label: string) => {
    setActiveCallNumber(`${label} (${num})`);
    setTimeout(() => {
      // open tel link as backup
      window.location.href = `tel:${num.replace(/[^0-9+]/g, '')}`;
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border-2 border-red-500 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgent Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-red-700 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  24/7 SOS QUICK DIAL
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <h2 className="font-black text-lg text-white tracking-tight mt-0.5">
                Emergency Hotline & Ambulance
              </h2>
            </div>
          </div>

          <button
            id="close-sos-modal-btn"
            onClick={() => {
              setIsSosModalOpen(false);
              setDispatching(false);
              setDispatched(false);
              setActiveCallNumber(null);
            }}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            title="Close Emergency Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800">

          {/* Active Call Status Banner */}
          {activeCallNumber && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-xl flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-amber-600 animate-bounce" />
                <div>
                  <p className="text-xs font-bold">Initiating Quick Dial Call...</p>
                  <p className="text-sm font-black text-amber-950">{activeCallNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveCallNumber(null)} 
                className="text-xs bg-amber-200 hover:bg-amber-300 px-2 py-1 rounded font-bold"
              >
                End
              </button>
            </div>
          )}

          {/* Key Emergency Numbers Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Direct Emergency Helpline Numbers</span>
              <span className="text-red-600 font-bold text-[11px]">• One-Tap Calling</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Ambulance 102 / 108 */}
              <div className="bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-xl p-3.5 flex flex-col justify-between transition-all group shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-700 uppercase tracking-wide">
                      <Ambulance className="w-4 h-4 text-red-600" /> Ambulance
                    </span>
                    <span className="bg-red-200 text-red-800 text-[10px] font-black px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                  <p className="text-2xl font-black text-red-950 tracking-tight">102 | 108</p>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    24/7 Road & Medical Ambulance Dispatch
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href="tel:102"
                    onClick={() => handleSimulateCall('102', 'Ambulance')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call 102
                  </a>
                  <a
                    href="tel:108"
                    onClick={() => handleSimulateCall('108', 'Ambulance')}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call 108
                  </a>
                </div>
              </div>

              {/* Emergency Helpline 112 */}
              <div className="bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-3.5 flex flex-col justify-between transition-all group shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-800 uppercase tracking-wide">
                      <ShieldAlert className="w-4 h-4 text-blue-600" /> National Emergency
                    </span>
                    <span className="bg-blue-200 text-blue-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                      UNIFIED
                    </span>
                  </div>
                  <p className="text-2xl font-black text-blue-950 tracking-tight">112</p>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Unified Police, Fire & Medical Response
                  </p>
                </div>
                <a
                  href="tel:112"
                  onClick={() => handleSimulateCall('112', 'National Emergency')}
                  className="mt-3 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 w-full"
                >
                  <Phone className="w-3.5 h-3.5" /> Dial 112 Now
                </a>
              </div>

            </div>

            {/* Telehealth Helpline */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>24/7 Direct Telehealth Helpline</span>
                </div>
                <p className="text-base font-black text-slate-900 mt-0.5">+91 98355 52841</p>
                <p className="text-[10px] text-slate-500">ailynkxhealth@gmail.com • Ashok Nagar, Patna</p>
              </div>
              <a
                href="tel:+919835552841"
                onClick={() => handleSimulateCall('+91 98355 52841', 'Telehealth Helpline')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call
              </a>
            </div>

          </div>

          {/* GPS Location & Automatic Emergency Dispatch Section */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 relative overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                  Live GPS Trauma Dispatch
                </span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                GPS ACTIVE: 28.6139° N, 77.2090° E
              </span>
            </div>

            {!dispatching && !dispatched && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Need immediate ambulance dispatch to your current location? Tap the SOS dispatch button to transmit live GPS coordinates to nearest trauma unit.
                </p>
                <button
                  id="trigger-gps-sos-btn"
                  onClick={handleTriggerGpsSos}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 border border-red-500 active:scale-98 transition-all"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Broadcast GPS SOS Dispatch Request</span>
                </button>
              </div>
            )}

            {dispatching && (
              <div className="bg-red-950/80 border border-red-800 p-3 rounded-lg space-y-2 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 text-red-300 text-xs font-extrabold uppercase">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Transmitting GPS Signal to 102/108 Dispatchers...</span>
                </div>
                <div className="text-3xl font-black text-amber-300 font-mono">
                  00:0{countdown}
                </div>
                <p className="text-[11px] text-slate-300">
                  Transmitting coordinates to nearest ambulance unit...
                </p>
                <button
                  onClick={() => setDispatching(false)}
                  className="text-xs text-slate-400 underline font-semibold hover:text-white mt-1"
                >
                  Cancel SOS Broadcast
                </button>
              </div>
            )}

            {dispatched && (
              <div className="bg-emerald-950/90 border border-emerald-600 p-3 rounded-lg space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-black uppercase">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Ambulance Unit #108 En Route!</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium">
                  Driver: Technician Rajesh Sharma • Vehicle: Trauma Van 108-A
                </p>
                <p className="text-[11px] text-emerald-300 font-mono">
                  Estimated Arrival Time: <strong>5 - 8 Minutes</strong>
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>🚨 For immediate assistance, stay on the call</span>
          <button
            onClick={() => {
              setIsSosModalOpen(false);
              setDispatching(false);
              setDispatched(false);
              setActiveCallNumber(null);
            }}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
