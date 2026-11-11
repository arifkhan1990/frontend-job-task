import { API_BASE_URL } from '../config.js';
import { tokenStore } from './tokenStore.js';

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function readPayload(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toApiError(payload, status) {
  return new ApiError(
    payload?.error?.message || `Request failed (${status})`,
    status,
    payload?.error?.code,
    payload?.error?.details,
  );
}

async function authRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  const data = payload?.data;
  tokenStore.setToken(data.token);

  return data;
}

export function loginRequest(credentials) {
  return authRequest('/auth/login', credentials);
}

export function registerRequest(payload) {
  return authRequest('/auth/register', payload);
}

export async function apiRequest(
  path,
  { method = 'GET', body, auth = true, token } = {},
) {
  const headers = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const bearerToken = tokenStore.getToken() || token;

  if (auth && bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && bearerToken) {
    window.dispatchEvent(new Event('auth:expired'));
  }

  const payload = await readPayload(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  return payload;
}

const ERROR_KEYS = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Session expired. Please log in again.',
};

export function formatApiError(error, t = (key) => key) {
  if (!error) {
    return '';
  }

  const key = ERROR_KEYS[error.code];

  if (key) {
    return t(key);
  }

  if (Array.isArray(error.details) && error.details.length > 0) {
    return `${error.message}: ${error.details
      .map((detail) => `${detail.path} ${detail.message}`)
      .join('; ')}`;
  }

  return error.message || t('Something went wrong.');
}
