import React, { useEffect, useRef } from 'react';
import { LogOut, X } from 'lucide-react';
import { useAuth, useRouter } from '../../app/hooks';
import { APP_NAV } from './appNavigation';
import { useSignOut } from './siteNavigation';

/** Mobile navigation drawer (native <dialog>: focus trap, Esc to close, inert background). */
export default function AppNavDrawer({ open, onClose }) {
  const ref = useRef(null);
  const { user } = useAuth();
  const { route, navigate } = useRouter();
  const signOut = useSignOut();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const go = (id) => {
    onClose();
    navigate(id);
  };

  return (
    <dialog
      ref={ref}
      className="app-drawer"
      aria-label="Menu"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="app-drawer-panel">
        <div className="app-drawer-head">
          <div>
            <p className="app-drawer-name">{user?.displayName}</p>
            <p className="app-drawer-email">{user?.email}</p>
          </div>
          <button type="button" className="app-icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main">
          <ul className="app-drawer-list">
            {APP_NAV.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="app-drawer-link"
                  aria-current={route === id ? 'page' : undefined}
                  onClick={(e) => (e.preventDefault(), go(id))}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="app-drawer-link app-drawer-signout" onClick={() => (onClose(), signOut())}>
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </dialog>
  );
}
