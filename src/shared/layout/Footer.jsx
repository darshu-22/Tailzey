import React from 'react';
import { useAuth } from '../../app/hooks';
import { PRODUCT_LINKS, SITE_LINKS, hrefFor, useSiteNavigation } from './siteNavigation';

const COPYRIGHT_YEAR = new Date().getFullYear();

const GUEST_LINKS = [
  { label: 'Sign in', route: 'signin' },
  { label: 'Create an account', route: 'signup' },
];

const MEMBER_LINKS = [{ label: 'Dashboard', route: 'dashboard' }];

function FooterColumn({ id, heading, links, onLink, className = '' }) {
  return (
    <nav className={`site-footer-col ${className}`.trim()} aria-labelledby={id}>
      <h2 id={id} className="site-footer-heading">
        {heading}
      </h2>
      <ul className="site-footer-list">
        {links.map((link) => (
          <li key={link.label}>
            <a href={hrefFor(link)} className="site-footer-link" onClick={(e) => onLink(e, link)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Compact public site footer: brand blurb, product / learn / account links, copyright. */
export default function Footer() {
  const { isAuthenticated } = useAuth();
  const go = useSiteNavigation();

  const handleLink = (event, target) => {
    event.preventDefault();
    go(target);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-about">
            <span className="site-brand">
              <img src="/assets/tailzy-logo.png" alt="" width="32" height="32" />
              <span>Tailzey</span>
            </span>
            <p>Design clothes, measure yourself with your phone camera, and get a tailor-ready report.</p>
          </div>

          <FooterColumn
            id="footer-product"
            heading="Product"
            links={PRODUCT_LINKS}
            onLink={handleLink}
            className="site-footer-product"
          />
          <FooterColumn id="footer-learn" heading="Learn more" links={SITE_LINKS} onLink={handleLink} />
          <FooterColumn
            id="footer-account"
            heading="Account"
            links={isAuthenticated ? MEMBER_LINKS : GUEST_LINKS}
            onLink={handleLink}
          />
        </div>

        <div className="site-footer-bottom">
          <p>&copy; {COPYRIGHT_YEAR} Tailzey. All rights reserved.</p>
          <p>Photos are processed in memory and never stored.</p>
        </div>
      </div>
    </footer>
  );
}
