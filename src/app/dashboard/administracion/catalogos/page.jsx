'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Plus, Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useCatalogos } from '@/hooks/useCatalogos';
import { useNotification } from '@/context/NotificationContext';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import SelectField from '@/components/ui/SelectField';

export default function CatalogosPage() {
  const { getAllCatalogos, createCatalogo, updateCatalogo, deleteCatalogo, loading } = useCatalogos();
  const { addNotification } = useNotification();
  
  const [catalogos, setCatalogos] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ tipo: '', codigo: '', nombre: '', descripcion: '' });

  const fetchCatalogos = useCallback(async () => {
    try {
      const data = await getAllCatalogos();
      setCatalogos(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification('error', 'Error al cargar catálogos');
    }
  }, [getAllCatalogos, addNotification]);

  useEffect(() => {
    fetchCatalogos();
  }, [fetchCatalogos]);

  const tiposDisponibles = useMemo(() => {
    const tipos = new Set(catalogos.map(c => c.tipo));
    return ['ALL', ...Array.from(tipos)].sort();
  }, [catalogos]);

  const filteredCatalogos = useMemo(() => {
    return catalogos.filter(c => {
      const matchesSearch = c.nombre?.toLowerCase().includes(search.toLowerCase()) || 
                           c.codigo?.toLowerCase().includes(search.toLowerCase()) ||
                           c.tipo?.toLowerCase().includes(search.toLowerCase());
      const matchesTipo = filterTipo === 'ALL' || c.tipo === filterTipo;
      return matchesSearch && matchesTipo;
    });
  }, [catalogos, search, filterTipo]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelected(item);
      setFormData({ 
        tipo: item.tipo, 
        codigo: item.codigo, 
        nombre: item.nombre, 
        descripcion: item.descripcion || '' 
      });
    } else {
      setSelected(null);
      setFormData({ tipo: '', codigo: '', nombre: '', descripcion: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await updateCatalogo(selected.id_catalogo, formData);
        addNotification('success', 'Catálogo actualizado correctamente');
      } else {
        await createCatalogo(formData);
        addNotification('success', 'Catálogo creado correctamente');
      }
      setModalOpen(false);
      fetchCatalogos();
    } catch (err) {
      addNotification('error', err.message || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCatalogo(selected.id_catalogo);
      addNotification('success', 'Catálogo eliminado correctamente');
      setDeleteModalOpen(false);
      fetchCatalogos();
    } catch (err) {
      addNotification('error', err.message || 'Error al eliminar');
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Catálogos Maestros</h1>
            <p className="text-slate-400 font-medium mt-0.5">Gestión de datos maestros y configuraciones del sistema</p>
          </div>
        </div>
        
        <Button 
          onClick={() => handleOpenModal()} 
          variant="primary" 
          icon={Plus}
          className="shadow-lg shadow-indigo-600/20"
        >
          NUEVO REGISTRO
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <InputField
              placeholder="Buscar por nombre, código o tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="bg-slate-900/60"
            />
          </div>
          <div className="relative">
            <SelectField
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              icon={Filter}
              className="bg-slate-900/60"
              options={tiposDisponibles.map(t => ({ value: t, label: t === 'ALL' ? 'Todos los Tipos' : t }))}
            />
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Tipo / Código</th>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && catalogos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">Cargando catálogos...</td>
              </tr>
            ) : filteredCatalogos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No se encontraron registros</td>
              </tr>
            ) : (
              filteredCatalogos.map((item) => (
                <tr key={item.id_catalogo} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter mb-0.5">{item.tipo}</span>
                      <span className="text-sm font-mono text-slate-300 font-bold">{item.codigo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white">{item.nombre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.descripcion || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    {item.activo ? (
                      <Badge variant="success" dot>Activo</Badge>
                    ) : (
                      <Badge variant="danger" dot>Inactivo</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { setSelected(item); setDeleteModalOpen(true); }}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Editar Registro' : 'Nuevo Registro'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Tipo de Catálogo"
              placeholder="Ej: TIPO_CONTRATO"
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value.toUpperCase() }))}
              required
              disabled={!!selected}
            />
            <InputField
              label="Código Único"
              placeholder="Ej: PERM"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
              required
              disabled={!!selected}
            />
          </div>
          <InputField
            label="Nombre"
            placeholder="Nombre descriptivo"
            value={formData.nombre}
            onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, nombre: e.target.value }))}
            required
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion-catalogo" className="text-sm font-bold text-slate-400 px-1">Descripción</label>
            <textarea
              id="descripcion-catalogo"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all min-h-[100px]"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Detalles adicionales..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={loading}>
              {selected ? 'Guardar Cambios' : 'Crear Registro'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="pt-4 space-y-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <Trash2 size={32} />
          </div>
          <div>
            <p className="text-white font-bold text-lg">¿Estás seguro?</p>
            <p className="text-slate-400 mt-2 text-sm px-4">
              Esta acción desactivará el registro <strong>{selected?.nombre}</strong>. Los datos históricos no se perderán.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} loading={loading}>Desactivar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
