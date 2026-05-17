'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const defaultForm = {
  nombre_empresa: '',
  rfc_empresa: '',
  id_corporativo: '',
};

const EmpresaFormModal = ({ open, onClose, selected, onSaved, notify, corporativos = [] }) => {
  const { createEmpresa, updateEmpresa, loading } = useOrganization();
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_empresa: selected.nombre_empresa || '',
        rfc_empresa: selected.rfc_empresa || '',
        id_corporativo: selected.id_corporativo || '',
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
        await updateEmpresa(selected.id_empresa || selected.id, formData);
        notify('Empresa actualizada correctamente', 'success');
      } else {
        await createEmpresa(formData);
        notify('Empresa creada correctamente', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al guardar empresa', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Empresa' : 'Nueva Empresa'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Empresa</label>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
              value={formData.nombre_empresa}
              onChange={(e) => setFormData(p => ({ ...p, nombre_empresa: e.target.value }))}
              required
              placeholder="Ej: Agroinsumos del Norte SA de CV"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RFC</label>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600 uppercase"
              value={formData.rfc_empresa}
              onChange={(e) => setFormData(p => ({ ...p, rfc_empresa: e.target.value.toUpperCase() }))}
              placeholder="Ej: AIN123456ABC"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporativo Asignado</label>
          <select
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
            value={formData.id_corporativo}
            onChange={(e) => setFormData(p => ({ ...p, id_corporativo: e.target.value }))}
            required
          >
            <option value="" className="bg-slate-900 text-slate-500">Seleccionar Corporativo</option>
            {corporativos.map(c => (
              <option key={c.id_corporativo || c.id} value={c.id_corporativo || c.id} className="bg-slate-900">{c.nombre_corporativo}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving || loading}>
            {selected ? 'Guardar Cambios' : 'Crear Empresa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmpresaFormModal;
