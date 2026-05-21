'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Shield, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

export default function PermisosFormModal({ open, onClose, selected, onSaved, modulos, loading }) {
  const [formData, setFormData] = useState({ id_modulo: '', accion: 'ver', descripcion: '', activo: true });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (selected) {
      setFormData({
        id_modulo: selected.id_modulo || '',
        accion: selected.accion || 'ver',
        descripcion: selected.descripcion || '',
        activo: selected.activo !== undefined ? selected.activo : true
      });
    } else {
      setFormData({ id_modulo: '', accion: 'ver', descripcion: '', activo: true });
    }
    setErrors({});
  }, [selected, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.id_modulo) newErrors.id_modulo = 'El módulo es requerido';
    if (!formData.accion.trim()) newErrors.accion = 'La acción es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSaved(formData);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{selected ? 'Editar Permiso' : 'Nuevo Permiso'}</h3>
              <p className="text-xs text-slate-400">{selected ? 'Modificar atributo de seguridad' : 'Registrar capacidad granular'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <SelectField
            label="Módulo"
            options={modulos.map(m => ({ value: m.id_modulo, label: `${m.nombre} (${m.sistema?.nombre || 'General'})` }))}
            value={formData.id_modulo}
            onChange={(val) => setFormData(prev => ({ ...prev, id_modulo: val }))}
            error={errors.id_modulo}
            placeholder="Seleccionar módulo"
          />
          <InputField
            label="Acción"
            name="accion"
            value={formData.accion}
            onChange={(e) => setFormData(prev => ({ ...prev, accion: e.target.value.toLowerCase() }))}
            error={errors.accion}
            placeholder="ej: crear_reporte"
            className="lowercase"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Descripción</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all placeholder-slate-600 resize-none"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={2}
              placeholder="Define el impacto del permiso..."
            />
          </div>
          <div
            onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setFormData(prev => ({ ...prev, activo: !prev.activo }))}
            className={`flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer ${
              formData.activo ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-white/5'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Estado Operativo</p>
              <p className="text-[10px] text-slate-500 uppercase">{formData.activo ? 'Habilitado' : 'Bloqueado'}</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-all ${formData.activo ? 'bg-emerald-600' : 'bg-slate-800'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${formData.activo ? 'left-6' : 'left-1'}`} />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/30 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (selected ? 'Guardar Cambios' : 'Crear Permiso')}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
