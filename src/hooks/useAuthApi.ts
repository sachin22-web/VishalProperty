// src/hooks/useAuthApi.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  phone?: string;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  success?: boolean;
}

export const useAuthApi = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const persistSession = useCallback((res: AuthResponse) => {
    if (!res?.token || !res?.user) throw new Error('Invalid auth response');
    api.setToken(res.token);
    setUser(res.user);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCurrentUser(); // expects { user }
      if (res?.user) setUser(res.user);
      else setUser(null);
      return res;
    } catch {
      // token invalid/expired
      api.clearToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
      // fire and forget
      checkAuth();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = (await api.userLogin(email, password)) as AuthResponse;
      persistSession(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Uses the same endpoint as user login; role is enforced in api.adminLogin
  const adminLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = (await api.adminLogin(email, password)) as AuthResponse;
      // double-check on client too
      if (res?.user?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      persistSession(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = (await api.userSignup(
        name,
        email,
        phone,
        password,
        confirmPassword
      )) as AuthResponse;
      persistSession(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore API errors on logout
    } finally {
      api.clearToken();
      setUser(null);
      setError(null);
      navigate('/', { replace: true });
    }
  };

  // Optional helper to protect admin routes in components
  const requireAdmin = useCallback(async () => {
    const res = await checkAuth();
    if (!res?.user || res.user.role !== 'admin') {
      navigate('/admin/login', {
        replace: true,
        state: { from: location },
      });
      throw new Error('Admin access required');
    }
    return true;
  }, [checkAuth, navigate, location]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    adminLogin,
    signup,
    logout,
    refresh: checkAuth,
    requireAdmin,
  };
};
