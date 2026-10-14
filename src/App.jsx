import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Designer from './pages/Designer';
import SmartMeasurement from './pages/SmartMeasurement';
import MeasurementResults from './pages/MeasurementResults';
import AvatarPreview from './pages/AvatarPreview';
import DesignReport from './pages/DesignReport';
import { Sparkles, X } from 'lucide-react';
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/designer.css';
import './styles/measurement.css';
import './styles/results.css';
import './styles/viewer3d.css';
import './styles/report.css';

/**
 * Main Tailzey Application Component (Phase 6)
 * Coordinates page views (Home, SignIn, SignUp, Dashboard, Designer, SmartMeasurement, MeasurementResults, AvatarPreview),
 * browser hash navigation, shared in-memory React session data, and interactive phase notices.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [phaseNotice, setPhaseNotice] = useState(null);

  // In-memory measurement session state (shared React state across Phase 4, Phase 5 & Phase 6)
  const [measurementSession, setMeasurementSession] = useState({
    manualValues: {},
    manualUnit: 'cm',
    cameraCaptureCount: 0,
    isCameraCompleted: false,
    skippedCount: 0,
    selectedSize: 'M',
    selectedSizeType: 'letter',
  });

  // In-memory outfit design session state (shared React state across Phase 3, Phase 5 & Phase 6)
  const [designerSession, setDesignerSession] = useState({
    garmentId: 'jacket',
    fitId: 'regular',
    colorId: 'black',
    styleId: 'classic',
  });

  // Sync hash routing on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'home') {
        setCurrentPage('home');
      } else if (['designer', 'dream-design', 'design'].includes(hash)) {
        setCurrentPage('designer');
      } else if (['measurement', 'smart-measurement', 'fit'].includes(hash)) {
        setCurrentPage('measurement');
      } else if (['results', 'measurement-results', 'size-selector', 'measurement-studio'].includes(hash)) {
        setCurrentPage('results');
      } else if (['preview3d', 'avatar-preview', '3d-preview', 'outfit-viewer', '3d-studio'].includes(hash)) {
        setCurrentPage('preview3d');
      } else if (['design-report', 'report', 'export', 'dossier'].includes(hash)) {
        setCurrentPage('design-report');
      } else if (['signin', 'signup', 'dashboard'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        // Fallback to home on unknown hash
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPhaseNotice = (featureTitle) => {
    setPhaseNotice({
      title: featureTitle,
      message: 'This bespoke feature is slated for upcoming atelier releases. The current Tailzey release includes the full Dream Outfit Designer, Smart Measurement Calibration, Measurement Studio & Size Selector, Interactive 3D Avatar Viewer, and Design Spec Report.',
    });
  };

  const handleClosePhaseNotice = () => {
    setPhaseNotice(null);
  };

  return (
    <div className="tailzy-app">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Route: Sign In */}
      {currentPage === 'signin' && (
        <SignIn
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Sign Up */}
      {currentPage === 'signup' && (
        <SignUp
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Dashboard */}
      {currentPage === 'dashboard' && (
        <Dashboard
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Dream Outfit Designer (Phase 3) */}
      {currentPage === 'designer' && (
        <Designer
          designerSession={designerSession}
          onUpdateDesignerSession={setDesignerSession}
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Guided Smart Measurement (Phase 4) */}
      {currentPage === 'measurement' && (
        <SmartMeasurement
          measurementSession={measurementSession}
          onUpdateMeasurementSession={setMeasurementSession}
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Measurement Results & Size Selector Studio (Phase 5) */}
      {currentPage === 'results' && (
        <MeasurementResults
          measurementSession={measurementSession}
          onUpdateMeasurementSession={setMeasurementSession}
          designerSession={designerSession}
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Interactive 3D Avatar & Outfit Studio (Phase 6) */}
      {currentPage === 'preview3d' && (
        <AvatarPreview
          designerSession={designerSession}
          onUpdateDesignerSession={setDesignerSession}
          measurementSession={measurementSession}
          onUpdateMeasurementSession={setMeasurementSession}
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Custom Outfit Design Report & PDF Export (Phase 7) */}
      {currentPage === 'design-report' && (
        <DesignReport
          designerSession={designerSession}
          measurementSession={measurementSession}
          onNavigate={navigateTo}
          onOpenPhaseNotice={handleOpenPhaseNotice}
        />
      )}

      {/* Route: Home */}
      {currentPage === 'home' && (
        <>
          <Header
            onNavigate={navigateTo}
            onOpenPhaseNotice={handleOpenPhaseNotice}
          />
          <Home
            onNavigate={navigateTo}
            onOpenPhaseNotice={handleOpenPhaseNotice}
          />
          <Footer
            onNavigate={navigateTo}
            onOpenPhaseNotice={handleOpenPhaseNotice}
          />
        </>
      )}

      {/* Floating Phase Notice Toast for Non-Implemented Future Features */}
      {phaseNotice && (
        <aside
          className="toast-notification"
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <div className="toast-content">
            <h5 className="toast-title">{phaseNotice.title}</h5>
            <p className="toast-message">{phaseNotice.message}</p>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={handleClosePhaseNotice}
            aria-label="Dismiss message"
          >
            <X size={18} />
          </button>
        </aside>
      )}
    </div>
  );
}
