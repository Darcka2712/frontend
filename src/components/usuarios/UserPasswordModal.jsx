'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { Lock, KeyRound, ShieldAlert } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

const UserPasswordModal = ({ open, onClose, user, notify }) => {
  const [saving, setSaving] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });



  const handleFormSubmit = async (data) => {
    setSaving(true);
    try {
      // API call goes here
      // await updatePassword(user.id_usuario, data.password);
      await new Promise(r => setTimeout(r, 1000));
      
      notify(`Credenciales de ${user.usuario} actualizadas`, 'success');
      reset();
      onClose();
    } catch (err) {
      notify('Error al renovar las credenciales', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Renovar Credenciales"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
          <ShieldAlert className="text-amber-500 shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-amber-500">Forzando actualización de seguridad</p>
            <p className="text-xs text-amber-500/70 mt-1">
              Estás a punto de modificar las credenciales de acceso para <strong>{user.usuario}</strong>. 
              El usuario será desconectado de sus sesiones actuales.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <InputField
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            icon={KeyRound}
            error={errors.password?.message}
            {...register('password')}
          />
          <InputField
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose}
            disabled={saving}
          >
            CANCELAR
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            size="lg"
            className="shadow-xl shadow-indigo-500/20"
          >
            CONFIRMAR CAMBIO
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserPasswordModal;
