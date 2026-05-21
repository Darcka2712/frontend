'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Server, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';

export default function SistemasFormModal({ open, onClose, selected, onSaved, loading }) {
  const [formData, setFormData] = useState({ clave: '', nombre: '', activo: true });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (selected) {
      setFormData({
        clave: selected.clave || '',
        nombre: selected.nombre || '',
        activo: selected.activo !== undefined ? selected.activo : true
      });
    } else {
      setFormData({ clave: '', nombre: '', activo: true });
    }
    setErrors({});
  }, [selected, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.clave.trim()) newErrors.clave = 'La clave es requerida';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{selected ? 'Editar Sistema' : 'Nuevo Sistema'}</h3>
              <p className="text-xs text-slate-400">{selected ? 'Modificar propiedades del sistema' : 'Registrar un nuevo sistema'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <InputField
            label="Clave de Acceso (ID)"
            name="clave"
            value={formData.clave}
            onChange={(e) => setFormData(prev => ({ ...prev, clave: e.target.value.toUpperCase() }))}
            error={errors.clave}
            placeholder="EJ: MOD_LOGISTICA"
            className="uppercase font-mono"
          />
          <InputField
            label="Nombre Descriptivo"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            error={errors.nombre}
            placeholder="Nombre del componente central"
          />

          <div
            onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setFormData(prev => ({ ...prev, activo: !prev.activo }))}
            className={`flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer ${
              formData.activo ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950 border-white/5'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Estado Operativo</p>
              <p className="text-[10px] text-slate-500 uppercase">{formData.activo ? 'Activo en producción' : 'En mantenimiento'}</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-all ${formData.activo ? 'bg-indigo-600' : 'bg-slate-800'}`}>
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
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (selected ? 'Guardar Cambios' : 'Crear Sistema')}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
