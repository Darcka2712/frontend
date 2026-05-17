import axios from 'axios';

/**
 * Normaliza NEXT_PUBLIC_API_URL: siempre termina en .../api (sin slash final).
 * Vacío → en cliente se usa mismo origen + /api (rewrites de Next).
 */
export function resolvePublicApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api`;
    }
    return 'http://localhost:3000/api';
  }
  let base = raw.replace(/\/$/, '');
  if (!base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

/**
 * URL absoluta para fetch desde el navegador (mismo patrón que Axios).
 */
export function publicApiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = resolvePublicApiBaseUrl();
  return `${base}${p}`;
}

/** Inicializa fetch con credenciales y Bearer si hay token en localStorage */
export function authFetchInit(init = {}) {
  const { headers: initHeaders = {}, ...rest } = init;
  const headers = { ...initHeaders };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return { credentials: 'include', ...rest, headers };
}

const api = axios.create({
  baseURL: resolvePublicApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error inesperado en el servidor';

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname === '/auth/login';
        if (!isLoginPage) {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
      success: false,
    });
  }
);

export const auditoriaApi = {
  getLogs: (params) => api.get('/auditoria', { params }),
  getLog: (id) => api.get(`/auditoria/${id}`),
};

export default api;
