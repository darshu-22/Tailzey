import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, User, LayoutDashboard } from 'lucide-react';
import PageContainer from './PageContainer';
import Button from '../ui/Button';

/**
 * Reusable luxury Header component with brand logo, desktop navigation,
 * action buttons, sign-in links, and functional mobile drawer.
 */
export default function Header({ onOpenPhaseNotice, onNavigate }) {
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

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate('signin');
    } else if (onOpenPhaseNotice) {
      onOpenPhaseNotice('Sign In');
    }
  };

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate('signin');
    }
  };

  const handleOpenDashboard = () => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate('dashboard');
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
          aria-label="Tailzey — Home"
        >
          <img
            src="/assets/tailzy-logo.png"
            alt="Tailzey luxury fashion-tech logo"
            className="brand-logo-image"
          />
          <div className="brand-identity">
            <span className="brand-title">TAILZEY</span>
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

        {/* Action Buttons & Mobile Toggle */}
        <div className="header-actions">
          <button
            type="button"
            className="nav-link"
            onClick={handleSignIn}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
            }}
          >
            <User size={15} aria-hidden="true" style={{ color: 'var(--color-gold)' }} />
            <span>Sign In</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleGetStarted}
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
            <span className="brand-title">TAILZEY</span>
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
            <li>
              <button
                type="button"
                className="mobile-nav-link"
                onClick={handleOpenDashboard}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)' }}>
                  <LayoutDashboard size={18} />
                  Demo Dashboard
                </span>
                <ArrowUpRight size={18} className="nav-arrow" />
              </button>
            </li>
          </ul>
        </nav>

        <div className="mobile-drawer-footer">
          <Button
            variant="outline"
            size="md"
            onClick={handleSignIn}
            style={{ width: '100%', marginBottom: '0.5rem' }}
            icon={User}
          >
            Sign In
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleGetStarted}
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
