'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const ReporteFormModal = ({ open, onClose, onSaved, notify }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', tipo: 'excel', descripcion: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${API}/api/reportes/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(formData),
      });
      if (res.ok) {
        notify('Reporte generado correctamente', 'success');
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al generar reporte');
      }
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Generar Nuevo Reporte" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Reporte</label>
          <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50" value={formData.nombre} onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))} required placeholder="Ej: Reporte Mensual de Ventas" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
          <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer" value={formData.tipo} onChange={(e) => setFormData(p => ({ ...p, tipo: e.target.value }))}>
            <option className="bg-slate-900" value="excel">Excel</option>
            <option className="bg-slate-900" value="pdf">PDF</option>
            <option className="bg-slate-900" value="csv">CSV</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
          <textarea className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 min-h-[80px]" value={formData.descripcion} onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción del reporte..." />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving}>Generar Reporte</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReporteFormModal;
