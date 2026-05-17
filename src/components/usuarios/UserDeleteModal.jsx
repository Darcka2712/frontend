'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle, UserX } from 'lucide-react';

const UserDeleteModal = ({ open, onClose, user, onDeleted, notify }) => {
  const [saving, setSaving] = React.useState(false);

  const handleDelete = async () => {
    setSaving(true);
    try {
      // API call to delete/deactivate user goes here
      // Example: await deleteUsuario(user.id_usuario);
      await new Promise(r => setTimeout(r, 800)); // Simulate API delay
      
      notify(`Identidad de ${user?.usuario} revocada correctamente`, 'success');
      onDeleted();
      onClose();
    } catch (err) {
      notify('Fallo crítico al intentar revocar la identidad', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Confirmar Revocación"
      size="md"
    >
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
          <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center border border-rose-500/20 relative group">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full group-hover:bg-rose-500/30 transition-all" />
            <UserX size={48} className="text-rose-500 relative z-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">
              ¿Eliminar a <span className="text-rose-500">{user.usuario}</span>?
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Esta acción deshabilitará el acceso de la identidad <span className="text-white font-bold">{user.nombre} {user.apellido}</span> al sistema. 
              Sus registros históricos se mantendrán por integridad referencial.
            </p>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-rose-200/70 font-medium">
            Si el usuario tiene operaciones pendientes o registros activos, 
            el sistema cambiará su estado a "Inactivo" en lugar de eliminarlo físicamente.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={saving}
          >
            CANCELAR
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={saving}
            size="lg"
            className="shadow-xl shadow-rose-500/20"
          >
            CONFIRMAR REVOCACIÓN
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDeleteModal;
