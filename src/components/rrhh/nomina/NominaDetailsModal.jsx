'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const NominaDetailsModal = ({ open, onClose, nomina }) => {
  if (!nomina) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Detalles de Nómina" size="lg">
      <div className="pt-4 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Período</p>
            <p className="text-white font-bold">{nomina.periodo || nomina.nombre || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo</p>
            <p className="text-white font-bold">{nomina.tipo || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</p>
            <p className="text-white font-bold uppercase">{nomina.estado || 'pendiente'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</p>
            <p className="text-emerald-400 font-bold text-lg">${Number(nomina.total || 0).toLocaleString()}</p>
          </div>
        </div>

        {nomina.detalles && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detalles</p>
            <div className="bg-slate-950 rounded-xl p-4 border border-white/5 max-h-[200px] overflow-auto custom-scrollbar">
              <pre className="text-xs font-mono text-indigo-300">{typeof nomina.detalles === 'string' ? nomina.detalles : JSON.stringify(nomina.detalles, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="primary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default NominaDetailsModal;
