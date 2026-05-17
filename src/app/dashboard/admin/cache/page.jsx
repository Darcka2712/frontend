import CacheManager from '../../../../components/CacheManager';

export const metadata = {
    title: 'Herramientas Master | ERP',
    description: 'Panel de herramientas avanzadas para desarrolladores master',
};

export default function CachePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Herramientas Master</h1>
                <p className="mt-2 text-gray-600">Gestión avanzada del sistema y mantenimiento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CacheManager />

                {/* Placeholder para futuras herramientas */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px] opacity-75">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-lg font-medium text-gray-900">Más herramientas pronto</h3>
                    <p className="mt-1 text-sm text-gray-500">Espacio reservado para logs, migraciones y health checks.</p>
                </div>
            </div>
        </div>
    );
}
