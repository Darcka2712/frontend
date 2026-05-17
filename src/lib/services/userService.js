import api from '@/lib/api';

/**
 * Servicio para gestión de usuarios
 * Sincronizado con /api/usuario del backend
 */
export const userService = {
  /**
   * Obtiene el perfil del usuario actual (validación de token)
   */
  getMe: async () => {
    return await api.get('/usuario/me');
  },

  /**
   * Obtiene la lista de usuarios (filtrando MASTER y sistema según backend)
   */
  getAll: async (params = {}) => {
    return await api.get('/usuario', { params });
  },

  /**
   * Crea un nuevo usuario
   */
  create: async (userData) => {
    return await api.post('/usuario', userData);
  },

  /**
   * Actualiza un usuario existente
   */
  update: async (id, userData) => {
    return await api.put(`/usuario/${id}`, userData);
  },

  /**
   * Desactiva un usuario (Soft Delete)
   */
  deactivate: async (id) => {
    return await api.post(`/usuario/${id}/deactivate`);
  }
};
