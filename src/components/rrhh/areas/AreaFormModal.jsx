'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const defaultForm = { nombre: '', descripcion: '' };

const AreaFormModal = ({ open, onClose, selected, onSaved, notify }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => {
    if (selected) {
      setFormData({ nombre: selected.nombre_area || selected.nombre || '', descripcion: selected.descripcion || '' });
    } else {
      setFormData(defaultForm);
    }
  }, [selected, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = selected ? 'PUT' : 'POST';
      const url = selected ? `${API}/api/areas/${selected.id_area || selected.id}` : `${API}/api/areas/`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(formData) });
      if (res.ok) {
        notify(selected ? 'Área actualizada correctamente' : 'Área creada correctamente', 'success');
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al guardar');
      }
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Área' : 'Nueva Área'} size="md">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Área</label>
          <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all" value={formData.nombre} onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))} required placeholder="Ej: Recursos Humanos" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
          <textarea className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all min-h-[80px]" value={formData.descripcion} onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción del departamento..." />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving}>{selected ? 'Guardar Cambios' : 'Crear Área'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AreaFormModal;
