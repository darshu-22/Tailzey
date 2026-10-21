import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter } from '../../../app/hooks';

const COPYRIGHT_YEAR = new Date().getFullYear();

const POINTS = [
  'Save your designs and measurement profiles',
  'Measurements from two photos, each with a ± range',
  'Photos are processed in memory and never stored',
];

/**
 * Full-height shell for the sign-in / sign-up pages: the form panel, plus a quiet brand
 * panel beside it on desktop (hidden on small screens).
 */
export default function AuthLayout({ children }) {
  const { navigate } = useRouter();
  const goHome = (event) => {
    event.preventDefault();
    navigate('home');
  };

  return (
    <div className="auth-page">
      <main id="main-content" className="auth-main" tabIndex={-1}>
        <div className="auth-topbar">
          <a href="#home" className="auth-brand" onClick={goHome}>
            <img src="/assets/tailzy-logo.png" alt="" width="32" height="32" />
            <span>Tailzey</span>
          </a>
          <a href="#home" className="auth-back-link" onClick={goHome}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </a>
        </div>

        <div className="auth-form-wrapper">{children}</div>
      </main>

      <aside className="auth-aside" aria-label="About Tailzey">
        <div className="auth-aside-inner">
          <p className="auth-aside-title">Clothes that fit, from a few photos.</p>
          <p className="auth-aside-text">
            Design an outfit, measure yourself with your camera, and take a clear report to your tailor.
          </p>
          <ul className="auth-aside-list">
            {POINTS.map((point) => (
              <li key={point}>
                <Check size={16} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-aside-footer">&copy; {COPYRIGHT_YEAR} Tailzey</p>
      </aside>
    </div>
  );
}
