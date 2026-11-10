import { apiRequest } from '../../api/client.js';

export function listInterests({ page = 1, limit = 10, interest } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (interest) {
    params.set('interest', interest);
  }

  return apiRequest(`/users/grouped-by-interests?${params.toString()}`);
}
