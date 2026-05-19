'use client';

import React from 'react';
import { 
  MoreHorizontal, 
  User, 
  Search,
  Building2, 
  MapPin, 
  Briefcase,
  FileText,
  UserMinus,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function EmployeeTable({ 
  empleados, 
  loading, 
  pagination, 
  onPageChange, 
  helpers,
  onAction,
  hasFilters = false
}) {
  const { totalPages = 1, page: currentPage = 1 } = pagination || {};

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-800/40 border border-slate-800" />
        ))}
      </div>
    );
  }

  if (!empleados || empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-slate-500">
          <Search className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-slate-200">
          {hasFilters ? 'No se encontraron empleados' : 'Busca empleados para comenzar'}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {hasFilters ? 'Intenta ajustar los filtros de búsqueda.' : 'Configura los filtros y presiona "Buscar Empleados".'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/50">
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Empleado</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Puesto & Área</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Ubicación</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Estado</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {empleados.map((emp) => (
                <tr 
                  key={emp.id_empleado}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  {/* Empleado Column */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                        {helpers.initials(emp)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-slate-100 truncate">
                          {emp.nombre} {emp.apellido_paterno}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          {emp.codigo_empleado}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Puesto & Área */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        {emp.puesto?.nombre_puesto || 'Sin puesto'}
                      </div>
                      <div className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${helpers.getCategoriaBadge(emp.id_categoria)}`}>
                        {emp.categoria?.nombre_categoria || 'General'}
                      </div>
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                        {emp.empresa?.nombre_empresa || 'Empresa'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {emp.categoria?.es_campo 
                          ? (emp.rancho?.nombre_rancho || 'Sin rancho')
                          : (emp.area?.nombre || 'Sin área')}
                      </div>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="p-5">
                    <div className="flex justify-center">
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        emp.activo 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${emp.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {emp.activo ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title="Ver detalles"
                        onClick={() => onAction('details', emp)}
                        className="rounded-xl border border-slate-700 bg-slate-800/50 p-2 text-slate-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button 
                        title="Dar de baja"
                        onClick={() => onAction('baja', emp)}
                        disabled={!emp.activo}
                        className="rounded-xl border border-slate-700 bg-slate-800/50 p-2 text-slate-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 p-6">
          <p className="text-xs text-slate-500 font-medium">
            Mostrando <span className="text-slate-300">{empleados.length}</span> de <span className="text-slate-300">{pagination?.total || 0}</span> empleados
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-110' 
                      : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-30 transition-all"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
