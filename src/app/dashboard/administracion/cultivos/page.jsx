'use client';
import { useState, useEffect, useCallback } from 'react';
import { Sprout, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useOrganization } from '@/hooks/useOrganization';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import CultivoKPIs from '@/components/administracion/cultivos/CultivoKPIs';
import CultivoTable from '@/components/administracion/cultivos/CultivoTable';
import CultivoFormModal from '@/components/administracion/cultivos/CultivoFormModal';
import CultivoDeleteModal from '@/components/administracion/cultivos/CultivoDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function CultivosPage() {
  const { addNotification } = useNotification();
  const { 
    getCultivos, 
    getSectores, 
    getCultivosTipo, 
    getVariedadesPorTipo, 
    updateCultivo 
  } = useOrganization();
  
  // Data States
  const [data, setData] = useState({
    cultivos: [],
    sectores: [],
    tipos: [],
    variedades: []
  });
  
  // UI Control States
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cultivosRes, sectoresRes, tiposRes] = await Promise.all([
        getCultivos(),
        getSectores(),
        getCultivosTipo()
      ]);

      setData({
        cultivos: cultivosRes || [],
        sectores: sectoresRes || [],
        tipos: tiposRes || [],
        variedades: [] // Se cargan por tipo en el formulario si es necesario
      });
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [getCultivos, getSectores, getCultivosTipo, addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (cultivo) => {
    try {
      await updateCultivo(cultivo.id_cultivo, { activo: !cultivo.activo });
      addNotification(`Estado de ${cultivo.nombre_cultivo} actualizado correctamente`, 'success');
      fetchData();
    } catch (err) {
      addNotification('Error al modificar estado del cultivo', 'error');
    }
  };

  const filteredCultivos = (data.cultivos || []).filter(c => {
    if (!c) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (c.nombre_cultivo?.toLowerCase().includes(term)) || 
      (c.descripcion?.toLowerCase().includes(term)) ||
      (c.codigo_cultivo?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && c.activo) || 
      (filter === 'inactivos' && !c.activo);

    return matchesSearch && matchesFilter;
  });

  const handleCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (cultivo) => {
    setSelected(cultivo);
    setModalOpen(true);
  };

  const handleDelete = (cultivo) => {
    setSelected(cultivo);
    setDeleteModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM CULTIVOS */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(34,197,94,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Sprout className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Cultivos</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Control Agrícola
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-green-600 hover:bg-green-500 shadow-[0_20px_40px_-5px_rgba(34,197,94,0.5)] border border-green-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVO CULTIVO</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD CULTIVOS */}
      <CultivoKPIs cultivos={data.cultivos} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar cultivo por nombre, código o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE CULTIVOS */}
      <CultivoTable 
        cultivos={filteredCultivos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        sectores={data.sectores}
        tipos={data.tipos}
        variedades={data.variedades}
      />

      {/* MODALES ORQUESTRADOS */}
      <CultivoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
        sectores={data.sectores}
        tipos={data.tipos}
        variedades={data.variedades}
      />

      <CultivoDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        cultivo={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
