// src/app/dashboard/administracion/cultivos-tipos/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from 'sonner';

// Componente para el modal de Frutas
const FrutaModal = ({ isOpen, onClose, editingTipo, formData, setFormData, onSubmit, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()} role="button" tabIndex={0}></div>
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-8 pb-4">
                    <h2 className="text-2xl font-black text-white">{editingTipo ? 'Editar Fruta' : 'Nueva Fruta'}</h2>
                    <p className="text-slate-400 mt-2 font-medium">Define el nombre de la especie.</p>
                </div>
                <form onSubmit={onSubmit} className="p-8 pt-4 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="nombre-fruta" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Fruta</label>
                        <input
                            id="nombre-fruta"
                            type="text"
                            required
                            placeholder="Ej: Fresa, Frambuesa, Zarzamora..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 font-bold"
                            value={formData.nombre}
                            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin size-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (editingTipo ? 'Guardar Cambios' : 'Registrar Fruta')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function CultivosTiposPage() {
    const { getCultivosTipo, createCultivoTipo, updateCultivoTipo, deleteCultivoTipo, loading: orgLoading } = useOrganization();
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTipo, setEditingTipo] = useState(null);
    const [formData, setFormData] = useState({ nombre: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getCultivosTipo();
            setTipos(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Error al cargar catálogo de frutas');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTipo) {
                await updateCultivoTipo(editingTipo.id, formData);
                toast.success('Fruta actualizada exitosamente');
            } else {
                await createCultivoTipo(formData);
                toast.success('Fruta registrada exitosamente');
            }
            setIsModalOpen(false);
            setEditingTipo(null);
            setFormData({ nombre: '' });
            loadData();
        } catch (error) {
            toast.error(error.message || 'Error al procesar la solicitud');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de desactivar esta fruta? Esto podría afectar a las variedades asociadas.')) return;
        try {
            await deleteCultivoTipo(id);
            toast.success('Fruta desactivada');
            loadData();
        } catch (error) {
            toast.error('Error al desactivar fruta');
        }
    };

    const openModal = (tipo = null) => {
        if (tipo) {
            setEditingTipo(tipo);
            setFormData({ nombre: tipo.nombre });
        } else {
            setEditingTipo(null);
            setFormData({ nombre: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Catálogo de Frutas</h1>
                    <p className="text-slate-400 mt-2 font-medium">Gestiona las especies principales de cultivo para tu organización.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                >
                    <svg className="size-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir Fruta
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={`loading-row-${i}`} className="animate-pulse">
                                        <td colSpan="3" className="px-8 py-6 h-16 bg-white/5"></td>
                                    </tr>
                                ))
                            ) : tipos.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-12 text-center text-slate-500 font-medium bg-slate-950/20">
                                        No hay frutas registradas en el catálogo.
                                    </td>
                                </tr>
                            ) : (
                                tipos.map((tipo) => (
                                    <tr key={tipo.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 text-slate-200">
                                            <span className="text-slate-400 font-mono text-xs">#{tipo.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-white border border-indigo-500/20 font-black">
                                                    {tipo.nombre[0].toUpperCase()}
                                                </div>
                                                <span className="text-white font-bold">{tipo.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openModal(tipo)}
                                                    className="p-2 text-white hover:text-white hover:bg-indigo-500/20 rounded-lg transition-all border border-transparent hover:border-indigo-500/20"
                                                >
                                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tipo.id)}
                                                    className="p-2 text-white hover:text-white hover:bg-rose-500/20 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
                                                >
                                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <FrutaModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingTipo={editingTipo}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={orgLoading}
            />
        </div>
    );
}
