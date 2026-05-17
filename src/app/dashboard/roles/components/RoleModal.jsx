'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { Shield, Info } from 'lucide-react';

const roleSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'Nombre demasiado largo'),
  descripcion: z.string().max(200, 'Descripción demasiado larga').optional(),
  nivel_acceso: z.enum(['sistema', 'corporativo', 'empresa', 'rancho'], {
    errorMap: () => ({ message: 'Selecciona un nivel de acceso válido' })
  }),
  activo: z.boolean().default(true)
});

const RoleModal = ({ show, onHide, editingRole, onSubmit, saving }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: editingRole || {
      nombre: '',
      descripcion: '',
      nivel_acceso: '',
      activo: true
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={show}
      onClose={onHide}
      title={editingRole ? 'Configuración de Rol' : 'Arquitectura de Nuevo Rol'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Identificador del Rol"
            placeholder="Ej: Administrador Maestro&hellip;"
            icon={Shield}
            error={errors.nombre?.message}
            {...register('nombre')}
          />

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
              Nivel de Autoridad
            </label>
            <select
              {...register('nivel_acceso')}
              className={`
                w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3 px-4 
                text-white font-bold appearance-none cursor-pointer
                focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all
                ${errors.nivel_acceso ? 'border-red-500/50' : ''}
              `}
            >
              <option value="" disabled className="bg-slate-900">Seleccionar nivel&hellip;</option>
              <option value="sistema" className="bg-slate-900 font-bold text-rose-400">NIVEL 0 - SISTEMA</option>
              <option value="corporativo" className="bg-slate-900 font-bold text-indigo-400">NIVEL 1 - CORPORATIVO</option>
              <option value="empresa" className="bg-slate-900 font-bold text-emerald-400">NIVEL 2 - EMPRESA</option>
              <option value="rancho" className="bg-slate-900 font-bold text-amber-400">NIVEL 3 - RANCHO</option>
            </select>
            {errors.nivel_acceso && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-2">
                {errors.nivel_acceso.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
            Alcance y Responsabilidades
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
              <Info size={18} />
            </div>
            <textarea
              {...register('descripcion')}
              placeholder="Define las capacidades de este rol en el ecosistema&hellip;"
              className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none h-32"
            />
          </div>
          {errors.descripcion && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-2">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('activo')}
              className="sr-only peer"
              id="role-active-toggle"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </div>
          <label htmlFor="role-active-toggle" className="text-sm font-bold text-slate-300 uppercase tracking-widest cursor-pointer">
            Estado Operativo del Rol
          </label>
        </div>

        <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/5">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onHide}
          >
            DESCARTAR
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            size="lg"
            className="shadow-xl shadow-indigo-500/20"
          >
            {editingRole ? 'ACTUALIZAR CONFIGURACIÓN' : 'DESPLEGAR ROL'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleModal;
