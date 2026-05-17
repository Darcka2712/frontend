'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const defaultForm = {
  nombre_rancho: '',
  codigo_rancho: '',
  id_empresa: '',
  ubicacion: '',
};

const RanchoFormModal = ({ open, onClose, selected, onSaved, notify, empresas = [] }) => {
  const { createRancho, updateRancho, loading } = useOrganization();
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_rancho: selected.nombre_rancho || '',
        codigo_rancho: selected.codigo_rancho || '',
        id_empresa: selected.id_empresa || '',
        ubicacion: selected.ubicacion || '',
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
        await updateRancho(selected.id_rancho || selected.id, formData);
        notify('Rancho actualizado correctamente', 'success');
      } else {
        await createRancho(formData);
        notify('Rancho creado correctamente', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al guardar rancho', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Rancho' : 'Nuevo Rancho'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Rancho</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600" value={formData.nombre_rancho} onChange={(e) => setFormData(p => ({ ...p, nombre_rancho: e.target.value }))} required placeholder="Ej: Rancho San Isidro" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código</label>
            <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600 uppercase" value={formData.codigo_rancho} onChange={(e) => setFormData(p => ({ ...p, codigo_rancho: e.target.value.toUpperCase() }))} placeholder="Ej: RSI-001" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Empresa Asignada</label>
          <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer" value={formData.id_empresa} onChange={(e) => setFormData(p => ({ ...p, id_empresa: e.target.value }))} required>
            <option value="" className="bg-slate-900 text-slate-500">Seleccionar Empresa</option>
            {empresas.map(e => (
              <option key={e.id_empresa || e.id} value={e.id_empresa || e.id} className="bg-slate-900">{e.nombre_empresa}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ubicación</label>
          <input className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-green-500/50 transition-all placeholder:text-slate-600" value={formData.ubicacion} onChange={(e) => setFormData(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Ej: Km 15 Carr. Hershey" />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving || loading}>{selected ? 'Guardar Cambios' : 'Crear Rancho'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default RanchoFormModal;
