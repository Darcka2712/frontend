'use client';

export default function CredencialTable({ credenciales, loading, onEdit, onToggle }) {
  if (loading) return <p className="text-slate-500">Cargando…</p>;
  if (!credenciales?.length) return <p className="text-slate-500">Sin datos.</p>;
  return (
    <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
      {credenciales.map((c) => (
        <li key={c.id_credencial ?? c.numero_tarjeta} className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-white">{c.empleado?.nombre || c.numero_tarjeta || '—'}</span>
          <div className="flex gap-2">
            <button type="button" className="text-xs text-indigo-400 hover:underline" onClick={() => onEdit?.(c)}>
              Editar
            </button>
            <button type="button" className="text-xs text-slate-400 hover:underline" onClick={() => onToggle?.(c)}>
              Cambiar estado
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
