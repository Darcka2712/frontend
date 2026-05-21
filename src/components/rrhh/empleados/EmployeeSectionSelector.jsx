'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, User, Building2, FileText, CreditCard, ShieldAlert, DollarSign } from 'lucide-react';

const SECTIONS = [
  { id: 'personal', title: 'Personal', icon: User, desc: 'Nombre, apellidos, fecha de nacimiento', color: 'indigo' },
  { id: 'laboral', title: 'Laboral', icon: Building2, desc: 'Empresa, categoría, puesto, ubicación', color: 'emerald' },
  { id: 'contrato', title: 'Contrato', icon: FileText, desc: 'Tipo, pago, salario, fechas', color: 'amber' },
  { id: 'fiscal', title: 'Fiscal', icon: CreditCard, desc: 'RFC, CURP, NSS, email, teléfono', color: 'violet' },
  { id: 'bancario', title: 'Bancario', icon: DollarSign, desc: 'Banco, cuenta, CLABE, titular', color: 'cyan' },
  { id: 'emergencia', title: 'Emergencia', icon: ShieldAlert, desc: 'Contacto de emergencia', color: 'rose' }
];

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/5' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/5' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', hover: 'hover:border-amber-500/50 hover:bg-amber-500/5' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', hover: 'hover:border-violet-500/50 hover:bg-violet-500/5' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/5' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', hover: 'hover:border-rose-500/50 hover:bg-rose-500/5' }
};

export default function EmployeeSectionSelector({ isOpen, onClose, onSelect, empleado }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] z-10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Editar Empleado</h3>
            <p className="text-sm text-slate-400 mt-1">
              {empleado?.nombre} {empleado?.apellido_paterno} — {empleado?.codigo_empleado}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 ml-1">Selecciona la sección a editar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section) => {
              const colors = COLOR_MAP[section.color];
              return (
                <button
                  key={section.id}
                  onClick={() => onSelect(section.id)}
                  className={`flex flex-col items-start gap-3 rounded-2xl border ${colors.border} ${colors.bg} p-5 text-left transition-all ${colors.hover} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-100">{section.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{section.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
