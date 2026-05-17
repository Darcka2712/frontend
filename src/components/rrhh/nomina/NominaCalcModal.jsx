'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const NominaCalcModal = ({ open, onClose, onSaved, notify }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fecha_inicio: '', fecha_fin: '', tipo: 'semanal' });
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/nomina/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        notify('Nómina calculada exitosamente', 'success');
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al calcular nómina');
      }
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Calcular Nueva Nómina" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Inicio</label>
            <input type="date" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50" value={formData.fecha_inicio} onChange={(e) => setFormData(p => ({ ...p, fecha_inicio: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Fin</label>
            <input type="date" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50" value={formData.fecha_fin} onChange={(e) => setFormData(p => ({ ...p, fecha_fin: e.target.value }))} required />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Nómina</label>
          <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer" value={formData.tipo} onChange={(e) => setFormData(p => ({ ...p, tipo: e.target.value }))}>
            <option value="semanal" className="bg-slate-900">Semanal</option>
            <option value="quincenal" className="bg-slate-900">Quincenal</option>
            <option value="mensual" className="bg-slate-900">Mensual</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving}>Calcular Nómina</Button>
        </div>
      </form>
    </Modal>
  );
};

export default NominaCalcModal;
