'use client';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { publicApiUrl, authFetchInit } from '@/lib/api';

export default function CacheManager() {
    const [loading, setLoading] = useState(false);

    const handleClearCache = async () => {
        setLoading(true);
        try {
            const response = await fetch(publicApiUrl('/sistemas/cache/clear'), {
                ...authFetchInit(),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(data.message || 'Caché limpiado correctamente');
            } else {
                toast.error(data.message || 'Error al limpiar el caché');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-zinc-200">
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-800">Invalidez de Caché Global</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Fuerza la actualización inmediata de todos los catálogos y listas cacheadas en el servidor.
                        Útil después de cambios estructurales, actualizaciones de roles o permisos.
                    </p>
                </div>
                <div className="text-4xl">🧹</div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        ⚠️
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Esta acción puede impactar temporalmente el rendimiento del servidor mientras se reconstruyen los índices de caché.
                            Úsala con responsabilidad.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleClearCache}
                    disabled={loading}
                    className={`
                        flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                        ${loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}
                        transition-colors duration-200
                    `}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Limpiando...
                        </>
                    ) : (
                        'Limpiar Caché Ahora'
                    )}
                </button>
            </div>
        </div>
    );
}
