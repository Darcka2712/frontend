'use client';

import React from 'react';
import { Eye, CheckCircle, CreditCard } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const NominaTable = ({ nominas = [], loading, onView, onApprove, onPay }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <th className="px-6 py-5">Período</th>
            <th className="px-6 py-5">Tipo</th>
            <th className="px-6 py-5 text-right">Total</th>
            <th className="px-6 py-5 text-center">Estado</th>
            <th className="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && nominas.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">Cargando nóminas...</td></tr>
          ) : nominas.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic font-medium">No hay períodos de nómina</td></tr>
          ) : (
            nominas.map((n) => (
              <tr key={n.id_nomina || n.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5"><span className="text-sm font-bold text-white">{n.periodo || n.nombre || `#${n.id_nomina || n.id}`}</span></td>
                <td className="px-6 py-5"><span className="text-xs text-slate-500">{n.tipo || '-'}</span></td>
                <td className="px-6 py-5 text-right"><span className="text-sm font-bold text-emerald-400">${Number(n.total || 0).toLocaleString()}</span></td>
                <td className="px-6 py-5 text-center">
                  <Badge variant={n.estado === 'pagada' ? 'success' : n.estado === 'aprobada' ? 'warning' : 'default'} uppercase dot>
                    {n.estado || 'pendiente'}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(n)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"><Eye size={16} /></button>
                    {n.estado !== 'pagada' && (
                      <>
                        <button onClick={() => onApprove(n.id_nomina || n.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"><CheckCircle size={16} /></button>
                        <button onClick={() => onPay(n.id_nomina || n.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"><CreditCard size={16} /></button>
                      </>
                    )}
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

export default NominaTable;
