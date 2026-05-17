'use client';
import { useState, useEffect, useCallback } from 'react';
import { Building, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useOrganization } from '@/hooks/useOrganization';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import CorporativoKPIs from '@/components/administracion/corporativos/CorporativoKPIs';
import CorporativoTable from '@/components/administracion/corporativos/CorporativoTable';
import CorporativoFormModal from '@/components/administracion/corporativos/CorporativoFormModal';
import CorporativoDeleteModal from '@/components/administracion/corporativos/CorporativoDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function CorporativosPage() {
  const { addNotification } = useNotification();
  const { getCorporativos, updateCorporativo } = useOrganization();
  
  // Data States
  const [corporativos, setCorporativos] = useState([]);
  
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
      const response = await getCorporativos();
      setCorporativos(response?.data || response || []);
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [getCorporativos, addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (corporativo) => {
    try {
      await updateCorporativo(corporativo.id_corporativo || corporativo.id, { activo: !corporativo.activo });
      addNotification(`Estado de ${corporativo.nombre_corporativo} actualizado correctamente`, 'success');
      fetchData();
    } catch (err) {
      addNotification('Error al modificar estado del corporativo', 'error');
    }
  };

  const filteredCorporativos = corporativos.filter(c => {
    if (!c) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (c.nombre_corporativo?.toLowerCase().includes(term)) || 
      (c.rfc_corporativo?.toLowerCase().includes(term)) ||
      (c.razon_social?.toLowerCase().includes(term));
    
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

  const handleEdit = (corporativo) => {
    setSelected(corporativo);
    setModalOpen(true);
  };

  const handleDelete = (corporativo) => {
    setSelected(corporativo);
    setDeleteModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM CORPORATIVO */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(147,51,234,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Building className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Corporativos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Maestros</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Entidades Jurídicas Principales
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_20px_40px_-5px_rgba(99,102,241,0.5)] border border-indigo-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVO CORPORATIVO</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD CORPORATIVO */}
      <CorporativoKPIs corporativos={corporativos} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar corporativo por nombre, RFC o razón social..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE CORPORATIVOS */}
      <CorporativoTable 
        corporativos={filteredCorporativos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* MODALES ORQUESTRADOS */}
      <CorporativoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
      />

      <CorporativoDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        corporativo={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
