import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Home, LogOut } from 'lucide-react';
import { initialsOf } from '../utils/recordFormat';

/** Avatar button + dropdown showing the signed-in member, with "back to site" and sign out. */
export default function UserMenu({ user, onGoHome, onSignOut }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const choose = (action) => () => {
    setOpen(false);
    action();
  };

  return (
    <div className="profile-menu-container" ref={containerRef}>
      <button
        type="button"
        className="profile-trigger-btn"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <div className="profile-avatar-circle">
          <span>{initialsOf(user?.displayName)}</span>
        </div>
        <span className="profile-user-name">{user?.displayName}</span>
        <ChevronDown size={14} className="profile-trigger-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="profile-dropdown-card" role="menu">
          <div className="profile-dropdown-header">
            <p className="profile-dropdown-name">{user?.displayName}</p>
            <p className="profile-dropdown-email">{user?.email}</p>
          </div>

          <button type="button" className="profile-dropdown-item" role="menuitem" onClick={choose(onGoHome)}>
            <Home size={15} className="profile-dropdown-item-icon" aria-hidden="true" />
            <span>Return to Main Website</span>
          </button>

          <button
            type="button"
            className="profile-dropdown-item profile-dropdown-item-danger"
            role="menuitem"
            onClick={choose(onSignOut)}
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
