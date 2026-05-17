'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const ReporteDeleteModal = ({ open, onClose, selected, onDeleted, notify }) => {
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${API}/api/reportes/${selected.id_reporte || selected.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        notify('Reporte eliminado correctamente', 'success');
        onDeleted();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al eliminar reporte');
      }
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Confirmar Eliminación" size="md">
      <div className="space-y-8 pt-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">¿Eliminar <span className="text-red-400">{selected?.nombre || selected?.titulo || 'este reporte'}</span>?</h3>
          <p className="text-slate-400 text-sm">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving}>Eliminar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReporteDeleteModal;
