'use client';
import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from 'sonner';
import { Building, Search, Plus, Filter } from 'lucide-react';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import CorporativoKPIs from '@/components/administracion/corporativos/CorporativoKPIs';
import CorporativoTable from '@/components/administracion/corporativos/CorporativoTable';
import CorporativoFormModal from '@/components/administracion/corporativos/CorporativoFormModal';
import CorporativoDeleteModal from '@/components/administracion/corporativos/CorporativoDeleteModal';

const initialState = {
  data: [],
  loading: false,
  hasFiltersApplied: false,
  pagination: { page: 1, total: 0, totalPages: 0, hasNext: false },
  filters: {
    search: '',
    estado: 'true'
  },
  ui: {
    modalOpen: false,
    deleteModalOpen: false,
    selected: null
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination,
        hasFiltersApplied: true,
        loading: false
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        data: [],
        hasFiltersApplied: false,
        pagination: initialState.pagination
      };
    case 'SET_UI':
      return { ...state, ui: { ...state.ui, ...action.payload } };
    default:
      return state;
  }
}

export default function CorporativosPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: corporativos, loading, hasFiltersApplied, pagination, filters, ui } = state;
  const { modalOpen, deleteModalOpen, selected } = ui;
  const { getCorporativos, updateCorporativo } = useOrganization();

  const loadData = useCallback(async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = Object.entries({
        page,
        limit: 10,
        buscar: filters.search,
        activo: filters.estado
      }).reduce((acc, [key, val]) => {
        if (val !== '' && val !== null && val !== undefined) acc[key] = val;
        return acc;
      }, {});

      const response = await getCorporativos(queryParams);

      if (response && response.success) {
        dispatch({
          type: 'SET_DATA',
          payload: {
            data: response.data || [],
            pagination: response.pagination || initialState.pagination
          }
        });
      } else {
        dispatch({
          type: 'SET_DATA',
          payload: { data: [], pagination: initialState.pagination }
        });
      }
    } catch (err) {
      console.error('Error loading corporativos:', err);
      dispatch({
        type: 'SET_DATA',
        payload: { data: [], pagination: initialState.pagination }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [filters, getCorporativos]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilter = () => loadData(1);
  const handleClearFilters = () => dispatch({ type: 'CLEAR_FILTERS' });

  const handleCreate = () => {
    dispatch({ type: 'SET_UI', payload: { selected: null, modalOpen: true } });
  };

  const handleEdit = (item) => {
    dispatch({ type: 'SET_UI', payload: { selected: item, modalOpen: true } });
  };

  const handleDelete = (item) => {
    dispatch({ type: 'SET_UI', payload: { selected: item, deleteModalOpen: true } });
  };

  const handleToggleStatus = async (item) => {
    try {
      await updateCorporativo(item.id_corporativo || item.id, { activo: !item.activo });
      toast.success(`Estado de ${item.nombre_corporativo} actualizado`);
      loadData();
    } catch (err) {
      toast.error('Error al modificar estado');
    }
  };

  const handleSaved = () => {
    toast.success(selected ? 'Corporativo actualizado correctamente' : 'Corporativo creado correctamente');
    dispatch({ type: 'SET_UI', payload: { modalOpen: false } });
    loadData();
  };

  const handleDeleted = () => {
    toast.success('Corporativo desactivado correctamente');
    dispatch({ type: 'SET_UI', payload: { deleteModalOpen: false } });
    loadData();
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-fadeIn pb-20 px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-slate-900/40 to-transparent p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-widest text-xs uppercase">
            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
            Administración
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Corporativos</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Administra las entidades jurídicas principales de tu organización.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          variant="primary"
          size="xl"
          icon={Plus}
          className="group relative overflow-hidden shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_-5px_rgba(99,102,241,0.6)] transition-all duration-500 rounded-2xl px-10"
        >
          <span className="relative z-10 flex items-center gap-2">
            Nuevo Corporativo
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:scale-105 transition-transform duration-500" />
        </Button>
      </div>

      {/* KPIs Section */}
      <CorporativoKPIs corporativos={corporativos} />

      {/* Filter Section */}
      <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/30 rounded-[2.5rem] p-8 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
            <Search size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Filtros de Búsqueda</h3>
            <p className="text-slate-400 text-sm">Busca corporativos por nombre, RFC o razón social</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <InputField
              placeholder="Buscar por nombre, RFC o razón social..."
              value={filters.search}
              onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
              icon={Search}
              className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
            />
          </div>
          <div>
            <SelectField
              value={filters.estado}
              onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { estado: e.target.value } })}
              icon={Filter}
              options={[
                { value: 'true', label: 'Solo Activos' },
                { value: 'false', label: 'Solo Inactivos' },
                { value: 'all', label: 'Todos los estados' }
              ]}
              className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-slate-700/30">
          <Button
            onClick={handleFilter}
            variant="primary"
            size="lg"
            icon={Filter}
            className="flex-1 sm:flex-none shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300"
          >
            Buscar Corporativos
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="secondary"
            size="lg"
            className="flex-1 sm:flex-none bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 transition-all duration-300"
          >
            Limpiar Todo
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <CorporativoTable
        corporativos={corporativos}
        loading={loading}
        pagination={pagination}
        onPageChange={loadData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        hasFilters={hasFiltersApplied}
      />

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <CorporativoFormModal
            open={modalOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { modalOpen: false } })}
            selected={selected}
            onSaved={handleSaved}
          />
        )}
        {deleteModalOpen && (
          <CorporativoDeleteModal
            open={deleteModalOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { deleteModalOpen: false } })}
            corporativo={selected}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
