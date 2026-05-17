'use client';

import React from 'react';
import { FileText, TrendingUp, Download, Calendar } from 'lucide-react';

const ReportesKPIs = ({ reportes = [] }) => {
  const cards = [
    { label: 'Total Reportes', value: reportes.length, icon: FileText, color: 'from-indigo-600 to-violet-700', shadow: 'rgba(99,102,241,0.3)' },
    { label: 'Descargados', value: reportes.filter(r => r.descargado || r.estado === 'completado').length, icon: Download, color: 'from-emerald-600 to-teal-700', shadow: 'rgba(16,185,129,0.3)' },
    { label: 'Pendientes', value: reportes.filter(r => !r.descargado && r.estado !== 'completado').length, icon: Calendar, color: 'from-amber-600 to-orange-700', shadow: 'rgba(251,146,60,0.3)' },
    { label: 'Tasa de Descarga', value: reportes.length ? `${Math.round((reportes.filter(r => r.descargado || r.estado === 'completado').length / reportes.length) * 100)}%` : '0%', icon: TrendingUp, color: 'from-cyan-600 to-blue-700', shadow: 'rgba(6,182,212,0.3)' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat) => (
        <div key={stat.label} className="bg-slate-900/40 rounded-[2rem] border border-white/5 backdrop-blur-xl p-6 flex items-center gap-5">
          <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`} style={{ boxShadow: `0 20px 40px -5px ${stat.shadow}` }}>
            <stat.icon className="text-white" size={26} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportesKPIs;
