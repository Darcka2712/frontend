'use client';

export default function CredencialKPIs({ credenciales = [] }) {
  const n = credenciales?.length ?? 0;
  return (
    <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-400">
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3">
        <span className="font-semibold text-white">{n}</span> credenciales
      </div>
    </div>
  );
}
