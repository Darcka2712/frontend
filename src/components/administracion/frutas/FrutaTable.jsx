'use client';

import React from 'react';
import { Edit2, Trash2, Power } from 'lucide-react';

const FrutaTable = ({ frutas = [], loading, onEdit, onDelete, onToggleStatus, variedades = [] }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Fruta</th>
            <th className="px-6 py-5">Código</th>
            <th className="px-6 py-5">Tipo</th>
            <th className="px-6 py-5">Origen</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && frutas.length === 0 ? (
            <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando frutas...</td></tr>
          ) : frutas.length === 0 ? (
            <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-500 italic font-medium">No se encontraron frutas</td></tr>
          ) : (
            frutas.map((f) => (
              <tr key={f.id_fruta || f.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-black border border-red-500/20">
                      {f.nombre_fruta?.[0]?.toUpperCase() || 'F'}
                    </div>
                    <span className="text-sm font-bold text-white">{f.nombre_fruta}</span>
                  </div>
                </td>
                <td className="px-6 py-5"><span className="text-xs font-mono text-slate-400 font-bold">{f.codigo_fruta || '-'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{f.tipo_fruta || '-'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{f.origen || '-'}</span></td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${f.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${f.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {f.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStatus(f)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors" title={f.activo ? 'Desactivar' : 'Activar'}><Power size={16} /></button>
                    <button onClick={() => onEdit(f)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(f)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FrutaTable;
