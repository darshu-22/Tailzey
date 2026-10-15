import React from 'react';
import { Mail } from 'lucide-react';
import { useAuth, useToast } from '../../../app/hooks';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import AuthLayout from '../components/AuthLayout';
import AuthFormAlert from '../components/AuthFormAlert';
import AuthSwitchPrompt from '../components/AuthSwitchPrompt';
import PasswordInput from '../components/PasswordInput';
import { useAuthForm } from '../hooks/useAuthForm';
import { validateSignIn } from '../utils/validation';

const INITIAL_VALUES = { email: '', password: '' };

/** Sign in with email + password. On success the router forwards to the page the user came for. */
export default function SignInPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const { values, errors, formError, pending, setField, handleSubmit } = useAuthForm({
    initialValues: INITIAL_VALUES,
    validate: validateSignIn,
    submit: async ({ email, password }) => {
      const user = await login({ email: email.trim(), password });
      notify({ title: 'Welcome back', message: `Signed in as ${user.displayName}.`, variant: 'success' });
    },
  });

  return (
    <AuthLayout pageType="signin">
      <div className="auth-form-header">
        <h1 className="auth-form-title">Welcome Back</h1>
        <p className="auth-form-subtitle">Step back into your personal style experience.</p>
      </div>

      <AuthFormAlert message={formError} />

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          id="signin-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="your.email@atelier.com"
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          icon={Mail}
          disabled={pending}
          required
        />

        <PasswordInput
          id="signin-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={(e) => setField('password', e.target.value)}
          error={errors.password}
          disabled={pending}
          required
        />

        <Button type="submit" variant="primary" size="lg" loading={pending} className="auth-submit-btn">
          {pending ? 'Signing In…' : 'Sign In'}
        </Button>

        <AuthSwitchPrompt prompt="Don't have an account yet?" linkLabel="Create an account" to="signup" />
      </form>
    </AuthLayout>
  );
}
