'use client';

import React from 'react';
import { Edit2, Trash2, Power } from 'lucide-react';

const RanchoTable = ({ ranchos = [], loading, onEdit, onDelete, onToggleStatus, empresas = [] }) => {
  const getEmpresaNombre = (id) => {
    const e = empresas.find(e => (e.id_empresa || e.id) === id);
    return e?.nombre_empresa || '-';
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Rancho</th>
            <th className="px-6 py-5">Código</th>
            <th className="px-6 py-5">Empresa</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && ranchos.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando ranchos...</td></tr>
          ) : ranchos.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">No se encontraron ranchos</td></tr>
          ) : (
            ranchos.map((r) => (
              <tr key={r.id_rancho || r.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5"><span className="text-sm font-bold text-white">{r.nombre_rancho}</span></td>
                <td className="px-6 py-5"><span className="text-xs font-mono text-slate-400 font-bold">{r.codigo_rancho || '-'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{getEmpresaNombre(r.id_empresa)}</span></td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${r.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${r.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {r.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStatus(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors" title={r.activo ? 'Desactivar' : 'Activar'}><Power size={16} /></button>
                    <button onClick={() => onEdit(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
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

export default RanchoTable;
