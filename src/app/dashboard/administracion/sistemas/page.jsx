'use client';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

export default function SistemasPage() {
    const { getSistemas, createSistema, updateSistema, deleteSistema, loading: apiLoading } = usePermissions();
    const [sistemas, setSistemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSistema, setEditingSistema] = useState(null);
    const [formData, setFormData] = useState({ clave: '', nombre: '', activo: true });
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadSistemas = async () => {
        try {
            const data = await getSistemas();
            setSistemas(data);
        } catch (err) {
            console.error('Error cargando sistemas:', err);
        }
    };

    useEffect(() => {
        loadSistemas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingSistema) {
                await updateSistema(editingSistema.id_sistema, formData);
                showToast('🚀 Sistema actualizado correctamente');
            } else {
                await createSistema(formData);
                showToast('✨ Nuevo sistema registrado');
            }
            setShowModal(false);
            setEditingSistema(null);
            setFormData({ clave: '', nombre: '', activo: true });
            loadSistemas();
        } catch (err) {
            showToast(err.message || 'Error en la operación', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSistema(deleteModal.id);
            showToast('🗑️ Sistema eliminado');
            setDeleteModal({ show: false, id: null, name: '' });
            loadSistemas();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-fadeIn text-slate-100 font-sans">
            {/* Modal de Confirmación de Borrado */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
                        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-6 mx-auto border border-rose-500/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2 uppercase tracking-tight">¿Eliminar sistema?</h3>
                        <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
                            Estás a punto de eliminar permanentemente <span className="font-bold text-slate-200">"{deleteModal.name}"</span>. Esta acción podría afectar módulos y permisos vinculados.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteModal({ show: false, id: null, name: '' })} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-bold transition-all border border-white/5">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {notification && (
                <div className="fixed top-8 right-8 z-[9999] animate-slideInRight">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${notification.type === 'success' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <span className="text-xl">{notification.type === 'success' ? '✨' : '⚠️'}</span>
                        <span className="font-bold tracking-tight">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Sistemas y Servicios</h1>
                    <p className="text-slate-400 font-medium mt-2">Gestión de infraestructuras funcionales y redundancia</p>
                </div>
                <button
                    onClick={() => { setEditingSistema(null); setFormData({ clave: '', nombre: '', activo: true }); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Añadir Servicio
                </button>
            </div>

            <div className="premium-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identificador</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nombre del Sistema</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center text-center">Estado</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {apiLoading && sistemas.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-32 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <span className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Sincronizando con el núcleo del sistema...</span>
                            </td></tr>
                        ) : sistemas.map((sistema) => (
                            <tr key={sistema.id_sistema} className="group hover:bg-white/5 transition-all">
                                <td className="px-8 py-6">
                                    <span className="font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl text-xs tracking-widest border border-indigo-500/20 shadow-sm group-hover:bg-indigo-500/20 transition-colors">
                                        {sistema.clave}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-200 text-sm group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{sistema.nombre}</span>
                                        <span className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-[0.2em]">Nucleo Corporativo</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${sistema.activo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${sistema.activo ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                                        {sistema.activo ? 'En Línea' : 'Offline'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => { setEditingSistema(sistema); setFormData({ clave: sistema.clave, nombre: sistema.nombre, activo: sistema.activo }); setShowModal(true); }}
                                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 rounded-xl transition-all active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, id: sistema.id_sistema, name: sistema.nombre })}
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
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
                        
                        <div className="px-8 py-5 border-b border-white/5 bg-slate-950/30 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">
                                    {editingSistema ? <span className="text-indigo-400 italic">Ajustar</span> : 'Nuevo'} Ecosistema
                                </h2>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-2">Propiedades centrales del núcleo</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <form id="sistema-form" onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label htmlFor="clave-acceso" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Clave de Acceso (ID)*</label>
                                    <input
                                        id="clave-acceso"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all uppercase placeholder-slate-700 font-mono"
                                        value={formData.clave}
                                        onChange={(e) => setFormData(prev => ({ ...prev, clave: e.target.value.toUpperCase() }))}
                                        required
                                        placeholder="EJ: MOD_LOGISTICA"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nombre-sistema" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Nombre Descriptivo Único*</label>
                                    <input
                                        id="nombre-sistema"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder-slate-700"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                        required
                                        placeholder="Nombre del componente central"
                                    />
                                </div>
                                <div 
                                    onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                                    onKeyDown={(e) => e.key === 'Enter' && setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                                    role="button"
                                    tabIndex={0}
                                    className={`flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer group ${formData.activo ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950 border-white/5'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                                            {formData.activo ? '⚡' : '💤'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-widest mb-0.5">Estado Operativo</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{formData.activo ? 'Activo en producción' : 'En mantenimiento / Off'}</p>
                                        </div>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full relative transition-all duration-300 ${formData.activo ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${formData.activo ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t border-white/5 bg-slate-950/30 flex items-center justify-end gap-4 shrink-0">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">Ignorar</button>
                            <button form="sistema-form" type="submit" disabled={loading} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-50 active:scale-95 flex items-center gap-2">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    editingSistema ? 'Propagar Ajustes' : 'Confirmar Sistema'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

