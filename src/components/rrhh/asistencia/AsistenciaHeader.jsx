'use client';

import React from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

const AsistenciaHeader = ({ onOpenModal }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
          <ClipboardCheck className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">Control de Asistencia</h1>
          <p className="text-slate-500 font-medium mt-1">Gestión unificada de asistencia - Campo y Administrativo</p>
        </div>
      </div>

      <Button
        onClick={onOpenModal}
        variant="primary"
        size="lg"
        icon={Plus}
        className="shadow-xl shadow-emerald-600/20"
      >
        REGISTRAR JORNADA
      </Button>
    </div>
  );
};

export default AsistenciaHeader;
