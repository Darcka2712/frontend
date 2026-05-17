'use client';

import React from 'react';
import { Users, LayoutGrid, Building2, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeStats = ({ pagination, empleados, getCategoriaNombre }) => {
  const stats = [
    { 
      label: 'Colaboradores', 
      value: pagination.total || 0, 
      color: 'text-indigo-400', 
      icon: Users, 
      bg: 'bg-indigo-500/10' 
    },
    { 
      label: 'Personal de Campo', 
      value: empleados.filter(e => {
        const name = getCategoriaNombre(e.id_categoria);
        return name?.toLowerCase().includes('campo') || name?.toLowerCase().includes('cosecha');
      }).length, 
      color: 'text-emerald-400', 
      icon: Building2, 
      bg: 'bg-emerald-500/10' 
    },
    { 
      label: 'Administrativos', 
      value: empleados.filter(e => {
        const name = getCategoriaNombre(e.id_categoria);
        return name?.toLowerCase().includes('admin') || name?.toLowerCase().includes('oficina');
      }).length, 
      color: 'text-blue-400', 
      icon: FileText, 
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Página Actual', 
      value: `${pagination.page}/${pagination.totalPages || 1}`, 
      color: 'text-amber-400', 
      icon: LayoutGrid, 
      bg: 'bg-amber-500/10' 
    },
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

export default EmployeeStats;
