import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Home, Sparkles, Shield } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

/**
 * Dashboard Header component with brand mark, mobile menu toggle,
 * demo pill, and interactive profile/avatar menu.
 */
export default function DashboardHeader({
  onNavigate,
  sidebarOpen,
  onToggleSidebar,
  onOpenPhaseNotice,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    if (onNavigate) {
      onNavigate('signin');
    }
  };

  return (
    <header className="dashboard-header" role="banner">
      <div className="dashboard-header-left">
        <button
          type="button"
          className="dashboard-menu-toggle"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar navigation' : 'Open sidebar navigation'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          href="#home"
          className="dashboard-brand-link"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
          aria-label="Tailzey Atelier Dashboard — Home"
        >
          <img
            src="/assets/tailzy-logo.png"
            alt="Tailzey Logo"
            className="dashboard-brand-logo"
          />
          <div className="brand-identity" style={{ display: 'none', minWidth: 'auto' }}>
            <span className="dashboard-brand-title">TAILZEY</span>
          </div>
        </a>

        <div className="dashboard-demo-pill" title="Frontend-only demonstration interface">
          <Sparkles size={12} aria-hidden="true" />
          <span>Demo Preview</span>
        </div>
      </div>

      <div className="dashboard-header-right">
        {/* Profile / Avatar Menu */}
        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            type="button"
            className="profile-trigger-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="User profile menu"
          >
            <div className="profile-avatar-circle">
              <span>TZ</span>
            </div>
            <span className="profile-user-name">Guest Atelier</span>
            <ChevronDown size={14} style={{ color: 'var(--color-gold)' }} />
          </button>

          {profileOpen && (
            <div className="profile-dropdown-card" role="menu">
              <div className="profile-dropdown-header">
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Guest Member
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  guest.atelier@tailzey.internal
                </p>
                <div style={{ marginTop: '0.35rem' }}>
                  <StatusBadge variant="gold">Phase 2 Demo</StatusBadge>
                </div>
              </div>

              <button
                type="button"
                className="profile-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  if (onNavigate) onNavigate('home');
                }}
              >
                <Home size={15} style={{ color: 'var(--color-gold)' }} />
                <span>Return to Main Website</span>
              </button>

              <button
                type="button"
                className="profile-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  if (onOpenPhaseNotice) onOpenPhaseNotice('Profile & Atelier Settings');
                }}
              >
                <User size={15} style={{ color: 'var(--color-gold)' }} />
                <span>Profile Settings</span>
              </button>

              <button
                type="button"
                className="profile-dropdown-item profile-dropdown-item-danger"
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
