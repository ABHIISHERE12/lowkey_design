import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';

const TOKEN_KEY = 'lld_token';
const USER_KEY = 'lld_user';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const toSafeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
  };
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextToken, nextUser) => {
    const safeUser = toSafeUser(nextUser);
    persistSession(nextToken, safeUser);
    setToken(nextToken);
    setUser(safeUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(storedToken);
        const safeUser = toSafeUser(data.user);
        persistSession(storedToken, safeUser);
        setToken(storedToken);
        setUser(safeUser);
      } catch {
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    if (!data.token || !data.user) {
      throw new Error('Login succeeded but no session was returned.');
    }
    applySession(data.token, data.user);
    navigate('/', { replace: true });
    return data;
  }, [applySession, navigate]);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });

    if (data.token && data.user) {
      applySession(data.token, data.user);
      navigate('/', { replace: true });
      return data;
    }

    const loginData = await loginUser({ email, password });
    if (!loginData.token || !loginData.user) {
      throw new Error('Account created, but signing in failed. Please log in.');
    }
    applySession(loginData.token, loginData.user);
    navigate('/', { replace: true });
    return loginData;
  }, [applySession, navigate]);

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token && user),
    user,
    token,
    loading,
    login,
    register,
    logout,
  }), [token, user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
