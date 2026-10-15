import { http } from '../core/api/httpClient';

/** Saved outfit designs. Records use the same field names as the workspace design state. */
export const designService = {
  list({ limit = 20, offset = 0 } = {}, options) {
    return http.get(`/designs?limit=${limit}&offset=${offset}`, options); // { data, meta }
  },
  async get(id, options) {
    return (await http.get(`/designs/${encodeURIComponent(id)}`, options)).data;
  },
  async create(design) {
    return (await http.post('/designs', design)).data;
  },
  async update(id, changes) {
    return (await http.patch(`/designs/${encodeURIComponent(id)}`, changes)).data;
  },
  remove(id) {
    return http.delete(`/designs/${encodeURIComponent(id)}`);
  },
};
