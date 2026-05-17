'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const defaultForm = {
  nombre_fruta: '',
  codigo_fruta: '',
  tipo_fruta: '',
  origen: '',
};

const FrutaFormModal = ({ open, onClose, selected, onSaved, notify, variedades = [] }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_fruta: selected.nombre_fruta || '',
        codigo_fruta: selected.codigo_fruta || '',
        tipo_fruta: selected.tipo_fruta || '',
        origen: selected.origen || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [selected, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/frutas${selected ? `/${selected.id_fruta || selected.id}` : ''}`, {
        method: selected ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        notify(selected ? 'Fruta actualizada correctamente' : 'Fruta creada correctamente', 'success');
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al guardar fruta');
      }
    } catch (err) {
      notify(err.message || 'Error al guardar fruta', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Fruta' : 'Nueva Fruta'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Fruta</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-600" value={formData.nombre_fruta} onChange={(e) => setFormData(p => ({ ...p, nombre_fruta: e.target.value }))} required placeholder="Ej: Fresa" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-600 uppercase" value={formData.codigo_fruta} onChange={(e) => setFormData(p => ({ ...p, codigo_fruta: e.target.value.toUpperCase() }))} placeholder="Ej: FRE-001" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-600" value={formData.tipo_fruta} onChange={(e) => setFormData(p => ({ ...p, tipo_fruta: e.target.value }))} placeholder="Ej: Baya / Cítrico" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Origen</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-600" value={formData.origen} onChange={(e) => setFormData(p => ({ ...p, origen: e.target.value }))} placeholder="Ej: Nacional / Importado" />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving}>{selected ? 'Guardar Cambios' : 'Crear Fruta'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FrutaFormModal;
