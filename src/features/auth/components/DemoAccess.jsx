import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth, useToast } from '../../../app/hooks';
import { getErrorMessage } from '../../../core/api/ApiError';
import Button from '../../../shared/ui/Button';

/** One-click access to the shared demo account, shown under the sign-in form. */
export default function DemoAccess({ disabled = false }) {
  const { loginDemo } = useAuth();
  const { notify } = useToast();
  const [pending, setPending] = useState(false);

  const start = async () => {
    setPending(true);
    try {
      await loginDemo();
      notify({ title: 'Demo account', message: 'You are exploring Tailzey with a shared demo account.', variant: 'success' });
    } catch (error) {
      notify({
        title: 'Demo unavailable',
        message: error?.status === 404 ? 'Demo access is turned off on this server.' : getErrorMessage(error),
        variant: 'error',
      });
      setPending(false);
    }
  };

  return (
    <div className="auth-demo">
      <div className="auth-divider" role="separator" aria-label="or">
        <span>or</span>
      </div>
      <Button
        variant="secondary"
        size="lg"
        icon={Sparkles}
        loading={pending}
        disabled={disabled}
        onClick={start}
        className="auth-demo-btn"
      >
        {pending ? 'Opening demo…' : 'Try the demo'}
      </Button>
      <p className="auth-demo-note">No sign-up needed. The demo account is shared, so don’t save anything personal.</p>
    </div>
  );
}
