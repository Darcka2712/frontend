'use client';
import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Plus, Calculator } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import api from '@/lib/api';

// Componentes Modulares
import NominaKPIs from '@/components/rrhh/nomina/NominaKPIs';
import NominaTable from '@/components/rrhh/nomina/NominaTable';
import NominaCalcModal from '@/components/rrhh/nomina/NominaCalcModal';
import NominaDetailsModal from '@/components/rrhh/nomina/NominaDetailsModal';
import Button from '@/components/ui/Button';

export default function NominaPage() {
  const { addNotification } = useNotification();
  
  // Estados
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calcOpen, setCalcOpen] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState(null);

  const fetchNominas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/nomina');
      if (response.success) {
        setNominas(response.data ?? []);
      }
    } catch (err) {
      console.error('Error fetchNominas:', err);
      addNotification('Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchNominas();
  }, [fetchNominas]);

  const handleAction = async (id, action) => {
    try {
      const response = await api.put(`/nomina/${id}/${action}`);
      if (response.success) {
        addNotification(`Nómina ${action === 'aprobar' ? 'aprobada' : 'pagada'} correctamente`, 'success');
        fetchNominas();
      } else {
        throw new Error(response.message || `Error al ${action} nómina`);
      }
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  const openDetails = (nomina) => {
    setSelectedNomina(nomina);
    setDetalleOpen(true);
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <DollarSign className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight">Nómina</h1>
            <p className="text-slate-500 font-medium mt-1">Gestión de períodos, dispersión y fiscalización</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setCalcOpen(true)} 
          variant="primary" 
          size="lg" 
          icon={Calculator}
          className="bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/20"
        >
          CALCULAR NUEVA NÓMINA
        </Button>
      </div>

      {/* Indicadores Financieros */}
      <NominaKPIs nominas={nominas} />

      {/* Tabla Principal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">Historial de Períodos</h2>
        </div>
        <NominaTable 
          nominas={nominas}
          loading={loading}
          onView={openDetails}
          onApprove={(id) => handleAction(id, 'aprobar')}
          onPay={(id) => handleAction(id, 'pagar')}
        />
      </div>

      {/* Capa de Modales */}
      <NominaCalcModal 
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        onSaved={fetchNominas}
        notify={addNotification}
      />

      <NominaDetailsModal 
        open={detalleOpen}
        onClose={() => { setDetalleOpen(false); setSelectedNomina(null); }}
        nomina={selectedNomina}
      />
    </div>
  );
}
