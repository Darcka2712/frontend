'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Bienvenido');

    useEffect(() => {
        const hour = new Date().getHours();
        let newGreeting = 'Bienvenido';
        if (hour < 12) newGreeting = 'Buenos días';
        else if (hour < 19) newGreeting = 'Buenas tardes';
        else newGreeting = 'Buenas noches';
        setGreeting(newGreeting);
    }, []);

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden premium-card p-10 mt-2 border-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/80 to-slate-950">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
                            {greeting}, <span className="text-indigo-400">Administrador</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium">
                            Aquí tienes el resumen de tu ecosistema empresarial hoy.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1">
                            Generar Reporte
                        </button>
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/20">
                            Configuración
                        </button>
                    </div>
                </div>
            </div>

            {/* Módulos de Acceso Rápido */}
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </span>
                    Módulos Principales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="premium-card group hover:border-indigo-500/50 cursor-pointer">
                        <div className="p-8 flex flex-col h-full">
                            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Recursos Humanos</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">Gestión de personal, asistencia corporativa y nóminas.</p>
                            <div className="mt-6 flex items-center text-emerald-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Acceder Módulo <span className="ml-2">→</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card group hover:border-amber-500/50 cursor-pointer">
                        <div className="p-8 flex flex-col h-full">
                            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Almacén Central</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">Control de inventario, mezclas y movimientos de productos.</p>
                            <div className="mt-6 flex items-center text-amber-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Acceder Módulo <span className="ml-2">→</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card group hover:border-rose-500/50 cursor-pointer">
                        <div className="p-8 flex flex-col h-full">
                            <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Combustible</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">Gestión de bombas, cargas a vehículos y rendimientos.</p>
                            <div className="mt-6 flex items-center text-rose-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Acceder Módulo <span className="ml-2">→</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card group hover:border-purple-500/50 cursor-pointer">
                        <div className="p-8 flex flex-col h-full">
                            <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Reportes Core</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">Análisis de datos avanzados e informes ejecutivos.</p>
                            <div className="mt-6 flex items-center text-purple-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Acceder Módulo <span className="ml-2">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="premium-card p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                        </span>
                        Salud del Sistema
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-slate-300 font-bold flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                Base de Datos
                            </span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/20">Operacional - 12ms</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-slate-300 font-bold flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                API Principal
                            </span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/20">Operacional - 45ms</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-slate-300 font-bold flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                                Caché Global
                            </span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold border border-blue-500/20">Sincronizando</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-900 rounded-full border-4 border-slate-800 p-2 shadow-2xl">
                            <Image src="https://ui-avatars.com/api/?name=Antigravity&background=4f46e5&color=fff&rounded=true&bold=true" alt="Antigravity Logo" width={96} height={96} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Plataforma Actualizada</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">
                            Estás visualizando la versión más reciente del sistema (v3.0 Dark Premium). Todos los componentes están operativos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}