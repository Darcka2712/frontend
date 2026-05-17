'use client';
import { X, ShieldCheck } from 'lucide-react';

const PermissionsModal = ({ show, onHide, selectedRole }) => {
  if (!show || !selectedRole) return null;

  const modules = [
    { id: 'usuarios', label: 'Usuarios', permissions: ['Crear', 'Leer', 'Editar', 'Eliminar'] },
    { id: 'empresas', label: 'Empresas', permissions: ['Crear', 'Leer', 'Editar', 'Eliminar'] },
    { id: 'reportes', label: 'Reportes', permissions: ['Leer', 'Exportar'] },
    { id: 'config', label: 'Configuración', permissions: ['Leer', 'Editar'] }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-indigo-600/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Configurar Permisos</h2>
              <p className="text-indigo-400 text-sm font-bold">{selectedRole.nombre}</p>
            </div>
          </div>
          <button
            onClick={onHide}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-12rem)] custom-scrollbar">
          <div className="space-y-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-400 transition-colors">
                  Módulo: {module.label}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {module.permissions.map((permission) => (
                    <label 
                      key={`${module.id}-${permission}`} 
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5 cursor-pointer hover:bg-slate-800 transition-all"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm font-medium text-slate-300">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-white/5">
            <button
              onClick={onHide}
              className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors"
            >
              Cerrar sin guardar
            </button>
            <button
              onClick={onHide}
              className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Guardar Cambios de Permisos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
