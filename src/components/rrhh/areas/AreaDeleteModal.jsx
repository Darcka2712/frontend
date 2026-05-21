'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Building2, Loader2 } from 'lucide-react';

const AreaDeleteModal = ({ open, onClose, selected, onDeleted }) => {
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => setMounted(true), []);

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/areas/${selected.id_area || selected.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        onDeleted();
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Error al desactivar');
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
        className="relative w-full max-w-md overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] z-10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h3 className="text-lg font-bold text-slate-100">Confirmar Desactivación</h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all disabled:opacity-30"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
              <Building2 size={40} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                ¿Desactivar <span className="text-red-400">{selected?.nombre_area || selected?.nombre}</span>?
              </h3>
              <p className="text-slate-400 text-sm mt-2">Esta acción no eliminará los empleados asociados.</p>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-200/70 font-medium">Los datos históricos se conservarán por integridad referencial.</p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-30"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/20 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Confirmar Desactivación</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default AreaDeleteModal;
