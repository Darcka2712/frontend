'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { TreePine, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useOrganization } from '@/hooks/useOrganization';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import RanchoKPIs from '@/components/administracion/ranchos/RanchoKPIs';
import RanchoTable from '@/components/administracion/ranchos/RanchoTable';
import RanchoFormModal from '@/components/administracion/ranchos/RanchoFormModal';
import RanchoDeleteModal from '@/components/administracion/ranchos/RanchoDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Reducer for managing RanchosPage state
const initialState = {
  ranchos: [],
  empresas: [],
  loading: true,
  search: '',
  filter: 'todos',
  modalOpen: false,
  deleteModalOpen: false,
  selected: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    case 'SET_DELETE_MODAL_OPEN':
      return { ...state, deleteModalOpen: action.payload };
    case 'SET_SELECTED':
      return { ...state, selected: action.payload };
    case 'RESET_FORM':
      return { ...state, selected: null, modalOpen: false };
    default:
      return state;
  }
}

export default function RanchosPage() {
  const { addNotification } = useNotification();
  const { getRanchos, getEmpresasComplete, updateRancho } = useOrganization();
  
  // Use reducer to manage all state
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Destructure state for easier access
  const { 
    ranchos, 
    empresas, 
    loading, 
    search, 
    filter, 
    modalOpen, 
    deleteModalOpen, 
    selected 
  } = state;

  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [ranchosRes, empresasRes] = await Promise.all([
        getRanchos(),
        getEmpresasComplete()
      ]);

      dispatch({ 
        type: 'SET_DATA', 
        payload: { 
          ranchos: ranchosRes?.data || ranchosRes || [], 
          empresas: empresasRes?.data || empresasRes || [] 
        } 
      });
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // Remove dependencies to prevent infinite loop

  useEffect(() => {
    fetchData();
  }, []); // Run only once on mount

  const handleToggleStatus = async (rancho) => {
    try {
      await updateRancho(rancho.id_rancho, { activo: !rancho.activo });
      addNotification(`Estado de ${rancho.nombre_rancho} actualizado correctamente`, 'success');
      fetchData();
    } catch (err) {
      addNotification('Error al modificar estado del rancho', 'error');
    }
  };

  const filteredRanchos = (ranchos || []).filter(r => {
    if (!r) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (r.nombre_rancho?.toLowerCase().includes(term)) || 
      (r.codigo_rancho?.toLowerCase().includes(term)) ||
      (r.ubicacion?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && r.activo) || 
      (filter === 'inactivos' && !r.activo) ||
      (filter === 'produccion' && r.tipo_rancho === 'produccion') ||
      (filter === 'administrativo' && r.tipo_rancho === 'administrativo');

    return matchesSearch && matchesFilter;
  });

  const handleCreate = () => {
    dispatch({ type: 'SET_SELECTED', payload: null });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleEdit = (rancho) => {
    dispatch({ type: 'SET_SELECTED', payload: rancho });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleDelete = (rancho) => {
    dispatch({ type: 'SET_SELECTED', payload: rancho });
    dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM RANCHOS */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(34,197,94,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <TreePine className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Ranchos</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Unidades Operativas Agrícolas
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
          <span className="group-hover:translate-x-1 transition-transform">NUEVO RANCHO</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD RANCHOS */}
      <RanchoKPIs ranchos={ranchos} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos', 'produccion', 'administrativo'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'produccion' ? 'Producción' : f === 'administrativo' ? 'Administrativo' : f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar rancho por nombre, código o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE RANCHOS */}
      <RanchoTable 
        ranchos={filteredRanchos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        empresas={empresas}
      />

      {/* MODALES ORQUESTRADOS */}
      <RanchoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
        empresas={empresas}
      />

      <RanchoDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        rancho={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
