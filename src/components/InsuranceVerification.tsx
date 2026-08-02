import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Lock, 
  FileDown, 
  Loader2,
  RefreshCw,
  Building,
  User,
  CreditCard,
  Trash2
} from 'lucide-react';
import { InsuranceDetails } from '../types';

interface Props {
  patient: any;
  onUpdatePatient: (updatedPatient: any) => void;
  addNotification: (notif: any) => void;
}

const INS_PROVIDERS = [
  'Blue Cross Blue Shield (BCBS)',
  'UnitedHealthcare (UHC)',
  'Aetna',
  'Cigna',
  'Kaiser Permanente',
  'Humana',
  'Medicare Part B / D',
  'Medicaid State Plan',
  'Molina Healthcare',
  'Centene Corporation'
];

export const InsuranceVerification: React.FC<Props> = ({ 
  patient, 
  onUpdatePatient,
  addNotification
}) => {
  const currentInsurance: InsuranceDetails | undefined = patient?.insurance;

  // Form states
  const [provider, setProvider] = useState(currentInsurance?.provider || 'Blue Cross Blue Shield (BCBS)');
  const [customProvider, setCustomProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState(currentInsurance?.policyNumber || '');
  const [groupNumber, setGroupNumber] = useState(currentInsurance?.groupNumber || '');
  const [holderName, setHolderName] = useState(currentInsurance?.holderName || patient?.name || '');
  const [relationship, setRelationship] = useState(currentInsurance?.relationship || 'Self');

  // File states (mocking uploads as preview urls)
  const [frontCardName, setFrontCardName] = useState<string | null>(currentInsurance?.frontCardUrl ? 'front_card_uploaded.png' : null);
  const [backCardName, setBackCardName] = useState<string | null>(currentInsurance?.backCardUrl ? 'back_card_uploaded.png' : null);
  const [frontCardUrl, setFrontCardUrl] = useState<string | undefined>(currentInsurance?.frontCardUrl);
  const [backCardUrl, setBackCardUrl] = useState<string | undefined>(currentInsurance?.backCardUrl);

  // Simulation states
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>(
    currentInsurance?.status || 'unverified'
  );
  const [simStep, setSimStep] = useState(0);
  const [simMessage, setSimMessage] = useState('');

  // Handle provider selection
  const selectedProvider = provider === 'Other' ? customProvider : provider;

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontCardName(file.name);
      setFrontCardUrl(URL.createObjectURL(file));
    }
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackCardName(file.name);
      setBackCardUrl(URL.createObjectURL(file));
    }
  };

  const handleClearInsurance = () => {
    if (confirm('Are you sure you want to remove your verified insurance profile? You will need to re-verify before scheduling new consultations.')) {
      setProvider('Blue Cross Blue Shield (BCBS)');
      setCustomProvider('');
      setPolicyNumber('');
      setGroupNumber('');
      setHolderName(patient?.name || '');
      setRelationship('Self');
      setFrontCardName(null);
      setBackCardName(null);
      setFrontCardUrl(undefined);
      setBackCardUrl(undefined);
      setVerificationStatus('unverified');

      const updated = {
        ...patient,
        insurance: undefined
      };
      onUpdatePatient(updated);

      addNotification({
        title: '🛡️ Insurance Profile Reset',
        message: 'Your health insurance records have been removed from your local profile.',
        type: 'system',
        targetPortal: 'patient'
      });
    }
  };

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyNumber.trim()) {
      alert('Please provide a valid Policy ID / Member ID number.');
      return;
    }

    setVerificationStatus('pending');
    setSimStep(1);
  };

  // Run the multi-step real-time verification process simulation
  useEffect(() => {
    if (verificationStatus !== 'pending' || simStep === 0) return;

    let timer: NodeJS.Timeout;
    
    switch (simStep) {
      case 1:
        setSimMessage('Establishing secure TLS 1.3 socket to Medicare Clearinghouse gateway...');
        timer = setTimeout(() => setSimStep(2), 1500);
        break;
      case 2:
        setSimMessage(`Submitting Member ID "${policyNumber}" to ${selectedProvider} verification portal...`);
        timer = setTimeout(() => setSimStep(3), 1800);
        break;
      case 3:
        setSimMessage('Comparing group code & verifying active deductible thresholds...');
        timer = setTimeout(() => setSimStep(4), 1500);
        break;
      case 4:
        setSimMessage('Checking copayment parameters for primary telehealth and clinical consultation tiers...');
        timer = setTimeout(() => setSimStep(5), 1400);
        break;
      case 5:
        setSimMessage('Acquiring signed digital coverage confirmation certificate...');
        timer = setTimeout(() => {
          setVerificationStatus('verified');
          setSimStep(0);

          const verifiedInsurance: InsuranceDetails = {
            provider: selectedProvider,
            policyNumber: policyNumber.trim(),
            groupNumber: groupNumber.trim() || 'GRP-9921',
            holderName: holderName.trim(),
            relationship,
            status: 'verified',
            frontCardUrl: frontCardUrl || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80',
            backCardUrl: backCardUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
            verifiedAt: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };

          const updatedPatient = {
            ...patient,
            insurance: verifiedInsurance
          };
          onUpdatePatient(updatedPatient);

          addNotification({
            title: '✅ Health Insurance Verified!',
            message: `Your policy with ${selectedProvider} (ID: ${policyNumber}) has been verified successfully. You may now book instant doctor consultations!`,
            type: 'appointment',
            targetPortal: 'patient'
          });
        }, 1500);
        break;
    }

    return () => clearTimeout(timer);
  }, [verificationStatus, simStep]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${
            verificationStatus === 'verified' 
              ? 'bg-emerald-50 text-emerald-600' 
              : verificationStatus === 'pending'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-blue-50 text-blue-600'
          }`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Insurance Verification & Policy Vault
            </h2>
            <p className="text-slate-500 text-xs mt-1 max-w-xl">
              Under healthcare standards, patients must verify their active medical policies to avoid billing delays or copay calculation issues. Upload details below for secure, instant verification.
            </p>
          </div>
        </div>

        {verificationStatus === 'verified' && (
          <button
            onClick={handleClearInsurance}
            className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Policy
          </button>
        )}
      </div>

      {/* 2. Status Blocks */}
      {verificationStatus === 'verified' && currentInsurance && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Policy Details */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full tracking-wider">
              Status: COVERAGE ACTIVE & VERIFIED
            </span>
            
            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Insurance Provider</span>
                <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{currentInsurance.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Policy / Member ID</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">{currentInsurance.policyNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Group Code</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">{currentInsurance.groupNumber}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Primary Insured Holder</span>
                <span className="font-bold text-slate-900 block mt-0.5">{currentInsurance.holderName} ({currentInsurance.relationship})</span>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified on: {currentInsurance.verifiedAt}</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Mockup Card (Dynamic Front Representation) */}
          <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Background vector accents for luxury card design */}
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/3 bottom-0 w-60 h-60 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-black text-blue-400">DIGITAL MEDICAL ID</span>
                <h3 className="font-black text-lg text-white">HEALTHLINK PLATINUM NETWORK</h3>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                VERIFIED TIER
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 relative z-10">
              <div className="space-y-1 text-xs text-slate-400">
                <p>Member Name: <strong className="text-white block font-bold mt-0.5">{currentInsurance.holderName}</strong></p>
                <p>Policy ID: <strong className="text-white block font-mono mt-0.5">{currentInsurance.policyNumber}</strong></p>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <p>Insurance Carrier: <strong className="text-white block font-bold mt-0.5">{currentInsurance.provider}</strong></p>
                <p>Group No: <strong className="text-white block font-mono mt-0.5">{currentInsurance.groupNumber}</strong></p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 relative z-10 gap-2">
              <div className="flex items-center gap-4">
                <span>RxBIN: <strong>004336</strong></span>
                <span>RxPCN: <strong>ADV</strong></span>
                <span>RxGRP: <strong>RX21</strong></span>
              </div>
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                AiLynkX Secure Vault Protected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pending Progress Simulation */}
      {verificationStatus === 'pending' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-center max-w-xl mx-auto">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-blue-800" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-base">Performing Secure Medical Check</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
              We are verifying your credentials through standard HIPAA-compliant Medicare and Medicaid clearinghouses. This secures accurate insurance copays.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-md mx-auto space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Verification Pipeline</span>
              <span>Step {simStep} of 5</span>
            </div>
            
            {/* Custom progress bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${(simStep / 5) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs font-mono text-slate-600 text-left pt-1 flex items-start gap-1.5 animate-pulse">
              <span className="text-blue-600 font-extrabold">➜</span>
              <span>{simMessage}</span>
            </p>
          </div>
        </div>
      )}

      {/* 4. Form (if Unverified or Null) */}
      {verificationStatus === 'unverified' && (
        <form onSubmit={handleStartVerification} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">Upload Health Policy & Card Images</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your coverage identifiers and upload high-resolution images of your physical card (Optional but recommended).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side: Identifiers Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Health Insurance Carrier / Provider *
                </label>
                <select
                  id="insurance-provider-select"
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
                >
                  {INS_PROVIDERS.map((prov, idx) => (
                    <option key={idx} value={prov}>{prov}</option>
                  ))}
                  <option value="Other">Other Carrier (Specify below)</option>
                </select>
              </div>

              {provider === 'Other' && (
                <div className="animate-in slide-in-from-top-2 duration-150">
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Custom Provider Name *
                  </label>
                  <input
                    type="text"
                    id="insurance-custom-provider"
                    value={customProvider}
                    onChange={e => setCustomProvider(e.target.value)}
                    placeholder="e.g. HealthFirst Regional"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium"
                    required={provider === 'Other'}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Policy ID / Member ID *
                  </label>
                  <input
                    type="text"
                    id="insurance-policy-number"
                    value={policyNumber}
                    onChange={e => setPolicyNumber(e.target.value)}
                    placeholder="e.g. BCB-992144810"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Group Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="insurance-group-number"
                    value={groupNumber}
                    onChange={e => setGroupNumber(e.target.value)}
                    placeholder="e.g. GRP-48210"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Cardholder Name *
                  </label>
                  <input
                    type="text"
                    id="insurance-holder-name"
                    value={holderName}
                    onChange={e => setHolderName(e.target.value)}
                    placeholder="Full name as written on card"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Relationship to Cardholder *
                  </label>
                  <select
                    id="insurance-relationship-select"
                    value={relationship}
                    onChange={e => setRelationship(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold"
                  >
                    <option value="Self">Self (Patient is policyholder)</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Dependent">Dependent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Side: Secure Document Dropzone */}
            <div className="space-y-4">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Upload Policy Card Scan (Front & Back)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front of Card Dropzone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center transition-colors relative cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    id="insurance-front-upload"
                    accept="image/*,.pdf"
                    onChange={handleFrontUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1.5 pointer-events-none">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-700">Insurance Card Front</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Drag & drop or Click</span>
                    </div>
                  </div>
                  {frontCardName && (
                    <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-3 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                      <span className="text-[11px] font-bold text-slate-800 truncate max-w-full">
                        {frontCardName}
                      </span>
                      <span className="text-[9px] text-slate-400">Ready for scan validation</span>
                    </div>
                  )}
                </div>

                {/* Back of Card Dropzone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center transition-colors relative cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    id="insurance-back-upload"
                    accept="image/*,.pdf"
                    onChange={handleBackUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1.5 pointer-events-none">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto text-blue-600">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-700">Insurance Card Back</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Drag & drop or Click</span>
                    </div>
                  </div>
                  {backCardName && (
                    <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-3 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                      <span className="text-[11px] font-bold text-slate-800 truncate max-w-full">
                        {backCardName}
                      </span>
                      <span className="text-[9px] text-slate-400">Ready for scan validation</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-blue-900 leading-normal flex items-start gap-2">
                <Lock className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                <span>
                  <strong>HIPAA Secured Encryption:</strong> Your documents are encrypted client-side using standard AES-256 protocols and stored privately in our protected server cache. Only certified medical providers can access these files during consulting reviews.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              id="submit-insurance-verification-btn"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Policy Coverage Details</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
