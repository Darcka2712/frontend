'use client';
import { useState, useEffect, useCallback } from 'react';
import { Building, Plus, Search, Filter } from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { useNotification } from '@/context/NotificationContext';
import AreaTable from '@/components/rrhh/areas/AreaTable';
import AreaFormModal from '@/components/rrhh/areas/AreaFormModal';
import AreaDeleteModal from '@/components/rrhh/areas/AreaDeleteModal';
import AreaKPIs from '@/components/rrhh/areas/AreaKPIs';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

export default function AreasPage() {
  const { getAreas } = useOrganization();
  const { addNotification } = useNotification();
  
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('true');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0, hasNext: false });
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  const fetchAreas = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAreas({
        page,
        limit: 10,
        buscar: search,
        activo: estado
      });
      
      if (response && response.success) {
        setAreas(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
          if (response.pagination.stats) {
            setStats(response.pagination.stats);
          }
        }
      } else {
        setAreas([]);
        setPagination({ page: 1, total: 0, totalPages: 0, hasNext: false });
      }
    } catch (err) {
      console.error('Error en fetchAreas:', err);
      setError(err.message);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, [getAreas, search, estado]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAreas(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, estado, fetchAreas]);

  const handlePageChange = (newPage) => {
    fetchAreas(newPage);
  };

  const handleCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (area) => {
    setSelected(area);
    setModalOpen(true);
  };

  const handleDelete = (area) => {
    setSelected(area);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <Building className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight">Áreas</h1>
            <p className="text-slate-500 font-medium mt-1">Estructura organizacional y departamentos</p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreate} 
          variant="primary" 
          size="lg" 
          icon={Plus}
          className="shadow-xl shadow-indigo-600/20"
        >
          NUEVA ÁREA
        </Button>
      </div>

      {/* Indicadores de Estructura */}
      <AreaKPIs stats={stats} />

      {/* Buscador y Controles */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <InputField
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            className="text-lg"
          />
        </div>
        <div className="w-full md:w-48">
          <SelectField
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            icon={Filter}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'true', label: 'Solo Activos' },
              { value: 'false', label: 'Solo Inactivos' }
            ]}
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      <AreaTable 
        areas={areas}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modales Orquestados */}
      <AreaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSaved={fetchAreas}
        notify={addNotification}
      />

      <AreaDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selected={selected}
        onDeleted={fetchAreas}
        notify={addNotification}
      />
    </div>
  );
}
