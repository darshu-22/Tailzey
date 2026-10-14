import React, { useState } from 'react';
import { Mail, User, AtSign, ArrowRight, Info, Sparkles } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordInput from '../components/auth/PasswordInput';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Sign-up registration page with split-screen luxury composition,
 * form validation, terms checkbox, and demo flow.
 */
export default function SignUp({ onNavigate, onOpenPhaseNotice }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.username.trim()) {
      errs.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms and conditions to continue.';
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

    setTimeout(() => {
      setSubmitting(false);
      setSubmissionFeedback({
        type: 'demo',
        message: 'Registration validation passed! In Phase 2 this is a frontend prototype. You can proceed directly to preview the Dashboard.',
      });
    }, 600);
  };

  return (
    <AuthLayout pageType="signup" onNavigate={onNavigate}>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Create Account</h1>
        <p className="auth-form-subtitle">
          Begin your journey into personalized outfit design and smart fit.
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="auth-demo-banner" role="note">
        <Info size={18} className="auth-demo-banner-icon" aria-hidden="true" />
        <div>
          <strong>Phase 2 Frontend Prototype:</strong> Registration is currently an interactive frontend prototype. No data is stored or transmitted.
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
          id="signup-fullname"
          label="Full Name"
          placeholder="e.g. Elena Rostova"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          error={errors.fullName}
          icon={User}
          required
        />

        <Input
          id="signup-email"
          label="Email Address"
          type="email"
          placeholder="your.email@domain.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          icon={Mail}
          required
        />

        <Input
          id="signup-username"
          label="Username"
          placeholder="e.g. elena_style"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
          icon={AtSign}
          required
        />

        <PasswordInput
          id="signup-password"
          label="Password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          required
        />

        <PasswordInput
          id="signup-confirm-password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          required
        />

        {/* Terms Checkbox */}
        <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          <label className="auth-checkbox-label" style={{ alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              className="auth-checkbox-input"
              style={{ marginTop: '3px' }}
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              I agree to the Tailzey{' '}
              <button
                type="button"
                className="auth-inline-link"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  color: 'var(--color-gold)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'inline',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onOpenPhaseNotice) onOpenPhaseNotice('Terms & Conditions');
                }}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="auth-inline-link"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  color: 'var(--color-gold)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'inline',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onOpenPhaseNotice) onOpenPhaseNotice('Privacy Policy');
                }}
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="form-error-text" style={{ display: 'block', marginTop: '0.35rem' }}>
              {errors.agreeTerms}
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          Create Atelier Account
        </Button>

        <p className="auth-switch-prompt">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('signin')}
            className="auth-switch-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
