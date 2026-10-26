import React, { useCallback, useState } from 'react';
import { Menu } from 'lucide-react';
import HeaderAuthActions from './HeaderAuthActions';
import MobileNavDrawer from './MobileNavDrawer';
import { SITE_LINKS, hrefFor, useSiteNavigation } from './siteNavigation';

/** Public site header: brand, section links, account actions, and a drawer below 1024px. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = useSiteNavigation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const handleLink = (event, target) => {
    event.preventDefault();
    setMenuOpen(false);
    go(target);
  };

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a href="#home" className="site-brand" onClick={(e) => handleLink(e, { section: 'home' })}>
          <img src="/assets/tailzy-logo.png" alt="" width="32" height="32" />
          <span>Tailzey</span>
        </a>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav-list">
            {SITE_LINKS.map((link) => (
              <li key={link.label}>
                <a href={hrefFor(link)} className="site-nav-link" onClick={(e) => handleLink(e, link)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          <HeaderAuthActions />
        </div>

        <button
          type="button"
          className="site-menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      <MobileNavDrawer open={menuOpen} onClose={closeMenu} onLink={handleLink} />
    </header>
  );
}
