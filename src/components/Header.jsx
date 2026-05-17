// src/components/Header.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ onMenuClick, onToggleSidebar, isCollapsed }) {
    const { user, logout } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-2xl border-b border-white/5">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-4">
                        {/* Botón menú móvil */}
                        <button
                            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            onClick={onMenuClick}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Botón toggle sidebar */}
                        <button
                            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                            onClick={onToggleSidebar}
                        >
                            <svg 
                                className="h-5 w-5 transition-transform duration-300" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 19l-7-7 7-7" 
                                />
                            </svg>
                        </button>

                        <div className="hidden md:block">
                            <h2 className="text-sm font-bold text-slate-100">Centro de Control</h2>
                        </div>
                    </div>

                    {/* Menú de usuario */}
                    <div className="relative">
                        <button
                            aria-label="Menú de usuario"
                            aria-haspopup="true"
                            aria-expanded={userMenuOpen}
                            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-white/10 bg-slate-900 hover:bg-slate-800 hover:border-white/20 transition-all duration-200 group"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                                    {user?.username}
                                </p>
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                                    {user?.nivel_acceso}
                                </p>
                            </div>
                            <svg 
                                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Menú desplegable Estilo Premium */}
                        {userMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setUserMenuOpen(false)}
                                    onKeyDown={(e) => e.key === 'Escape' && setUserMenuOpen(false)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Cerrar menú"
                                ></div>
                                <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] bg-slate-900 border border-white/10 p-1.5 z-50 animate-fadeIn backdrop-blur-xl">
                                    <div className="p-3 mb-1 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-sm font-bold text-white">
                                            {user?.username || 'Usuario'}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                            {user?.email || 'sin-email@empresa.com'}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Mi Perfil
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Configuración
                                        </button>
                                        <div className="h-px bg-white/10 my-1 mx-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg flex items-center gap-2 transition-colors font-bold"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}