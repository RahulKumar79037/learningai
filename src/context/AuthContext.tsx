import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isActive: boolean;
  avatar?: string;
  dailyStudyGoalMinutes: number;
  studyStreak: number;
  lastActiveDate?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('lc_auth_token');
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data.data?.user) {
        setUser(res.data.data.user);
        localStorage.setItem('lc_user', JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      console.warn('Session restoration failed:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('lc_user');
      localStorage.removeItem('lc_auth_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth_logout', handleLogoutEvent);
    return () => window.removeEventListener('auth_logout', handleLogoutEvent);
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.post('/auth/login', { email, password: pass });
    if (res.data?.success) {
      const { user: loggedInUser, token: authToken } = res.data.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('lc_user', JSON.stringify(loggedInUser));
      localStorage.setItem('lc_auth_token', authToken);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.post('/auth/register', { name, email, password: pass });
    if (res.data?.success) {
      const { user: registeredUser, token: authToken } = res.data.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('lc_user', JSON.stringify(registeredUser));
      localStorage.setItem('lc_auth_token', authToken);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network failures on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('lc_user');
      localStorage.removeItem('lc_auth_token');
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem('lc_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
