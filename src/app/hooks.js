/**
 * App-wide hooks. Import from here in feature code:
 *   import { useAuth, useWorkspace, useToast, useRouter } from '../../../app/hooks';
 */
import { useContext } from 'react';
import { AuthContext } from './providers/auth/AuthContext';
import { WorkspaceContext } from './providers/workspace/WorkspaceContext';
import { ToastContext } from './providers/toast/ToastContext';
import { RouterContext } from './router/RouterContext';

function useRequiredContext(context, name) {
  const value = useContext(context);
  if (value === null) throw new Error(`${name} must be used inside its provider`);
  return value;
}

/** { user, status: 'loading'|'authenticated'|'anonymous', login, loginDemo, register, logout, deleteAccount } */
export const useAuth = () => useRequiredContext(AuthContext, 'useAuth');

/** Design + measurement edit buffers, their actions, and save/load against the API. */
export const useWorkspace = () => useRequiredContext(WorkspaceContext, 'useWorkspace');

/** { notify({ title, message, variant: 'success'|'error'|'info' }), dismiss(id) } */
export const useToast = () => useRequiredContext(ToastContext, 'useToast');

/** { route, navigate(routeId, { replace }) } */
export const useRouter = () => useRequiredContext(RouterContext, 'useRouter');
