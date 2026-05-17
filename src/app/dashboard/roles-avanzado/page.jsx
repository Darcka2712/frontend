'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { publicApiUrl, authFetchInit } from '@/lib/api';

// Componente de Selector de Permisos Jerárquico
// Constantes para optimizar el rendimiento
const EMPTY_INITIAL_PERMISOS = [];

const PermisosGranularesSelector = ({ initialPermisos = EMPTY_INITIAL_PERMISOS, onSave, onCancel }) => {
  const { getSistemas, getModulos, getPermisos } = usePermissions();
  const [sistemas, setSistemas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState(
    Array.isArray(initialPermisos) ? initialPermisos.map(p => p.id_permiso) : []
  );
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [s, m, p] = await Promise.all([getSistemas(), getModulos(), getPermisos()]);
      setSistemas(s);
      setModulos(m);
      setPermisosDisponibles(p);
    } catch (err) {
      console.error('Error cargando estructura de permisos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleToggle = (permisoId) => {
    setSelectedPermisos(prev =>
      prev.includes(permisoId) ? prev.filter(id => id !== permisoId) : [...prev, permisoId]
    );
  };

  const isSistemaChecked = (sistemaId) => {
    const modulosId = modulos.reduce((acc, m) => {
      if (m.id_sistema === sistemaId) acc.push(m.id_modulo);
      return acc;
    }, []);
    const permisosDelSistema = permisosDisponibles.reduce((acc, p) => {
      if (modulosId.includes(p.id_modulo)) acc.push(p);
      return acc;
    }, []);
    return permisosDelSistema.length > 0 && permisosDelSistema.every(p => selectedPermisos.includes(p.id_permiso));
  };

  const toggleSistema = (sistemaId, checked) => {
    const permisosDelSistemaId = permisosDisponibles.reduce((acc, p) => {
      const moduloMatch = modulos.find(m => m.id_sistema === sistemaId && m.id_modulo === p.id_modulo);
      if (moduloMatch) acc.push(p.id_permiso);
      return acc;
    }, []);

    if (checked) {
      setSelectedPermisos(prev => Array.from(new Set([...prev, ...permisosDelSistemaId])));
    } else {
      setSelectedPermisos(prev => prev.filter(id => !permisosDelSistemaId.includes(id)));
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Cargando motor de permisos...</span>
    </div>
  );

  return (
    <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
      {sistemas.map(sistema => (
        <div key={sistema.id_sistema} className="bg-slate-950/40 rounded-3xl border border-white/5 overflow-hidden shadow-inner">
          <div className="bg-slate-900/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                onClick={() => toggleSistema(sistema.id_sistema, !isSistemaChecked(sistema.id_sistema))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSistema(sistema.id_sistema, !isSistemaChecked(sistema.id_sistema));
                  }
                }}
                tabIndex={0}
                role="checkbox"
                aria-checked={isSistemaChecked(sistema.id_sistema)}
                aria-label={`Toggle ${sistema.nombre} access`}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isSistemaChecked(sistema.id_sistema) ? 'bg-blue-600 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-950 border-white/10'}`}
              >
                {isSistemaChecked(sistema.id_sistema) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="font-black text-slate-200 uppercase tracking-[0.1em] text-xs leading-none">{sistema.nombre}</span>
            </div>
            <span className="text-[9px] bg-white/5 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/5">{sistema.clave}</span>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {modulos.reduce((acc, m) => {
              if (m.id_sistema === sistema.id_sistema) {
                acc.push(
                  <div key={m.id_modulo} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{m.nombre}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {permisosDisponibles.reduce((permAcc, p) => {
                        if (p.id_modulo === m.id_modulo) {
                          permAcc.push(
                            <button
                              key={p.id_permiso}
                              onClick={() => handleToggle(p.id_permiso)}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${selectedPermisos.includes(p.id_permiso)
                                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20 hover:text-slate-300'
                                }`}
                            >
                              {p.accion}
                            </button>
                          );
                        }
                        return permAcc;
                      }, [])}
                    </div>
                  </div>
                );
              }
              return acc;
            }, [])}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-white/10 -mx-2 px-2 pt-6 flex gap-4 justify-end">
        <button onClick={onCancel} className="px-8 py-3 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-300 transition-colors">Cancelar</button>
        <button
          onClick={() => onSave(selectedPermisos)}
          className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5"
        >
          Anclar Privilegios
        </button>
      </div>
    </div>
  );
};

