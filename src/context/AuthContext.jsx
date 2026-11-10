import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from '../api/client.js';

const TOKEN_KEY = 'notes_api_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    apiRequest('/auth/me', { token })
      .then((payload) => {
        if (!cancelled) {
          setUser(payload.data.user);
        }
      })
      .catch((error) => {
        if (!cancelled && error.status === 401) {
          setToken(null);
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
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    setToken(payload.data.token);
    setUser(payload.data.user);
  }, []);

  const register = useCallback(async (data) => {
    const payload = await apiRequest('/auth/register', {
      method: 'POST',
      body: data,
    });

    setToken(payload.data.token);
    setUser(payload.data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading, login, register, logout],
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
