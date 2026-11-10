import { apiRequest } from '../../api/client.js';

export function listUserPosts(userId, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest(`/users/${userId}/posts?${params.toString()}`, {
    auth: false,
  });
}

export function createPost(body) {
  return apiRequest('/posts', { method: 'POST', body });
}
