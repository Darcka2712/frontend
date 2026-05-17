'use client';

import React from 'react';
import { Users, ClipboardCheck, Clock, MapPin } from 'lucide-react';
import { m } from 'framer-motion';

const AsistenciaKPIs = ({ resumen, asistencias = [] }) => {
  const stats = [
    {
      label: 'Asistencias Totales',
      value: resumen?.total_asistencias || asistencias.length,
      icon: ClipboardCheck,
      color: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-500/20'
    },
    {
      label: 'Personal Activo',
      value: resumen?.total_empleados || '...',
      icon: Users,
      color: 'from-emerald-600 to-teal-700',
      shadow: 'shadow-emerald-500/20'
    },
    {
      label: 'Promedio Horas',
      value: resumen?.promedio_horas?.toFixed(1) || '0.0',
      icon: Clock,
      color: 'from-rose-600 to-pink-700',
      shadow: 'shadow-rose-500/20'
    },
    {
      label: 'Lugares Cubiertos',
      value: resumen?.lugares_unicos || '0',
      icon: MapPin,
      color: 'from-amber-600 to-orange-700',
      shadow: 'shadow-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <m.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl overflow-hidden hover:border-white/10 transition-colors"
        >
          <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {stat.label}
              </p>
              <h3 className="text-4xl font-black text-white italic tracking-tighter">
                {stat.value}
              </h3>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-2 relative z-10">
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <m.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
          </div>
        </m.div>
      ))}
    </div>
  );
};

export default AsistenciaKPIs;
