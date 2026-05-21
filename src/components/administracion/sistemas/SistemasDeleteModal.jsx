'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Trash2, AlertCircle, Loader2 } from 'lucide-react';

export default function SistemasDeleteModal({ open, onClose, selected, onDeleted, loading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Eliminar Sistema</h3>
              <p className="text-xs text-slate-400">Esta acción desactivará el sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">Confirmar eliminación de:</p>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-slate-200">{selected?.nombre}</span>
                  <br />
                  Clave: <span className="font-mono text-xs">{selected?.clave}</span>
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Esto podría afectar módulos y permisos vinculados al sistema.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-950/30 p-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-700 p-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onDeleted}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 p-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 hover:bg-red-500 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar Eliminación'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
