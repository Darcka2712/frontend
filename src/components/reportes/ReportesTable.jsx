'use client';

import React from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const ReportesTable = ({ reportes = [], loading, onView, onDownload, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Nombre</th>
            <th className="px-6 py-5">Tipo</th>
            <th className="px-6 py-5">Fecha</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && reportes.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando reportes...</td></tr>
          ) : reportes.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">No hay reportes generados</td></tr>
          ) : (
            reportes.map((r) => (
              <tr key={r.id_reporte || r.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5"><span className="text-sm font-bold text-white">{r.nombre || r.titulo || '#Reporte'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{r.tipo || r.categoria || '-'}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-400 font-mono">{r.created_at || r.fecha ? new Date(r.created_at || r.fecha).toLocaleDateString() : '-'}</span></td>
                <td className="px-6 py-5 text-center">
                  <Badge variant={(r.estado === 'completado' || r.descargado) ? 'success' : 'default'} uppercase dot>
                    {(r.estado === 'completado' || r.descargado) ? 'Completado' : 'Pendiente'}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"><Eye size={16} /></button>
                    <button onClick={() => onDownload(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"><Download size={16} /></button>
                    <button onClick={() => onDelete(r)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
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

export default ReportesTable;
