import { useAuth, useRouter, useToast } from '../../../app/hooks';
import { getErrorMessage } from '../../../core/api/ApiError';
import { useSignOut } from '../../../shared/layout/siteNavigation';

/** Sign out, and permanently delete the account after confirmation. */
export function useAccountActions({ confirm }) {
  const { deleteAccount } = useAuth();
  const { navigate } = useRouter();
  const { notify } = useToast();
  const signOut = useSignOut();

  const requestDeleteAccount = () =>
    confirm({
      title: 'Delete your account?',
      message:
        'This permanently deletes your Tailzey account together with all saved designs and measurement profiles. This cannot be undone.',
      confirmLabel: 'Delete account',
      onConfirm: async () => {
        try {
          await deleteAccount();
          notify({ title: 'Account deleted', message: 'Your account and data have been removed.', variant: 'success' });
          navigate('home');
        } catch (err) {
          notify({ title: 'Could not delete account', message: getErrorMessage(err), variant: 'error' });
        }
      },
    });

  return { signOut, requestDeleteAccount };
}
