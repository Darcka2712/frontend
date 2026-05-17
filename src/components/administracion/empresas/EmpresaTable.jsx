'use client';

import React from 'react';
import { Edit2, Trash2, Power, ChevronLeft, ChevronRight } from 'lucide-react';

const EmpresaTable = ({ empresas = [], loading, pagination, onPageChange, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Empresa</th>
            <th className="px-6 py-5">RFC</th>
            <th className="px-6 py-5">Corporativo</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && empresas.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando empresas...</td>
            </tr>
          ) : empresas.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">No se encontraron empresas</td>
            </tr>
          ) : (
            empresas.map((e) => (
              <tr key={e.id_empresa || e.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-white">{e.nombre_empresa}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-mono text-slate-400 font-bold">{e.rfc_empresa || '-'}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs text-slate-500">{e.corporativo?.nombre_corporativo || '-'}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${e.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${e.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {e.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStatus(e)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors" title={e.activo ? 'Desactivar' : 'Activar'}><Power size={16} /></button>
                    <button onClick={() => onEdit(e)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(e)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/20">
          <span className="text-xs text-slate-500 font-medium">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaTable;
