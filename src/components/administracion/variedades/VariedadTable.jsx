'use client';

import React from 'react';
import { Edit2, Trash2, Power } from 'lucide-react';

const VariedadTable = ({ variedades = [], loading, onEdit, onDelete, onToggleStatus, cultivos = [] }) => {
  const getCultivoNombre = (id) => {
    const c = cultivos.find(c => (c.id_cultivo || c.id || c.id_variedad) === id);
    return c?.nombre_cultivo || c?.nombre || '-';
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Variedad</th>
            <th className="px-6 py-5">Código</th>
            <th className="px-6 py-5">Cultivo</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && variedades.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando variedades...</td></tr>
          ) : variedades.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">No se encontraron variedades</td></tr>
          ) : (
            variedades.map((v) => (
              <tr key={v.id_variedad || v.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5"><span className="text-sm font-bold text-white">{v.nombre_variedad}</span></td>
                <td className="px-6 py-5"><span className="text-xs font-mono text-slate-400 font-bold">{v.codigo_variedad || '-'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{v.cultivo?.nombre_cultivo || getCultivoNombre(v.id_cultivo)}</span></td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${v.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${v.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {v.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStatus(v)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors" title={v.activo ? 'Desactivar' : 'Activar'}><Power size={16} /></button>
                    <button onClick={() => onEdit(v)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(v)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
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

export default VariedadTable;
