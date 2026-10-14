import React from 'react';
import {
  LayoutDashboard,
  Palette,
  Ruler,
  FolderHeart,
  Sliders,
  User,
  Settings,
  Sparkles,
  FileText,
  LogOut,
  Home,
} from 'lucide-react';

/**
 * Dashboard Sidebar navigation component
 * Supports desktop sidebar and mobile drawer with active indicator
 */
export default function DashboardSidebar({
  activeNav = 'dashboard',
  onSelectNav,
  onNavigate,
  onOpenPhaseNotice,
  isOpen = false,
  onClose,
}) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isImplemented: true },
    { id: 'dream-design', label: 'Dream Design', icon: Palette, isImplemented: true },
    { id: 'smart-measurement', label: 'Smart Measurement', icon: Ruler, isImplemented: true },
    { id: 'my-measurements', label: 'My Measurements', icon: Sliders, isImplemented: true },
    { id: 'avatar-3d', label: '3D Outfit Studio', icon: Sparkles, isImplemented: true },
    { id: 'design-report', label: 'Design Report', icon: FileText, isImplemented: true },
    { id: 'my-designs', label: 'My Designs', icon: FolderHeart, phaseName: 'My Saved Designs Collection' },
  ];

  const secondaryNavItems = [
    { id: 'profile', label: 'Profile', icon: User, phaseName: 'User Profile Atelier' },
    { id: 'settings', label: 'Settings', icon: Settings, phaseName: 'Account & Preference Settings' },
  ];

  const handleItemClick = (item) => {
    if (onClose) onClose();
    if (item.id === 'dream-design') {
      if (onNavigate) onNavigate('designer');
      return;
    }
    if (item.id === 'smart-measurement') {
      if (onNavigate) onNavigate('measurement');
      return;
    }
    if (item.id === 'my-measurements') {
      if (onNavigate) onNavigate('results');
      return;
    }
    if (item.id === 'avatar-3d') {
      if (onNavigate) onNavigate('preview3d');
      return;
    }
    if (item.id === 'design-report') {
      if (onNavigate) onNavigate('design-report');
      return;
    }
    if (item.isImplemented) {
      if (onSelectNav) onSelectNav(item.id);
    } else {
      if (onOpenPhaseNotice) onOpenPhaseNotice(item.phaseName || item.label);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Dashboard Workspace Navigation"
      >
        <div>
          <span className="sidebar-nav-section-title">Studio Navigation</span>
          <ul className="sidebar-nav-list">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sidebar-nav-item-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <Icon size={18} className="sidebar-icon" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <span className="sidebar-nav-section-title">Preferences</span>
          <ul className="sidebar-nav-list">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="sidebar-nav-item-btn"
                    onClick={() => handleItemClick(item)}
                  >
                    <Icon size={18} className="sidebar-icon" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-nav-item-btn"
            onClick={() => {
              if (onClose) onClose();
              if (onNavigate) onNavigate('home');
            }}
          >
            <Home size={18} className="sidebar-icon" />
            <span>Back to Website</span>
          </button>
        </div>
      </aside>
    </>
  );
}
