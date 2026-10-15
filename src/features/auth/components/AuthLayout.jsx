import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useRouter } from '../../../app/hooks';

const COPYRIGHT_YEAR = new Date().getFullYear();

const PANEL_COPY = {
  signin: {
    quote: (
      <>
        Bespoke elegance, <br />
        <span className="text-gold-gradient">measured for you.</span>
      </>
    ),
    sub: 'Welcome back to your private fashion atelier. Review your saved designs and measurement profiles, and continue designing.',
  },
  signup: {
    quote: (
      <>
        Where couture craft meets <br />
        <span className="text-gold-gradient">precision fit.</span>
      </>
    ),
    sub: 'Create your account to save personalised garments and smart body measurements to your private studio.',
  },
};

const FEATURES = [
  'Custom silhouette crafting tailored to your aesthetic',
  'Guided smart measurement review & fit precision',
  'Private & secure style studio workspace',
];

/** Split-screen shell for the sign-in / sign-up pages: brand panel (desktop) + form panel. */
export default function AuthLayout({ children, pageType = 'signin' }) {
  const { navigate } = useRouter();
  const copy = PANEL_COPY[pageType];
  const goHome = () => navigate('home');

  return (
    <div className="auth-page">
      <div className="auth-split-grid">
        <aside className="auth-brand-panel" aria-label="Brand Overview">
          <div className="auth-panel-top">
            <button type="button" className="auth-back-link" onClick={goHome}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to Home</span>
            </button>
            <span className="auth-panel-eyebrow">TAILZEY ATELIER</span>
          </div>

          <div className="auth-panel-center">
            <div className="auth-brand-badge">
              <img src="/assets/tailzy-logo.png" alt="Tailzey Monogram" className="auth-brand-badge-logo" />
              <span className="auth-brand-badge-title">TAILZEY</span>
            </div>

            <h2 className="auth-panel-quote">{copy.quote}</h2>
            <p className="auth-panel-sub">{copy.sub}</p>

            <ul className="auth-feature-list">
              {FEATURES.map((feature) => (
                <li key={feature} className="auth-feature-item">
                  <Check size={16} className="auth-feature-item-icon" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-panel-bottom">
            <span>TAILZEY &copy; {COPYRIGHT_YEAR}</span>
            <span>CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
        </aside>

        <main className="auth-form-panel" id="main-content">
          <div className="auth-form-wrapper">
            <div className="auth-mobile-header">
              <div className="auth-mobile-logo">
                <img src="/assets/tailzy-logo.png" alt="Tailzey Logo" className="auth-mobile-logo-img" />
                <span className="brand-title auth-mobile-title">TAILZEY</span>
              </div>
              <button type="button" className="auth-back-link" onClick={goHome}>
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Home</span>
              </button>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
