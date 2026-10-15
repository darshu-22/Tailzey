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
  logout() {
    return http.post('/auth/logout');
  },
  deleteAccount() {
    return http.delete('/auth/me');
  },
};