export default function RolesAvanzadoPage() {
  const { getSistemas, loading: pLoading } = usePermissions();
  const [roles, setRoles] = useState([]);
  const loadingRef = useRef(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isManagingPerms, setIsManagingPerms] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, roleId: null, roleName: '' });

  // Helper para mostrar feedback visual agradable
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre_rol: '', descripcion: '', nivel_acceso: 'sistema', activo: true });
  const [metricas, setMetricas] = useState({ totalRoles: 0, activos: 0, inactivos: 0, porNivel: [] });

  const fetchRoles = async () => {
    try {
      loadingRef.current = true;
      const res = await fetch(publicApiUrl('/roles'), authFetchInit());
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      loadingRef.current = false;
    }
  };

  const fetchMetricas = async () => {
    try {
      const res = await fetch(publicApiUrl('/roles/metrics'), authFetchInit());
      const data = await res.json();
      if (res.ok) {
        setMetricas(data.data || data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchRoles();
    fetchMetricas();
  }, []);

  const handleManagePerms = async (role) => {
    setSelectedRole(role);
    try {
      const res = await fetch(publicApiUrl(`/roles/${role.id_rol}/permisos-granulares`), authFetchInit());
      const responseJson = await res.json();
      const data = responseJson.data || responseJson;
      setRolePermissions(Array.isArray(data) ? data : []);
      setIsManagingPerms(true);
    } catch (e) {
      showToast('Error cargando permisos', 'error');
    }
  };

  const savePerms = async (id_permisos) => {
    try {
      const res = await fetch(publicApiUrl(`/roles/${selectedRole.id_rol}/permisos-granulares`), {
        ...authFetchInit(),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_permisos })
      });
      if (res.ok) {
        showToast('🚀 Privilegios actualizados con éxito');
        setIsManagingPerms(false);
        fetchRoles();
        fetchMetricas();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'No se pudieron guardar los cambios', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error de conexión con el servidor', 'error');
    }
  };

  const createRole = async () => {
    if (!form.nombre_rol) return showToast('El nombre es obligatorio', 'error');
    try {
      const res = await fetch(publicApiUrl('/roles/create'), {
        ...authFetchInit(),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        showToast('✨ Rol creado exitosamente');
        setForm({ nombre_rol: '', descripcion: '', nivel_acceso: 'sistema', activo: true });
        fetchRoles();
        fetchMetricas();
      } else {
        const data = await res.json();
        showToast(data.message || 'Error al crear rol', 'error');
      }
    } catch (e) {
      showToast('Error de conexión', 'error');
    }
  };

  const toggleRoleStatus = async (role) => {
    try {
      const res = await fetch(publicApiUrl(`/roles/${role.id_rol}`), {
        ...authFetchInit(),
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !role.activo })
      });
      if (res.ok) {
        showToast(`Rol ${!role.activo ? 'activado' : 'desactivado'} correctamente`);
        fetchRoles();
        fetchMetricas();
      }
    } catch (e) {
      showToast('Error al cambiar estado', 'error');
    }
  };

  const deleteRole = async () => {
    const { roleId } = deleteModal;
    try {
      const res = await fetch(publicApiUrl(`/roles/${roleId}`), {
        ...authFetchInit(),
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('🗑️ Rol eliminado correctamente');
        setDeleteModal({ show: false, roleId: null, roleName: '' });
        fetchRoles();
        fetchMetricas();
      } else {
        const data = await res.json();
        showToast(data.message || 'No se puede eliminar un rol con seguridad crítica', 'error');
      }
    } catch (e) {
      showToast('Error al eliminar', 'error');
    }
  };

  const activeRoles = roles.filter(r => r.activo);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-slate-100 font-sans">
      {/* Modal de Confirmación Premium */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-10 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
            <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mb-8 mx-auto border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-3 uppercase tracking-tight">¿Eliminar este rol?</h3>
            <p className="text-slate-400 text-center text-sm mb-10 leading-relaxed font-medium px-4">
              Estás a punto de eliminar permanentemente el rol <span className="text-slate-200 font-black">"{deleteModal.roleName}"</span>. Esta acción no se puede deshacer y afectará a los usuarios vinculados.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setDeleteModal({ show: false, roleId: null, roleName: '' })}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={deleteRole}
                className="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight uppercase">Control Maestro de Roles</h1>
          <p className="text-slate-400 font-medium mt-2">Motor granular de acceso y privilegios corporativos</p>
        </div>
        <div className="flex gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estado Global</span>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                <span className="text-sm font-black text-white uppercase tracking-wider">{metricas.activos} <span className="text-slate-600">/</span> {metricas.totalRoles} ACTIVOS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Notificaciones Visuales (Toast) */}
      {notification && (
        <div className={`fixed top-8 right-8 z-[9999] animate-slideInRight`}>
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${notification.type === 'success'
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
            <span className="text-xl font-bold">{notification.type === 'success' ? '✨' : '⚠️'}</span>
            <span className="font-bold tracking-tight">{notification.message}</span>
          </div>
        </div>
      )}

      {isManagingPerms ? (
        <div className="premium-card p-12 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-white uppercase tracking-tight leading-none">Gestionar Privilegios</h2>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Rol: <span className="text-white italic">{selectedRole.nombre_rol}</span></p>
                </div>
              </div>
              <button onClick={() => setIsManagingPerms(false)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Volver</button>
          </div>
          <PermisosGranularesSelector
            initialPermisos={rolePermissions}
            onCancel={() => setIsManagingPerms(false)}
            onSave={savePerms}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <div className="premium-card overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rol / Nivel</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Permisos</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estado</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                  {roles.map(role => (
                    <tr key={role.id_rol} className="group hover:bg-white/5 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-200 group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm leading-none">{role.nombre_rol}</span>
                          <span className="text-[9px] font-black uppercase text-slate-500 mt-2 tracking-[0.2em] flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-slate-700"></span> {role.nivel_acceso}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-blue-600/10 text-blue-400 font-black px-3 py-1.5 rounded-xl text-[10px] border border-blue-500/20 shadow-[0_0_10px_rgba(37,99,235,0.05)] tracking-widest">
                          {String(metricas.permisosPorRol?.find(m => m.id_rol === role.id_rol)?.permisos || 0).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${role.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${role.activo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                          {role.activo ? 'Operativo' : 'Inactivo'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => handleManagePerms(role)}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl transition-all active:scale-95"
                            title="Configurar Permisos"
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => toggleRoleStatus(role)}
                            className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all shadow-sm active:scale-95 ${role.activo
                              ? 'bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/10'
                              : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                              }`}
                            title={role.activo ? 'Suspender' : 'Reactivar'}
                          >
                            {role.activo ? '🚫' : '✅'}
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, roleId: role.id_rol, roleName: role.nombre_rol })}
                            className="w-10 h-10 flex items-center justify-center bg-rose-500/5 border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 rounded-xl transition-all active:scale-95"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-700" />
              
              <h3 className="text-xl font-semibold text-white uppercase tracking-tight mb-8 relative z-10">Nuevo Rol Maestro</h3>
              <div className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="etiqueta-rol" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3 ml-1">Etiqueta Identificadora</label>
                  <input
                    id="etiqueta-rol"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-white placeholder-slate-700 uppercase"
                    placeholder="Ej: AUDITOR_INTERNO"
                    value={form.nombre_rol}
                    onChange={(e) => setForm(prev => ({ ...prev, nombre_rol: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div>
                  <label htmlFor="nivel-jerarquia" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3 ml-1">Nivel de Jerarquía</label>
                   <div className="relative">
                        <select
                            id="nivel-jerarquia"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-white appearance-none cursor-pointer"
                            value={form.nivel_acceso}
                            onChange={(e) => setForm(prev => ({ ...prev, nivel_acceso: e.target.value }))}
                        >
                            <option value="sistema" className="bg-slate-900 uppercase">Sistema Central</option>
                            <option value="corporativo" className="bg-slate-900 uppercase">Corporativo</option>
                            <option value="empresa" className="bg-slate-900 uppercase">Empresa</option>
                            <option value="rancho" className="bg-slate-900 uppercase">Rancho</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                   </div>
                </div>
                <button
                  onClick={createRole}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.6)] mt-4 active:scale-95 group"
                >
                  Proyectar Rol <span className="inline-block transition-transform group-hover:translate-x-2 ml-2">→</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950/40 rounded-[2.5rem] p-10 border border-white/10 shadow-inner group">
              <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,1)] animate-pulse"></span>
                  Documentación
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 group/item">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover/item:text-blue-400 transition-all border border-white/5">💡</div>
                  <div>
                      <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Granularidad</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Permisos definidos por sistema, módulo y acción.</p>
                  </div>
                </div>
                <div className="flex gap-4 group/item">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover/item:text-blue-400 transition-all border border-white/5">🌐</div>
                  <div>
                      <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Impacto Global</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">El nivel de jerarquía filtra la visibilidad de datos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
