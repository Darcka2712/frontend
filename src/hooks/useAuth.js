'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

/**
 * Hook de autenticación y gestión de usuarios.
 */
export function useAuth() {
    const { push } = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const wrapRequest = useCallback(async (requestFn) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await requestFn();
            return response;
        } catch (err) {
            const msg = err.message || 'Error en la operación de autenticación';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.post('/usuario/login', {
                user: credentials.email,
                password: credentials.password,
            });

            if (response.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user:v1', JSON.stringify(user));

                const displayName = user?.nombre || user?.usuario || 'Usuario';
                toast.success('¡Bienvenido de vuelta!', {
                    description: `Sesión iniciada como ${displayName}`,
                });

                startTransition(() => {
                    push('/dashboard');
                });
                return response.data;
            }
        } catch (err) {
            const errorMsg = err.message || 'Error al iniciar sesión';
            setError(errorMsg);
            toast.error('Fallo en el ingreso', {
                description: errorMsg,
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/usuario/logout');
        } catch (e) {
            console.error('Logout error on server:', e);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user:v1');
            toast.info('Sesión cerrada');
            startTransition(() => {
                push('/auth/login');
            });
        }
    };

    // --- User Management (Expected by UsuariosPage) ---
    const getUsuarios = (params) => wrapRequest(() => api.get('/usuario', { params }));
    const createUsuario = (data) => wrapRequest(() => api.post('/usuario', data));
    const updateUsuario = (id, data) => wrapRequest(() => api.put(`/usuario/${id}`, data));
    const deleteUsuario = (id) => wrapRequest(() => api.delete(`/usuario/${id}`));
    const changePassword = (id, data) => wrapRequest(() => api.put(`/usuario/${id}/password`, data));

    // --- Roles ---
    const getRoles = () => wrapRequest(() => api.get('/roles/select'));

    return {
        login,
        logout,
        getUsuarios,
        createUsuario,
        updateUsuario,
        deleteUsuario,
        changePassword,
        getRoles,
        isLoading: isLoading || isPending,
        loading: isLoading || isPending, // Alias for UsuariosPage
        error,
    };
}
