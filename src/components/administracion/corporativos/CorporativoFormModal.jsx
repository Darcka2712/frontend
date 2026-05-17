'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const defaultForm = {
  nombre_corporativo: '',
  rfc_corporativo: '',
  razon_social: '',
};

const CorporativoFormModal = ({ open, onClose, selected, onSaved, notify }) => {
  const { createCorporativo, updateCorporativo, loading } = useOrganization();
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData({
        nombre_corporativo: selected.nombre_corporativo || '',
        rfc_corporativo: selected.rfc_corporativo || '',
        razon_social: selected.razon_social || '',
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
        await updateCorporativo(selected.id_corporativo || selected.id, formData);
        notify('Corporativo actualizado correctamente', 'success');
      } else {
        await createCorporativo(formData);
        notify('Corporativo creado correctamente', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al guardar corporativo', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={selected ? 'Editar Corporativo' : 'Nuevo Corporativo'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Corporativo</label>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              value={formData.nombre_corporativo}
              onChange={(e) => setFormData(p => ({ ...p, nombre_corporativo: e.target.value }))}
              required
              placeholder="Ej: Grupo Agrícola del Norte"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RFC</label>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 uppercase"
              value={formData.rfc_corporativo}
              onChange={(e) => setFormData(p => ({ ...p, rfc_corporativo: e.target.value.toUpperCase() }))}
              placeholder="Ej: GAN123456ABC"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Razón Social</label>
          <textarea
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 min-h-[80px]"
            value={formData.razon_social}
            onChange={(e) => setFormData(p => ({ ...p, razon_social: e.target.value }))}
            placeholder="Razón social completa..."
          />
        </div>
        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" loading={saving || loading}>
            {selected ? 'Guardar Cambios' : 'Crear Corporativo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CorporativoFormModal;
