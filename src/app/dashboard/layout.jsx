'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { NotificationProvider } from '@/context/NotificationContext';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <NotificationProvider>
            <div className="min-h-screen flex bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Sidebar móvil (Overlay) */}
            <div className={`fixed inset-0 z-[60] lg:hidden overflow-hidden transition-all duration-500 ${sidebarOpen ? 'visible' : 'invisible'}`}>
                <div 
                    className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setSidebarOpen(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                ></div>
                <div className={`relative flex flex-col w-72 bg-slate-900 h-full transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-2xl border-r border-white/5 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b border-white/5 flex justify-end">
                        <button
                            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <Sidebar isCollapsed={false} />
                    </div>
                </div>
            </div>

            {/* Sidebar escritorio */}
            <div className={`hidden lg:block transition-all duration-300 ease-in-out border-r border-white/5 bg-slate-900/50 backdrop-blur-xl ${isCollapsed ? 'w-20' : 'w-72'}`}>
                <div className="h-full sticky top-0">
                    <Sidebar isCollapsed={isCollapsed} />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                {/* Glow ambiental de fondo */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
                
                <Header 
                    onMenuClick={() => setSidebarOpen(true)}
                    onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    isCollapsed={isCollapsed}
                />
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none custom-scrollbar">
                    <div className="py-8 animate-fadeIn">
                        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
        </NotificationProvider>
    );
}