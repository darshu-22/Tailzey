import React, { useState } from 'react';
import { Mail, ArrowRight, Info, Sparkles } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Sign-in page with split-screen luxury composition, inline validation,
 * forgot-password notice, and demo dashboard navigation.
 */
export default function SignIn({ onNavigate, onOpenPhaseNotice }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionFeedback(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    // Frontend-only demonstration without fabricated auth or credentials storage
    setTimeout(() => {
      setSubmitting(false);
      setSubmissionFeedback({
        type: 'demo',
        message: 'Frontend validation passed. Since authentication is not connected in Phase 2, you can enter the Demo Dashboard below.',
      });
    }, 600);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (onOpenPhaseNotice) {
      onOpenPhaseNotice('Password Recovery');
    }
  };

  return (
    <AuthLayout pageType="signin" onNavigate={onNavigate}>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Welcome Back</h1>
        <p className="auth-form-subtitle">
          Step back into your personal style experience.
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="auth-demo-banner" role="note">
        <Info size={18} className="auth-demo-banner-icon" aria-hidden="true" />
        <div>
          <strong>Phase 2 Frontend Prototype:</strong> No credentials are saved or sent. Fill the fields to test client validation or enter directly via demo mode.
        </div>
      </div>

      {/* Submission Feedback */}
      {submissionFeedback && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(217, 180, 122, 0.1)',
            border: '1px solid var(--color-gold)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-primary)',
          }}
        >
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
            {submissionFeedback.message}
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            onClick={() => onNavigate && onNavigate('dashboard')}
          >
            Enter Demo Dashboard
          </Button>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          id="signin-email"
          label="Email Address"
          type="email"
          placeholder="your.email@atelier.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          icon={Mail}
          required
        />

        <PasswordInput
          id="signin-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          required
        />

        <div className="auth-form-row">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              className="auth-checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="auth-forgot-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          Sign In
        </Button>

        {/* Direct Demo Bypass Button */}
        <Button
          type="button"
          variant="outline"
          size="md"
          icon={Sparkles}
          onClick={() => onNavigate && onNavigate('dashboard')}
          style={{ width: '100%' }}
        >
          Explore Demo Dashboard Directly
        </Button>

        <p className="auth-switch-prompt">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('signup')}
            className="auth-switch-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Create an account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
