import React from 'react';
import { ArrowLeft, Sparkles, Shield, Compass, Check } from 'lucide-react';

/**
 * Reusable AuthLayout providing desktop split-screen composition and responsive mobile view
 */
export default function AuthLayout({
  children,
  pageType = 'signin', // 'signin' or 'signup'
  onNavigate,
}) {
  const isSignIn = pageType === 'signin';

  return (
    <div className="auth-page">
      <div className="auth-split-grid">
        {/* Left Side: Brand Visual Panel (Desktop) */}
        <aside className="auth-brand-panel" aria-label="Brand Overview">
          <div className="auth-panel-top">
            <button
              type="button"
              className="auth-back-link"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to Home</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', letterSpacing: '0.15em' }}>
              TAILZEY ATELIER
            </span>
          </div>

          <div className="auth-panel-center">
            <div className="auth-brand-badge">
              <img
                src="/assets/tailzy-logo.png"
                alt="Tailzey Monogram"
                className="auth-brand-badge-logo"
              />
              <span className="auth-brand-badge-title">TAILZEY</span>
            </div>

            <h2 className="auth-panel-quote">
              {isSignIn ? (
                <>
                  Bespoke elegance, <br />
                  <span className="text-gold-gradient">measured for you.</span>
                </>
              ) : (
                <>
                  Where couture craft meets <br />
                  <span className="text-gold-gradient">precision fit.</span>
                </>
              )}
            </h2>

            <p className="auth-panel-sub">
              {isSignIn
                ? 'Welcome back to your private fashion atelier. Review your silhouette library and continue designing.'
                : 'Join the next era of luxury fashion. Create your profile to unlock personalized garments and smart body measurements.'}
            </p>

            <ul className="auth-feature-list">
              <li className="auth-feature-item">
                <Check size={16} className="auth-feature-item-icon" />
                <span>Custom silhouette crafting tailored to your aesthetic</span>
              </li>
              <li className="auth-feature-item">
                <Check size={16} className="auth-feature-item-icon" />
                <span>Guided smart measurement review & fit precision</span>
              </li>
              <li className="auth-feature-item">
                <Check size={16} className="auth-feature-item-icon" />
                <span>Private & secure style studio workspace</span>
              </li>
            </ul>
          </div>

          <div className="auth-panel-bottom">
            <span>TAILZEY &copy; {new Date().getFullYear()}</span>
            <span>CUSTOM ✦ STYLISH ✦ YOU</span>
          </div>
        </aside>

        {/* Right Side: Form Panel */}
        <main className="auth-form-panel" id="auth-main-content">
          <div className="auth-form-wrapper">
            {/* Mobile Header with Logo & Back button */}
            <div className="auth-mobile-header">
              <div className="auth-mobile-logo">
                <img
                  src="/assets/tailzy-logo.png"
                  alt="Tailzey Logo"
                  className="auth-mobile-logo-img"
                />
                <span className="brand-title" style={{ fontSize: '1.25rem' }}>TAILZEY</span>
              </div>
              <button
                type="button"
                className="auth-back-link"
                onClick={() => onNavigate && onNavigate('home')}
              >
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
