'use client';

import React from 'react';
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ACCION_COLORS = {
  ver: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  crear: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  eliminar: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  editar: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const PermisosTable = ({
  permisos = [],
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  hasFilters = false
}) => {
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

  if (!permisos || permisos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-slate-500">
          <Search className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-slate-200">
          {hasFilters ? 'No se encontraron permisos' : 'Busca permisos para comenzar'}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {hasFilters ? 'Intenta ajustar los filtros de búsqueda.' : 'Configura los filtros y presiona "Buscar Permisos".'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-900/50">
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Servicio</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Atributo</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Descripción</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Estado</th>
                <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {permisos.map((p) => (
                <tr key={p.id_permiso} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="p-5">
                    <span className="text-sm font-semibold text-slate-100">{p.modulo?.nombre || 'N/A'}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      {p.modulo?.sistema?.nombre || ''}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                      ACCION_COLORS[p.accion] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {p.accion}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-xs text-slate-400 max-w-xs truncate block">
                      {p.descripcion || 'Sin descripción'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        p.activo
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="rounded-xl border border-slate-700 bg-slate-800/50 p-2 text-slate-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-xl border border-slate-700 bg-slate-800/50 p-2 text-slate-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
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
            Mostrando <span className="text-slate-300">{permisos.length}</span> de <span className="text-slate-300">{pagination?.total || 0}</span> permisos
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
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-110'
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
};

export default PermisosTable;
