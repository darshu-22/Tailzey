import { http } from '../core/api/httpClient';

/** Saved measurement profiles (values stored in the profile's own unit). */
export const profileService = {
  list({ limit = 20, offset = 0 } = {}, options) {
    return http.get(`/measurement-profiles?limit=${limit}&offset=${offset}`, options); // { data, meta }
  },
  async get(id, options) {
    return (await http.get(`/measurement-profiles/${encodeURIComponent(id)}`, options)).data;
  },
  async create(profile) {
    return (await http.post('/measurement-profiles', profile)).data;
  },
  async update(id, changes) {
    return (await http.patch(`/measurement-profiles/${encodeURIComponent(id)}`, changes)).data;
  },
  remove(id) {
    return http.delete(`/measurement-profiles/${encodeURIComponent(id)}`);
  },
};
