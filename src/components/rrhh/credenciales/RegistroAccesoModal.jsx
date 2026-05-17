'use client';

import Modal from '@/components/ui/Modal';

export default function RegistroAccesoModal({ open, onClose, notify }) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Registrar acceso">
      <p className="text-sm text-slate-400">Modal pendiente de conexión al API.</p>
      <button
        type="button"
        className="mt-4 text-sm text-indigo-400"
        onClick={() => {
          notify?.('Registro no disponible sin API', 'info');
          onClose?.();
        }}
      >
        Cerrar
      </button>
    </Modal>
  );
}
