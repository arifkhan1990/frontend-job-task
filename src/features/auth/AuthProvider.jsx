import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  loginRequest,
  logoutRequest,
  refreshSession,
  registerRequest,
} from '../../api/client.js';
import { tokenStore } from '../../api/tokenStore.js';

const AuthContext = createContext(null);
const USER_KEY = 'notes_api_user';

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(() => !readCachedUser());

  useEffect(() => {
    let cancelled = false;

    refreshSession()
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          cacheUser(data.user);
        }
      })
      .catch((error) => {
        // No refresh cookie or an expired session is a normal anonymous start.
        if (!cancelled && error?.status === 401) {
          setUser(null);
          cacheUser(null);
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
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      tokenStore.clear();
      setUser(null);
      cacheUser(null);
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
    setUser(data.user);
    cacheUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);
    setUser(data.user);
    cacheUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      tokenStore.clear();
      setUser(null);
      cacheUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      token: tokenStore.getAccessToken(),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
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
