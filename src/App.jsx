import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Designer from './pages/Designer';
import { Sparkles, X } from 'lucide-react';
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/designer.css';

/**
 * Main Tailzey Application Component (Phase 3)
 * Coordinates page views (Home, SignIn, SignUp, Dashboard, Designer),
 * browser hash navigation, and interactive phase notices.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [phaseNotice, setPhaseNotice] = useState(null);

  // Sync hash routing on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['signin', 'signup', 'dashboard', 'home', 'designer', 'dream-design'].includes(hash)) {
        setCurrentPage(hash === 'dream-design' ? 'designer' : hash);
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
      message: 'This feature is slated for upcoming phases. Phase 3 introduces the interactive Dream Outfit Designer studio.',
    });
  };

  const handleClosePhaseNotice = () => {
    setPhaseNotice(null);
  };

  return (
    <div className="tailzy-app">
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
