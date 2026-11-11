import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest, loginRequest, registerRequest } from '../../api/client.js';
import { tokenStore } from '../../api/tokenStore.js';

const AuthContext = createContext(null);
const USER_KEY = 'notes_api_user';
const TOKEN_KEY = 'notes_api_token';

function readCachedUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

function cacheUser(user) {
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_KEY);
  }
}

function readCachedToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function cacheToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => readCachedToken());
  const [user, setUser] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(() => Boolean(readCachedToken()));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    tokenStore.setToken(token);
    setLoading(true);

    apiRequest('/auth/me', { token })
      .then((payload) => {
        if (!cancelled) {
          setUser(payload.data.user);
          cacheUser(payload.data.user);
        }
      })
      .catch((error) => {
        if (!cancelled && error?.status === 401) {
          tokenStore.clear();
          cacheToken(null);
          cacheUser(null);
          setTokenState(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const handleExpired = () => {
      tokenStore.clear();
      cacheToken(null);
      cacheUser(null);
      setTokenState(null);
      setUser(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (emailOrCredentials, maybePassword) => {
    const credentials =
      typeof emailOrCredentials === 'string'
        ? { email: emailOrCredentials, password: maybePassword }
        : emailOrCredentials;
    const data = await loginRequest(credentials);

    tokenStore.setToken(data.token);
    cacheToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    cacheUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);

    tokenStore.setToken(data.token);
    cacheToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    cacheUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    cacheToken(null);
    cacheUser(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, token, login, register, logout }),
    [user, loading, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
