import React, { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import PageContainer from './PageContainer';
import HeaderAuthActions from './HeaderAuthActions';
import MobileNavDrawer from './MobileNavDrawer';
import { PRIMARY_LINKS, hrefFor, useSiteNavigation } from './siteNavigation';

/** Public site header: brand, primary navigation, account actions and the mobile drawer. */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const go = useSiteNavigation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  const handleLink = (event, target) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    go(target);
  };

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`} role="banner">
      <PageContainer className="header-inner">
        <a
          href="#home"
          className="brand-logo-link"
          onClick={(e) => handleLink(e, { section: 'home' })}
          aria-label="Tailzey — Home"
        >
          <img src="/assets/tailzy-logo.png" alt="Tailzey luxury fashion-tech logo" className="brand-logo-image" />
          <div className="brand-identity">
            <span className="brand-title">TAILZEY</span>
            <span className="brand-tagline-micro">CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
        </a>

        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={hrefFor(link)} className="nav-link" onClick={(e) => handleLink(e, link)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <HeaderAuthActions />
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </PageContainer>

      <MobileNavDrawer open={mobileMenuOpen} onClose={closeMenu} onLink={handleLink} />
    </header>
  );
}
