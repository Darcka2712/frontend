import { useState, useCallback, useMemo } from 'react';
import api from '@/lib/api';

/**
 * Hook para gestión de la estructura organizacional y operacional
 * Utiliza el cliente API estandarizado y soporta paginación
 */
export function useOrganization() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const wrapRequest = useCallback(async (requestFn) => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestFn();
            return response;
        } catch (err) {
            const msg = err.message || 'Error en la operación organizacional';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Corporativos ---
    const getCorporativos = useCallback((params) => wrapRequest(() => api.get('/corporativos', { params })), [wrapRequest]);
    const getCorporativosComplete = useCallback(() => wrapRequest(() => api.get('/corporativos/select')), [wrapRequest]);
    const createCorporativo = useCallback((data) => wrapRequest(() => api.post('/corporativos', data)), [wrapRequest]);
    const updateCorporativo = useCallback((id, data) => wrapRequest(() => api.put(`/corporativos/${id}`, data)), [wrapRequest]);
    const deleteCorporativo = useCallback((id) => wrapRequest(() => api.delete(`/corporativos/${id}`)), [wrapRequest]);

    // --- Empresas ---
    const getEmpresas = useCallback((params) => wrapRequest(() => api.get('/empresas', { params })), [wrapRequest]);
    const getEmpresasComplete = useCallback(() => wrapRequest(() => api.get('/empresas/select')), [wrapRequest]);
    const getEmpresasSelect = useCallback(() => wrapRequest(() => api.get('/empresas/select')), [wrapRequest]);
    const createEmpresa = useCallback((data) => wrapRequest(() => api.post('/empresas', data)), [wrapRequest]);
    const updateEmpresa = useCallback((id, data) => wrapRequest(() => api.put(`/empresas/${id}`, data)), [wrapRequest]);
    const deleteEmpresa = useCallback((id) => wrapRequest(() => api.delete(`/empresas/${id}`)), [wrapRequest]);

    // --- Ranchos ---
    const getRanchos = useCallback((params) => wrapRequest(() => api.get('/ranchos', { params })), [wrapRequest]);
    const getRanchosSelect = useCallback(() => wrapRequest(() => api.get('/ranchos/select')), [wrapRequest]);
    const createRancho = useCallback((data) => wrapRequest(() => api.post('/ranchos', data)), [wrapRequest]);
    const updateRancho = useCallback((id, data) => wrapRequest(() => api.put(`/ranchos/${id}`, data)), [wrapRequest]);
    const deleteRancho = useCallback((id) => wrapRequest(() => api.delete(`/ranchos/${id}`)), [wrapRequest]);

    // --- Sectores ---
    const getSectores = useCallback((params) => wrapRequest(() => api.get('/sectores', { params })), [wrapRequest]);
    const getSectoresSelect = useCallback(() => wrapRequest(() => api.get('/sectores/select')), [wrapRequest]);
    const createSector = useCallback((data) => wrapRequest(() => api.post('/sectores', data)), [wrapRequest]);
    const updateSector = useCallback((id, data) => wrapRequest(() => api.put(`/sectores/${id}`, data)), [wrapRequest]);
    const deleteSector = useCallback((id) => wrapRequest(() => api.delete(`/sectores/${id}`)), [wrapRequest]);
    
    // --- Cultivos & Variedades ---
    const getCultivos = useCallback((params) => wrapRequest(() => api.get('/cultivos', { params })), [wrapRequest]);
    const getCultivosSelect = useCallback(() => wrapRequest(() => api.get('/cultivos/select')), [wrapRequest]);
    const getCultivosTipo = useCallback((params) => wrapRequest(() => api.get('/cultivos/tipos', { params })), [wrapRequest]);
    const createCultivo = useCallback((data) => wrapRequest(() => api.post('/cultivos', data)), [wrapRequest]);
    const createCultivoTipo = useCallback((data) => wrapRequest(() => api.post('/cultivos/tipos', data)), [wrapRequest]);
    const updateCultivo = useCallback((id, data) => wrapRequest(() => api.put(`/cultivos/${id}`, data)), [wrapRequest]);
    const updateCultivoTipo = useCallback((id, data) => wrapRequest(() => api.put(`/cultivos/tipos/${id}`, data)), [wrapRequest]);
    const deleteCultivo = useCallback((id) => wrapRequest(() => api.delete(`/cultivos/${id}`)), [wrapRequest]);
    const deleteCultivoTipo = useCallback((id) => wrapRequest(() => api.delete(`/cultivos/tipos/${id}`)), [wrapRequest]);
    const getVariedades = useCallback((params) => wrapRequest(() => api.get('/variedades', { params })), [wrapRequest]);
    const getVariedadesSelect = useCallback((id_cultivo) => wrapRequest(() => api.get('/variedades/select', { params: { id_cultivo } })), [wrapRequest]);
    const getVariedadesPorTipo = useCallback((id_cultivo) => wrapRequest(() => api.get('/variedades', { params: { id_cultivo } })), [wrapRequest]);
    const createVariedad = useCallback((data) => wrapRequest(() => api.post('/variedades', data)), [wrapRequest]);
    const updateVariedad = useCallback((id, data) => wrapRequest(() => api.put(`/variedades/${id}`, data)), [wrapRequest]);
    const deleteVariedad = useCallback((id) => wrapRequest(() => api.delete(`/variedades/${id}`)), [wrapRequest]);

    // --- Áreas & Departamentos ---
    const getAreas = useCallback((params) => wrapRequest(() => api.get('/areas', { params })), [wrapRequest]);
    const getAreasSelect = useCallback(() => wrapRequest(() => api.get('/areas/select')), [wrapRequest]);
    const getAreasComplete = useCallback(() => wrapRequest(() => api.get('/areas/select')), [wrapRequest]);

    // --- RRHH Catalogos (Asistencia/Empleados) ---
    const getCategoriasSelect = useCallback(() => wrapRequest(() => api.get('/categorias/select')), [wrapRequest]);
    const getPuestosSelect = useCallback(() => wrapRequest(() => api.get('/puestos/select')), [wrapRequest]);
    const getEmpleadosSelect = useCallback(() => wrapRequest(() => api.get('/empleados/select')), [wrapRequest]);

    // --- Asistencia ---
    const getAsistencias = useCallback((params) => wrapRequest(() => api.get('/asistencia', { params })), [wrapRequest]);
    const getResumenDiario = useCallback((params) => wrapRequest(() => api.get('/asistencia/resumen-diario', { params })), [wrapRequest]);
    const createAsistencia = useCallback((data) => wrapRequest(() => api.post('/asistencia', data)), [wrapRequest]);
    const updateAsistencia = useCallback((id, data) => wrapRequest(() => api.put(`/asistencia/${id}`, data)), [wrapRequest]);
    const deleteAsistencia = useCallback((id) => wrapRequest(() => api.delete(`/asistencia/${id}`)), [wrapRequest]);

    // --- Roles ---
    const getRolesList = useCallback((params) => wrapRequest(() => api.get('/roles', { params })), [wrapRequest]);
    const createRole = useCallback((data) => wrapRequest(() => api.post('/roles/create', data)), [wrapRequest]);
    const updateRole = useCallback((id, data) => wrapRequest(() => api.put(`/roles/${id}`, data)), [wrapRequest]);
    const deleteRole = useCallback((id) => wrapRequest(() => api.delete(`/roles/${id}`)), [wrapRequest]);

    return useMemo(() => ({
        loading,
        error,
        // Corporativos
        getCorporativos,
        getCorporativosComplete,
        createCorporativo,
        updateCorporativo,
        deleteCorporativo,
        // Empresas
        getEmpresas,
        getEmpresasComplete,
        getEmpresasSelect,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
        // Ranchos
        getRanchos,
        getRanchosSelect,
        createRancho,
        updateRancho,
        deleteRancho,
        // Sectores
        getSectores,
        getSectoresSelect,
        createSector,
        updateSector,
        deleteSector,
        // Cultivos
        getCultivos,
        getCultivosSelect,
        getCultivosTipo,
        createCultivo,
        createCultivoTipo,
        updateCultivo,
        updateCultivoTipo,
        deleteCultivo,
        deleteCultivoTipo,
        getVariedades,
        getVariedadesSelect,
        getVariedadesPorTipo,
        createVariedad,
        updateVariedad,
        deleteVariedad,
        // Areas
        getAreas,
        getAreasSelect,
        getAreasComplete,
        // Catalogs
        getCategoriasSelect,
        getPuestosSelect,
        getEmpleadosSelect,
        // Asistencia
        getAsistencias,
        getResumenDiario,
        createAsistencia,
        updateAsistencia,
        deleteAsistencia,
        // Roles
        getRolesList,
        createRole,
        updateRole,
        deleteRole
    }), [
        loading,
        error,
        getCorporativos,
        getCorporativosComplete,
        createCorporativo,
        updateCorporativo,
        deleteCorporativo,
        getEmpresas,
        getEmpresasComplete,
        getEmpresasSelect,
        createEmpresa,
        updateEmpresa,
        deleteEmpresa,
        getRanchos,
        getRanchosSelect,
        createRancho,
        updateRancho,
        deleteRancho,
        getSectores,
        getSectoresSelect,
        createSector,
        updateSector,
        deleteSector,
        getCultivos,
        getCultivosSelect,
        getCultivosTipo,
        createCultivo,
        createCultivoTipo,
        updateCultivo,
        updateCultivoTipo,
        deleteCultivo,
        deleteCultivoTipo,
        getVariedades,
        getVariedadesSelect,
        getVariedadesPorTipo,
        createVariedad,
        updateVariedad,
        deleteVariedad,
        getAreas,
        getAreasSelect,
        getAreasComplete,
        getCategoriasSelect,
        getPuestosSelect,
        getEmpleadosSelect,
        getAsistencias,
        getResumenDiario,
        createAsistencia,
        updateAsistencia,
        deleteAsistencia,
        getRolesList,
        createRole,
        updateRole,
        deleteRole
    ]);
}

