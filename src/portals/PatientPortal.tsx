import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/VideoCallModal';
import { Appointment } from '../types';
import { 
  Calendar, 
  Video, 
  Building2, 
  FileText, 
  TestTube2, 
  Package, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Download,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  User
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { 
    appointments, 
    sampleRequests, 
    orders, 
    uploadedDocs, 
    uploadDocument, 
    startVideoCall, 
    activeVideoCall, 
    endVideoCall,
    setPortal,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'documents' | 'samples' | 'orders'>('appointments');
  const [docUploadModal, setDocUploadModal] = useState(false);

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'prescription' | 'lab_report' | 'test_pdf'>('prescription');

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    uploadDocument({
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      fileType: docType,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '1.8 MB'
    });

    setDocName('');
    setDocUploadModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to Your Health Dashboard
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your scheduled video consultations, view uploaded medical records, track home sample collection, and follow medicine deliveries.
          </p>
        </div>

        <button
          id="patient-dashboard-book-btn"
          onClick={() => setPortal('landing')}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold gap-1">
        <button
          id="tab-appointments"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'appointments' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Appointments ({appointments.length})
        </button>

        <button
          id="tab-documents"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'documents' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Medical PDFs & Reports ({uploadedDocs.length})
        </button>

        <button
          id="tab-samples"
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'samples' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          Home Lab Samples ({sampleRequests.length})
        </button>

        <button
          id="tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Medicine Orders ({orders.length})
        </button>
      </div>

      {/* Tab Content 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Your Appointments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div key={apt.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    apt.mode === 'video' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {apt.mode === 'video' ? '🎥 Video Consultation' : '🏥 Clinic Visit'}
                  </span>
                  
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{apt.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={apt.doctorAvatar} 
                    alt={apt.doctorName} 
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold">
                      {apt.doctorSpecialty}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>

                {apt.symptoms && (
                  <p className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Reason:</strong> {apt.symptoms}
                  </p>
                )}

                {/* Video Call Trigger Action */}
                {apt.mode === 'video' && (
                  <button
                    id={`join-video-call-btn-${apt.id}`}
                    onClick={() => startVideoCall(apt)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Call Now</span>
                  </button>
                )}

                {apt.ePrescription && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium">
                    <p className="font-bold text-emerald-950 mb-1">✓ Digital E-Prescription Issued</p>
                    <p className="font-mono text-[11px] whitespace-pre-wrap text-emerald-800">
                      {apt.ePrescription}
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Medical PDFs & Reports */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Uploaded Prescriptions & Test PDFs
            </h2>
            <button
              id="upload-new-pdf-btn"
              onClick={() => setDocUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload New PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedDocs.map(doc => (
              <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.size}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Uploaded: {doc.uploadDate}
                  </p>
                </div>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> View / Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Home Lab Samples */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Home Sample Collection Tracking
          </h2>

          <div className="space-y-3">
            {sampleRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium text-sm">No active home sample collection requests.</p>
                <button
                  onClick={() => setPortal('landing')}
                  className="mt-2 text-xs font-bold text-blue-600 underline"
                >
                  Apply for Home Sample Collection on Landing Page
                </button>
              </div>
            ) : (
              sampleRequests.map(req => {
                const isPending = req.status === 'pending';
                const isAssigned = req.status === 'technician-assigned';
                const isCollected = req.status === 'sample-collected';
                const isReady = req.status === 'report-ready';
                
                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-900">
                        Request #{req.id}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        isPending ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        isAssigned ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        isCollected ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {req.status.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      Tests: {req.selectedTests.join(', ')}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p>📅 Date: {req.preferredDate} ({req.preferredTime})</p>
                      <p>📍 Address: {req.patientAddress}</p>
                    </div>

                    {/* Dispatch Phlebotomist details */}
                    {(req.technicianName || req.technicianPhone) && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60 text-xs text-slate-700">
                        <p className="font-bold text-blue-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>Assigned Phlebotomist / Technician</span>
                        </p>
                        <p className="mt-1 font-medium">
                          Name: <span className="font-bold text-slate-800">{req.technicianName}</span> | 
                          Contact: <span className="font-bold text-slate-800">{req.technicianPhone}</span>
                        </p>
                      </div>
                    )}

                    {/* Report PDF Display */}
                    {isReady && req.reportPdfUrl && (
                      <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/50 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide block">Test Results Published</span>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                              <FileText className="w-4 h-4 text-emerald-600" />
                              {req.reportPdfName}
                            </span>
                          </div>
                          
                          <a
                            href={req.reportPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download PDF</span>
                          </a>
                        </div>
                        
                        {req.reportComments && (
                          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-slate-600">
                            <span className="font-bold text-emerald-900 block text-[10px] uppercase mb-0.5">Clinical observations particularly:</span>
                            <p className="whitespace-pre-line font-medium leading-relaxed">{req.reportComments}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Medicine Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Medicine Orders History
          </h2>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium text-sm">No medicine orders placed yet.</p>
                <button
                  onClick={() => setPortal('pharmacy')}
                  className="mt-2 text-xs font-bold text-blue-600 underline"
                >
                  Browse Pharmacy Store to order medicines
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-900">
                      Order #{order.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-700">
                    {order.items.map((item, i) => (
                      <p key={i} className="flex justify-between">
                        <span>{item.medicine.name} x {item.quantity}</span>
                        <span className="font-bold">${(item.medicine.price * item.quantity).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-black text-blue-950 text-sm">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Doc Upload Modal */}
      {docUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900">Upload Medical Document / PDF</h3>
            <form onSubmit={handleUploadNewDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Title</label>
                <input
                  type="text"
                  id="new-doc-title-input"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Allergy_Blood_Test_2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
                <select
                  id="new-doc-type-select"
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="prescription">Doctor Prescription</option>
                  <option value="lab_report">Lab Test Report</option>
                  <option value="test_pdf">Medical History PDF</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-new-doc-btn"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
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
