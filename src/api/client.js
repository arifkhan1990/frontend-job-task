const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event('auth:expired'));
    }

    throw new ApiError(
      payload?.error?.message || `Request failed (${response.status})`,
      response.status,
      payload?.error?.details,
    );
  }

  return payload;
}

export function formatApiError(error) {
  if (!error) {
    return '';
  }

  if (Array.isArray(error.details) && error.details.length > 0) {
    const details = error.details
      .map((detail) => `${detail.path} ${detail.message}`)
      .join('; ');
    return `${error.message}: ${details}`;
  }

  return error.message || 'Something went wrong';
}
