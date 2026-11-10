import { apiRequest } from '../../api/client.js';

function noteQuery({ page = 1, limit = 10, ownerId } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (ownerId) {
    params.set('ownerId', ownerId);
  }

  return params.toString();
}

export function listNotes(params) {
  return apiRequest(`/notes?${noteQuery(params)}`);
}

export function createNote(body) {
  return apiRequest('/notes', { method: 'POST', body });
}

export function updateNote(id, body) {
  return apiRequest(`/notes/${id}`, { method: 'PATCH', body });
}

export function deleteNote(id) {
  return apiRequest(`/notes/${id}`, { method: 'DELETE' });
}
