'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Clipboard, 
  Tag, 
  Fingerprint,
  Info
} from 'lucide-react';

import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';
import { useOrganization } from '@/hooks/useOrganization';

const asistenciaSchema = z.object({
  id_empleado: z.string().min(1, 'Selecciona un colaborador'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  hora_entrada: z.string().min(5, 'Hora de entrada requerida (HH:MM)'),
  hora_salida: z.string().min(5, 'Hora de salida requerida (HH:MM)'),
  metodo_registro: z.string().default('manual'),
  observaciones: z.string().optional()
}).refine(data => {
  if (data.hora_entrada && data.hora_salida) {
    return data.hora_salida > data.hora_entrada;
  }
  return true;
}, {
  message: "La salida debe ser posterior a la entrada",
  path: ["hora_salida"]
});

const AsistenciaFormModal = ({ 
  open, 
  onClose, 
  editingRecord, 
  onSaved, 
  apiUrl,
  empleados = []
}) => {
  const [saving, setSaving] = React.useState(false);
  const { createAsistencia, updateAsistencia } = useOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(asistenciaSchema),
    defaultValues: {
      id_empleado: '',
      fecha: new Date().toISOString().split('T')[0],
      hora_entrada: '08:00',
      hora_salida: '17:00',
      metodo_registro: 'manual',
      observaciones: ''
    }
  });

  // Efecto para cargar datos en edición
  React.useEffect(() => {
    if (editingRecord) {
      reset({
        id_empleado: String(editingRecord.id_empleado),
        fecha: editingRecord.fecha ? new Date(editingRecord.fecha).toISOString().split('T')[0] : '',
        hora_entrada: editingRecord.hora_entrada?.slice(0, 5) || '',
        hora_salida: editingRecord.hora_salida?.slice(0, 5) || '',
        metodo_registro: editingRecord.metodo_registro || 'manual',
        observaciones: record.observaciones || ''
      });
    } else {
      reset({
        id_empleado: '',
        fecha: new Date().toISOString().split('T')[0],
        hora_entrada: '08:00',
        hora_salida: '17:00',
        metodo_registro: 'manual',
        observaciones: ''
      });
    }
  }, [editingRecord, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = editingRecord 
        ? await updateAsistencia(editingRecord.id_asistencia, data)
        : await createAsistencia(data);

      if (response.success) {
        toast.success(editingRecord ? 'Jornada actualizada' : 'Jornada registrada correctamente');
        onSaved();
        onClose();
        reset();
      } else {
        toast.error(response.message || 'Error al procesar la solicitud');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión con el servidor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={editingRecord ? 'Ajuste de Registro' : 'Nueva Jornada Laboral'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Identificación del Colaborador */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Núcleo de Operación</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Colaborador Asignado"
              placeholder="Seleccionar empleado..."
              icon={User}
              error={errors.id_empleado?.message}
              options={empleados.map(e => ({ 
                value: String(e.id_empleado || e.id), 
                label: e.nombre_completo || e.nombre 
              }))}
              {...register('id_empleado')}
              disabled={!!editingRecord}
            />

            <InputField
              label="Fecha de Jornada"
              type="date"
              icon={Calendar}
              error={errors.fecha?.message}
              {...register('fecha')}
            />
          </div>
        </div>

        {/* Parámetros de Tiempo */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Ciclo de Tiempo</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Hora de Entrada"
              type="time"
              icon={Clock}
              error={errors.hora_entrada?.message}
              {...register('hora_entrada')}
            />
            <InputField
              label="Hora de Salida"
              type="time"
              icon={Clock}
              error={errors.hora_salida?.message}
              {...register('hora_salida')}
            />
            <SelectField
              label="Método de Registro"
              icon={Fingerprint}
              options={[
                { value: 'manual', label: 'Carga Manual' },
                { value: 'biometrico', label: 'Biometría' },
                { value: 'qr', label: 'Escaneo QR' },
                { value: 'tarjeta', label: 'Proximidad' }
              ]}
              {...register('metodo_registro')}
            />
          </div>
        </div>

        {/* Detalles Adicionales */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Contexto Operativo</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="relative group">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2">Observaciones de la Jornada</label>
            <div className="relative">
              <textarea
                {...register('observaciones')}
                placeholder="Detalles sobre incidencias, horas extra o motivos de ajuste..."
                className="w-full bg-slate-950/40 border border-white/5 rounded-3xl py-4 px-6 text-white font-medium min-h-[120px] focus:border-indigo-500/50 outline-none transition-all resize-none"
              />
              <Info size={18} className="absolute right-4 bottom-4 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Acciones de Despliegue */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>DESCARGAR</Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            size="lg"
            className="shadow-xl shadow-indigo-600/30"
            icon={Clipboard}
          >
            {editingRecord ? 'SINCRONIZAR AJUSTES' : 'DESPLEGAR REGISTRO'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AsistenciaFormModal;
