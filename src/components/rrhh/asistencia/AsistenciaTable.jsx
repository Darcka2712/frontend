'use client';

import React from 'react';
import { User, Calendar, Clock, MapPin, Edit, Trash2, Tag, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const AsistenciaTable = ({ 
  data = [], 
  loading = false, 
  pagination, 
  onPageChange,
  onEdit,
  onDelete,
  hasFilters = false
}) => {
  if (loading) return (
    <Card className="p-0 overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-xl">
      <div className="p-10 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Sincronizando Registros...</p>
      </div>
    </Card>
  );

  if (data.length === 0) return (
    <Card className="p-20 text-center border-dashed border-white/10 bg-transparent">
      <div className="max-w-xs mx-auto space-y-6">
        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
          <Calendar size={32} className="text-slate-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Sin registros detectados</h3>
          <p className="text-slate-500 text-sm font-medium mt-2">
            {hasFilters ? 'No se encontraron resultados para los filtros aplicados.' : 'No hay asistencias registradas para este periodo.'}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <Card className="p-0 overflow-hidden" hover={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-8">Colaborador / Identidad</th>
              <th className="px-10 py-8">Jornada / Horario</th>
              <th className="px-10 py-8">Métricas</th>
              <th className="px-10 py-8">Ubicación / Contexto</th>
              <th className="px-10 py-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((record) => (
              <tr key={record.id_asistencia} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-950/60 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                      <User size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xl tracking-tight uppercase italic flex items-center gap-2">
                        {record.empleado?.nombre_completo || record.id_empleado}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mt-1 tracking-tight">
                        <Tag size={12} className="text-indigo-400/50" />
                        {record.categoria?.nombre_categoria || 'GENERAL'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-wider">
                      <Calendar size={14} />
                      {new Date(record.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                        IN: {record.hora_entrada?.slice(0, 5)}
                      </div>
                      <div className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-[10px] font-black text-rose-400 uppercase tracking-tighter">
                        OUT: {record.hora_salida?.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white text-lg font-black italic">
                      <Clock size={16} className="text-indigo-500" />
                      {record.horas_trabajadas || '0.0'} <span className="text-[10px] text-slate-500 uppercase font-black ml-1">HRS</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                      Registro {record.metodo_registro || 'Manual'}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-tight">
                      <MapPin size={14} className="text-indigo-500" />
                      {record.rancho?.nombre_rancho || record.area?.nombre || 'UBICACIÓN_REMOTA'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Briefcase size={14} />
                      {record.empresa?.nombre_empresa || 'Corporativo'}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button 
                      onClick={() => onEdit(record)} 
                      variant="secondary" 
                      size="sm" 
                      icon={Edit}
                      className="w-12 h-12 p-0 text-blue-400 hover:bg-blue-400/10"
                    />
                    <Button 
                      onClick={() => onDelete(record.id_asistencia)} 
                      variant="secondary" 
                      size="sm" 
                      icon={Trash2}
                      className="w-12 h-12 p-0 text-rose-400 hover:bg-rose-400/10"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-10 py-8 bg-slate-950/20 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {pagination.total} Jornadas Detectadas - Página {pagination.page} de {pagination.totalPages}
          </span>
          <div className="flex gap-3">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => onPageChange(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 border ${
                  pagination.page === i + 1 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-400/20 scale-110' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AsistenciaTable;
