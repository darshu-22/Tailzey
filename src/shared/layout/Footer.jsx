import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useAuth } from '../../app/hooks';
import StatusBadge from '../ui/StatusBadge';
import PageContainer from './PageContainer';
import { EXPERIENCE_LINKS, hrefFor, useSiteNavigation } from './siteNavigation';

const COPYRIGHT_YEAR = new Date().getFullYear();

const GUEST_LINKS = [
  { label: 'Member Sign In', route: 'signin' },
  { label: 'Create Atelier Account', route: 'signup' },
  { label: 'How Tailzey Works', section: 'how-it-works' },
];

const MEMBER_LINKS = [
  { label: 'Studio Dashboard', route: 'dashboard' },
  { label: 'How Tailzey Works', section: 'how-it-works' },
];

function FooterLinks({ heading, links, onLink }) {
  return (
    <div className="footer-links-col">
      <h4 className="footer-heading">{heading}</h4>
      <ul className="footer-nav-list">
        {links.map((link) => (
          <li key={link.label}>
            <a href={hrefFor(link)} onClick={(e) => onLink(e, link)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Public site footer: brand column, experience + account links, and back-to-top. */
export default function Footer() {
  const { isAuthenticated } = useAuth();
  const go = useSiteNavigation();

  const handleLink = (event, target) => {
    event.preventDefault();
    go(target);
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top-accent" />
      <PageContainer>
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img src="/assets/tailzy-logo.png" alt="Tailzey official monogram logo" className="footer-logo-image" />
              <div>
                <span className="footer-brand-title">TAILZEY</span>
                <span className="footer-tagline">CUSTOM ✦ STYLISH ✦ YOU</span>
              </div>
            </div>
            <p className="footer-description">
              Elevating personal fashion through intentional silhouettes, refined craftsmanship, and smart body
              measurement discovery.
            </p>
            <div className="footer-status-pill">
              <StatusBadge variant="gold" dot>
                Tailzey Atelier Studio
              </StatusBadge>
            </div>
          </div>

          <FooterLinks heading="Experience" links={EXPERIENCE_LINKS} onLink={handleLink} />
          <FooterLinks
            heading="Access & Atelier"
            links={isAuthenticated ? MEMBER_LINKS : GUEST_LINKS}
            onLink={handleLink}
          />

          <div className="footer-links-col">
            <h4 className="footer-heading">Craftsmanship</h4>
            <div className="footer-promise-box">
              <p className="footer-promise-text">
                Designed with precision in black, antique gold, and warm ivory. Built around your personal fit.
              </p>
              <span className="footer-promise-author">Tailzey Atelier</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; {COPYRIGHT_YEAR} TAILZEY. All rights reserved. Custom ✦ Stylish ✦ You.
          </p>
          <button
            type="button"
            className="back-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
