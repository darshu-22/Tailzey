import React, { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import HeaderAuthActions from './HeaderAuthActions';
import { MOBILE_LINKS, hrefFor } from './siteNavigation';

/** Slide-in navigation for small screens. Closes on Escape and locks page scroll while open. */
export default function MobileNavDrawer({ open, onClose, onLink }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`mobile-drawer-overlay ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />

      <div
        className={`mobile-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        inert={!open}
      >
        <div className="mobile-drawer-header">
          <div className="brand-identity">
            <span className="brand-title">TAILZEY</span>
            <span className="brand-tagline-micro">CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
          <button type="button" className="mobile-close-btn" onClick={onClose} aria-label="Close navigation menu">
            <X size={22} />
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Mobile Navigation Links">
          <ul className="mobile-nav-list">
            {MOBILE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={hrefFor(link)} className="mobile-nav-link" onClick={(e) => onLink(e, link)}>
                  <span>{link.label}</span>
                  <ArrowUpRight size={18} className="nav-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-drawer-footer">
          <div className="mobile-drawer-actions">
            <HeaderAuthActions variant="drawer" onAction={onClose} />
          </div>
          <p className="mobile-tagline-note">Custom ✦ Stylish ✦ You</p>
        </div>
      </div>
    </>
  );
}
