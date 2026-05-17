'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Shield, Search, Filter, Calendar, User, Activity, Eye, RefreshCw } from 'lucide-react';
import { auditoriaApi } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

export default function AuditoriaPage() {
  const { addNotification } = useNotification();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await auditoriaApi.getLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification('error', 'Error al cargar logs de auditoría');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const accionesDisponibles = useMemo(() => {
    const acciones = new Set(logs.map(l => l.accion));
    return ['ALL', ...Array.from(acciones)].sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = l.usuario?.toLowerCase().includes(search.toLowerCase()) || 
                           l.entidad?.toLowerCase().includes(search.toLowerCase()) ||
                           l.accion?.toLowerCase().includes(search.toLowerCase());
      const matchesAction = filterAction === 'ALL' || l.accion === filterAction;
      return matchesSearch && matchesAction;
    });
  }, [logs, search, filterAction]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (accion) => {
    if (accion.includes('CREATE') || accion.includes('POST')) return 'success';
    if (accion.includes('UPDATE') || accion.includes('PUT') || accion.includes('PATCH')) return 'warning';
    if (accion.includes('DELETE')) return 'danger';
    return 'default';
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Logs de Auditoría</h1>
            <p className="text-slate-400 font-medium mt-0.5">Historial de acciones y seguridad del sistema</p>
          </div>
        </div>
        
        <Button 
          onClick={fetchLogs} 
          variant="ghost" 
          icon={RefreshCw}
          className="text-slate-400 hover:text-white"
          loading={loading}
        >
          REFRESCAR
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <InputField
              placeholder="Buscar por usuario, entidad o acción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="bg-slate-900/60"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <select 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500/50 transition-all appearance-none"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                {accionesDisponibles.map(a => (
                  <option key={a} value={a}>{a === 'ALL' ? 'Todas las Acciones' : a}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Logs */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Fecha / Hora</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Acción</th>
              <th className="px-6 py-4">Entidad</th>
              <th className="px-6 py-4 text-right">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">Cargando registros de auditoría...</td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No se encontraron registros de actividad</td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id_log} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <Calendar size={12} className="text-slate-500" />
                      {formatDate(log.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-white/5">
                        {log.usuario?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-semibold text-white">{log.usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getActionColor(log.accion)} uppercase>{log.accion}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Activity size={14} className="opacity-50" />
                      {log.entidad}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedLog(log); setModalOpen(true); }}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles de la Acción"
        size="lg"
      >
        <div className="pt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuario</p>
              <p className="text-white font-bold">{selectedLog?.usuario}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha y Hora</p>
              <p className="text-white font-bold">{selectedLog && formatDate(selectedLog.created_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acción</p>
              <Badge variant={selectedLog ? getActionColor(selectedLog.accion) : 'default'}>{selectedLog?.accion}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entidad / ID</p>
              <p className="text-white font-bold">{selectedLog?.entidad} <span className="text-slate-500 text-xs ml-2">#{selectedLog?.id_entidad}</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Datos de la Operación (JSON)</p>
            <div className="bg-slate-950 rounded-xl p-4 border border-white/5 overflow-auto max-h-[300px] custom-scrollbar">
              <pre className="text-xs font-mono text-indigo-300 leading-relaxed">
                {selectedLog?.detalles ? JSON.stringify(JSON.parse(selectedLog.detalles), null, 2) : '// No hay datos adicionales'}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contexto de Red</p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-bold text-slate-600">IP:</span> {selectedLog?.ip_address || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-bold text-slate-600">Origen:</span> {selectedLog?.user_agent ? 'Web Browser' : 'API Request'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={() => setModalOpen(false)}>Cerrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
