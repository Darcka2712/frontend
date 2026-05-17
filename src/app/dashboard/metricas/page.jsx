'use client';

import { useEffect, useMemo, useState } from 'react';

import BarChart from '@/components/metricas/BarChart';
import CircularMetric from '@/components/metricas/CircularMetric';
import TimelineMetrics from '@/components/metricas/TimelineMetrics';

// Componente principal del dashboard de métricas
export default function MetricasDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  
  const [metricas, setMetricas] = useState({
    usuarios: {
      total: 0,
      activos: 0,
      nuevosEsteMes: 0,
      porRol: [],
      actividadReciente: []
    },
    sistema: {
      operacionesHoy: 0,
      sesionesActivas: 0,
      tiempoRespuesta: 0,
      errores: 0,
      usoPorHora: []
    },
    corporativo: {
      empresas: 0,
      ranchos: 0,
      sectores: 0,
      cultivos: 0,
      estructuraActiva: []
    },
    operaciones: {
      mezclasHoy: 0,
      combustibleConsumido: 0,
      activosEnUso: 0,
      mantenimientoPendiente: 0,
      operacionesPorTipo: []
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [loading, setLoading] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState('7d');
  const [selectedCategoria, setSelectedCategoria] = useState('usuarios');

  const fetchMetricas = async (periodo = selectedPeriodo) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/metricas?periodo=${periodo}`, {
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        setMetricas(data);
      }
    } catch (e) {
      console.error('Error cargando métricas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, [selectedPeriodo]);

  // Datos para gráficos
  const usuariosPorRol = useMemo(() => {
    return metricas.usuarios.porRol.map(rol => ({
      label: rol.nombre_rol || rol.rol,
      value: rol.cantidad || rol.count
    }));
  }, [metricas.usuarios.porRol]);

  const operacionesPorTipo = useMemo(() => {
    return metricas.operaciones.operacionesPorTipo.map(op => ({
      label: op.tipo || op.type,
      value: op.cantidad || op.count
    }));
  }, [metricas.operaciones.operacionesPorTipo]);

  const actividadReciente = useMemo(() => {
    if (!isClient) return [];
    return metricas.usuarios.actividadReciente.slice(0, 7).map(act => ({
      date: act.fecha ? new Date(act.fecha).toLocaleDateString() : '',
      value: act.cantidad || act.count
    }));
  }, [metricas.usuarios.actividadReciente, isClient]);

  const usoPorHora = useMemo(() => {
    return metricas.sistema.usoPorHora.slice(0, 24).map(hora => ({
      date: `${hora.hora}:00`,
      value: hora.cantidad || hora.count
    }));
  }, [metricas.sistema.usoPorHora]);

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard de Métricas</h1>
          <p className="text-sm text-gray-600 mt-1">Análisis completo del sistema</p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>

          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="usuarios">Usuarios</option>
            <option value="sistema">Sistema</option>
            <option value="corporativo">Corporativo</option>
            <option value="operaciones">Operaciones</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
              <p className="text-3xl font-bold text-blue-600">{metricas.usuarios.total}</p>
              <p className="text-sm text-green-600 mt-1">
                +{metricas.usuarios.nuevosEsteMes} este mes
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Operaciones Hoy</p>
              <p className="text-3xl font-bold text-green-600">{metricas.sistema.operacionesHoy}</p>
              <p className="text-sm text-gray-600 mt-1">
                {metricas.sistema.sesionesActivas} sesiones activas
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estructura Corporativa</p>
              <p className="text-3xl font-bold text-purple-600">
                {metricas.corporativo.empresas + metricas.corporativo.ranchos + metricas.corporativo.sectores}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {metricas.corporativo.empresas} empresas activas
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rendimiento Sistema</p>
              <p className="text-3xl font-bold text-orange-600">
                {metricas.sistema.tiempoRespuesta < 100 ? '✓' : '⚠'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {metricas.sistema.tiempoRespuesta}ms promedio
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios por rol */}
        <BarChart
          data={usuariosPorRol}
          title="Usuarios por Rol"
          color="bg-blue-500"
        />

        {/* Operaciones por tipo */}
        <BarChart
          data={operacionesPorTipo}
          title="Operaciones por Tipo"
          color="bg-green-500"
        />

        {/* Actividad reciente */}
        <TimelineMetrics
          data={actividadReciente}
          title="Actividad de Usuarios (Últimos 7 días)"
        />

        {/* Uso por hora */}
        <TimelineMetrics
          data={usoPorHora}
          title="Uso del Sistema por Hora"
        />
      </div>

      {/* Métricas circulares detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CircularMetric
          value={metricas.usuarios.activos}
          max={metricas.usuarios.total}
          label="Usuarios Activos"
          color="text-blue-600"
        />

        <CircularMetric
          value={metricas.sistema.sesionesActivas}
          max={50}
          label="Sesiones Concurrentes"
          color="text-green-600"
        />

        <CircularMetric
          value={metricas.operaciones.mezclasHoy}
          max={100}
          label="Mezclas del Día"
          color="text-purple-600"
        />

        <CircularMetric
          value={100 - (metricas.sistema.errores * 10)}
          max={100}
          label="Disponibilidad"
          color="text-orange-600"
        />
      </div>

      {/* Información detallada por categoría */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Información Detallada - {selectedCategoria.charAt(0).toUpperCase() + selectedCategoria.slice(1)}
        </h2>

        {selectedCategoria === 'usuarios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Usuarios Activos vs Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Usuarios activos</span>
                  <span className="text-sm font-medium">{metricas.usuarios.activos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Usuarios totales</span>
                  <span className="text-sm font-medium">{metricas.usuarios.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nuevos este mes</span>
                  <span className="text-sm font-medium text-green-600">+{metricas.usuarios.nuevosEsteMes}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Última actividad</h3>
              <div className="text-sm text-gray-600">
                {metricas.usuarios.actividadReciente.length > 0 ? (
                  <div>
                    <p>Último acceso: {isClient && metricas.usuarios.actividadReciente[0].fecha ? new Date(metricas.usuarios.actividadReciente[0].fecha).toLocaleString() : '---'}</p>
                    <p>Operaciones recientes: {metricas.sistema.operacionesHoy}</p>
                  </div>
                ) : (
                  <p>No hay actividad reciente registrada</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedCategoria === 'sistema' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Rendimiento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo de respuesta</span>
                  <span className="text-sm font-medium">{metricas.sistema.tiempoRespuesta}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Errores del día</span>
                  <span className="text-sm font-medium">{metricas.sistema.errores}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Sesiones</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activas ahora</span>
                  <span className="text-sm font-medium">{metricas.sistema.sesionesActivas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Operaciones hoy</span>
                  <span className="text-sm font-medium">{metricas.sistema.operacionesHoy}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Estado</h3>
              <div className="space-y-2">
                <div className={`flex justify-between ${metricas.sistema.tiempoRespuesta < 100 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-sm">Sistema</span>
                  <span className="text-sm font-medium">
                    {metricas.sistema.tiempoRespuesta < 100 ? 'Óptimo' : 'Lento'}
                  </span>
                </div>
                <div className={`flex justify-between ${metricas.sistema.errores === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  <span className="text-sm">Errores</span>
                  <span className="text-sm font-medium">
                    {metricas.sistema.errores === 0 ? 'Ninguno' : metricas.sistema.errores}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategoria === 'corporativo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metricas.corporativo.empresas}</div>
              <div className="text-sm text-gray-600">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metricas.corporativo.ranchos}</div>
              <div className="text-sm text-gray-600">Ranchos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metricas.corporativo.sectores}</div>
              <div className="text-sm text-gray-600">Sectores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metricas.corporativo.cultivos}</div>
              <div className="text-sm text-gray-600">Cultivos</div>
            </div>
          </div>
        )}

        {selectedCategoria === 'operaciones' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Operaciones del Día</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mezclas creadas</span>
                  <span className="text-sm font-medium">{metricas.operaciones.mezclasHoy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Combustible consumido</span>
                  <span className="text-sm font-medium">{metricas.operaciones.combustibleConsumido}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activos en uso</span>
                  <span className="text-sm font-medium">{metricas.operaciones.activosEnUso}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Mantenimiento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pendiente</span>
                  <span className={`text-sm font-medium ${metricas.operaciones.mantenimientoPendiente > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {metricas.operaciones.mantenimientoPendiente}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado general</span>
                  <span className={`text-sm font-medium ${metricas.operaciones.mantenimientoPendiente === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {metricas.operaciones.mantenimientoPendiente === 0 ? 'Óptimo' : 'Requiere atención'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-700">Actualizando métricas&hellip;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
