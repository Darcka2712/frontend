'use client';

import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AreaTable = ({ areas = [], pagination, loading, onEdit, onDelete, onPageChange }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Nombre</th>
            <th className="px-6 py-5">Descripción</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && areas.length === 0 ? (
            <tr><td colSpan="4" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando áreas...</td></tr>
          ) : areas.length === 0 ? (
            <tr><td colSpan="4" className="px-6 py-16 text-center text-slate-500 italic font-medium">No se encontraron áreas</td></tr>
          ) : (
            areas.map((a) => (
              <tr key={a.id_area || a.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5"><span className="text-sm font-bold text-white">{a.nombre_area || a.nombre}</span></td>
                <td className="px-6 py-5"><p className="text-xs text-slate-500 max-w-xs truncate">{a.descripcion || '-'}</p></td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${a.activo !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${a.activo !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {a.activo !== false ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(a)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(a)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/20">
          <span className="text-xs text-slate-500 font-medium">Página {pagination.page} de {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft size={16} /></button>
            <button onClick={() => onPageChange(pagination.page + 1)} disabled={!pagination.hasNext} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaTable;
