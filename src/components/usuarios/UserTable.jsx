'use client';

import React from 'react';
import { User, Shield, Mail, Calendar, MoreHorizontal, Edit, Trash2, Key, Check, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TableSkeleton } from '@/components/skeletons';

const UserTable = ({ 
  users = [], 
  loading = false, 
  pagination, 
  onPageChange,
  onEdit,
  onDelete,
  onChangePassword,
  onToggleStatus 
}) => {
  if (loading) return <Card className="p-0"><TableSkeleton rows={8} /></Card>;

  return (
    <Card className="p-0 overflow-hidden" hover={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-8">Alias / Identidad</th>
              <th className="px-10 py-8">Rol de Acceso</th>
              <th className="px-10 py-8">Contacto</th>
              <th className="px-10 py-8 text-center">Estado</th>
              <th className="px-10 py-8 text-right">Comandos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id_usuario || user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-950/60 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                      {user.imagen ? (
                        <img src={user.imagen} alt={user.usuario} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-600 group-hover:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-black text-white text-xl tracking-tight uppercase italic flex items-center gap-2">
                        {user.usuario}
                        {user.es_sistema && (
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" title="Acceso de Sistema" />
                        )}
                      </div>
                      <div className="text-slate-500 text-sm font-bold mt-1 tracking-tight truncate max-w-[200px]">
                        {user.nombre} {user.apellido}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Shield size={14} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {user.rol_nombre || 'USUARIO_ESTÁNDAR'}
                      </span>
                    </div>
                    {user.empresa_nombre && (
                      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        🏢 {user.empresa_nombre}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Mail size={14} className="text-slate-600" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={14} />
                      Activo desde {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-center">
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`w-14 h-7 rounded-full transition-all relative ${user.activo ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${user.activo ? 'left-8' : 'left-1'}`} />
                  </button>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button 
                      onClick={() => onChangePassword(user)} 
                      variant="secondary" 
                      size="sm" 
                      icon={Key}
                      className="w-12 h-12 p-0 text-amber-400"
                    />
                    <Button 
                      onClick={() => onEdit(user)} 
                      variant="secondary" 
                      size="sm" 
                      icon={Edit}
                      className="w-12 h-12 p-0 text-blue-400"
                    />
                    <Button 
                      onClick={() => onDelete(user)} 
                      variant="secondary" 
                      size="sm" 
                      icon={Trash2}
                      className="w-12 h-12 p-0 text-rose-400"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-10 py-8 bg-slate-950/20 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {pagination.total} Entidades Detectadas - Página {pagination.page} de {pagination.totalPages}
          </span>
          <div className="flex gap-3">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => onPageChange(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 border ${
                  pagination.page === i + 1 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-400/20 scale-110' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserTable;
