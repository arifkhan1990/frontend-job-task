import { apiRequest } from '../../api/client.js';

export function listUsers({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest(`/users?${params.toString()}`);
}

export function createUser(body) {
  return apiRequest('/users', { method: 'POST', body });
}

export function updateUser(id, body) {
  return apiRequest(`/users/${id}`, { method: 'PATCH', body });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, { method: 'DELETE' });
}

export function bulkDeleteUsers(ids) {
  return apiRequest('/users/bulk-delete', { method: 'POST', body: { ids } });
}
