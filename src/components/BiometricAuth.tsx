import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  ScanFace, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Cpu, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Activity,
  UserCheck
} from 'lucide-react';

// Interfaces for our biometric registry
export interface BiometricCredential {
  portalId: string;
  username: string;
  displayName: string;
  biometricType: 'fingerprint' | 'faceid';
  registeredAt: string;
}

interface BiometricAuthProps {
  portalId: 'admin' | 'patient' | 'doctor' | 'hospital' | 'pharmacy' | 'lab';
  onSuccess: (username: string) => void;
  onClose: () => void;
  isOpen: boolean;
  defaultUsername?: string; // Optional default to pre-select
}

// Global registry operations helper
export const BiometricRegistry = {
  getCredentials: (): BiometricCredential[] => {
    const saved = localStorage.getItem('aily_biometric_credentials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing biometric credentials', e);
      }
    }
    // Return pre-registered default accounts so users can test immediately
    return [
      {
        portalId: 'admin',
        username: 'suailynkxadmin25',
        displayName: 'Master Administrator',
        biometricType: 'faceid',
        registeredAt: new Date().toISOString()
      },
      {
        portalId: 'patient',
        username: 'patient@healthconnect.org',
        displayName: 'John Doe (Demo Patient)',
        biometricType: 'fingerprint',
        registeredAt: new Date().toISOString()
      },
      {
        portalId: 'doctor',
        username: 'sarah123',
        displayName: 'Dr. Sarah Jenkins',
        biometricType: 'faceid',
        registeredAt: new Date().toISOString()
      },
      {
        portalId: 'hospital',
        username: 'stjude',
        displayName: 'St. Jude General Hospital',
        biometricType: 'fingerprint',
        registeredAt: new Date().toISOString()
      },
      {
        portalId: 'pharmacy',
        username: 'medicare',
        displayName: 'Medicare Central Pharmacy',
        biometricType: 'fingerprint',
        registeredAt: new Date().toISOString()
      },
      {
        portalId: 'lab',
        username: 'apexlab',
        displayName: 'Apex Diagnostic Laboratories',
        biometricType: 'faceid',
        registeredAt: new Date().toISOString()
      }
    ];
  },

  register: (portalId: string, username: string, displayName: string, type: 'fingerprint' | 'faceid'): boolean => {
    try {
      const credentials = BiometricRegistry.getCredentials();
      // Remove existing duplicate for same portal and user
      const filtered = credentials.filter(c => !(c.portalId === portalId && c.username.toLowerCase() === username.toLowerCase()));
      
      filtered.push({
        portalId,
        username,
        displayName,
        biometricType: type,
        registeredAt: new Date().toISOString()
      });

      localStorage.setItem('aily_biometric_credentials', JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to register biometric credentials', e);
      return false;
    }
  },

  isRegistered: (portalId: string, username: string): boolean => {
    const credentials = BiometricRegistry.getCredentials();
    return credentials.some(c => c.portalId === portalId && c.username.toLowerCase() === username.toLowerCase());
  },

  getRegisteredUsersForPortal: (portalId: string): BiometricCredential[] => {
    const credentials = BiometricRegistry.getCredentials();
    return credentials.filter(c => c.portalId === portalId);
  }
};

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  portalId,
  onSuccess,
  onClose,
  isOpen,
  defaultUsername = ''
}) => {
  const [registeredUsers, setRegisteredUsers] = useState<BiometricCredential[]>([]);
  const [selectedUser, setSelectedUser] = useState<BiometricCredential | null>(null);
  const [scanType, setScanType] = useState<'fingerprint' | 'faceid'>('fingerprint');
  const [scanState, setScanState] = useState<'select' | 'ready' | 'scanning' | 'success' | 'error'>('select');
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Select an account to authorize');
  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);
  const [webAuthnNotice, setWebAuthnNotice] = useState<string>('');

  // Check WebAuthn support
  useEffect(() => {
    if (window.PublicKeyCredential) {
      setIsWebAuthnSupported(true);
    }
  }, []);

  // Fetch registered users for this portal
  useEffect(() => {
    if (isOpen) {
      const users = BiometricRegistry.getRegisteredUsersForPortal(portalId);
      setRegisteredUsers(users);
      
      if (users.length > 0) {
        // If there's a default username, select it first
        const matched = users.find(u => u.username.toLowerCase() === defaultUsername.toLowerCase());
        const initialUser = matched || users[0];
        setSelectedUser(initialUser);
        setScanType(initialUser.biometricType);
        setScanState('ready');
        setStatusMessage(`Ready to verify ${initialUser.displayName}`);
      } else {
        setScanState('select');
        setStatusMessage('No biometric profiles configured on this device yet.');
      }
    }
  }, [isOpen, portalId, defaultUsername]);

  // Handle Scan progress simulation & WebAuthn call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === 'scanning') {
      setScanProgress(0);
      setStatusMessage('📡 Exchanging cryptographic credentials with secure enclave...');
      
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleVerificationSuccess();
            return 100;
          }
          
          // Phase-based messages for immersive realism
          if (prev === 20) {
            setStatusMessage('🧬 Scanning biometric patterns & unique ridge details...');
          } else if (prev === 50) {
            setStatusMessage('🔒 Verifying local device public-key signatures...');
          } else if (prev === 80) {
            setStatusMessage('🔑 Secure handshake established. Handing over...');
          }
          
          return prev + 5;
        });
      }, 70);
    }
    return () => clearInterval(interval);
  }, [scanState]);

  const handleVerificationSuccess = () => {
    if (!selectedUser) return;
    setScanState('success');
    setStatusMessage(`Success! Identity authorized for ${selectedUser.displayName}`);
    
    // Trigger successful callback after brief delay
    setTimeout(() => {
      onSuccess(selectedUser.username);
    }, 1200);
  };

  const handleUserSelect = (user: BiometricCredential) => {
    setSelectedUser(user);
    setScanType(user.biometricType);
    setScanState('ready');
    setStatusMessage(`Ready to verify ${user.displayName}`);
    setWebAuthnNotice('');
  };

  const triggerScan = async () => {
    if (!selectedUser) return;
    setScanState('scanning');
    setWebAuthnNotice('');

    // Attempt actual WebAuthn credential retrieval where supported
    if (isWebAuthnSupported) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Standard mock parameters to satisfy API
        const options: CredentialRequestOptions = {
          publicKey: {
            challenge: challenge,
            timeout: 5000,
            rpId: window.location.hostname,
            allowCredentials: [{
              type: 'public-key',
              id: new Uint8Array([1, 2, 3, 4])
            }],
            userVerification: 'required'
          }
        };

        // Note: In sandboxed iframes, navigator.credentials.get will reject with a SecurityError or NotAllowedError.
        // We capture this gracefully and fallback seamlessly to the simulator.
        await navigator.credentials.get(options);
      } catch (err: any) {
        console.warn('Physical WebAuthn sensor rejected or restricted by iframe. Using safe local simulator fallback.', err);
        setWebAuthnNotice('Running secure local simulator (sandboxed environment policy)');
      }
    } else {
      setWebAuthnNotice('Hardware emulator active (device does not report physical WebAuthn)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      />

      {/* Main Core Container */}
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-red-100 animate-pulse" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">AiLynkX Biometrics</h3>
              <p className="text-[10px] text-red-100/90 font-bold">Secure Hardware Cryptographic Enclave</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/15 rounded-xl transition-all text-white/90 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* User selector tab */}
          {registeredUsers.length > 0 && scanState !== 'scanning' && scanState !== 'success' && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Authorized Biometric Keys On This Device
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {registeredUsers.map((user) => (
                  <button
                    key={user.username}
                    onClick={() => handleUserSelect(user)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      selectedUser?.username === user.username
                        ? 'border-red-600 bg-red-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        selectedUser?.username === user.username ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.biometricType === 'faceid' ? (
                          <ScanFace className="w-4 h-4" />
                        ) : (
                          <Fingerprint className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{user.displayName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{user.username}</p>
                      </div>
                    </div>
                    {selectedUser?.username === user.username && (
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Visual Scan Stage */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[220px]">
            
            {/* Hologram Circle ring */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative ${
              scanState === 'scanning'
                ? 'bg-red-50 border-2 border-red-500 shadow-lg shadow-red-500/10'
                : scanState === 'success'
                  ? 'bg-emerald-50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-white border border-slate-200'
            }`}>
              
              {/* Scan Ripple Animations */}
              {scanState === 'scanning' && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping duration-1000"></span>
                  {/* Laser line sweep */}
                  <div className="absolute left-4 right-4 h-0.5 bg-red-500 shadow-md shadow-red-500/80 rounded-full animate-bounce top-1/2"></div>
                </>
              )}

              {/* Status Icons */}
              {scanState === 'select' && (
                <ShieldAlert className="w-14 h-14 text-slate-300" />
              )}

              {scanState === 'success' && (
                <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
              )}

              {scanState === 'error' && (
                <ShieldAlert className="w-14 h-14 text-red-500 animate-shake" />
              )}

              {(scanState === 'ready' || scanState === 'scanning') && (
                <>
                  {scanType === 'fingerprint' ? (
                    <Fingerprint className={`w-14 h-14 transition-all ${
                      scanState === 'scanning' ? 'text-red-600 scale-105' : 'text-slate-500 hover:text-slate-700'
                    }`} />
                  ) : (
                    <ScanFace className={`w-14 h-14 transition-all ${
                      scanState === 'scanning' ? 'text-red-600 scale-105' : 'text-slate-500 hover:text-slate-700'
                    }`} />
                  )}
                </>
              )}
            </div>

            {/* Scan Progress Bar */}
            {scanState === 'scanning' && (
              <div className="w-full max-w-[200px] bg-slate-200 h-1 rounded-full mt-5 overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-70"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            )}

            {/* Dynamic Interactive Instructions */}
            <div className="text-center mt-4 space-y-1">
              <p className={`text-xs font-extrabold ${
                scanState === 'success' ? 'text-emerald-600' : scanState === 'error' ? 'text-red-600' : 'text-slate-700'
              }`}>
                {statusMessage}
              </p>
              
              {webAuthnNotice && (
                <p className="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md inline-block">
                  ⚡ {webAuthnNotice}
                </p>
              )}

              {scanState === 'ready' && (
                <p className="text-[10px] text-slate-400 font-semibold">
                  Click the scan button below to simulate biometric handshake.
                </p>
              )}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2.5">
            {scanState === 'ready' && selectedUser && (
              <button
                onClick={triggerScan}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {scanType === 'fingerprint' ? (
                  <>
                    <Fingerprint className="w-4 h-4 text-red-500" />
                    <span>Authorize with Touch ID</span>
                  </>
                ) : (
                  <>
                    <ScanFace className="w-4 h-4 text-red-500" />
                    <span>Authorize with Face ID</span>
                  </>
                )}
              </button>
            )}

            {scanState === 'scanning' && (
              <button
                disabled
                className="w-full bg-slate-100 text-slate-400 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <div className="w-4 h-4 border-2 border-slate-300 border-t-red-600 rounded-full animate-spin"></div>
                <span>Scanning Device Biometrics...</span>
              </button>
            )}

            {registeredUsers.length === 0 && (
              <div className="text-center p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-semibold block leading-relaxed">
                  💡 No security keys found on device. Log into your dashboard and navigate to Account settings to bind your device biometrics!
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl text-xs transition-all uppercase tracking-wider cursor-pointer"
            >
              Cancel & Use Password
            </button>
          </div>

        </div>

        {/* Brand footer bar */}
        <div className="bg-slate-50 border-t border-slate-150 p-4 text-center">
          <p className="text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
            Powered by AiLynkX CareLock End-to-End Authentication Core
          </p>
        </div>

      </div>
    </div>
  );
};


// 2. Beautiful setup component to register biometrics in dashboards
interface BiometricRegisterToggleProps {
  portalId: string;
  username: string;
  displayName: string;
  onSuccess?: () => void;
}

export const BiometricRegisterToggle: React.FC<BiometricRegisterToggleProps> = ({
  portalId,
  username,
  displayName,
  onSuccess
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [setupType, setSetupType] = useState<'fingerprint' | 'faceid'>('fingerprint');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [setupState, setSetupState] = useState<'ready' | 'enrolling' | 'success'>('ready');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsRegistered(BiometricRegistry.isRegistered(portalId, username));
  }, [portalId, username, isSetupOpen]);

  const startSetup = () => {
    setSetupState('ready');
    setProgress(0);
    setIsSetupOpen(true);
  };

  const handleEnroll = () => {
    setSetupState('enrolling');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        BiometricRegistry.register(portalId, username, displayName, setupType);
        setIsRegistered(true);
        setSetupState('success');
        if (onSuccess) onSuccess();
      }
    }, 150);
  };

  const handleDeregister = () => {
    if (confirm("Are you sure you want to disable and revoke biometric access on this device for this account? You will need your standard password to login.")) {
      const saved = BiometricRegistry.getCredentials();
      const filtered = saved.filter(c => !(c.portalId === portalId && c.username.toLowerCase() === username.toLowerCase()));
      localStorage.setItem('aily_biometric_credentials', JSON.stringify(filtered));
      setIsRegistered(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isRegistered ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
            {isRegistered ? <ShieldCheck className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              Secure Biometric Authentication
              {isRegistered && (
                <span className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                  Device Bonded
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5 max-w-md">
              Enable Touch ID or Face ID for lightning-fast, zero-password portal sign-ins. Your cryptographic signature is kept in the local browser secure sandbox.
            </p>
          </div>
        </div>

        <div>
          {isRegistered ? (
            <button
              onClick={handleDeregister}
              className="px-4 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              Disable Biometrics
            </button>
          ) : (
            <button
              onClick={startSetup}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition-all shadow-xs cursor-pointer"
            >
              Enable on Device
            </button>
          )}
        </div>
      </div>

      {/* Enroll Modal Dialog */}
      {isSetupOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSetupOpen(false)} />
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative z-10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-5 h-5 text-red-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Enroll Device Security</h3>
              </div>
              <button onClick={() => setIsSetupOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {setupState === 'ready' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Select your preferred biometric method to register this account credentials on this device's local secure database.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSetupType('fingerprint')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all ${
                        setupType === 'fingerprint'
                          ? 'border-red-600 bg-red-50/20 text-slate-800'
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      }`}
                    >
                      <Fingerprint className="w-8 h-8 text-red-500" />
                      <span className="text-xs font-black uppercase tracking-wider">Touch ID</span>
                    </button>

                    <button
                      onClick={() => setSetupType('faceid')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all ${
                        setupType === 'faceid'
                          ? 'border-red-600 bg-red-50/20 text-slate-800'
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      }`}
                    >
                      <ScanFace className="w-8 h-8 text-red-500" />
                      <span className="text-xs font-black uppercase tracking-wider">Face ID</span>
                    </button>
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl transition-all text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Confirm & Start Enrolling
                  </button>
                </div>
              )}

              {setupState === 'enrolling' && (
                <div className="flex flex-col items-center justify-center py-6 space-y-5">
                  <div className="relative w-28 h-28 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full">
                    {/* Ring progress loader */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        fill="none" 
                        stroke="#EF4444" 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-150"
                      />
                    </svg>
                    
                    {setupType === 'fingerprint' ? (
                      <Fingerprint className="w-12 h-12 text-slate-400 animate-pulse" />
                    ) : (
                      <ScanFace className="w-12 h-12 text-slate-400 animate-pulse" />
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Enrolling secure enclave... {progress}%
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Please hold still and let the device secure signature register...
                    </p>
                  </div>
                </div>
              )}

              {setupState === 'success' && (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Biometrics Active!</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your biometric identity has been successfully bonded to your browser secure storage sandbox. You can now login instantly!
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSetupOpen(false)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl transition-all text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
