'use client';
import { useState, useEffect, useCallback } from 'react';
import { Shield, Plus, ListFilter, Scan, Construction } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

// Componentes Modulares
import CredencialKPIs from '@/components/rrhh/credenciales/CredencialKPIs';
import CredencialTable from '@/components/rrhh/credenciales/CredencialTable';
import AccesoTable from '@/components/rrhh/credenciales/AccesoTable';
import CredencialFormModal from '@/components/rrhh/credenciales/CredencialFormModal';
import RegistroAccesoModal from '@/components/rrhh/credenciales/RegistroAccesoModal';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { publicApiUrl, authFetchInit } from '@/lib/api';

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function CredencialesPage() {
  const { addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState('credenciales');
  const [credenciales, setCredenciales] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCredenciales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(publicApiUrl('/credenciales/'), authFetchInit());
      const data = await parseJsonSafe(res);
      if (res.status === 404 || res.status === 501) {
        setApiUnavailable(true);
        setCredenciales([]);
        return;
      }
      if (data.success) setCredenciales(data.data || []);
      else setCredenciales([]);
    } catch {
      addNotification('Error al cargar credenciales', 'error');
      setCredenciales([]);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const fetchRegistros = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(publicApiUrl('/registro-acceso/'), authFetchInit());
      const data = await parseJsonSafe(res);
      if (res.status === 404 || res.status === 501) {
        setApiUnavailable(true);
        setRegistros([]);
        return;
      }
      if (data.success) setRegistros(data.data || []);
      else setRegistros([]);
    } catch {
      addNotification('Error al cargar bitácora', 'error');
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    if (activeTab === 'credenciales') fetchCredenciales();
    else fetchRegistros();
  }, [activeTab, fetchCredenciales, fetchRegistros]);

  const handleToggleStatus = async (credencial) => {
    if (apiUnavailable) return;
    try {
      const nuevoEstado = credencial.estado === 'activa' ? 'inactiva' : 'activa';
      const res = await fetch(
        publicApiUrl(`/credenciales/${credencial.id_credencial}`),
        authFetchInit({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...credencial, estado: nuevoEstado }),
        })
      );

      if (res.ok) {
        addNotification(`Credencial ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'}`, 'success');
        fetchCredenciales();
      }
    } catch {
      addNotification('Error al cambiar estado', 'error');
    }
  };

  const filteredCredenciales = credenciales.filter(
    (c) =>
      c.empleado?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      c.numero_tarjeta?.toLowerCase().includes(search.toLowerCase()) ||
      c.codigo_qr?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRegistros = registros.filter(
    (r) =>
      r.empleado?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      r.tipo_acceso?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {apiUnavailable && (
        <div className="flex items-start gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-amber-100">
          <Construction className="h-6 w-6 shrink-0 text-amber-400" aria-hidden />
          <div>
            <p className="font-semibold text-amber-50">Módulo de credenciales no disponible en el API</p>
            <p className="mt-1 text-sm text-amber-200/90">
              El backend aún no expone <code className="rounded bg-black/20 px-1">/api/credenciales</code> ni{' '}
              <code className="rounded bg-black/20 px-1">/api/registro-acceso</code>. Cuando existan en mezclas, esta
              pantalla se conectará automáticamente.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Shield className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight">Acceso & Seguridad</h1>
            <p className="text-slate-500 font-medium mt-1">Sistemas de identificación y bitácora de movimientos</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => !apiUnavailable && setScanOpen(true)}
            variant="secondary"
            size="lg"
            icon={Scan}
            disabled={apiUnavailable}
          >
            REGISTRAR ACCESO
          </Button>
          <Button
            onClick={() => {
              if (apiUnavailable) return;
              setSelected(null);
              setFormOpen(true);
            }}
            variant="primary"
            size="lg"
            icon={Plus}
            className="shadow-xl shadow-blue-600/20"
            disabled={apiUnavailable}
          >
            NUEVA CREDENCIAL
          </Button>
        </div>
      </div>

      <CredencialKPIs credenciales={credenciales} />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-2 rounded-3xl border border-white/5 backdrop-blur-sm">
          <div className="flex p-1.5 bg-slate-950/50 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('credenciales')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'credenciales'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              Credenciales
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('registros')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'registros'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              Bitácora de Acceso
            </button>
          </div>

          <div className="flex-1 max-w-md px-2">
            <InputField
              placeholder={`Filtrar ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={ListFilter}
              className="bg-transparent border-none py-2"
            />
          </div>
        </div>

        {activeTab === 'credenciales' ? (
          <CredencialTable
            credenciales={filteredCredenciales}
            loading={loading}
            onEdit={(c) => {
              if (apiUnavailable) return;
              setSelected(c);
              setFormOpen(true);
            }}
            onToggle={handleToggleStatus}
            onDelete={() => {}}
          />
        ) : (
          <AccesoTable registros={filteredRegistros} loading={loading} />
        )}
      </div>

      <CredencialFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
        }}
        selected={selected}
        onSaved={fetchCredenciales}
        notify={addNotification}
      />

      <RegistroAccesoModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onSaved={fetchRegistros}
        notify={addNotification}
      />
    </div>
  );
}
