'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

export default function CultivosTiposDeleteModal({ open, onClose, onConfirm, selected, loading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!open || !mounted || !selected) return null;

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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900 shadow-2xl"
      >
        <div className="flex flex-col items-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Desactivar Tipo de Cultivo</h3>
          <p className="text-sm text-slate-400 mb-6">
            ¿Estás seguro de que deseas desactivar <span className="font-bold text-white">{selected.descripcion}</span>?
            <br />
            <span className="text-xs text-slate-500">Esto podría afectar a las variedades asociadas.</span>
          </p>
          <div className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 mb-6">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Especie:</span>
              <span className="text-white font-semibold">{selected.descripcion}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/30 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sí, Desactivar'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
