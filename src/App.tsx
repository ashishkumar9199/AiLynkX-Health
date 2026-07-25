import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PortalSwitcherDrawer } from './components/PortalSwitcherDrawer';
import { NotificationCenter } from './components/NotificationCenter';
import { SosQuickDialModal } from './components/SosQuickDialModal';
import { Footer } from './components/Footer';
import { FeedbackToggle } from './components/FeedbackToggle';

// Portals
import { LandingPortal } from './portals/LandingPortal';
import { PatientPortal } from './portals/PatientPortal';
import { DoctorPortal } from './portals/DoctorPortal';
import { PharmacyPortal } from './portals/PharmacyPortal';
import { AdminPortal } from './portals/AdminPortal';

function MainAppContent() {
  const { setPortal } = useApp();
  const location = useLocation();

  // Retrieve the secret path (useful if custom configured by admin)
  const secretRoute = (localStorage.getItem('admin_secret_path') || 'admin-gate-suk2h2ai')
    .trim()
    .toLowerCase()
    .replace(/^#\/?/, '')
    .replace(/^\//, '');

  const isSecretMatch = location.pathname.toLowerCase().replace(/^\//, '') === secretRoute;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<LandingPortal />} />
          <Route path="/landing" element={<LandingPortal />} />
          <Route path="/patient" element={<PatientPortal />} />
          <Route path="/doctor" element={<DoctorPortal />} />
          <Route path="/pharmacy" element={<PharmacyPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          
          {/* Secret dynamic gateway to Admin portal */}
          {isSecretMatch && (
            <Route path={`/${secretRoute}`} element={<AdminPortal />} />
          )}

          {/* Catch-all fallback redirects back to the main medical landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Drawers & Modals */}
      <PortalSwitcherDrawer />
      <NotificationCenter />
      <SosQuickDialModal />

      {/* Floating Feedback & Suggestions Panel */}
      <FeedbackToggle />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
