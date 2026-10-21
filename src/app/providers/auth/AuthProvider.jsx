import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../../../services/authService';
import { onUnauthorized } from '../../../core/api/httpClient';
import { AuthContext } from './AuthContext';

/**
 * Owns the signed-in user. The session itself is an HttpOnly cookie the browser
 * manages; on load we ask the server who we are (GET /auth/me).
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    authService
      .me()
      .then((u) => !cancelled && (setUser(u), setStatus('authenticated')))
      .catch(() => !cancelled && (setUser(null), setStatus('anonymous')));
    // Any 401 from any API call means the session expired.
    const unsubscribe = onUnauthorized(() => {
      setUser(null);
      setStatus('anonymous');
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback((u) => {
    setUser(u);
    setStatus('authenticated');
    return u;
  }, []);

  const login = useCallback((credentials) => authService.login(credentials).then(signIn), [signIn]);
  const register = useCallback((details) => authService.register(details).then(signIn), [signIn]);
  const loginDemo = useCallback(() => authService.demo().then(signIn), [signIn]);

  const clear = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  const logout = useCallback(() => authService.logout().finally(clear), [clear]);
  const deleteAccount = useCallback(() => authService.deleteAccount().then(clear), [clear]);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === 'authenticated', login, loginDemo, register, logout, deleteAccount }),
    [user, status, login, loginDemo, register, logout, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
