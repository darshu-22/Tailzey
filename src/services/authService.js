import { http } from '../core/api/httpClient';

export const authService = {
  async me() {
    return (await http.get('/auth/me')).data;
  },
  async login({ email, password }) {
    return (await http.post('/auth/login', { email, password })).data;
  },
  async register({ displayName, email, password }) {
    return (await http.post('/auth/register', { displayName, email, password })).data;
  },
  /** One-click sign-in to the shared demo account (available in development builds of the API). */
  async demo() {
    return (await http.post('/auth/demo')).data;
  },
  logout() {
    return http.post('/auth/logout');
  },
  deleteAccount() {
    return http.delete('/auth/me');
  },
};
