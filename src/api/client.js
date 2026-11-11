import { API_BASE_URL } from '../config.js';
import { tokenStore } from './tokenStore.js';

const AUTH_PATHS = new Set([
  '/auth/csrf',
  '/auth/login',
  '/auth/logout',
  '/auth/refresh',
  '/auth/register',
]);

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

let csrfPromise = null;
let refreshPromise = null;

async function fetchCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  const csrfToken = payload?.data?.csrfToken;

  if (!csrfToken) {
    throw new ApiError('Could not initialize CSRF protection', response.status, 'CSRF_ERROR');
  }

  tokenStore.setCsrfToken(csrfToken);
  return csrfToken;
}

async function ensureCsrfToken() {
  const existing = tokenStore.getCsrfToken();

  if (existing) {
    return existing;
  }

  if (!csrfPromise) {
    csrfPromise = fetchCsrfToken().finally(() => {
      csrfPromise = null;
    });
  }

  return csrfPromise;
}

async function performRefresh() {
  const csrfToken = await ensureCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    tokenStore.clear();
    window.dispatchEvent(new Event('auth:expired'));
    throw toApiError(payload, response.status);
  }

  const data = payload?.data;
  tokenStore.setAccessToken(data.accessToken);
  tokenStore.setCsrfToken(data.csrfToken);

  return data;
}

export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function authRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const payload = await readPayload(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  const data = payload?.data;
  tokenStore.setAccessToken(data.accessToken);
  tokenStore.setCsrfToken(data.csrfToken);

  return data;
}

export function loginRequest(credentials) {
  return authRequest('/auth/login', credentials);
}

export function registerRequest(payload) {
  return authRequest('/auth/register', payload);
}

export async function logoutRequest() {
  try {
    const csrfToken = await ensureCsrfToken();

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });
  } finally {
    tokenStore.clear();
  }
}

export async function apiRequest(
  path,
  { method = 'GET', body, auth = true, retry = true, token } = {},
) {
  const headers = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  // The in-memory token wins; the fallback keeps the pre-refactor pages working
  // while they are migrated to the new provider.
  const bearerToken = tokenStore.getAccessToken() || token;

  if (auth && bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && retry && !AUTH_PATHS.has(path)) {
    await refreshSession();
    return apiRequest(path, { method, body, auth, retry: false });
  }

  const payload = await readPayload(response);

  if (!response.ok) {
    throw toApiError(payload, response.status);
  }

  return payload;
}

const ERROR_KEYS = {
  CSRF_ERROR: 'Session expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Session expired. Please log in again.',
  REFRESH_TOKEN_REUSED: 'Session expired. Please log in again.',
  REFRESH_TOKEN_EXPIRED: 'Session expired. Please log in again.',
  REFRESH_TOKEN_REQUIRED: 'Session expired. Please log in again.',
};

export function formatApiError(error) {
  if (!error) {
    return '';
  }

  const key = ERROR_KEYS[error.code];

  if (key) {
    return key;
  }

  if (Array.isArray(error.details) && error.details.length > 0) {
    return `${error.message}: ${error.details
      .map((detail) => `${detail.path} ${detail.message}`)
      .join('; ')}`;
  }

  return error.message || 'Something went wrong.';
}
