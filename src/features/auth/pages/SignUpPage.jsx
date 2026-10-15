import React from 'react';
import { Mail, User } from 'lucide-react';
import { useAuth, useToast } from '../../../app/hooks';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import AuthLayout from '../components/AuthLayout';
import AuthFormAlert from '../components/AuthFormAlert';
import AuthSwitchPrompt from '../components/AuthSwitchPrompt';
import PasswordInput from '../components/PasswordInput';
import { useAuthForm } from '../hooks/useAuthForm';
import { DISPLAY_NAME_MAX, PASSWORD_MAX, PASSWORD_MIN, validateSignUp } from '../utils/validation';

const INITIAL_VALUES = { displayName: '', email: '', password: '', confirmPassword: '', agreeTerms: false };

/** Create an account. A successful registration signs the user in and the router forwards them on. */
export default function SignUpPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const { values, errors, formError, pending, setField, handleSubmit } = useAuthForm({
    initialValues: INITIAL_VALUES,
    validate: validateSignUp,
    submit: async ({ displayName, email, password }) => {
      const user = await register({ displayName: displayName.trim(), email: email.trim(), password });
      notify({ title: 'Account created', message: `Welcome to Tailzey, ${user.displayName}.`, variant: 'success' });
    },
  });

  return (
    <AuthLayout pageType="signup">
      <div className="auth-form-header">
        <h1 className="auth-form-title">Create Account</h1>
        <p className="auth-form-subtitle">Begin your journey into personalized outfit design and smart fit.</p>
      </div>

      <AuthFormAlert message={formError} />

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          id="signup-display-name"
          label="Full Name"
          autoComplete="name"
          placeholder="e.g. Elena Rostova"
          maxLength={DISPLAY_NAME_MAX}
          value={values.displayName}
          onChange={(e) => setField('displayName', e.target.value)}
          error={errors.displayName}
          icon={User}
          disabled={pending}
          required
        />

        <Input
          id="signup-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="your.email@domain.com"
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          icon={Mail}
          disabled={pending}
          required
        />

        <PasswordInput
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          placeholder={`At least ${PASSWORD_MIN} characters`}
          maxLength={PASSWORD_MAX}
          value={values.password}
          onChange={(e) => setField('password', e.target.value)}
          error={errors.password}
          disabled={pending}
          required
        />

        <PasswordInput
          id="signup-confirm-password"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          maxLength={PASSWORD_MAX}
          value={values.confirmPassword}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          disabled={pending}
          required
        />

        <div className="auth-terms">
          <label className="auth-checkbox-label auth-terms-label">
            <input
              type="checkbox"
              className="auth-checkbox-input"
              checked={values.agreeTerms}
              onChange={(e) => setField('agreeTerms', e.target.checked)}
              aria-invalid={Boolean(errors.agreeTerms)}
              aria-describedby={errors.agreeTerms ? 'signup-terms-error' : undefined}
              disabled={pending}
            />
            <span className="auth-terms-text">I agree to the Tailzey Terms of Service and Privacy Policy.</span>
          </label>
          {errors.agreeTerms && (
            <span id="signup-terms-error" className="form-error-text auth-terms-error">
              {errors.agreeTerms}
            </span>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={pending} className="auth-submit-btn">
          {pending ? 'Creating Account…' : 'Create Atelier Account'}
        </Button>

        <AuthSwitchPrompt prompt="Already have an account?" linkLabel="Sign in" to="signin" />
      </form>
    </AuthLayout>
  );
}
