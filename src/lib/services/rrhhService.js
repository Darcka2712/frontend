import api from '@/lib/api';

/**
 * Servicio para Recursos Humanos
 */
export const rrhhService = {
  // Empleados
  getEmpleados: async (params) => {
    return await api.get('/empleados', { params });
  },
  
  createEmpleado: async (data) => {
    return await api.post('/empleados', data);
  },

  darDeBaja: async (id, motivo) => {
    return await api.post(`/empleados/${id}/baja`, { motivo });
  },

  // Catálogos
  getCategorias: async (params) => {
    return await api.get('/categorias', { params });
  },

  getPuestos: async (params) => {
    return await api.get('/puestos', { params });
  },

  getAreas: async (params) => {
    return await api.get('/areas', { params });
  },

  getTiposContrato: async () => {
    return await api.get('/catalogos/tipos-contrato');
  }
};
