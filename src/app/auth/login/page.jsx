// src/app/auth/login/page.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex selection:bg-indigo-500/30">
            {/* Panel Izquierdo: Visual (Background Image) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-white/5">
                {/* Imagen decorativa de arquitectura moderna / oscura */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-[20s] hover:scale-100"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                
                {/* Overlay de gradiente para fundir con el tema oscuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
                
                {/* Glow ambiental */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Contenido decorativo */}
                <div className="relative z-10 flex flex-col justify-end p-12 h-full text-left">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 mb-8 shadow-2xl">
                        <span className="text-white font-black text-3xl">A</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                        Antigravity System
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg font-medium">
                        El núcleo central de control y gestión corporativa. Elegancia, escalabilidad y rendimiento en una sola plataforma SaaS.
                    </p>
                </div>
            </div>

            {/* Panel Derecho: Formulario */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
                {/* Elementos decorativos móviles */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none lg:hidden"></div>

                <div className="w-full max-w-md relative z-10 animate-slideInUp">
                    {/* Header solo móvil */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-indigo-500/20 mb-6 mx-auto shadow-[0_0_30px_rgba(79,70,229,0.15)]">
                            <span className="text-indigo-400 font-black text-3xl">A</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Antigravity</h2>
                    </div>

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Ingresa tus credenciales para acceder al sistema.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 animate-fadeIn">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-300 ml-1">
                                        Usuario o Correo
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium sm:text-sm"
                                            placeholder="Ingresa tu usuario"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                email: e.target.value
                                            }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-bold text-slate-300 ml-1">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium sm:text-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                password: e.target.value
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl text-white font-bold bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        <span>Iniciando sesión&hellip;</span>
                                    </>
                                ) : (
                                    <>
                                        Ingresar al Master Central
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-500 font-medium">
                        &copy; 2026 Antigravity Systems. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}