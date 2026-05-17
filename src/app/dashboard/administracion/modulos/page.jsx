'use client';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

export default function ModulosPage() {
    const { getModulos, getSistemas, createModulo, updateModulo, deleteModulo, loading: apiLoading } = usePermissions();
    const [modulos, setModulos] = useState([]);
    const [sistemas, setSistemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingModulo, setEditingModulo] = useState(null);
    const [formData, setFormData] = useState({ id_sistema: '', clave: '', nombre: '', activo: true });
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadData = async () => {
        try {
            const [modulosData, sistemasData] = await Promise.all([getModulos(), getSistemas()]);
            setModulos(modulosData);
            setSistemas(sistemasData);
        } catch (err) {
            console.error('Error cargando datos:', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingModulo) {
                await updateModulo(editingModulo.id_modulo, formData);
                showToast('🚀 Módulo optimizado con éxito');
            } else {
                await createModulo(formData);
                showToast('✨ Nuevo módulo integrado');
            }
            setShowModal(false);
            setEditingModulo(null);
            setFormData({ id_sistema: '', clave: '', nombre: '', activo: true });
            loadData();
        } catch (err) {
            showToast(err.message || 'Error en despliegue', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteModulo(deleteModal.id);
            showToast('🗑️ Módulo removido del núcleo');
            setDeleteModal({ show: false, id: null, name: '' });
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-fadeIn text-slate-100 font-sans">
            {/* Modal Confirmación Borrado */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
                        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-6 mx-auto border border-rose-500/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2 uppercase tracking-tight">¿Remover módulo?</h3>
                        <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
                            Estás a punto de eliminar el módulo <span className="font-bold text-slate-200">"{deleteModal.name}"</span>. Esta acción es crítica para la integridad del sistema.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteModal({ show: false, id: null, name: '' })} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-bold transition-all border border-white/5">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-xs">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificaciones */}
            {notification && (
                <div className="fixed top-8 right-8 z-[9999] animate-slideInRight">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${notification.type === 'success' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <span className="text-xl">{notification.type === 'success' ? '⚡' : '⚠️'}</span>
                        <span className="font-bold tracking-tight">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Lógica de Módulos</h1>
                    <p className="text-slate-400 font-medium mt-2">Fragmentación de capacidades y servicios corporativos</p>
                </div>
                <button
                    onClick={() => { setEditingModulo(null); setFormData({ id_sistema: '', clave: '', nombre: '', activo: true }); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Añadir Módulo
                </button>
            </div>

            <div className="premium-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ecosistema</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clave</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nombre del Módulo</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {apiLoading && modulos.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-32 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <span className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Buscando dependencias funcionales...</span>
                            </td></tr>
                        ) : modulos.map((modulo) => (
                            <tr key={modulo.id_modulo} className="group hover:bg-white/5 transition-all">
                                <td className="px-8 py-6">
                                    <span className="bg-indigo-500/10 text-indigo-400 font-black px-3 py-1.5 rounded-xl text-[10px] uppercase border border-indigo-500/20 shadow-sm">
                                        {modulo.sistema?.nombre || 'General'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-slate-400 font-black uppercase tracking-widest">
                                    {modulo.clave}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-slate-200 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{modulo.nombre}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => { setEditingModulo(modulo); setFormData({ id_sistema: modulo.id_sistema, clave: modulo.clave, nombre: modulo.nombre, activo: modulo.activo }); setShowModal(true); }}
                                            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 rounded-xl transition-all active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, id: modulo.id_modulo, name: modulo.nombre })}
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
                                    {editingModulo ? <span className="text-indigo-400italic">Actualizar</span> : 'Nuevo'} Módulo
                                </h2>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-2">Motor operacional del sistema</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <form id="modulo-form" onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label htmlFor="ecosistema-maestro" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Ecosistema Maestro*</label>
                                    <div className="relative">
                                        <select
                                            id="ecosistema-maestro"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                            value={formData.id_sistema}
                                            onChange={(e) => setFormData(prev => ({ ...prev, id_sistema: e.target.value }))}
                                            required
                                        >
                                            <option value="" className="text-slate-600">Seleccionar Ecosistema</option>
                                            {sistemas.map(s => <option key={s.id_sistema} value={s.id_sistema} className="text-slate-200 font-bold">{s.nombre}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="clave-modulo" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Clave de Módulo*</label>
                                    <input
                                        id="clave-modulo"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all uppercase placeholder-slate-700 font-mono"
                                        value={formData.clave}
                                        onChange={(e) => setFormData(prev => ({ ...prev, clave: e.target.value.toUpperCase() }))}
                                        required
                                        placeholder="EJ: CAT_PUESTOS"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nombre-modulo" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Nombre Descriptivo*</label>
                                    <input
                                        id="nombre-modulo"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder-slate-700"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                        required
                                        placeholder="Ej: Gestión de Asistencia"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t border-white/5 bg-slate-950/30 flex items-center justify-end gap-4 shrink-0">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">Ignorar</button>
                            <button form="modulo-form" type="submit" disabled={loading} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-50 active:scale-95 flex items-center gap-2">
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    editingModulo ? 'Propagar Cambios' : 'Confirmar Módulo'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

