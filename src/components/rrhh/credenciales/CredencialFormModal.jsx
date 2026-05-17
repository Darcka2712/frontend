'use client';

import Modal from '@/components/ui/Modal';

export default function CredencialFormModal({ open, onClose, notify }) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Credencial">
      <p className="text-sm text-slate-400">Formulario pendiente de conexión al API.</p>
      <button
        type="button"
        className="mt-4 text-sm text-indigo-400"
        onClick={() => {
          notify?.('Guardado local no disponible sin API', 'info');
          onClose?.();
        }}
      >
        Cerrar
      </button>
    </Modal>
  );
}
