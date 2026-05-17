'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle, Building } from 'lucide-react';

const AreaDeleteModal = ({ open, onClose, selected, onDeleted, notify }) => {
  const [saving, setSaving] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/areas/${selected.id_area || selected.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        notify(`Área ${selected.nombre_area || selected.nombre} desactivada correctamente`, 'success');
        onDeleted();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al desactivar');
      }
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Confirmar Desactivación" size="md">
      <div className="space-y-8 pt-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
            <Building size={40} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">¿Desactivar <span className="text-red-400">{selected?.nombre_area || selected?.nombre}</span>?</h3>
            <p className="text-slate-400 text-sm mt-2">Esta acción no eliminará los empleados asociados.</p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-200/70 font-medium">Los datos históricos se conservarán por integridad referencial.</p>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving} size="lg">Confirmar Desactivación</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AreaDeleteModal;
