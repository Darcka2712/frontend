'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { Map, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useOrganization } from '@/hooks/useOrganization';
import { motion } from 'framer-motion';

// Componentes Modulares Premium
import SectorKPIs from '@/components/administracion/sectores/SectorKPIs';
import SectorTable from '@/components/administracion/sectores/SectorTable';
import SectorFormModal from '@/components/administracion/sectores/SectorFormModal';
import SectorDeleteModal from '@/components/administracion/sectores/SectorDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Reducer for managing SectoresPage state
const initialState = {
  sectores: [],
  ranchos: [],
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

export default function SectoresPage() {
  const { addNotification } = useNotification();
  const { getSectores, getRanchos, updateSector } = useOrganization();
  
  // Use reducer to manage all state
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Destructure state for easier access
  const { 
    sectores, 
    ranchos, 
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
      const [sectoresRes, ranchosRes] = await Promise.all([
        getSectores(),
        getRanchos()
      ]);

      dispatch({ 
        type: 'SET_DATA', 
        payload: { 
          sectores: sectoresRes?.data || sectoresRes || [], 
          ranchos: ranchosRes?.data || ranchosRes || [] 
        } 
      });
    } catch (err) {
      addNotification('Error al cargar los datos de sectores', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [getSectores, getRanchos, addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (sector) => {
    try {
      await updateSector(sector.id_sector, { activo: !sector.activo });
      addNotification(`Estado de ${sector.nombre_sector} actualizado correctamente`, 'success');
      fetchData();
    } catch (err) {
      addNotification('Error al modificar estado del sector', 'error');
    }
  };

  const filteredSectores = sectores.filter(s => {
    if (!s) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (s.nombre_sector?.toLowerCase().includes(term)) || 
      (s.codigo_sector?.toLowerCase().includes(term)) ||
      (s.tipo_suelo?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && s.activo) || 
      (filter === 'inactivos' && !s.activo);

    return matchesSearch && matchesFilter;
  });

  const handleCreate = () => {
    dispatch({ type: 'SET_SELECTED', payload: null });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleEdit = (sector) => {
    dispatch({ type: 'SET_SELECTED', payload: sector });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleDelete = (sector) => {
    dispatch({ type: 'SET_SELECTED', payload: sector });
    dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM SECTORES */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 via-amber-700 to-yellow-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(251,146,60,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Map className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Sectores <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Agrícolas</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Unidades de Producción
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-orange-600 hover:bg-orange-500 shadow-[0_20px_40px_-5px_rgba(251,146,60,0.5)] border border-orange-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVO SECTOR</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD SECTORES */}
      <SectorKPIs sectores={sectores} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar sector por nombre, código o tipo de suelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE SECTORES */}
      <SectorTable 
        sectores={filteredSectores}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        ranchos={ranchos}
      />

      {/* MODALES ORQUESTRADOS */}
      <SectorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
        ranchos={ranchos}
      />

      <SectorDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        sector={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
