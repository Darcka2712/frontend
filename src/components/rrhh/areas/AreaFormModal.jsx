'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Building2, Loader2 } from 'lucide-react';

const defaultForm = { nombre: '', descripcion: '' };

const AreaFormModal = ({ open, onClose, selected, onSaved }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => setMounted(true), []);

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
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] z-10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {selected ? 'Editar Área' : 'Nueva Área'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre del Área</label>
            <input
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all"
              value={formData.nombre}
              onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))}
              required
              placeholder="Ej: Recursos Humanos"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Descripción</label>
            <textarea
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 transition-all min-h-[80px]"
              value={formData.descripcion}
              onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))}
              placeholder="Descripción del departamento..."
            />
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>{selected ? 'Guardar Cambios' : 'Crear Área'}</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default AreaFormModal;
