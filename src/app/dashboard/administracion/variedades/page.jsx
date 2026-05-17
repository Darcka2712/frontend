'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import { Flower, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { motion } from 'framer-motion';

// Componentes Modulares Premium
import VariedadKPIs from '@/components/administracion/variedades/VariedadKPIs';
import VariedadTable from '@/components/administracion/variedades/VariedadTable';
import VariedadFormModal from '@/components/administracion/variedades/VariedadFormModal';
import VariedadDeleteModal from '@/components/administracion/variedades/VariedadDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Reducer for managing component state
const initialState = {
  variedades: [],
  cultivos: [],
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

export default function VariedadesPage() {
  const { addNotification } = useNotification();
  
  // Use reducer to manage all state
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Destructure state for easier access
  const { 
    variedades, 
    cultivos, 
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
      const endpoints = [
        `${API_URL}/api/variedades/`,
        `${API_URL}/api/cultivos/tipos/`
      ];

      const responses = await Promise.all(
        endpoints.map(url => fetch(url, { credentials: 'include' }))
      );

      const [variedadesRes, cultivosRes] = responses;
      
      let variedadesData = [];
      let cultivosData = [];

      if (variedadesRes.ok) {
        const variedadesResult = await variedadesRes.json();
        variedadesData = Array.isArray(variedadesResult) ? variedadesResult : (variedadesResult.data || []);
      }

      if (cultivosRes.ok) {
        const cultivosResult = await cultivosRes.json();
        cultivosData = Array.isArray(cultivosResult) ? cultivosResult : (cultivosResult.data || []);
      }

      dispatch({ type: 'SET_DATA', payload: { variedades: variedadesData, cultivos: cultivosData } });
    } catch (err) {
      addNotification('Error al cargar los datos de variedades', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (variedad) => {
    try {
      const res = await fetch(`${API_URL}/api/variedades/${variedad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ activo: !variedad.activo })
      });
      
      if (res.ok) {
        addNotification(`Estado de ${variedad.nombre_variedad} actualizado correctamente`, 'success');
        fetchData();
      }
    } catch (err) {
      addNotification('Error al modificar estado de la variedad', 'error');
    }
  };

  const filteredVariedades = variedades.filter(v => {
    if (!v) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (v.nombre_variedad?.toLowerCase().includes(term)) || 
      (v.codigo_variedad?.toLowerCase().includes(term)) ||
      (v.descripcion?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && v.activo) || 
      (filter === 'inactivos' && !v.activo);

    return matchesSearch && matchesFilter;
  });

  const handleCreate = () => {
    dispatch({ type: 'SET_SELECTED', payload: null });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleEdit = (variedad) => {
    dispatch({ type: 'SET_SELECTED', payload: variedad });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleDelete = (variedad) => {
    dispatch({ type: 'SET_SELECTED', payload: variedad });
    dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM VARIEDADES */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-700 to-violet-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(147,51,234,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Flower className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Variedades</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Tipos de Cultivos
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-purple-600 hover:bg-purple-500 shadow-[0_20px_40px_-5px_rgba(147,51,234,0.5)] border border-purple-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVA VARIEDAD</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD VARIEDADES */}
      <VariedadKPIs variedades={variedades} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
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
            placeholder="Buscar variedad por nombre, código o descripción..."
            value={search}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE VARIEDADES */}
      <VariedadTable 
        variedades={filteredVariedades}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        cultivos={cultivos}
      />

      {/* MODALES ORQUESTRADOS */}
      <VariedadFormModal
        open={modalOpen}
        onClose={() => dispatch({ type: 'SET_MODAL_OPEN', payload: false })}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
        cultivos={cultivos}
      />

      <VariedadDeleteModal
        open={deleteModalOpen}
        onClose={() => dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: false })}
        variedad={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
