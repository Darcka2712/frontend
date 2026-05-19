'use client';

import { createContext, use, useReducer, useState, useEffect, useMemo, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

const initialState = {
  user: null,
  loading: true,
  error: null,
  isLoading: false
};

function authReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return { user: action.payload.user, loading: false, error: null, isLoading: false };
    case 'LOGIN':
      return { user: action.payload.user, loading: false, error: null, isLoading: false };
    case 'LOGOUT':
      return { user: null, loading: false, error: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LOGIN_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const { push } = useRouter();
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const initialize = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('user:v1');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      dispatch({
        type: 'INITIALIZE',
        payload: { user: JSON.parse(storedUser) }
      });

      // Validar token en segundo plano
      try {
        const response = await api.get('/usuarios/me');
        if (response.success) {
          localStorage.setItem('user:v1', JSON.stringify(response.data.user));
          dispatch({ type: 'INITIALIZE', payload: { user: response.data.user } });
        } else {
          throw new Error('Token inválido');
        }
      } catch (error) {
        console.error('Sesión expirada:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user:v1');
        dispatch({ type: 'INITIALIZE', payload: { user: null } });
      }
    } else {
      dispatch({ type: 'INITIALIZE', payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'SET_LOGIN_LOADING', payload: true });
    try {
      const response = await api.post('/usuarios/login', {
        user: credentials.email,
        password: credentials.password
      });

      if (response.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user:v1', JSON.stringify(user));

        dispatch({ type: 'LOGIN', payload: { user } });

        push('/dashboard');
        return { success: true };
      }
      const errorMsg = response.message || 'Credenciales inválidas';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, message: errorMsg };
    } catch (error) {
      const errorMsg = error.message || 'Error al iniciar sesión';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return {
        success: false,
        message: errorMsg
      };
    } finally {
      dispatch({ type: 'SET_LOGIN_LOADING', payload: false });
    }
  }, [push]);

  const logout = useCallback(async () => {
    try {
      await api.post('/usuarios/logout');
    } catch (error) {
      // Logout endpoint may not exist on backend; clear local state anyway
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user:v1');
      dispatch({ type: 'LOGOUT' });
      push('/auth/login');
    }
  }, [push]);

  const contextValue = useMemo(() => ({
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isLoading: authState.isLoading,
    login,
    logout
  }), [authState.user, authState.loading, authState.error, authState.isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => use(AuthContext);
