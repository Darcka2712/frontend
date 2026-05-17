'use client';
import { useState, useEffect, useCallback } from 'react';
import { Apple, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { motion } from 'framer-motion';

// Componentes Modulares Premium
import FrutaKPIs from '@/components/administracion/frutas/FrutaKPIs';
import FrutaTable from '@/components/administracion/frutas/FrutaTable';
import FrutaFormModal from '@/components/administracion/frutas/FrutaFormModal';
import FrutaDeleteModal from '@/components/administracion/frutas/FrutaDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function FrutasPage() {
  const { addNotification } = useNotification();
  
  // Data States
  const [data, setData] = useState({
    frutas: [],
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
      const endpoints = [
        `${API_URL}/api/frutas/`,
        `${API_URL}/api/variedades/`
      ];

      const responses = await Promise.all(
        endpoints.map(url => fetch(url, { credentials: 'include' }))
      );

      const [frutasRes, variedadesRes] = responses;
      
      let frutasData = [];
      let variedadesData = [];

      if (frutasRes.ok) {
        const frutasResult = await frutasRes.json();
        frutasData = Array.isArray(frutasResult) ? frutasResult : (frutasResult.data || []);
      }

      if (variedadesRes.ok) {
        const variedadesResult = await variedadesRes.json();
        variedadesData = Array.isArray(variedadesResult) ? variedadesResult : (variedadesResult.data || []);
      }

      setData({
        frutas: frutasData,
        variedades: variedadesData
      });
    } catch (err) {
      addNotification('Error al cargar los datos de frutas', 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (fruta) => {
    try {
      const res = await fetch(`${API_URL}/api/frutas/${fruta.id_fruta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ activo: !fruta.activo })
      });
      
      if (res.ok) {
        addNotification(`Estado de ${fruta.nombre_fruta} actualizado correctamente`, 'success');
        fetchData();
      }
    } catch (err) {
      addNotification('Error al modificar estado de la fruta', 'error');
    }
  };

  const filteredFrutas = data.frutas.filter(f => {
    if (!f) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (f.nombre_fruta?.toLowerCase().includes(term)) || 
      (f.codigo_fruta?.toLowerCase().includes(term)) ||
      (f.tipo_fruta?.toLowerCase().includes(term)) ||
      (f.origen?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && f.activo) || 
      (filter === 'inactivos' && !f.activo);

    return matchesSearch && matchesFilter;
  });

  const handleCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (fruta) => {
    setSelected(fruta);
    setModalOpen(true);
  };

  const handleDelete = (fruta) => {
    setSelected(fruta);
    setDeleteModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM FRUTAS */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 via-pink-700 to-purple-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(239,68,68,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Apple className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">Frutas</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Variedades y Tipos
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-red-600 hover:bg-red-500 shadow-[0_20px_40px_-5px_rgba(239,68,68,0.5)] border border-red-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVA FRUTA</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD FRUTAS */}
      <FrutaKPIs frutas={data.frutas} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar fruta por nombre, código, tipo u origen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE FRUTAS */}
      <FrutaTable 
        frutas={filteredFrutas}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        variedades={data.variedades}
      />

      {/* MODALES ORQUESTRADOS */}
      <FrutaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchData}
        notify={addNotification}
        variedades={data.variedades}
      />

      <FrutaDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        fruta={selected}
        onDeleted={fetchData}
        notify={addNotification}
      />
    </div>
  );
}
