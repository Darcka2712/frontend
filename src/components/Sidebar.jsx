// src/components/Sidebar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
    {
        title: 'Dashboard', path: '/dashboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        )
    },
    {
        title: 'Recursos Humanos',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ),
        submenu: [
            { title: 'Áreas', path: '/dashboard/rrhh/areas' },
            { title: 'Asistencia', path: '/dashboard/rrhh/asistencia' },
            { title: 'Empleados', path: '/dashboard/rrhh/empleados' },
            { title: 'Nómina', path: '/dashboard/rrhh/nomina' },
            { title: 'Credenciales', path: '/dashboard/rrhh/credenciales' }
        ]
    },
    {
        title: 'Usuarios',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        submenu: [
            { title: 'Usuarios', path: '/dashboard/usuarios' },
            { title: 'Roles Avanzados', path: '/dashboard/roles-avanzado' },
            { title: 'Métricas', path: '/dashboard/metricas' }
        ]
    },
    {
        title: 'Organización',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        ),
        submenu: [
            { title: 'Corporativos', path: '/dashboard/administracion/corporativos' },
            { title: 'Unidades de Negocio', path: '/dashboard/administracion/empresas' },
            { title: 'Centros de Producción', path: '/dashboard/administracion/ranchos' },
            { title: 'Micro-Sectores', path: '/dashboard/administracion/sectores' },
            { title: 'Lotes de Cultivo', path: '/dashboard/administracion/cultivos' },
            { title: 'Catálogo de Tipos', path: '/dashboard/administracion/cultivos-tipos' },
            { title: 'Catálogo de Variedades', path: '/dashboard/administracion/variedades' }
        ]
    },
    {
        title: 'Administración',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        ),
        submenu: [
            { title: 'Servicios de Sistema', path: '/dashboard/administracion/sistemas' },
            { title: 'Módulos', path: '/dashboard/administracion/modulos' },
            { title: 'Permisos', path: '/dashboard/administracion/permisos' }
        ]
    },
    {
        title: 'Herramientas Master',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
        ),
        submenu: [
            { title: 'Gestión de Caché', path: '/dashboard/admin/cache' }
        ]
    }
];

export default function Sidebar({ isCollapsed }) {
    const pathname = usePathname();
    const { user } = useAuth();

    const filteredMenuItems = useMemo(() => {
        if (!user) return [];
        if (user.nivel_acceso === 'master' || user.rol === 'MASTER' || user.rol?.codigo_rol === 'MASTER') return menuItems;

        if (user.nivel_acceso === 'sistema') {
            return menuItems.filter(item => item.title !== 'Herramientas Master');
        }

        const sistemasPermitidos = user.accesos?.map(a => a.sistema?.clave) || [];

        return menuItems.filter(item => {
            if (item.title === 'Dashboard') return true;
            if (item.title === 'Usuarios' && user.nivel_acceso === 'corporativo') return true;

            const systemMap = {
                'Recursos Humanos': 'RRHH',
                'Almacén': 'MEZCLAS',
                'Combustible': 'COMBUSTIBLE',
                'Organización': 'ADMIN',
                'Administración': 'ADMIN'
            };

            const requiredSystem = systemMap[item.title];
            return !requiredSystem || sistemasPermitidos.includes(requiredSystem);
        });
    }, [user]);

    const [openGroups, setOpenGroups] = useState(new Set());

    const activeStates = useMemo(() => ({
        isActive: (target) => pathname === target,
        isSectionActive: (section) => section.submenu?.some(s => pathname.startsWith(s.path))
    }), [pathname]);

    const toggleGroup = (title) => {
        setOpenGroups(prev => {
            const next = new Set(prev);
            if (next.has(title)) next.delete(title);
            else next.add(title);
            return next;
        });
    };

    useEffect(() => {
        const activeGroups = menuItems.reduce((acc, item) => {
            if (item.submenu?.some(sub => pathname.startsWith(sub.path))) {
                acc.push(item.title);
            }
            return acc;
        }, []);

        if (activeGroups.length > 0) {
            setOpenGroups(prev => {
                const next = new Set(prev);
                activeGroups.forEach(group => next.add(group));
                return next;
            });
        }
    }, [pathname]);

    return (
        <aside
            className={`bg-slate-900/50 backdrop-blur-xl h-full flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 ${isCollapsed ? 'w-20' : 'w-72'
                }`}
            role="navigation"
        >
            {/* Header / Logo Section */}
            <div className={`p-6 mb-2 ${isCollapsed ? 'px-4' : ''}`}>
                <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-black text-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/20 flex-shrink-0">
                        A
                    </div>
                    {!isCollapsed && (
                        <span className="font-black text-white text-xl tracking-tight">Antigravity</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
                <ul className="space-y-1.5">
                    {filteredMenuItems.map((item) => {
                        const sectionOpen = openGroups.has(item.title);
                        const sectionIsActive = activeStates.isSectionActive(item);
                        const itemIsActive = activeStates.isActive(item.path);

                        if (item.submenu) {
                            return (
                                <li key={item.title}>
                                    <button
                                        onClick={() => toggleGroup(item.title)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group ${sectionIsActive
                                                ? 'bg-indigo-500/10 text-indigo-400 shadow-inner'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <span className={`transition-colors duration-200 ${sectionIsActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                                            }`}>
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1 text-left">{item.title}</span>
                                                <svg className={`w-4 h-4 transition-transform duration-200 opacity-50 ${sectionOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    {!isCollapsed && sectionOpen && (
                                        <ul className="mt-2 ml-4 border-l border-white/10 space-y-1">
                                            {item.submenu.map((sub) => (
                                                <li key={sub.path}>
                                                    <Link
                                                        href={sub.path}
                                                        className={`block ml-4 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeStates.isActive(sub.path)
                                                                ? 'text-indigo-400 bg-indigo-500/5 shadow-inner border border-indigo-500/10'
                                                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        }

                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group ${itemIsActive
                                            ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_10px_rgba(79,70,229,0.1)] border border-indigo-500/10'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                                        } ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    <span className={`transition-colors duration-200 ${itemIsActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                                        }`}>
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && <span>{item.title}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Access Footer (Optional/Refined) */}
            {!isCollapsed && (
                <div className="p-5 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {user?.usuario?.[0]?.toUpperCase() || user?.nombre?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-100 truncate">{user?.usuario || user?.nombre || 'Usuario'}</p>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{user?.nivel_acceso || 'Nivel'}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}