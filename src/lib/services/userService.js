import api from '@/lib/api';

/**
 * Servicio para gestión de usuarios
 * Sincronizado con /api/usuarios del backend
 */
export const userService = {
  /**
   * Obtiene el perfil del usuario actual (validación de token)
   */
  getMe: async () => {
    return await api.get('/usuarios/me');
  },

  /**
   * Obtiene la lista de usuarios (filtrando MASTER y sistema según backend)
   */
  getAll: async (params = {}) => {
    return await api.get('/usuarios', { params });
  },

  /**
   * Crea un nuevo usuario
   */
  create: async (userData) => {
    return await api.post('/usuarios', userData);
  },

  /**
   * Actualiza un usuario existente
   */
  update: async (id, userData) => {
    return await api.put(`/usuarios/${id}`, userData);
  },

  /**
   * Desactiva un usuario (Soft Delete)
   */
  deactivate: async (id) => {
    return await api.post(`/usuarios/${id}/deactivate`);
  }
};
