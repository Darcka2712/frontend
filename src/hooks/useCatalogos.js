import { useState, useCallback, useMemo } from 'react';
import api from '@/lib/api';

export function useCatalogos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrapRequest = useCallback(async (requestFn) => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestFn();
      return response;
    } catch (err) {
      const msg = err.message || 'Error en catálogos';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllCatalogos = useCallback(
    (params) => wrapRequest(() => api.get('/catalogos', { params })),
    [wrapRequest]
  );

  const getCatalogoByTipo = useCallback(
    (tipo) => wrapRequest(() => api.get(`/catalogos/tipo/${tipo}`)),
    [wrapRequest]
  );

  const getCatalogoByTipoCodigo = useCallback(
    (tipo, codigo) => wrapRequest(() => api.get(`/catalogos/tipo/${tipo}/codigo/${codigo}`)),
    [wrapRequest]
  );

  const createCatalogo = useCallback(
    (data) => wrapRequest(() => api.post('/catalogos', data)),
    [wrapRequest]
  );

  const updateCatalogo = useCallback(
    (id, data) => wrapRequest(() => api.put(`/catalogos/${id}`, data)),
    [wrapRequest]
  );

  const deleteCatalogo = useCallback(
    (id) => wrapRequest(() => api.delete(`/catalogos/${id}`)),
    [wrapRequest]
  );

  return useMemo(() => ({
    loading,
    error,
    getAllCatalogos,
    getCatalogoByTipo,
    getCatalogoByTipoCodigo,
    createCatalogo,
    updateCatalogo,
    deleteCatalogo,
  }), [
    loading,
    error,
    getAllCatalogos,
    getCatalogoByTipo,
    getCatalogoByTipoCodigo,
    createCatalogo,
    updateCatalogo,
    deleteCatalogo,
  ]);
}
