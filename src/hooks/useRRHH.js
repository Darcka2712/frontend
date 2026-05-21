'use client';

import { useState, useCallback, useMemo } from 'react';
import api from '@/lib/api';

/**
 * Hook para gestión de Recursos Humanos
 */
export function useRRHH() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const wrapRequest = useCallback(async (requestFn) => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestFn();
            return response;
        } catch (err) {
            const msg = err.message || 'Error en la operación de RRHH';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getEmpleados = useCallback((params) => wrapRequest(() => api.get('/empleados', { params })), [wrapRequest]);
    
    const createEmpleadoMultiTable = useCallback((data) => wrapRequest(() => api.post('/empleados/multi-table', data)), [wrapRequest]);
    
    const darDeBajaEmpleado = useCallback((id, motivo) => wrapRequest(() => api.post(`/empleados/${id}/deactivate`, { motivo })), [wrapRequest]);
    
    // TODO: Endpoint pendiente de implementación en backend
    const updateEmpleado = useCallback((id, data) => wrapRequest(() => api.put(`/empleados/${id}`, data)), [wrapRequest]);
    
    // TODO: Endpoint pendiente de implementación en backend
    const updateEmpleadoSection = useCallback((id, section, data) => wrapRequest(() => api.put(`/empleados/${id}/${section}`, data)), [wrapRequest]);
    
    const getCategoriasByEmpresa = useCallback((empresaId) => wrapRequest(() => api.get('/categorias', { params: { id_empresa: empresaId } })), [wrapRequest]);
    
    const getCategoriasSelect = useCallback(() => wrapRequest(() => api.get('/categorias/select')), [wrapRequest]);
    
    const getCategoriaById = useCallback((id) => wrapRequest(() => api.get(`/categorias/${id}`)), [wrapRequest]);

    const getPuestosSelect = useCallback(() => wrapRequest(() => api.get('/puestos/select')), [wrapRequest]);

    const getAreasByEmpresa = useCallback((empresaId) => wrapRequest(() => api.get('/areas', { params: { id_empresa: empresaId } })), [wrapRequest]);

    const getAreasSelect = useCallback(() => wrapRequest(() => api.get('/areas/select')), [wrapRequest]);

    const getTiposContrato = useCallback(() => wrapRequest(() => api.get('/catalogos/tipo/TIPO_CONTRATO')), [wrapRequest]);

    const getTiposPago = useCallback(() => wrapRequest(() => api.get('/catalogos/tipo/TIPO_PAGO')), [wrapRequest]);

    const getTiposBanco = useCallback(() => wrapRequest(() => api.get('/catalogos/tipo/TIPO_BANCO')), [wrapRequest]);

    const getTiposCuenta = useCallback(() => wrapRequest(() => api.get('/catalogos/tipo/TIPO_CUENTA')), [wrapRequest]);

    return useMemo(() => ({
        loading,
        error,
        getEmpleados,
        createEmpleadoMultiTable,
        updateEmpleado,
        updateEmpleadoSection,
        darDeBajaEmpleado,
        getCategoriasByEmpresa,
        getCategoriasSelect,
        getCategoriaById,
        getPuestosSelect,
        getAreasByEmpresa,
        getAreasSelect,
        getTiposContrato,
        getTiposPago,
        getTiposBanco,
        getTiposCuenta
    }), [loading, error, getEmpleados, createEmpleadoMultiTable, updateEmpleado, updateEmpleadoSection, darDeBajaEmpleado, getCategoriasByEmpresa, getCategoriasSelect, getCategoriaById, getPuestosSelect, getAreasByEmpresa, getAreasSelect, getTiposContrato, getTiposPago, getTiposBanco, getTiposCuenta]);
}
