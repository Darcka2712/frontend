'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { User, Mail, Shield, Building, Home, Lock } from 'lucide-react';
import api from '@/lib/api';

const userSchema = z.object({
  usuario: z.string().min(4, 'El alias debe tener al menos 4 caracteres').max(20, 'Alias demasiado largo'),
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La clave debe tener al menos 6 caracteres').optional().or(z.literal('')),
  id_rol: z.string().min(1, 'Selecciona un rol de autoridad'),
  id_corporativo: z.string().optional(),
  id_empresa: z.string().optional(),
  id_rancho: z.string().optional(),
  activo: z.boolean().default(true)
});

const UserFormModal = ({ 
  open, 
  onClose, 
  selected, 
  onSaved, 
  notify,
  roles = [],
  corporativos = [],
  empresas = [],
  ranchos = []
}) => {
  const [saving, setSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: selected || {
      usuario: '',
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      id_rol: '',
      id_corporativo: '',
      id_empresa: '',
      id_rancho: '',
      activo: true
    }
  });

  const handleFormSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        usuario: data.usuario,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        id_rol: parseInt(data.id_rol),
        activo: data.activo
      };
      if (data.id_corporativo) payload.id_corporativo = parseInt(data.id_corporativo);
      if (data.id_empresa) payload.id_empresa = parseInt(data.id_empresa);
      if (data.id_rancho) payload.id_rancho = parseInt(data.id_rancho);
      if (!selected && data.password) payload.password = data.password;

      if (selected) {
        const id = selected.id_usuario || selected.id;
        const response = await api.put(`/usuario/${id}`, payload);
        if (!response.success) throw new Error(response.message || 'Error al actualizar');
        notify(`Usuario ${data.usuario} actualizado correctamente`, 'success');
      } else {
        const response = await api.post('/usuario', payload);
        if (!response.success) throw new Error(response.message || 'Error al crear');
        notify(`Usuario ${data.usuario} creado correctamente`, 'success');
      }
      reset();
      onSaved();
      onClose();
    } catch (err) {
      notify(err.message || 'Error en la sincronización del perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={selected ? 'Configuración de Perfil' : 'Alta de Nueva Identidad'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
        {/* Sección de Identidad */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Núcleo de Identidad</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Alias del Sistema"
              placeholder="Ej: admin_root&hellip;"
              icon={User}
              error={errors.usuario?.message}
              {...register('usuario')}
            />
            <InputField
              label="Correo Institucional"
              placeholder="usuario@empresa.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />
            <InputField
              label="Nombre(s)"
              placeholder="Nombre del usuario"
              error={errors.nombre?.message}
              {...register('nombre')}
            />
            <InputField
              label="Apellido(s)"
              placeholder="Apellido del usuario"
              error={errors.apellido?.message}
              {...register('apellido')}
            />
            {!selected && (
              <InputField
                label="Clave de Acceso Inicial"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
            )}
          </div>
        </div>

        {/* Sección de Autoridad y Contexto */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Jerarquía y Acceso</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Rol Asignado</label>
              <select 
                {...register('id_rol')}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3 px-4 text-white font-bold appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
              >
                <option value="" disabled className="bg-slate-900 text-slate-500 italic">Seleccionar autoridad&hellip;</option>
                {roles.map(r => (
                  <option key={r.id_rol || r.id} value={r.id_rol || r.id} className="bg-slate-900">{r.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Estructura Corporativa</label>
              <select 
                {...register('id_corporativo')}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3 px-4 text-white font-bold appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
              >
                <option value="" className="bg-slate-900 text-slate-500">Global (Sin Corporativo)</option>
                {corporativos.map(c => (
                  <option key={c.id_corporativo || c.id} value={c.id_corporativo || c.id} className="bg-slate-900">{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('activo')}
              className="sr-only peer"
              id="user-active-toggle"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </div>
          <label htmlFor="user-active-toggle" className="text-sm font-bold text-slate-300 uppercase tracking-widest cursor-pointer">
            Usuario Habilitado para Operar
          </label>
        </div>

        <div className="flex justify-end items-center gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>DESCARGAR</Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            size="lg"
            className="shadow-xl shadow-indigo-600/30"
          >
            {selected ? 'ACTUALIZAR IDENTIDAD' : 'DESPLEGAR USUARIO'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
