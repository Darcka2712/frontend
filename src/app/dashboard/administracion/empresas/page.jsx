'use client';
import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useOrganization } from '@/hooks/useOrganization';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import EmpresaKPIs from '@/components/administracion/empresas/EmpresaKPIs';
import EmpresaTable from '@/components/administracion/empresas/EmpresaTable';
import EmpresaFormModal from '@/components/administracion/empresas/EmpresaFormModal';
import EmpresaDeleteModal from '@/components/administracion/empresas/EmpresaDeleteModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function EmpresasPage() {
  const { addNotification } = useNotification();
  const { getEmpresas, getCorporativosComplete, updateEmpresa, loading: orgLoading } = useOrganization();
  
  // Data States
  const [data, setData] = useState({
    empresas: [],
    corporativos: []
  });
  
  // UI Control States
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Modal Orchestration
  const [modals, setModals] = useState({
    form: false,
    delete: false
  });
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = {
        page,
        pageSize: 10,
        buscar: search,
        activo: filter === 'activos' ? true : filter === 'inactivos' ? false : undefined
      };

      const [empresasRes, corporativosRes] = await Promise.all([
        getEmpresas(queryParams),
        getCorporativosComplete()
      ]);

      if (empresasRes && empresasRes.success) {
        setData({
          empresas: empresasRes.data || [],
          corporativos: corporativosRes?.data || corporativosRes || []
        });
        
        if (empresasRes.pagination) {
          setPagination(empresasRes.pagination);
        }
      } else {
        setData({
          empresas: [],
          corporativos: []
        });
      }
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [getEmpresas, getCorporativosComplete, addNotification, search, filter]);

  useEffect(() => {
    fetchData(1);
  }, [search, filter]);

  const handleToggleStatus = async (empresa) => {
    try {
      await updateEmpresa(empresa.id_empresa, { activo: !empresa.activo });
      addNotification(`Estado de ${empresa.nombre_empresa} actualizado correctamente`, 'success');
      fetchData(pagination.page);
    } catch (err) {
      addNotification('Error al modificar estado de la empresa', 'error');
    }
  };

  const empresasList = data.empresas || [];

  const openModal = (type, empresa = null) => {
    setSelectedEmpresa(empresa);
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedEmpresa(null);
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
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
            <Building2 className="text-white drop-shadow-lg" size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
              Gestión <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Corporativa</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Control Centralizado de Entidades Jurídicas
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => openModal('form')} 
          variant="primary" 
          size="xl" 
          icon={Plus}
          className="bg-emerald-600 hover:bg-emerald-500 shadow-[0_20px_40px_-5px_rgba(16,185,129,0.5)] border border-emerald-400/20 px-10 py-5 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">REGISTRAR ENTIDAD</span>
        </Button>
      </motion.div>

      {/* KPI DASHBOARD CORPORATIVO */}
      <EmpresaKPIs empresas={data.empresas} />

      {/* FILTROS Y BÚSQUEDA GLASSMORPHISM */}
      <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
          {['todos', 'activos', 'inactivos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold scale-105' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors">
            <Search size={22} />
          </div>
          <input 
            placeholder="Localizar entidad por nombre, código o RFC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* TABLA DE EMPRESAS */}
      <EmpresaTable 
        empresas={empresasList}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchData}
        onEdit={(e) => openModal('form', e)}
        onDelete={(e) => openModal('delete', e)}
        onToggleStatus={handleToggleStatus}
      />

      {/* MODALES MODULARES */}
      <AnimatePresence mode="wait">
        {modals.form && (
          <EmpresaFormModal 
            key="empresa-form-modal"
            open={modals.form}
            onClose={() => closeModal('form')}
            selected={selectedEmpresa}
            onSaved={fetchData}
            notify={addNotification}
            corporativos={data.corporativos}
          />
        )}
        
        {modals.delete && (
          <EmpresaDeleteModal 
            key="empresa-delete-modal"
            open={modals.delete}
            onClose={() => closeModal('delete')}
            empresa={selectedEmpresa}
            onDeleted={fetchData}
            notify={addNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
