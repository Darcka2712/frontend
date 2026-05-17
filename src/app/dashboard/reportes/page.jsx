'use client';
import { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Filter, Download, TrendingUp, Plus } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import ReportesKPIs from '@/components/reportes/ReportesKPIs';
import ReportesTable from '@/components/reportes/ReportesTable';
import ReporteFormModal from '@/components/reportes/ReporteFormModal';
import ReporteDeleteModal from '@/components/reportes/ReporteDeleteModal';
import Button from '@/components/ui/Button';
import { publicApiUrl, authFetchInit } from '@/lib/api';

export default function ReportesPage() {
  const { addNotification } = useNotification();
  
  // Data States
  const [data, setData] = useState({
    reportes: [],
    tipos: [],
    usuarios: []
  });
  
  // UI Control States
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  
  // Modal Orchestration
  const [modals, setModals] = useState({
    form: false,
    delete: false
  });
  const [selectedReporte, setSelectedReporte] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoints = [
        publicApiUrl('/reportes/'),
        publicApiUrl('/reportes/tipos'),
        publicApiUrl('/usuario/'),
      ];

      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url, authFetchInit()).then(async (r) => {
            const text = await r.text();
            if (!text) return {};
            try {
              return JSON.parse(text);
            } catch {
              return {};
            }
          })
        )
      );

      const safeArray = (res) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        return [];
      };

      setData({
        reportes: safeArray(responses[0]),
        tipos: safeArray(responses[1]),
        usuarios: safeArray(responses[2])
      });
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (reporte) => {
    try {
      const res = await fetch(
        publicApiUrl(`/reportes/${reporte.id_reporte}`),
        authFetchInit({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activo: !reporte.activo }),
        })
      );
      
      if (res.ok) {
        addNotification(`Estado de ${reporte.nombre_reporte} actualizado correctamente`, 'success');
        fetchData();
      }
    } catch (err) {
      addNotification('Error al modificar estado del reporte', 'error');
    }
  };

  const filteredReportes = (data.reportes || []).filter(r => {
    if (!r) return false;
    const term = search.toLowerCase();
    const matchesSearch = 
      (r.nombre_reporte?.toLowerCase().includes(term)) || 
      (r.descripcion?.toLowerCase().includes(term)) ||
      (r.tipo_reporte?.toLowerCase().includes(term));
    
    const matchesFilter = 
      filter === 'todos' || 
      (filter === 'activos' && r.activo) || 
      (filter === 'inactivos' && !r.activo) ||
      (filter === 'programados' && r.programado) ||
      (filter === 'manuales' && !r.programado);

    return matchesSearch && matchesFilter;
  });

  const openModal = (type, reporte = null) => {
    setSelectedReporte(reporte);
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedReporte(null);
  };

  const handleDownload = async (reporte) => {
    try {
      const res = await fetch(
        publicApiUrl(`/reportes/${reporte.id_reporte}/generar`),
        authFetchInit({ method: 'POST' })
      );
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reporte.nombre_reporte}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addNotification('Reporte generado y descargado correctamente', 'success');
      }
    } catch (err) {
      addNotification('Error al generar el reporte', 'error');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
      {/* HEADER PREMIUM REPORTES */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(99,102,241,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <FileText className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Reportes</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Análisis y Estadísticas
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => openModal('form')} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_20px_40px_-5px_rgba(99,102,241,0.5)] border border-indigo-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">NUEVO REPORTE</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD REPORTES */}
      <ReportesKPIs reportes={data.reportes} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos', 'programados', 'manuales'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'programados' ? 'Programados' : f === 'manuales' ? 'Manuales' : f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Buscar reporte por nombre, tipo o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE REPORTES */}
      <ReportesTable 
        reportes={filteredReportes}
        loading={loading}
        onEdit={(r) => openModal('form', r)}
        onDelete={(r) => openModal('delete', r)}
        onToggleStatus={handleToggleStatus}
        onDownload={handleDownload}
        tipos={data.tipos}
        usuarios={data.usuarios}
      />

      {/* MODALES MODULARES */}
      <AnimatePresence mode="wait">
        {modals.form && (
          <ReporteFormModal 
            key="reporte-form-modal"
            open={modals.form}
            onClose={() => closeModal('form')}
            selected={selectedReporte}
            onSaved={fetchData}
            notify={addNotification}
            tipos={data.tipos}
            usuarios={data.usuarios}
          />
        )}
        
        {modals.delete && (
          <ReporteDeleteModal 
            key="reporte-delete-modal"
            open={modals.delete}
            onClose={() => closeModal('delete')}
            reporte={selectedReporte}
            onDeleted={fetchData}
            notify={addNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
