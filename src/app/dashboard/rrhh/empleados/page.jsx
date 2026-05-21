'use client';
import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganization } from '@/hooks/useOrganization';
import { useRRHH } from '@/hooks/useRRHH';
import { toast } from 'sonner';
import { Users, Search, PlusCircle, LayoutGrid, Building2, FileText, Filter, Briefcase, UserPlus } from 'lucide-react';

// UI Components
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Card from '@/components/ui/Card';

// Business Components
import EmployeeStats from '@/components/rrhh/empleados/EmployeeStats';
import EmployeeFilters from '@/components/rrhh/empleados/EmployeeFilters';
import EmployeeTable from '@/components/rrhh/empleados/EmployeeTable';
import EmployeeWizard from '@/components/rrhh/empleados/EmployeeWizard';
import EmployeeDetailsModals from '@/components/rrhh/empleados/EmployeeDetailsModals';
import EmployeeSectionSelector from '@/components/rrhh/empleados/EmployeeSectionSelector';
import EmployeeSectionEditModal from '@/components/rrhh/empleados/EmployeeSectionEditModal';
import BajaModal from '@/components/rrhh/empleados/BajaModal';


const initialState = {
  data: [],
  loading: false,
  hasFiltersApplied: false,
  pagination: { page: 1, total: 0, totalPages: 0, hasNext: false },
  filters: {
    search: '',
    id_categoria: '',
    id_empresa: '',
    id_puesto: '',
    lugar: '',
    tipo_contrato: '',
    activo: 1
  },
  catalogs: {
    empresas: [],
    ranchos: [],
    categorias: [],
    puestos: [],
    areas: [],
    puestosFiltrados: [],
    tiposContrato: [],
    tiposPago: [],
    tiposBanco: [],
    tiposCuenta: []
  },
  ui: {
    isWizardOpen: false,
    activeDetailModal: null,
    isBajaOpen: false,
    selectedEmpleado: null,
    isSectionSelectorOpen: false,
    isEditModalOpen: false,
    editSection: null
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
    case 'SET_CATALOGS':
      return { ...state, catalogs: { ...state.catalogs, ...action.payload } };
    case 'SET_UI':
      return { ...state, ui: { ...state.ui, ...action.payload } };
    default:
      return state;
  }
}

