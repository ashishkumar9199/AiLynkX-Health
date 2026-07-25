import React from 'react';
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
  const { portal, setPortal } = useApp();

  React.useEffect(() => {
    const checkSecretRoute = () => {
      const rawStoredPath = localStorage.getItem('admin_secret_path') || 'admin-gate-suk2h2ai';
      const cleanSecret = rawStoredPath.trim().toLowerCase().replace(/^#\/?/, '').replace(/^\//, '');
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const path = window.location.pathname.toLowerCase().replace(/^\//, '');

      if (
        hash === cleanSecret || 
        path === cleanSecret
      ) {
        setPortal('admin');
      }
    };

    // Run immediately on load
    checkSecretRoute();

    // Listen for hash changes & browser navigation history
    window.addEventListener('hashchange', checkSecretRoute);
    window.addEventListener('popstate', checkSecretRoute);

    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('popstate', checkSecretRoute);
    };
  }, [setPortal]);

  const renderActivePortal = () => {
    switch (portal) {
      case 'landing':
        return <LandingPortal />;
      case 'patient':
        return <PatientPortal />;
      case 'doctor':
        return <DoctorPortal />;
      case 'pharmacy':
        return <PharmacyPortal />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <LandingPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActivePortal()}
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
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
