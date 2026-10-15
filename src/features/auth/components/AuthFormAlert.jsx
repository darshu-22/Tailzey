import React from 'react';
import { AlertCircle } from 'lucide-react';

/** Form-level error (wrong credentials, rate limit, network) shown above the fields. */
export default function AuthFormAlert({ message }) {
  if (!message) return null;
  return (
    <div className="auth-form-alert" role="alert">
      <AlertCircle size={18} className="auth-form-alert-icon" aria-hidden="true" />
      <div>{message}</div>
    </div>
  );
}