export default function EmpleadosPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: empleados, loading, hasFiltersApplied, pagination, filters, catalogs, ui } = state;
  const { empresas, ranchos, categorias, puestos, areas, puestosFiltrados, tiposContrato, tiposPago, tiposBanco, tiposCuenta } = catalogs;
  const { isWizardOpen, activeDetailModal, isBajaOpen, selectedEmpleado, isSectionSelectorOpen, isEditModalOpen, editSection } = ui;
  const { getEmpresas, getRanchos } = useOrganization();
  const {
    getEmpleados, createEmpleadoMultiTable, updateEmpleadoSection, darDeBajaEmpleado,
    getCategoriasSelect, getCategoriaById, getAreasSelect, getPuestosSelect, getTiposContrato, getTiposPago, getTiposBanco, getTiposCuenta
  } = useRRHH();

  // Data Loading
  const loadData = useCallback(async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Preparar parámetros de búsqueda
      // Preparar parámetros de búsqueda y limpiar strings vacíos
      const queryParams = Object.entries({
        ...filters,
        page,
        limit: 10
      }).reduce((acc, [key, val]) => {
        if (val !== '' && val !== null && val !== undefined) acc[key] = val;
        return acc;
      }, {});

      // Lógica para diferenciar Rancho de Área en el filtro combinado
      if (filters.lugar) {
        if (filters.lugar.startsWith('rancho-')) {
          queryParams.id_rancho = filters.lugar.replace('rancho-', '');
        } else if (filters.lugar.startsWith('area-')) {
          queryParams.id_area = filters.lugar.replace('area-', '');
        }
      }

      delete queryParams.lugar;

      const response = await getEmpleados(queryParams);

      if (response && response.success) {
        dispatch({
          type: 'SET_DATA',
          payload: {
            data: response.data || [],
            pagination: response.pagination || {
              page: response.pagination?.page || page,
              total: response.pagination?.total || 0,
              totalPages: response.pagination?.totalPages || 1,
              hasNext: response.pagination?.hasNext || false
            }
          }
        });
      } else {
        dispatch({
          type: 'SET_DATA',
          payload: { data: [], pagination: initialState.pagination }
        });
      }
    } catch (error) {
      console.error('Error loading employees:', error.message || error);
      toast.error('Error al cargar colaboradores. Verifique su conexión.');
      dispatch({
        type: 'SET_DATA',
        payload: { data: [], pagination: initialState.pagination }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [filters, getEmpleados]);

  const loadCatalogs = useCallback(async () => {
    try {
      const [eRes, cRes, rRes, aRes, pRes, tRes, tpRes, tbRes, tcRes] = await Promise.allSettled([
        getEmpresas(),
        getCategoriasSelect(),
        getRanchos(),
        getAreasSelect(),
        getPuestosSelect(),
        getTiposContrato(),
        getTiposPago(),
        getTiposBanco(),
        getTiposCuenta(),
      ]);

      const newCatalogs = {};
      if (eRes.status === 'fulfilled') newCatalogs.empresas = eRes.value?.data || eRes.value || [];
      if (cRes.status === 'fulfilled') newCatalogs.categorias = cRes.value?.data || cRes.value || [];
      if (rRes.status === 'fulfilled') newCatalogs.ranchos = rRes.value?.data || rRes.value || [];
      if (aRes.status === 'fulfilled') newCatalogs.areas = aRes.value?.data || aRes.value || [];
      if (pRes.status === 'fulfilled') {
        const pData = pRes.value?.data || pRes.value || [];
        newCatalogs.puestos = pData;
        newCatalogs.puestosFiltrados = pData;
      }
      if (tRes.status === 'fulfilled') newCatalogs.tiposContrato = tRes.value?.data || tRes.value || [];
      if (tpRes.status === 'fulfilled') newCatalogs.tiposPago = tpRes.value?.data || tpRes.value || [];
      if (tbRes.status === 'fulfilled') newCatalogs.tiposBanco = tbRes.value?.data || tbRes.value || [];
      if (tcRes.status === 'fulfilled') newCatalogs.tiposCuenta = tcRes.value?.data || tcRes.value || [];

      dispatch({ type: 'SET_CATALOGS', payload: newCatalogs });

    } catch (error) {
      console.error('Error loading catalogs:', error);
      toast.error('Error al cargar catálogos de configuración');
    }
  }, [getEmpresas, getCategoriasSelect, getRanchos, getAreasSelect, getPuestosSelect, getTiposContrato, getTiposPago, getTiposBanco, getTiposCuenta]);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const handleFilter = () => {
    loadData(1);
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Catalog Handlers
  const handleEmpresaChange = useCallback(async (empresaId) => {
    if (!empresaId) {
      dispatch({ type: 'SET_CATALOGS', payload: { categorias: [], puestosFiltrados: [], ranchos: [], areas: [] } });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/categorias/empresa/${empresaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        dispatch({ type: 'SET_CATALOGS', payload: { categorias: json.data || [], puestosFiltrados: [], ranchos: [], areas: [] } });
      }
    } catch (error) {
      dispatch({ type: 'SET_CATALOGS', payload: { categorias: [], puestosFiltrados: [], ranchos: [], areas: [] } });
    }
  }, []);

  const handleCategoriaChange = useCallback(async (categoriaId, empresaId = null) => {
    if (!categoriaId) {
      dispatch({ type: 'SET_CATALOGS', payload: { puestosFiltrados: [], ranchos: [], areas: [] } });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const rawEmpresaId = empresaId || filters?.id_empresa;
      const targetEmpresaId = typeof rawEmpresaId === 'object' ? rawEmpresaId?.id_empresa : rawEmpresaId;

      const catResponse = await fetch(`/api/categorias/${categoriaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let esCampo = false;
      if (catResponse.ok) {
        const catJson = await catResponse.json();
        const catData = catJson.data;
        esCampo = catData?.es_campo || catData?.es_campo === 1;
      }

      const puestosResponse = await fetch(`/api/puestos/categoria/${categoriaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (puestosResponse.ok) {
        const puestosJson = await puestosResponse.json();
        dispatch({ type: 'SET_CATALOGS', payload: { puestosFiltrados: puestosJson.data || [] } });
      }

      if (targetEmpresaId) {
        if (esCampo) {
          const ranchosRes = await fetch(`/api/ranchos/empresa/${targetEmpresaId}/select`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (ranchosRes.ok) {
            const ranchosJson = await ranchosRes.json();
            dispatch({ type: 'SET_CATALOGS', payload: { ranchos: ranchosJson.data || [], areas: [] } });
          }
        } else {
          const areasRes = await fetch(`/api/areas/empresa/${targetEmpresaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (areasRes.ok) {
            const areasJson = await areasRes.json();
            dispatch({ type: 'SET_CATALOGS', payload: { areas: areasJson.data || [], ranchos: [] } });
          }
        }
      }
    } catch (error) {
      console.error('Error en handleCategoriaChange:', error);
    }
  }, [filters?.id_empresa]);

  // Wizard Finalization
  const handleWizardFinalize = async (data) => {
    try {
      await createEmpleadoMultiTable(data);
      toast.success('Empleado dado de alta correctamente con todos sus datos');
      dispatch({ type: 'SET_UI', payload: { isWizardOpen: false } });
      loadCatalogs();
      loadData();
    } catch (error) {
      toast.error(error.message || 'Error al crear empleado');
    }
  };

  const handleBajaConfirm = async (motivo) => {
    try {
      await darDeBajaEmpleado(selectedEmpleado.id_empleado, motivo);
      toast.success('Baja procesada correctamente');
      dispatch({ type: 'SET_UI', payload: { isBajaOpen: false } });
      loadData();
    } catch (error) {
      toast.error('Error al procesar baja');
    }
  };

  const handleEditClick = (emp) => {
    dispatch({ type: 'SET_UI', payload: { selectedEmpleado: emp, isSectionSelectorOpen: true } });
  };

  const handleSectionSelect = (section) => {
    dispatch({ type: 'SET_UI', payload: { isSectionSelectorOpen: false, editSection: section, isEditModalOpen: true } });
  };

  const handleSectionSave = async (section, data) => {
    try {
      // TODO: Endpoint pendiente de implementación en backend
      // await updateEmpleadoSection(selectedEmpleado.id_empleado, section, data);
      toast.success(`Sección ${section} actualizada correctamente (endpoint pendiente)`);
      dispatch({ type: 'SET_UI', payload: { isEditModalOpen: false, editSection: null } });
      loadData();
    } catch (error) {
      toast.error(error.message || `Error al actualizar sección ${section}`);
    }
  };

  // Helpers Memoized
  const helpers = useMemo(() => ({
    getPuestoNombre: (id) => puestos.find(p => p.id_puesto.toString() === id?.toString())?.nombre_puesto || 'Sin puesto',
    getCategoriaNombre: (id) => categorias.find(cat => cat.id_categoria.toString() === id?.toString())?.label || 'Sin categoría',
    getCategoriaBadge: (id) => {
      const cat = categorias.find(c => c.id_categoria.toString() === id?.toString());
      return cat ? `border-${cat.color_badge.split('-')[1]} text-${cat.color_badge.split('-')[1]}` : 'text-slate-400';
    },
    initials: (emp) => `${emp.nombre?.[0] || ''}${emp.apellido_paterno?.[0] || ''}`.toUpperCase()
  }), [puestos, categorias]);

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
            Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Personal</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Administra el ciclo de vida de tus colaboradores, desde el alta hasta la gestión de beneficios y bajas.
          </p>
        </div>

        <Button
          onClick={() => dispatch({ type: 'SET_UI', payload: { isWizardOpen: true } })}
          variant="primary"
          size="xl"
          icon={UserPlus}
          className="group relative overflow-hidden shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_-5px_rgba(79,70,229,0.6)] transition-all duration-500 rounded-2xl px-10"
        >
          <span className="relative z-10 flex items-center gap-2">
            Nuevo Colaborador
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:scale-105 transition-transform duration-500" />
        </Button>
      </div>

      {/* Header & Stats Section */}
      <EmployeeStats
        pagination={pagination}
        empleados={empleados}
        getCategoriaNombre={helpers.getCategoriaNombre}
      />

      {/* Filter Section */}
      <EmployeeFilters
        filters={filters}
        setFilters={(newFilters) => dispatch({ type: 'SET_FILTERS', payload: newFilters })}
        catalogs={catalogs}
        handlers={{ handleEmpresaChange, handleCategoriaChange }}
        onSearch={handleFilter}
        onClear={handleClearFilters}
      />

      {/* Table Section */}
      <EmployeeTable
        empleados={empleados}
        loading={loading}
        pagination={pagination}
        onPageChange={loadData}
        helpers={helpers}
        hasFilters={hasFiltersApplied}
        onAction={(action, emp) => {
          dispatch({ type: 'SET_UI', payload: { selectedEmpleado: emp } });
          if (action === 'edit') {
            dispatch({ type: 'SET_UI', payload: { isSectionSelectorOpen: true } });
          } else if (['personal', 'laboral', 'legal', 'contacto'].includes(action)) {
            dispatch({ type: 'SET_UI', payload: { activeDetailModal: action } });
          } else if (action === 'baja') {
            dispatch({ type: 'SET_UI', payload: { isBajaOpen: true } });
          }
        }}
      />



      {/* Modals & Overlays */}
      <AnimatePresence>
        {isWizardOpen && (
          <EmployeeWizard
            isOpen={isWizardOpen}
            onClose={() => { dispatch({ type: 'SET_UI', payload: { isWizardOpen: false } }); loadCatalogs(); }}
            onFinalize={handleWizardFinalize}
            catalogs={{
              ...catalogs,
              handleEmpresaChange,
              handleCategoriaChange
            }}
            loading={loading}
          />
        )}
        
        {activeDetailModal && (
          <EmployeeDetailsModals
            activeDetailModal={activeDetailModal}
            empleado={selectedEmpleado}
            onClose={() => dispatch({ type: 'SET_UI', payload: { activeDetailModal: null } })}
            onEditSection={(section) => {
              dispatch({ type: 'SET_UI', payload: { activeDetailModal: null, editSection: section, isEditModalOpen: true } });
            }}
          />
        )}

        {isSectionSelectorOpen && (
          <EmployeeSectionSelector
            isOpen={isSectionSelectorOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { isSectionSelectorOpen: false } })}
            onSelect={handleSectionSelect}
            empleado={selectedEmpleado}
          />
        )}

        {isEditModalOpen && editSection && (
          <EmployeeSectionEditModal
            isOpen={isEditModalOpen}
            section={editSection}
            empleado={selectedEmpleado}
            catalogs={{
              ...catalogs,
              handleEmpresaChange,
              handleCategoriaChange
            }}
            onSave={handleSectionSave}
            onClose={() => dispatch({ type: 'SET_UI', payload: { isEditModalOpen: false, editSection: null } })}
          />
        )}

        {isBajaOpen && (
          <BajaModal
            isOpen={isBajaOpen}
            onClose={() => dispatch({ type: 'SET_UI', payload: { isBajaOpen: false } })}
            onConfirm={handleBajaConfirm}
            empleado={selectedEmpleado}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
