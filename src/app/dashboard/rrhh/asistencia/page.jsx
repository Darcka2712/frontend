'use client';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from 'sonner';
import { ClipboardCheck, Plus, Calendar, Filter, Search, Users, Briefcase } from 'lucide-react';

// ui components
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

// business components
import AsistenciaKPIs from '@/components/rrhh/asistencia/AsistenciaKPIs';
import AsistenciaHeader from '@/components/rrhh/asistencia/AsistenciaHeader';
import AsistenciaFilters from '@/components/rrhh/asistencia/AsistenciaFilters';
import AsistenciaTable from '@/components/rrhh/asistencia/AsistenciaTable';
import AsistenciaFormModal from '@/components/rrhh/asistencia/AsistenciaFormModal';


const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const initialState = {
  // Data State
  asistencias: [],
  empleados: [],
  resumenDia: null,
  categorias: [],
  puestos: [],
  empresas: [],
  ranchos: [],
  areas: [],
  
  // Filters State
  filters: {
    search: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_categoria: '',
    id_puesto: '',
    id_empresa: '',
    lugar: ''
  },
  fechaInicio: '',
  fechaFin: '',
  categoriaFiltro: '',
  puestoFiltro: '',
  empresaFiltro: '',
  lugarFiltro: '',
  estadoFiltro: 'true',
  searchTerm: '',
  
  // UI State
  loading: false,
  hasFiltersApplied: false,
  editingRecord: null,
  modalOpen: false,
  pagination: { page: 1, total: 0, totalPages: 1 },
  error: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ASISTENCIAS':
      return { ...state, asistencias: action.payload };
    case 'SET_EMPLEADOS':
      return { ...state, empleados: action.payload };
    case 'SET_RESUMEN_DIA':
      return { ...state, resumenDia: action.payload };
    case 'SET_CATEGORIAS':
      return { ...state, categorias: action.payload };
    case 'SET_PUESTOS':
      return { ...state, puestos: action.payload };
    case 'SET_EMPRESAS':
      return { ...state, empresas: action.payload };
    case 'SET_RANCHOS':
      return { ...state, ranchos: action.payload };
    case 'SET_AREAS':
      return { ...state, areas: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_FECHA_INICIO':
      return { ...state, fechaInicio: action.payload };
    case 'SET_FECHA_FIN':
      return { ...state, fechaFin: action.payload };
    case 'SET_CATEGORIA_FILTRO':
      return { ...state, categoriaFiltro: action.payload };
    case 'SET_PUESTO_FILTRO':
      return { ...state, puestoFiltro: action.payload };
    case 'SET_EMPRESA_FILTRO':
      return { ...state, empresaFiltro: action.payload };
    case 'SET_LUGAR_FILTRO':
      return { ...state, lugarFiltro: action.payload };
    case 'SET_ESTADO_FILTRO':
      return { ...state, estadoFiltro: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_HAS_FILTERS_APPLIED':
      return { ...state, hasFiltersApplied: action.payload };
    case 'SET_EDITING_RECORD':
      return { ...state, editingRecord: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        fechaInicio: '',
        fechaFin: '',
        categoriaFiltro: '',
        puestoFiltro: '',
        empresaFiltro: '',
        lugarFiltro: '',
        estadoFiltro: 'true',
        searchTerm: ''
      };
    default:
      return state;
  }
}

export default function AsistenciaPage() {
  const {
    getAsistencias,
    getResumenDiario,
    getCategoriasSelect,
    getPuestosSelect,
    getEmpresasSelect,
    getRanchosSelect,
    getAreasSelect,
    getEmpleadosSelect,
    deleteAsistencia
  } = useOrganization();


  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Extract state for convenience
  const {
    asistencias,
    empleados,
    resumenDia,
    categorias,
    puestos,
    empresas,
    ranchos,
    areas,
    filters,
    fechaInicio,
    fechaFin,
    categoriaFiltro,
    puestoFiltro,
    empresaFiltro,
    lugarFiltro,
    estadoFiltro,
    searchTerm,
    loading,
    hasFiltersApplied,
    editingRecord,
    modalOpen,
    pagination,
    error
  } = state;

  const fetchAsistencias = useCallback(async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_HAS_FILTERS_APPLIED', payload: true });
    try {
      // Preparar parámetros de búsqueda
      const queryParams = {
        ...(fechaInicio && { fecha_inicio: fechaInicio }),
        ...(fechaFin && { fecha_fin: fechaFin }),
        ...(categoriaFiltro && { id_categoria: categoriaFiltro }),
        ...(puestoFiltro && { id_puesto: puestoFiltro }),
        ...(empresaFiltro && { id_empresa: empresaFiltro }),
        ...(searchTerm && { buscar: searchTerm }),
        activo: estadoFiltro,
        page,
        limit: 10
      };

      // Lógica para diferenciar Rancho de Área en el filtro combinado
      if (lugarFiltro) {
        if (lugarFiltro.startsWith('rancho-')) {
          queryParams.id_rancho = lugarFiltro.replace('rancho-', '');
        } else if (lugarFiltro.startsWith('area-')) {
          queryParams.id_area = lugarFiltro.replace('area-', '');
        }
      }

      // Obtener asistencias usando el hook
      const response = await getAsistencias(queryParams);

      if (response && response.success) {
        dispatch({ type: 'SET_ASISTENCIAS', payload: response.data || [] });
        if (response.pagination) {
          dispatch({ type: 'SET_PAGINATION', payload: {
            page: response.pagination.page || page,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 1,
            hasNext: response.pagination.hasNext || false
          }});
        }
      } else {
        dispatch({ type: 'SET_ASISTENCIAS', payload: [] });
        dispatch({ type: 'SET_PAGINATION', payload: { page: 1, total: 0, totalPages: 0, hasNext: false } });
      }

      // También obtener el resumen diario con los mismos filtros
      const hoy = new Date().toISOString().split('T')[0];
      const fechaResumen = fechaFin || fechaInicio || hoy;

      const resumenParams = {
        fecha: fechaResumen,
        ...(empresaFiltro && { id_empresa: empresaFiltro }),
        ...(categoriaFiltro && { id_categoria: categoriaFiltro }),
        ...(puestoFiltro && { id_puesto: puestoFiltro })
      };

      const resumenResponse = await getResumenDiario(resumenParams);
      if (resumenResponse && resumenResponse.success) {
        dispatch({ type: 'SET_RESUMEN_DIA', payload: resumenResponse.data });
      }

    } catch (err) {
      console.error('[DEBUG] Error en fetchAsistencias:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
      toast.error('Error al cargar datos de asistencia');
      dispatch({ type: 'SET_ASISTENCIAS', payload: [] });
      dispatch({ type: 'SET_PAGINATION', payload: { page: 1, total: 0, totalPages: 0, hasNext: false } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fechaInicio, fechaFin, categoriaFiltro, puestoFiltro, empresaFiltro, lugarFiltro, searchTerm, getAsistencias, getResumenDiario]);

  const loadCatalogs = useCallback(async () => {
    try {
      const [catRes, ptoRes, empreRes, ranchoRes, areaRes, empRes] = await Promise.allSettled([
        getCategoriasSelect(),
        getPuestosSelect(),
        getEmpresasSelect(),
        getRanchosSelect(),
        getAreasSelect(),
        getEmpleadosSelect()
      ]);
      
      if (catRes.status === 'fulfilled') dispatch({ type: 'SET_CATEGORIAS', payload: catRes.value?.data || catRes.value || [] });
      if (ptoRes.status === 'fulfilled') dispatch({ type: 'SET_PUESTOS', payload: ptoRes.value?.data || ptoRes.value || [] });
      if (empreRes.status === 'fulfilled') dispatch({ type: 'SET_EMPRESAS', payload: empreRes.value?.data || empreRes.value || [] });
      if (ranchoRes.status === 'fulfilled') dispatch({ type: 'SET_RANCHOS', payload: ranchoRes.value?.data || ranchoRes.value || [] });
      if (areaRes.status === 'fulfilled') dispatch({ type: 'SET_AREAS', payload: areaRes.value?.data || areaRes.value || [] });
      if (empRes.status === 'fulfilled') {
        const empData = empRes.value?.data || empRes.value || [];
        dispatch({ type: 'SET_EMPLEADOS', payload: empData });
        console.log('[DEBUG] Empleados cargados:', empData.length);
      } else {
        console.error('[DEBUG] Error cargando empleados:', empRes);
      }
      
    } catch (error) {
      toast.error('Error al cargar catálogos');
    }
  }, [getCategoriasSelect, getPuestosSelect, getEmpresasSelect, getRanchosSelect, getAreasSelect, getEmpleadosSelect]);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const handleSaved = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_EDITING_RECORD', payload: null });
    fetchAsistencias(pagination.page || 1);
  };

  const handleFilter = () => {
    fetchAsistencias(1);
  };

  const handleClearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
    dispatch({ type: 'SET_ASISTENCIAS', payload: [] });
    dispatch({ type: 'SET_HAS_FILTERS_APPLIED', payload: false });
    dispatch({ type: 'SET_PAGINATION', payload: { page: 1, total: 0, totalPages: 0, hasNext: false } });
  };

  const handleEdit = (record) => {
    dispatch({ type: 'SET_EDITING_RECORD', payload: record });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este registro de asistencia?')) return;
    try {
      const response = await deleteAsistencia(id);
      if (response.success) {
        toast.success('Registro eliminado');
        fetchAsistencias(pagination.page || 1);
      }
    } catch (e) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Premium */}
      <AsistenciaHeader onOpenModal={() => {
        dispatch({ type: 'SET_EDITING_RECORD', payload: null });
        dispatch({ type: 'SET_MODAL_OPEN', payload: true });
      }} />

      {/* Indicadores Diarios (Basados en las Fechas Seleccionadas) */}
      <AsistenciaKPIs resumen={resumenDia} fechaInicio={fechaInicio} fechaFin={fechaFin} asistencias={asistencias} />

      {/* Filtros Avanzados */}
      <AsistenciaFilters
        searchTerm={searchTerm}
        setSearchTerm={(val) => dispatch({ type: 'SET_SEARCH_TERM', payload: val })}
        fechaInicio={fechaInicio}
        setFechaInicio={(val) => dispatch({ type: 'SET_FECHA_INICIO', payload: val })}
        fechaFin={fechaFin}
        setFechaFin={(val) => dispatch({ type: 'SET_FECHA_FIN', payload: val })}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={(val) => dispatch({ type: 'SET_CATEGORIA_FILTRO', payload: val })}
        puestoFiltro={puestoFiltro}
        setPuestoFiltro={(val) => dispatch({ type: 'SET_PUESTO_FILTRO', payload: val })}
        empresaFiltro={empresaFiltro}
        setEmpresaFiltro={(val) => dispatch({ type: 'SET_EMPRESA_FILTRO', payload: val })}
        lugarFiltro={lugarFiltro}
        setLugarFiltro={(val) => dispatch({ type: 'SET_LUGAR_FILTRO', payload: val })}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={(val) => dispatch({ type: 'SET_ESTADO_FILTRO', payload: val })}
        categorias={categorias}
        puestos={puestos}
        empresas={empresas}
        ranchos={ranchos}
        areas={areas}
        onSearch={handleFilter}
        onClear={handleClearFilters}
      />

      {/* Tabla Premium */}
      <AsistenciaTable
        data={asistencias}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchAsistencias}
        onDelete={handleDelete}
        onEdit={handleEdit}
        hasFilters={hasFiltersApplied}
      />



      {/* Modal de Registro */}
      <AsistenciaFormModal
        open={modalOpen}
        onClose={() => {
          dispatch({ type: 'SET_MODAL_OPEN', payload: false });
          dispatch({ type: 'SET_EDITING_RECORD', payload: null });
        }}
        empleados={empleados}
        onSaved={handleSaved}
        apiUrl={API}
        editingRecord={editingRecord}
      />
    </div>
  );
}