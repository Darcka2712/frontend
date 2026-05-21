'use client';

import React from 'react';
import { Sprout, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const CultivosTiposKPIs = ({ tipos, pagination }) => {
  const total = pagination?.total || tipos.length;
  const activos = tipos.filter(t => t.activo).length;
  const inactivos = total - activos;

  const stats = [
    { label: 'Total Tipos', value: total, color: 'text-indigo-400', icon: Sprout, bg: 'bg-indigo-500/10' },
    { label: 'Activos', value: activos, color: 'text-emerald-400', icon: CheckCircle, bg: 'bg-emerald-500/10' },
    { label: 'Inactivos', value: inactivos, color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/10' },
    { label: 'Página Actual', value: `${pagination?.page || 1}/${pagination?.totalPages || 1}`, color: 'text-amber-400', icon: LayoutGrid, bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group cursor-default"
        >
          <div className="absolute inset-0 bg-slate-900/40 rounded-[2.5rem] border border-white/5 transition-all duration-500 group-hover:scale-[1.02] group-hover:bg-slate-800/50 group-hover:border-white/10 group-hover:shadow-2xl" />
          <div className="relative p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon size={24} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <p className={`text-3xl font-black ${stat.color} tracking-tight mt-1`}>{stat.value}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className={`h-full bg-gradient-to-r from-transparent to-current ${stat.color}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CultivosTiposKPIs;
