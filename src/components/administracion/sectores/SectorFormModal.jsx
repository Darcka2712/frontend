'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const defaultForm = {
  nombre_sector: '',
  codigo_sector: '',
  id_rancho: '',
  tipo_suelo: '',
};

const SectorFormModal = ({ open, onClose, selected, onSaved, notify, ranchos = [] }) => {
  const { createSector, updateSector, loading } = useOrganization();
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_sector: selected.nombre_sector || '',
        codigo_sector: selected.codigo_sector || '',
        id_rancho: selected.id_rancho || '',
        tipo_suelo: selected.tipo_suelo || '',
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
        await updateSector(selected.id_sector || selected.id, formData);
        notify('Sector actualizado correctamente', 'success');
      } else {
        await createSector(formData);
        notify('Sector creado correctamente', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al guardar sector', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Sector' : 'Nuevo Sector'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Sector</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600" value={formData.nombre_sector} onChange={(e) => setFormData(p => ({ ...p, nombre_sector: e.target.value }))} required placeholder="Ej: Sector Norte" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600 uppercase" value={formData.codigo_sector} onChange={(e) => setFormData(p => ({ ...p, codigo_sector: e.target.value.toUpperCase() }))} placeholder="Ej: SN-001" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rancho Asignado</label>
          <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer" value={formData.id_rancho} onChange={(e) => setFormData(p => ({ ...p, id_rancho: e.target.value }))} required>
            <option value="" className="bg-slate-900 text-slate-500">Seleccionar Rancho</option>
            {ranchos.map(r => (
              <option key={r.id_rancho || r.id} value={r.id_rancho || r.id} className="bg-slate-900">{r.nombre_rancho}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Suelo</label>
          <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600" value={formData.tipo_suelo} onChange={(e) => setFormData(p => ({ ...p, tipo_suelo: e.target.value }))} placeholder="Ej: Arcilloso / Franco" />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving || loading}>{selected ? 'Guardar Cambios' : 'Crear Sector'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SectorFormModal;
