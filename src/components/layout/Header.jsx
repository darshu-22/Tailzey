import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import PageContainer from './PageContainer';
import Button from '../ui/Button';

/**
 * Reusable luxury Header component with brand logo, desktop navigation,
 * action button, and functional mobile drawer.
 */
export default function Header({ onOpenPhaseNotice }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId, e, featureName) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (onOpenPhaseNotice && featureName) {
      onOpenPhaseNotice(featureName);
    }
  };

  return (
    <header
      className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}
      role="banner"
    >
      <PageContainer className="header-inner">
        {/* Brand Logo & Title */}
        <a
          href="#home"
          className="brand-logo-link"
          onClick={(e) => handleNavClick('home', e)}
          aria-label="Tailzy — Home"
        >
          <img
            src="/assets/tailzy-logo.png"
            alt="Tailzy luxury fashion-tech logo"
            className="brand-logo-image"
          />
          <div className="brand-identity">
            <span className="brand-title">TAILZY</span>
            <span className="brand-tagline-micro">CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li>
              <a
                href="#home"
                className="nav-link"
                onClick={(e) => handleNavClick('home', e)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#dream-design"
                className="nav-link"
                onClick={(e) => handleNavClick('dream-design', e, 'Dream Design')}
              >
                Dream Design
              </a>
            </li>
            <li>
              <a
                href="#smart-measurement"
                className="nav-link"
                onClick={(e) => handleNavClick('smart-measurement', e, 'Smart Measurement')}
              >
                Smart Measurement
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="nav-link"
                onClick={(e) => handleNavClick('how-it-works', e)}
              >
                How It Works
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="header-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenPhaseNotice ? onOpenPhaseNotice('Outfit Design Studio') : null}
            className="header-cta-btn"
            icon={Sparkles}
          >
            Get Started
          </Button>

          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </PageContainer>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer-header">
          <div className="brand-identity">
            <span className="brand-title">TAILZY</span>
            <span className="brand-tagline-micro">CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Mobile Navigation Links">
          <ul className="mobile-nav-list">
            <li>
              <a
                href="#home"
                className="mobile-nav-link"
                onClick={(e) => handleNavClick('home', e)}
              >
                <span>Home</span>
                <ArrowUpRight size={18} className="nav-arrow" />
              </a>
            </li>
            <li>
              <a
                href="#dream-design"
                className="mobile-nav-link"
                onClick={(e) => handleNavClick('dream-design', e, 'Dream Design')}
              >
                <span>Dream Design</span>
                <ArrowUpRight size={18} className="nav-arrow" />
              </a>
            </li>
            <li>
              <a
                href="#smart-measurement"
                className="mobile-nav-link"
                onClick={(e) => handleNavClick('smart-measurement', e, 'Smart Measurement')}
              >
                <span>Smart Measurement</span>
                <ArrowUpRight size={18} className="nav-arrow" />
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="mobile-nav-link"
                onClick={(e) => handleNavClick('how-it-works', e)}
              >
                <span>How It Works</span>
                <ArrowUpRight size={18} className="nav-arrow" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="mobile-drawer-footer">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenPhaseNotice) onOpenPhaseNotice('Outfit Design Studio');
            }}
            style={{ width: '100%' }}
            icon={Sparkles}
          >
            Get Started
          </Button>
          <p className="mobile-tagline-note">Custom ✦ Stylish ✦ You</p>
        </div>
      </div>
    </header>
  );
}
