import { useAuth, useRouter } from '../../../app/hooks';

/**
 * The landing page's two calls to action. Visitors get "Get started" (sign up) and "Sign in";
 * signed-in users go straight to their dashboard or into the designer.
 */
export function useStartActions() {
  const { status } = useAuth();
  const { navigate } = useRouter();

  if (status === 'authenticated') {
    return {
      primary: { label: 'Go to dashboard', onClick: () => navigate('dashboard') },
      secondary: { label: 'Design an outfit', onClick: () => navigate('designer') },
    };
  }
  return {
    primary: { label: 'Get started', onClick: () => navigate('signup') },
    secondary: { label: 'Sign in', onClick: () => navigate('signin') },
  };
}
