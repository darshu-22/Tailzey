import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import HeaderAuthActions from './HeaderAuthActions';
import { SITE_LINKS, hrefFor } from './siteNavigation';

/** Public-site menu for small screens (native <dialog>: focus trap, Esc to close, inert background). */
export default function MobileNavDrawer({ open, onClose, onLink }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="site-drawer"
      aria-label="Menu"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="site-drawer-panel">
        <div className="site-drawer-head">
          <span className="site-brand">
            <img src="/assets/tailzy-logo.png" alt="" width="32" height="32" />
            <span>Tailzey</span>
          </span>
          <button type="button" className="site-icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main">
          <ul className="site-drawer-list">
            {SITE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={hrefFor(link)} className="site-drawer-link" onClick={(e) => onLink(e, link)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <HeaderAuthActions variant="drawer" onAction={onClose} />
      </div>
    </dialog>
  );
}
