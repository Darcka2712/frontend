'use client';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

export default function PermisosPage() {
    const { getPermisos, getModulos, createPermiso, updatePermiso, deletePermiso, loading: apiLoading } = usePermissions();
    const [permisos, setPermisos] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPermiso, setEditingPermiso] = useState(null);
    const [formData, setFormData] = useState({ id_modulo: '', accion: 'ver', descripcion: '', activo: true });
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadData = async () => {
        try {
            const [pData, mData] = await Promise.all([getPermisos(), getModulos()]);
            console.log('Permisos cargados:', pData);
            console.log('Modulos cargados:', mData);
            setPermisos(Array.isArray(pData) ? pData : (pData.data || []));
            setModulos(Array.isArray(mData) ? mData : (mData.data || []));
        } catch (err) {
            console.error('Error cargando datos en Permisos:', err);
            showToast('Error al conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingPermiso) {
                await updatePermiso(editingPermiso.id_permiso, formData);
                showToast('🚀 Atributo de seguridad actualizado');
            } else {
                await createPermiso(formData);
                showToast('✨ Capacidad granular añadida');
            }
            setShowModal(false);
            setEditingPermiso(null);
            setFormData({ id_modulo: '', accion: 'ver', descripcion: '', activo: true });
            loadData();
        } catch (err) {
            showToast(err.message || 'Error en validación', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePermiso(deleteModal.id);
            showToast('🗑️ Permiso removido permanentemente');
            setDeleteModal({ show: false, id: null, name: '' });
            loadData();
        } catch (err) {
            showToast(err.message || 'Error al eliminar', 'error');
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-fadeIn text-slate-100 font-sans">
            {/* Modal Confirmación */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
                        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-6 mx-auto border border-rose-500/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2 uppercase tracking-tight">¿Eliminar capacidad?</h3>
                        <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
                            Estás por eliminar el permiso <span className="font-bold text-slate-200">"{deleteModal.name}"</span>. Los roles asociados perderán este acceso.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteModal({ show: false, id: null, name: '' })} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-bold transition-all border border-white/5">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs">Si, eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {notification && (
                <div className="fixed top-8 right-8 z-[9999] animate-slideInRight">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <span className="text-xl font-bold">{notification.type === 'success' ? '🛡️' : '⚠️'}</span>
                        <span className="font-bold tracking-tight">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Control Granular</h1>
                    <p className="text-slate-400 font-medium mt-2">Definición de privilegios y acciones a nivel de servicio</p>
                </div>
                <button
                    onClick={() => { setEditingPermiso(null); setFormData({ id_modulo: '', accion: 'ver', descripcion: '', activo: true }); setShowModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Añadir Capacidad
                </button>
            </div>

            <div className="premium-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Servicio</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Atributo</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Impacto Administrativo</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center text-center">Estado</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {apiLoading && permisos.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-32 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                <span className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Sincronizando tabla de privilegios...</span>
                            </td></tr>
                        ) : permisos.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-32 text-slate-500 font-black text-xs uppercase tracking-widest italic">No se encontraron capacidades registradas</td></tr>
                        ) : permisos.map((permiso) => (
                            <tr key={permiso.id_permiso} className="group hover:bg-white/5 transition-all">
                                <td className="px-8 py-6">
                                    <div className="font-black text-slate-200 text-sm group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{permiso.modulo?.nombre}</div>
                                    <div className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-[0.2em]">{permiso.modulo?.sistema?.nombre}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                        permiso.accion === 'ver' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                        permiso.accion === 'crear' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        permiso.accion === 'eliminar' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                        {permiso.accion}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-medium text-slate-400 text-xs italic leading-relaxed max-w-xs truncate group-hover:text-slate-300 transition-colors">
                                    {permiso.descripcion || 'Sin descripción corporativa'}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${permiso.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${permiso.activo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                                        {permiso.activo ? 'Activo' : 'Baja'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => { setEditingPermiso(permiso); setFormData({ id_modulo: permiso.id_modulo, accion: permiso.accion, descripcion: permiso.descripcion, activo: permiso.activo }); setShowModal(true); }}
                                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 rounded-xl transition-all active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, id: permiso.id_permiso, name: permiso.accion })}
                                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10 rounded-xl transition-all active:scale-95"
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

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[5000] p-4 animate-fadeIn">
                    <div className="bg-slate-900 rounded-[2rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] w-full max-w-lg border border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>

                        <div className="px-8 py-6 border-b border-white/5 bg-slate-950/30 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">
                                    {editingPermiso ? <span className="text-emerald-400">Ajustar</span> : 'Nuevo'} Atributo
                                </h2>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Configuración granular</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-6">
                                    <div>
                                        <select
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-3.5 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                            value={formData.id_modulo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, id_modulo: e.target.value }))}
                                            required
                                        >
                                            <option value="" className="bg-slate-900">Seleccionar Módulo</option>
                                            {modulos.map(m => (
                                                <option key={m.id_modulo} value={m.id_modulo} className="bg-slate-900">
                                                    {m.nombre} ({m.sistema?.nombre})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-3.5 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all placeholder-slate-700 lowercase"
                                            value={formData.accion}
                                            onChange={(e) => setFormData(prev => ({ ...prev, accion: e.target.value.toLowerCase() }))}
                                            required
                                            placeholder="ej: crear_reporte"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-6 py-3.5 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all placeholder-slate-700 resize-none font-sans"
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                            rows="2"
                                            placeholder="Define el impacto..."
                                        />
                                    </div>
                                    <div 
                                        onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                                        onKeyDown={(e) => e.key === 'Enter' && setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                                        role="button"
                                        tabIndex={0}
                                        className={`flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer group ${formData.activo ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950 border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-inner text-lg">
                                                {formData.activo ? '🛡️' : '🔒'}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Estado</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{formData.activo ? 'Habilitado' : 'Bloqueado'}</p>
                                            </div>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${formData.activo ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${formData.activo ? 'left-5' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-white/5 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/5">Descartar</button>
                                    <button type="submit" disabled={loading} className="flex-[2] px-6 py-4 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3">
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            editingPermiso ? 'Guardar Cambios' : 'Anclar Atributo'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
