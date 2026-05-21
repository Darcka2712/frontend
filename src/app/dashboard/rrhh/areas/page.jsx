'use client';
import { useReducer, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Plus, Search, Filter } from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from 'sonner';
import AreaTable from '@/components/rrhh/areas/AreaTable';
import AreaFormModal from '@/components/rrhh/areas/AreaFormModal';
import AreaDeleteModal from '@/components/rrhh/areas/AreaDeleteModal';
import AreaKPIs from '@/components/rrhh/areas/AreaKPIs';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

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

export default function AreasPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: areas, loading, hasFiltersApplied, pagination, filters, ui } = state;
  const { modalOpen, deleteModalOpen, selected } = ui;
  const { getAreas } = useOrganization();

  const fetchAreas = useCallback(async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getAreas({
        page,
        limit: 10,
        buscar: filters.search,
        activo: filters.estado
      });

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
      console.error('Error en fetchAreas:', err);
      dispatch({
        type: 'SET_DATA',
        payload: { data: [], pagination: initialState.pagination }
      });
    }
  }, [getAreas, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAreas(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, filters.estado, fetchAreas]);

  const handleFilter = () => {
    fetchAreas(1);
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const handleCreate = () => {
    dispatch({ type: 'SET_UI', payload: { selected: null, modalOpen: true } });
  };

  const handleEdit = (area) => {
    dispatch({ type: 'SET_UI', payload: { selected: area, modalOpen: true } });
  };

  const handleDelete = (area) => {
    dispatch({ type: 'SET_UI', payload: { selected: area, deleteModalOpen: true } });
  };

  const handleSaved = () => {
    toast.success(selected ? 'Área actualizada correctamente' : 'Área creada correctamente');
    dispatch({ type: 'SET_UI', payload: { modalOpen: false } });
    fetchAreas();
  };

  const handleDeleted = () => {
    toast.success('Área desactivada correctamente');
    dispatch({ type: 'SET_UI', payload: { deleteModalOpen: false } });
    fetchAreas();
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-fadeIn pb-20 px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-slate-900/40 to-transparent p-8 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-widest text-xs uppercase">
            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
            Recursos Humanos
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Áreas</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Administra la estructura organizacional y departamentos de tu empresa.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          variant="primary"
          size="xl"
          icon={Plus}
          className="group relative overflow-hidden shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_-5px_rgba(79,70,229,0.6)] transition-all duration-500 rounded-2xl px-10"
        >
          <span className="relative z-10 flex items-center gap-2">
            Nueva Área
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:scale-105 transition-transform duration-500" />
        </Button>
      </div>

      {/* KPIs Section */}
      <AreaKPIs stats={pagination} />

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <InputField
            placeholder="Buscar por nombre o descripción..."
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
            icon={Search}
            className="text-lg"
          />
        </div>
        <div className="w-full md:w-48">
          <SelectField
            value={filters.estado}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { estado: e.target.value } })}
            icon={Filter}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'true', label: 'Solo Activos' },
              { value: 'false', label: 'Solo Inactivos' }
            ]}
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleFilter} variant="primary" icon={Search}>
            Buscar
          </Button>
          <Button onClick={handleClearFilters} variant="ghost">
            Limpiar
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <AreaTable
        areas={areas}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchAreas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasFilters={hasFiltersApplied}
      />

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <AreaFormModal
            open={modalOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { modalOpen: false } })}
            selected={selected}
            onSaved={handleSaved}
          />
        )}
        {deleteModalOpen && (
          <AreaDeleteModal
            open={deleteModalOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { deleteModalOpen: false } })}
            selected={selected}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
