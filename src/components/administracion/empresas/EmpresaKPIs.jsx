'use client';

import React from 'react';
import { Building2, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const EmpresaKPIs = ({ empresas = [] }) => {
  const total = empresas.length;
  const activos = empresas.filter(e => e.activo).length;
  const inactivos = total - activos;

  const stats = [
    { label: 'Total Empresas', value: total, icon: Building2, color: 'from-emerald-600 to-teal-700', shadow: 'rgba(16,185,129,0.3)' },
    { label: 'Activas', value: activos, icon: CheckCircle, color: 'from-emerald-600 to-green-700', shadow: 'rgba(34,197,94,0.3)' },
    { label: 'Inactivas', value: inactivos, icon: XCircle, color: 'from-red-600 to-rose-700', shadow: 'rgba(239,68,68,0.3)' },
    { label: 'Tasa de Actividad', value: total ? `${Math.round((activos / total) * 100)}%` : '0%', icon: TrendingUp, color: 'from-indigo-600 to-blue-700', shadow: 'rgba(99,102,241,0.3)' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-slate-900/40 rounded-[2rem] border border-white/5 backdrop-blur-xl p-6 flex items-center gap-5 hover:bg-slate-900/60 transition-all group">
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

export default EmpresaKPIs;
