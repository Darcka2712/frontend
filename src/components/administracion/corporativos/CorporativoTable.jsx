'use client';

import React from 'react';
import { Edit2, Trash2, Power } from 'lucide-react';

const CorporativoTable = ({ corporativos = [], loading, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Nombre Corporativo</th>
            <th className="px-6 py-5">RFC</th>
            <th className="px-6 py-5">Razón Social</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && corporativos.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">
                Cargando corporativos...
              </td>
            </tr>
          ) : corporativos.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">
                No se encontraron corporativos
              </td>
            </tr>
          ) : (
            corporativos.map((c) => (
              <tr key={c.id_corporativo || c.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-white">{c.nombre_corporativo}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-mono text-slate-400 font-bold">{c.rfc_corporativo || '-'}</span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs text-slate-500 max-w-xs truncate">{c.razon_social || '-'}</p>
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      c.activo
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${c.activo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onToggleStatus(c)}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
                      title={c.activo ? 'Desactivar' : 'Activar'}
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default CorporativoTable;
