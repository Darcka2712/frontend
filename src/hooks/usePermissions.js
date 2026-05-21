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
    const getSistemas = (params = {}) => {
        const queryString = Object.entries(params)
            .filter(([_, val]) => val !== '' && val !== null && val !== undefined)
            .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            .join('&');
        const url = queryString ? `/api/sistemas?${queryString}` : '/api/sistemas';
        return apiRequest(url);
    };
    const createSistema = (data) => apiRequest('/api/sistemas', { method: 'POST', body: JSON.stringify(data) });
    const updateSistema = (id, data) => apiRequest(`/api/sistemas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const deleteSistema = (id) => apiRequest(`/api/sistemas/${id}`, { method: 'DELETE' });

    // Módulos
    const getModulos = (params = {}) => {
        const queryString = Object.entries(params)
            .filter(([_, val]) => val !== '' && val !== null && val !== undefined)
            .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            .join('&');
        const url = queryString ? `/api/modulos?${queryString}` : '/api/modulos';
        return apiRequest(url);
    };
    const getModulosBySistema = (sistemaId) => apiRequest(`/api/modulos/sistema/${sistemaId}`);
    const createModulo = (data) => apiRequest('/api/modulos', { method: 'POST', body: JSON.stringify(data) });
    const updateModulo = (id, data) => apiRequest(`/api/modulos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    const deleteModulo = (id) => apiRequest(`/api/modulos/${id}`, { method: 'DELETE' });

    // Permisos
    const getPermisos = (params = {}) => {
        const queryString = Object.entries(params)
            .filter(([_, val]) => val !== '' && val !== null && val !== undefined)
            .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            .join('&');
        const url = queryString ? `/api/permisos?${queryString}` : '/api/permisos';
        return apiRequest(url);
    };
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
