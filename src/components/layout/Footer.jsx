import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import PageContainer from './PageContainer';
import StatusBadge from '../ui/StatusBadge';

/**
 * Reusable luxury Footer component with brand mark, tagline, navigation sections,
 * and copyright information.
 */
export default function Footer({ onOpenPhaseNotice }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e, featureName, targetId) => {
    e.preventDefault();
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (onOpenPhaseNotice) {
      onOpenPhaseNotice(featureName);
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top-accent" />
      <PageContainer>
        <div className="footer-main-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img
                src="/assets/tailzy-logo.png"
                alt="Tailzy official monogram logo"
                className="footer-logo-image"
              />
              <div>
                <span className="footer-brand-title">TAILZY</span>
                <span className="footer-tagline">CUSTOM ✦ STYLISH ✦ YOU</span>
              </div>
            </div>
            <p className="footer-description">
              Elevating personal fashion through intentional silhouettes, refined craftsmanship,
              and smart body measurement discovery.
            </p>
            <div className="footer-status-pill">
              <StatusBadge variant="gold" dot>
                Phase 1 Foundation
              </StatusBadge>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Experience</h4>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, 'Dream Outfit Design', 'features')}
                >
                  Dream Outfit Design
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, 'Smart Measurement Experience', 'features')}
                >
                  Smart Measurement
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, 'Personal Style Preview', 'features')}
                >
                  Personal Style Preview
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Architecture</h4>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, 'How It Works', 'how-it-works')}
                >
                  How Tailzy Works
                </a>
              </li>
              <li>
                <a
                  href="#foundation-ui"
                  onClick={(e) => handleLinkClick(e, 'Design System UI Kit', 'foundation-ui')}
                >
                  Design System Kit
                </a>
              </li>
              <li>
                <a
                  href="#philosophy"
                  onClick={(e) => handleLinkClick(e, 'Brand Philosophy', 'features')}
                >
                  Brand Philosophy
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Craftsmanship</h4>
            <div className="footer-promise-box">
              <p className="footer-promise-text">
                Designed with precision in black, antique gold, and warm ivory. Built for future fit innovation.
              </p>
              <span className="footer-promise-author">Tailzy Atelier 2026</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} TAILZY. All rights reserved. Custom ✦ Stylish ✦ You.
          </p>

          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </PageContainer>
    </footer>
  );
}
