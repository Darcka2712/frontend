'use client';
import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, ShieldCheck, Filter } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

// Componentes Modulares Premium
import UserKPIs from '@/components/usuarios/UserKPIs';
import UserTable from '@/components/usuarios/UserTable';
import UserFormModal from '@/components/usuarios/UserFormModal';
import UserDeleteModal from '@/components/usuarios/UserDeleteModal';
import UserPasswordModal from '@/components/usuarios/UserPasswordModal';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function UsuariosPage() {
  const { addNotification } = useNotification();
  const { 
    getUsuarios, updateUsuario, getRoles,
    loading: authLoading 
  } = useAuth();
  
  const { 
    getCorporativosComplete, getEmpresasComplete, getRanchos,
    loading: orgLoading 
  } = useOrganization();
  
  // Data States
  const [data, setData] = useState({
    usuarios: [],
    roles: [],
    corporativos: [],
    empresas: [],
    ranchos: []
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
    delete: false,
    password: false
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      // Preparar filtros para el backend
      const queryParams = {
        page,
        pageSize: 10,
        buscar: search,
        activo: filter === 'activos' ? true : filter === 'inactivos' ? false : undefined
      };

      const [
        usuariosRes, rolesRes, corporativosRes, empresasRes, ranchosRes
      ] = await Promise.all([
        getUsuarios(queryParams),
        getRoles(),
        getCorporativosComplete(),
        getEmpresasComplete(),
        getRanchos()
      ]);

      // Manejar respuesta de usuarios (paginada o no)
      if (usuariosRes && usuariosRes.success) {
        setData(prev => ({
          ...prev,
          usuarios: usuariosRes.data || [],
          roles: rolesRes?.data || rolesRes || [],
          corporativos: corporativosRes?.data || corporativosRes || [],
          empresas: empresasRes?.data || empresasRes || [],
          ranchos: ranchosRes?.data || ranchosRes || []
        }));
        
        if (usuariosRes.pagination) {
          setPagination(usuariosRes.pagination);
        }
      } else {
        setData({
          usuarios: [],
          roles: [],
          corporativos: [],
          empresas: [],
          ranchos: []
        });
      }
    } catch (err) {
      addNotification('Fallo en la sincronización de datos con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filter, getUsuarios, getRoles, getCorporativosComplete, getEmpresasComplete, getRanchos, addNotification]);

  useEffect(() => {
    fetchData(1);
  }, [search, filter, fetchData]);

  const handleToggleStatus = async (user) => {
    try {
      await updateUsuario(user.id_usuario || user.id, { activo: !user.activo });
      addNotification(`Estado de @${user.usuario} actualizado correctamente`, 'success');
      fetchData(pagination.page);
    } catch (err) {
      addNotification('Error al modificar estado del usuario', 'error');
    }
  };

  const usersList = data.usuarios || [];

  const openModal = (type, user = null) => {
    setSelectedUser(user);
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedUser(null);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-[1600px] mx-auto space-y-12 pb-24 animate-fadeIn">
        {/* HEADER PREMIUM V2 */}
        <m.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] border border-white/10 group hover:scale-105 transition-transform duration-500">
              <ShieldCheck className="text-white drop-shadow-lg" size={40} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
                Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">IAM</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Gestión Centralizada de Identidades y Privilegios
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => openModal('form')} 
            variant="primary" 
            size="xl" 
            icon={UserPlus}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_20px_40px_-5px_rgba(79,70,229,0.5)] border border-indigo-400/20 px-10 py-5 group"
          >
            <span className="group-hover:translate-x-1 transition-transform">DESPLEGAR NUEVO USUARIO</span>
          </Button>
        </m.div>

        {/* KPI DASHBOARD */}
        <UserKPIs users={data.usuarios} />

        {/* FILTROS Y BUSQUEDA GLASSMORPHISM */}
        <div className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1 self-stretch md:self-auto">
            {['todos', 'activos', 'inactivos'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 relative group w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <Search size={22} />
            </div>
            <input 
              placeholder="Localizar usuario por alias, nombre o correo&hellip;"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <UserTable 
          users={usersList}
          loading={loading}
          pagination={pagination}
          onPageChange={fetchData}
          onEdit={(u) => openModal('form', u)}
          onDelete={(u) => openModal('delete', u)}
          onChangePassword={(u) => openModal('password', u)}
          onToggleStatus={handleToggleStatus}
        />

        {/* MODALES MODULARES */}
        <AnimatePresence mode="wait">
          {modals.form && (
            <UserFormModal 
              key="user-form-modal"
              open={modals.form}
              onClose={() => closeModal('form')}
              selected={selectedUser}
              onSaved={fetchData}
              notify={addNotification}
              roles={data.roles}
              corporativos={data.corporativos}
              empresas={data.empresas}
              ranchos={data.ranchos}
            />
          )}
          
          {modals.delete && (
            <UserDeleteModal 
              key="user-delete-modal"
              open={modals.delete}
              onClose={() => closeModal('delete')}
              user={selectedUser}
              onDeleted={fetchData}
              notify={addNotification}
            />
          )}

          {modals.password && (
            <UserPasswordModal 
              key="user-password-modal"
              open={modals.password}
              onClose={() => closeModal('password')}
              user={selectedUser}
              notify={addNotification}
            />
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
