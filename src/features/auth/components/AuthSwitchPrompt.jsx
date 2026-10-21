import React from 'react';
import { useRouter } from '../../../app/hooks';

/** "Don't have an account? Create one" link between the two auth pages. */
export default function AuthSwitchPrompt({ prompt, linkLabel, to }) {
  const { navigate } = useRouter();
  return (
    <p className="auth-switch-prompt">
      {prompt}{' '}
      <a
        href={`#${to}`}
        className="auth-switch-link"
        onClick={(event) => {
          event.preventDefault();
          navigate(to);
        }}
      >
        {linkLabel}
      </a>
    </p>
  );
}
