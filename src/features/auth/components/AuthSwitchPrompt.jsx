import React from 'react';
import { useRouter } from '../../../app/hooks';

/** "Don't have an account? Create one" style link between the two auth pages. */
export default function AuthSwitchPrompt({ prompt, linkLabel, to }) {
  const { navigate } = useRouter();
  return (
    <p className="auth-switch-prompt">
      {prompt}
      <button type="button" onClick={() => navigate(to)} className="auth-switch-link">
        {linkLabel}
      </button>
    </p>
  );
}
