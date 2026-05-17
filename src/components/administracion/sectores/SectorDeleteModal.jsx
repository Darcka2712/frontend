'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';
import { AlertTriangle, Map } from 'lucide-react';

const SectorDeleteModal = ({ open, onClose, sector, onDeleted, notify }) => {
  const { deleteSector, loading } = useOrganization();
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    if (!sector) return;
    setSaving(true);
    try {
      await deleteSector(sector.id_sector || sector.id);
      notify(`Sector ${sector.nombre_sector} desactivado correctamente`, 'success');
      onDeleted();
      onClose();
    } catch (err) {
      notify(err.message || 'Error al desactivar sector', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Confirmar Desactivación" size="md">
      <div className="space-y-8 pt-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20">
            <Map size={40} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">¿Desactivar <span className="text-red-400">{sector?.nombre_sector}</span>?</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">El sector quedará inactivo pero los datos históricos se conservarán.</p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-200/70 font-medium">Los cultivos y variedades asociadas no serán eliminados.</p>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={saving || loading} size="lg">Confirmar Desactivación</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SectorDeleteModal;
