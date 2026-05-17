'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const defaultForm = {
  nombre_cultivo: '',
  codigo_cultivo: '',
  id_sector: '',
  descripcion: '',
};

const CultivoFormModal = ({ open, onClose, selected, onSaved, notify, sectores = [], tipos = [], variedades = [] }) => {
  const { createCultivo, updateCultivo, loading } = useOrganization();
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_cultivo: selected.nombre_cultivo || '',
        codigo_cultivo: selected.codigo_cultivo || '',
        id_sector: selected.id_sector || '',
        descripcion: selected.descripcion || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [selected, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        await updateCultivo(selected.id_cultivo || selected.id, formData);
        notify('Cultivo actualizado correctamente', 'success');
      } else {
        await createCultivo(formData);
        notify('Cultivo creado correctamente', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al guardar cultivo', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Cultivo' : 'Nuevo Cultivo'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Cultivo</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600" value={formData.nombre_cultivo} onChange={(e) => setFormData(p => ({ ...p, nombre_cultivo: e.target.value }))} required placeholder="Ej: Maíz Híbrido" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600 uppercase" value={formData.codigo_cultivo} onChange={(e) => setFormData(p => ({ ...p, codigo_cultivo: e.target.value.toUpperCase() }))} placeholder="Ej: MH-001" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector Asignado</label>
          <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer" value={formData.id_sector} onChange={(e) => setFormData(p => ({ ...p, id_sector: e.target.value }))} required>
            <option value="" className="bg-slate-900 text-slate-500">Seleccionar Sector</option>
            {sectores.map(s => (
              <option key={s.id_sector || s.id} value={s.id_sector || s.id} className="bg-slate-900">{s.nombre_sector}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
          <textarea className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600 min-h-[80px]" value={formData.descripcion} onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))} placeholder="Detalles del cultivo..." />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving || loading}>{selected ? 'Guardar Cambios' : 'Crear Cultivo'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CultivoFormModal;
