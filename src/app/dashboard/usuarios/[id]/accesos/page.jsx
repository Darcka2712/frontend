'use client';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useParams, useRouter } from 'next/navigation';

export default function UsuarioAccesosPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getSistemas } = usePermissions();
    const [accesos, setAccesos] = useState([]);
    const [sistemas, setSistemas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ id_sistema: '', id_empresa: '' });

    const loadData = async () => {
        try {
            setLoading(true);
            const [accRes, sisRes, empRes] = await Promise.all([
                fetch(`/api/usuarios/${id}/accesos`, { credentials: 'include' }).then(r => r.json()),
                getSistemas(),
                fetch('/api/usuarios/empresas', { credentials: 'include' }).then(r => r.json())
            ]);
            setAccesos(accRes);
            setSistemas(sisRes);
            setEmpresas(empRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await fetch(`/api/usuarios/${id}/accesos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (res.ok) {
                setFormData({ id_sistema: '', id_empresa: '' });
                loadData();
            }
        } catch (err) {
            alert('Error asignando acceso');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (accesoId) => {
        if (!confirm('¿Remover este acceso?')) return;
        try {
            const res = await fetch(`/api/usuarios/${id}/accesos/${accesoId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) loadData();
        } catch (err) {
            alert('Error removiendo');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Accesos a Sistemas</h1>
                    <p className="text-gray-500">Configura los sistemas y empresas permitidos para este usuario</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Nueva Asignación</h2>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label htmlFor="sistema-select" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Sistema</label>
                                <select
                                    id="sistema-select"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.id_sistema}
                                    onChange={e => setFormData(prev => ({ ...prev, id_sistema: e.target.value }))}
                                    required
                                >
                                    <option value="">Selecciona sistema</option>
                                    {sistemas.map(s => <option key={s.id_sistema} value={s.id_sistema}>{s.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="empresa-select" className="block text-xs font-bold text-gray-400 uppercase mb-1">Empresa (Opcional)</label>
                                <select
                                    id="empresa-select"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.id_empresa}
                                    onChange={e => setFormData(prev => ({ ...prev, id_empresa: e.target.value }))}
                                >
                                    <option value="">Todas las empresas</option>
                                    {empresas.map(e => <option key={e.id_empresa} value={e.id_empresa}>{e.nombre_empresa}</option>)}
                                </select>
                            </div>
                            <button
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                            >
                                {saving ? 'Asignando...' : 'Asignar Acceso'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sistema</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Empresa / Rancho</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-10">Cargando accesos...</td></tr>
                                ) : accesos.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-10 text-gray-400 italic">No tiene accesos asignados</td></tr>
                                ) : accesos.map(acceso => (
                                    <tr key={acceso.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">{acceso.sistema?.nombre}</td>
                                        <td className="px-6 py-4">
                                            {acceso.empresa ? (
                                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">
                                                    {acceso.empresa.nombre_empresa}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Global / Todas</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(acceso.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all font-bold text-sm"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
