import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { Sparkles, X, Info } from 'lucide-react';
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';

/**
 * Main Tailzy Application Component
 * Coordinates layout, header, footer, page view, and interactive phase notices
 */
export default function App() {
  const [phaseNotice, setPhaseNotice] = useState(null);

  const handleOpenPhaseNotice = (featureTitle) => {
    setPhaseNotice({
      title: featureTitle,
      message: 'This feature is slated for upcoming phases. Phase 1 establishes the visual branding, typography, and reusable UI foundation.',
    });
  };

  const handleClosePhaseNotice = () => {
    setPhaseNotice(null);
  };

  return (
    <div className="tailzy-app">
      <Header onOpenPhaseNotice={handleOpenPhaseNotice} />
      
      <Home onOpenPhaseNotice={handleOpenPhaseNotice} />

      <Footer onOpenPhaseNotice={handleOpenPhaseNotice} />

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
