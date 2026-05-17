'use client';
import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export function usePermissions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiRequest = useCallback(async (url, options = {}) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('access_token');

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            // Devolver directamente el contenido útil
            return data.data || data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Sistemas
    const getSistemas = () => apiRequest('/api/sistemas');
    const createSistema = (data) => apiRequest('/api/sistemas', { method: 'POST', body: JSON.stringify(data) });
    const updateSistema = (id, data) => apiRequest(`/api/sistemas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const deleteSistema = (id) => apiRequest(`/api/sistemas/${id}`, { method: 'DELETE' });

    // Módulos
    const getModulos = () => apiRequest('/api/modulos');
    const getModulosBySistema = (sistemaId) => apiRequest(`/api/modulos/sistema/${sistemaId}`);
    const createModulo = (data) => apiRequest('/api/modulos', { method: 'POST', body: JSON.stringify(data) });
    const updateModulo = (id, data) => apiRequest(`/api/modulos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const deleteModulo = (id) => apiRequest(`/api/modulos/${id}`, { method: 'DELETE' });

    // Permisos
    const getPermisos = () => apiRequest('/api/permisos');
    const getPermisosByModulo = (moduloId) => apiRequest(`/api/permisos/modulo/${moduloId}`);
    const createPermiso = (data) => apiRequest('/api/permisos', { method: 'POST', body: JSON.stringify(data) });
    const updatePermiso = (id, data) => apiRequest(`/api/permisos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const deletePermiso = (id) => apiRequest(`/api/permisos/${id}`, { method: 'DELETE' });

    return {
        loading,
        error,
        getSistemas,
        createSistema,
        updateSistema,
        deleteSistema,
        getModulos,
        getModulosBySistema,
        createModulo,
        updateModulo,
        deleteModulo,
        getPermisos,
        getPermisosByModulo,
        createPermiso,
        updatePermiso,
        deletePermiso
    };
}
