'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { useNotification } from '@/context/NotificationContext';
import { ShieldCheck, Plus, Search, Shield, Key, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

// Componentes modulares
import RoleModal from './components/RoleModal';
import PermissionsModal from './components/PermissionsModal';

const LoadingSkeleton = () => (
  <div className="space-y-6 p-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={`skeleton-${i}`} className="bg-white/5 rounded-[2rem] p-8 animate-pulse border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <div className="w-16 h-16 bg-white/10 rounded-2xl"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-white/10 rounded-lg w-1/4"></div>
            <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
          </div>
        </div>
        <div className="w-32 h-10 bg-white/5 rounded-xl"></div>
      </div>
    ))}
  </div>
);

function RolesContent() {
  const { addNotification } = useNotification();
  const { 
    getRolesList, createRole, updateRole, deleteRole, 
    loading: orgLoading 
  } = useOrganization();

  // Estados principales
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Carga de datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRolesList();
      setRoles(response || []);
    } catch (err) {
      addNotification('Error al sincronizar matriz de roles', 'error');
    } finally {
      setLoading(false);
    }
  }, [getRolesList, addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manejo de Scroll Optimizado
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = currentScrollY < lastScrollY || currentScrollY < 50;
      setHeaderVisible(prev => prev !== shouldShow ? shouldShow : prev);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter(role =>
      (role.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (role.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const openCreateModal = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleRoleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingRole) {
        await updateRole(editingRole.id_rol || editingRole.id, data);
        addNotification(`Configuración de ${data.nombre} actualizada`, 'success');
      } else {
        await createRole(data);
        addNotification(`Nuevo rol ${data.nombre} desplegado con éxito`, 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Error en el despliegue del rol', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleRoleStatus = async (role) => {
    try {
      await updateRole(role.id_rol || role.id, { activo: !role.activo });
      addNotification(`Estado del rol ${role.nombre} modificado`, 'success');
      fetchData();
    } catch (err) {
      addNotification('Fallo al conmutar estado del rol', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 pb-24">
      {/* Header Premium Flotante */}
      <AnimatePresence>
        {headerVisible && (
          <m.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5"
          >
            <div className="max-w-[1600px] mx-auto px-10 py-8 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control <span className="text-indigo-400">RBAC</span></h1>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Matriz de Autorización y Privilegios</p>
                </div>
              </div>
              <Button
                onClick={openCreateModal}
                variant="primary"
                size="xl"
                icon={Plus}
                className="shadow-2xl shadow-indigo-600/30"
              >
                DESPLEGAR ROL
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="h-40"></div>

      <div className="max-w-[1600px] mx-auto px-10 space-y-12">
        {/* Filtros Inteligentes */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Localizar rol por nomenclatura o descripción&hellip;"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
            />
          </div>
          <div className="flex gap-4">
            <select className="bg-slate-950/40 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer min-w-[250px] shadow-inner">
              <option value="">TODOS LOS NIVELES</option>
              <option value="sistema">SISTEMA</option>
              <option value="corporativo">CORPORATIVO</option>
              <option value="empresa">EMPRESA</option>
              <option value="rancho">RANCHO</option>
            </select>
          </div>
        </div>

        {/* Matriz de Roles */}
        <Card className="p-0 overflow-hidden" hover={false}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estructura de Rol</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nivel de Acceso</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Permisos</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Comandos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {paginatedRoles.map((role) => (
                      <m.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={role.id_rol || role.id} 
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                              role.activo ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:scale-110' : 'bg-slate-800/50 border-white/5 text-slate-600'
                            }`}>
                              <Shield size={28} />
                            </div>
                            <div>
                              <div className="font-black text-white text-xl tracking-tight uppercase italic">{role.nombre}</div>
                              <div className="text-slate-500 text-sm font-bold mt-1 max-w-lg line-clamp-1">{role.descripcion || 'Sin especificaciones técnicas'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-5 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest border shadow-sm ${
                            role.nivel_acceso === 'sistema' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            role.nivel_acceso === 'corporativo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {role.nivel_acceso}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5 shadow-inner">
                            <Key size={14} className="text-indigo-400" />
                            <span className="text-white font-black text-sm">
                              {role.permisos_count || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <button
                            onClick={() => toggleRoleStatus(role)}
                            className={`w-14 h-7 rounded-full transition-all relative ${role.activo ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-800'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${role.activo ? 'left-8' : 'left-1'}`} />
                          </button>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                            <Button 
                              onClick={() => setSelectedRole(role) || setShowPermissionsModal(true)} 
                              variant="secondary" 
                              size="sm" 
                              icon={Key}
                              className="w-12 h-12 p-0"
                            />
                            <Button 
                              onClick={() => openEditModal(role)} 
                              variant="secondary" 
                              size="sm" 
                              icon={Edit}
                              className="w-12 h-12 p-0 text-blue-400"
                            />
                          </div>
                        </td>
                      </m.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación Premium */}
          {totalPages > 1 && (
            <div className="px-10 py-8 bg-slate-950/20 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Página {currentPage} de {totalPages}</span>
              <div className="flex gap-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={`page-${i + 1}`}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 border ${
                      currentPage === i + 1 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-400/20 scale-110' 
                        : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <RoleModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        editingRole={editingRole} 
        onSubmit={handleRoleSubmit} 
        saving={saving} 
      />
      
      <PermissionsModal 
        show={showPermissionsModal} 
        onHide={() => setShowPermissionsModal(false)} 
        selectedRole={selectedRole} 
      />
    </div>
  );
}

export default function RolesManagement() {
  return (
    <LazyMotion features={domAnimation}>
      <ErrorBoundary>
        <RolesContent />
      </ErrorBoundary>
    </LazyMotion>
  );
}
