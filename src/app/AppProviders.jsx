import React from 'react';
import RouterProvider from './router/RouterProvider';
import AuthProvider from './providers/auth/AuthProvider';
import WorkspaceProvider from './providers/workspace/WorkspaceProvider';
import ToastProvider from './providers/toast/ToastProvider';
import { useAuth } from './hooks';

/** A fresh workspace per signed-in user: keying by user id resets all unsaved work on sign-out/in. */
function UserWorkspace({ children }) {
  const { user } = useAuth();
  return <WorkspaceProvider key={user?.id ?? 'anonymous'}>{children}</WorkspaceProvider>;
}

export default function AppProviders({ children }) {
  return (
    <RouterProvider>
      <ToastProvider>
        <AuthProvider>
          <UserWorkspace>{children}</UserWorkspace>
        </AuthProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
