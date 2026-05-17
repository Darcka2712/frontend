'use client';

export default function AccesoTable({ registros, loading }) {
  if (loading) return <p className="text-slate-500">Cargando…</p>;
  if (!registros?.length) return <p className="text-slate-500">Sin registros.</p>;
  return (
    <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
      {registros.map((r, i) => (
        <li key={r.id ?? i} className="px-4 py-3 text-slate-300">
          {r.empleado?.nombre || r.tipo_acceso || 'Registro'}
        </li>
      ))}
    </ul>
  );
}
