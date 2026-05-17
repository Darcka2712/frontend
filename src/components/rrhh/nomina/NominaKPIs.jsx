'use client';

import React from 'react';
import { DollarSign, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const NominaKPIs = ({ nominas = [] }) => {
  const total = nominas.length;
  const pagadas = nominas.filter(n => n.estado === 'pagada').length;
  const pendientes = nominas.filter(n => n.estado === 'pendiente' || n.estado === 'calculada').length;
  const cards = [
    { label: 'Total Nóminas', value: total, icon: DollarSign, color: 'from-emerald-600 to-teal-700', shadow: 'rgba(16,185,129,0.3)' },
    { label: 'Pagadas', value: pagadas, icon: CheckCircle, color: 'from-emerald-600 to-green-700', shadow: 'rgba(34,197,94,0.3)' },
    { label: 'Pendientes', value: pendientes, icon: XCircle, color: 'from-amber-600 to-orange-700', shadow: 'rgba(251,146,60,0.3)' },
    { label: 'Tasa de Pago', value: total ? `${Math.round((pagadas / total) * 100)}%` : '0%', icon: TrendingUp, color: 'from-indigo-600 to-blue-700', shadow: 'rgba(99,102,241,0.3)' },
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

export default NominaKPIs;
