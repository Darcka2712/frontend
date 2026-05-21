'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X, User, Building2, FileText, CreditCard, ShieldAlert,
  DollarSign, Loader2, Calendar, Contact, Mail, Phone,
  MapPin, Heart, Briefcase
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

const SECTION_CONFIG = {
  personal: { title: 'Personal', icon: User, color: 'indigo' },
  laboral: { title: 'Laboral', icon: Building2, color: 'emerald' },
  contrato: { title: 'Contrato', icon: FileText, color: 'amber' },
  fiscal: { title: 'Fiscal', icon: CreditCard, color: 'violet' },
  bancario: { title: 'Bancario', icon: DollarSign, color: 'cyan' },
  emergencia: { title: 'Emergencia', icon: ShieldAlert, color: 'rose' }
};

const getInitialFormData = (section, empleado) => {
  switch (section) {
    case 'personal':
      return {
        nombre: empleado.nombre || '',
        apellido_paterno: empleado.apellido_paterno || '',
        apellido_materno: empleado.apellido_materno || '',
        fecha_nacimiento: empleado.fecha_nacimiento ? empleado.fecha_nacimiento.split('T')[0] : '',
        genero: empleado.genero || 'M'
      };
    case 'laboral':
      return {
        id_empresa: empleado.id_empresa || empleado.empresa?.id_empresa || '',
        id_categoria: empleado.id_categoria || empleado.categoria?.id_categoria || '',
        id_puesto: empleado.id_puesto || empleado.puesto?.id_puesto || '',
        id_rancho: empleado.id_rancho || empleado.rancho?.id_rancho || '',
        id_area: empleado.id_area || empleado.area?.id_area || ''
      };
    case 'contrato':
      return {
        tipo_contrato_id: empleado.tipo_contrato_id || empleado.contrato?.id_catalogo || '',
        tipo_pago_id: empleado.tipo_pago_id || empleado.pago?.id_catalogo || '',
        salario_diario: empleado.salario_diario || '',
        fecha_inicio: empleado.fecha_inicio ? empleado.fecha_inicio.split('T')[0] : '',
        fecha_fin: empleado.fecha_fin ? empleado.fecha_fin.split('T')[0] : ''
      };
    case 'fiscal':
      return {
        rfc: empleado.rfc || '',
        curp: empleado.curp || '',
        nss: empleado.nss || '',
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        direccion_fiscal: empleado.direccion_fiscal || ''
      };
    case 'bancario':
      return {
        banco_id: empleado.banco_id || empleado.banco?.id_catalogo || '',
        tipo_cuenta_id: empleado.tipo_cuenta_id || empleado.tipo_cuenta?.id_catalogo || '',
        numero_cuenta: empleado.numero_cuenta || '',
        clabe: empleado.clabe || '',
        titular_cuenta: empleado.titular_cuenta || ''
      };
    case 'emergencia':
      return {
        nombre_contacto: empleado.nombre_contacto || '',
        relacion: empleado.relacion || '',
        telefono_contacto: empleado.telefono_contacto || ''
      };
    default:
      return {};
  }
};

export default function EmployeeSectionEditModal({ isOpen, section, empleado, catalogs, onSave, onClose }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && section && empleado) {
      setFormData(getInitialFormData(section, empleado));
      setErrors({});
    }
  }, [isOpen, section, empleado]);

  const config = SECTION_CONFIG[section];

  const selectedCategory = useMemo(() =>
    catalogs?.categorias?.find(c => c.id_categoria?.toString() === formData.id_categoria?.toString()),
    [catalogs?.categorias, formData.id_categoria]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    if (field === 'id_empresa' && catalogs?.handleEmpresaChange) {
      catalogs.handleEmpresaChange(value);
    }
    if (field === 'id_categoria' && catalogs?.handleCategoriaChange) {
      catalogs.handleCategoriaChange(value, formData.id_empresa);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (section === 'personal') {
      if (!formData.nombre) newErrors.nombre = 'Requerido';
      if (!formData.apellido_paterno) newErrors.apellido_paterno = 'Requerido';
    }
    if (section === 'laboral') {
      if (!formData.id_empresa) newErrors.id_empresa = 'Requerido';
      if (!formData.id_categoria) newErrors.id_categoria = 'Requerido';
      if (!formData.id_puesto) newErrors.id_puesto = 'Requerido';
    }
    if (section === 'contrato') {
      if (!formData.tipo_contrato_id) newErrors.tipo_contrato_id = 'Requerido';
      if (!formData.tipo_pago_id) newErrors.tipo_pago_id = 'Requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(section, formData);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !mounted || !config) return null;

  const renderFields = () => {
    switch (section) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nombre(s)" name="nombre" value={formData.nombre || ''} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} icon={User} placeholder="Escribe el nombre" />
            <InputField label="Apellido Paterno" name="apellido_paterno" value={formData.apellido_paterno || ''} onChange={(e) => handleChange('apellido_paterno', e.target.value)} error={errors.apellido_paterno} placeholder="Escribe el apellido paterno" />
            <InputField label="Apellido Materno (Opcional)" name="apellido_materno" value={formData.apellido_materno || ''} onChange={(e) => handleChange('apellido_materno', e.target.value)} placeholder="Escribe el apellido materno" />
            <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento || ''} onChange={(e) => handleChange('fecha_nacimiento', e.target.value)} error={errors.fecha_nacimiento} icon={Calendar} />
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Género</label>
              <div className="flex gap-4">
                {['M', 'F', 'O'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('genero', g)}
                    className={`flex-1 rounded-2xl border p-4 text-sm font-semibold transition-all ${formData.genero === g
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-inner'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {g === 'M' ? 'Masculino' : g === 'F' ? 'Femenino' : 'Otro'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'laboral':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <SelectField
                label="Empresa de Adscripción"
                icon={Building2}
                options={catalogs?.empresas?.map(e => ({ value: e.id_empresa, label: e.nombre_empresa })) || []}
                value={formData.id_empresa || ''}
                onChange={(val) => handleChange('id_empresa', val)}
                error={errors.id_empresa}
                placeholder="Seleccionar empresa"
              />
            </div>
            <SelectField
              label="Categoría"
              icon={Heart}
              options={catalogs?.categorias?.map(c => ({ value: c.id_categoria, label: c.nombre_categoria })) || []}
              value={formData.id_categoria || ''}
              onChange={(val) => handleChange('id_categoria', val)}
              error={errors.id_categoria}
              disabled={!formData.id_empresa}
              placeholder={formData.id_empresa ? "Seleccionar categoría" : "Primero seleccione empresa"}
            />
            <SelectField
              label="Puesto"
              icon={Briefcase}
              options={catalogs?.puestosFiltrados?.map(p => ({ value: p.id_puesto, label: p.nombre_puesto })) || []}
              value={formData.id_puesto || ''}
              onChange={(val) => handleChange('id_puesto', val)}
              error={errors.id_puesto}
              disabled={!formData.id_categoria}
              placeholder={formData.id_categoria ? "Seleccionar puesto" : "Primero seleccione categoría"}
            />
            {selectedCategory?.es_campo ? (
              <div className="col-span-full">
                <SelectField
                  label="Rancho Asignado"
                  icon={MapPin}
                  options={catalogs?.ranchos?.map(r => ({ value: r.id_rancho, label: r.nombre_rancho })) || []}
                  value={formData.id_rancho || ''}
                  onChange={(val) => handleChange('id_rancho', val)}
                  error={errors.id_rancho}
                  placeholder="Seleccionar rancho"
                />
              </div>
            ) : (
              <div className="col-span-full">
                <SelectField
                  label="Área Operativa"
                  icon={MapPin}
                  options={catalogs?.areas?.map(a => ({ value: a.id_area, label: a.nombre })) || []}
                  value={formData.id_area || ''}
                  onChange={(val) => handleChange('id_area', val)}
                  error={errors.id_area}
                  placeholder="Seleccionar área"
                />
              </div>
            )}
          </div>
        );

      case 'contrato':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Tipo de Contrato"
              icon={FileText}
              options={catalogs?.tiposContrato?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
              value={formData.tipo_contrato_id || ''}
              onChange={(val) => handleChange('tipo_contrato_id', val)}
              error={errors.tipo_contrato_id}
              placeholder="Seleccionar tipo"
            />
            <SelectField
              label="Tipo de Pago"
              icon={DollarSign}
              options={catalogs?.tiposPago?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
              value={formData.tipo_pago_id || ''}
              onChange={(val) => handleChange('tipo_pago_id', val)}
              error={errors.tipo_pago_id}
              placeholder="Seleccionar tipo"
            />
            {(() => {
              const selectedTipoPago = catalogs?.tiposPago?.find(p => p.id_catalogo?.toString() === formData.tipo_pago_id?.toString());
              const codigo = selectedTipoPago?.codigo?.toUpperCase();
              const showSalario = codigo === 'FIJO' || codigo === 'MIXTO';
              return showSalario ? (
                <InputField
                  label="Salario Diario"
                  name="salario_diario"
                  type="number"
                  value={formData.salario_diario || ''}
                  onChange={(e) => handleChange('salario_diario', e.target.value)}
                  error={errors.salario_diario}
                  icon={DollarSign}
                  placeholder="0.00"
                />
              ) : null;
            })()}
            <InputField
              label="Fecha de Inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio || ''}
              onChange={(e) => handleChange('fecha_inicio', e.target.value)}
              icon={Calendar}
            />
            <InputField
              label="Fecha de Fin (opcional)"
              name="fecha_fin"
              type="date"
              value={formData.fecha_fin || ''}
              onChange={(e) => handleChange('fecha_fin', e.target.value)}
              icon={Calendar}
            />
          </div>
        );

      case 'fiscal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="RFC" name="rfc" value={formData.rfc || ''} onChange={(e) => handleChange('rfc', e.target.value)} error={errors.rfc} icon={FileText} placeholder="ABCD123456XYZ" />
            <InputField label="CURP" name="curp" value={formData.curp || ''} onChange={(e) => handleChange('curp', e.target.value)} placeholder="ABCD123456HABCDE12" />
            <InputField label="NSS" name="nss" value={formData.nss || ''} onChange={(e) => handleChange('nss', e.target.value)} placeholder="11 dígitos" />
            <InputField label="Email Corporativo" name="email" type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} icon={Mail} />
            <InputField label="Teléfono" name="telefono" value={formData.telefono || ''} onChange={(e) => handleChange('telefono', e.target.value)} icon={Phone} />
            <div className="col-span-full">
              <InputField label="Dirección Fiscal Completa" name="direccion_fiscal" value={formData.direccion_fiscal || ''} onChange={(e) => handleChange('direccion_fiscal', e.target.value)} />
            </div>
          </div>
        );

      case 'bancario':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Banco"
              icon={Building2}
              options={catalogs?.tiposBanco?.map(b => ({ value: b.id_catalogo, label: b.nombre })) || []}
              value={formData.banco_id || ''}
              onChange={(val) => handleChange('banco_id', val)}
              error={errors.banco_id}
              placeholder="Seleccionar banco"
            />
            <SelectField
              label="Tipo de Cuenta"
              icon={CreditCard}
              options={catalogs?.tiposCuenta?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
              value={formData.tipo_cuenta_id || ''}
              onChange={(val) => handleChange('tipo_cuenta_id', val)}
              placeholder="Seleccionar tipo"
            />
            <InputField label="Número de Cuenta" name="numero_cuenta" value={formData.numero_cuenta || ''} onChange={(e) => handleChange('numero_cuenta', e.target.value)} icon={CreditCard} />
            <InputField label="CLABE Interbancaria" name="clabe" value={formData.clabe || ''} onChange={(e) => handleChange('clabe', e.target.value)} placeholder="18 dígitos" />
            <div className="col-span-full">
              <InputField label="Titular de la Cuenta" name="titular_cuenta" value={formData.titular_cuenta || ''} onChange={(e) => handleChange('titular_cuenta', e.target.value)} icon={User} />
            </div>
          </div>
        );

      case 'emergencia':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <InputField label="Nombre Completo del Contacto" name="nombre_contacto" value={formData.nombre_contacto || ''} onChange={(e) => handleChange('nombre_contacto', e.target.value)} icon={Contact} />
            </div>
            <InputField label="Relación / Parentesco" name="relacion" value={formData.relacion || ''} onChange={(e) => handleChange('relacion', e.target.value)} placeholder="Ej. Esposa, Padre, Amigo..." />
            <InputField label="Teléfono de Emergencia" name="telefono_contacto" value={formData.telefono_contacto || ''} onChange={(e) => handleChange('telefono_contacto', e.target.value)} icon={Phone} />
          </div>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] z-10"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-${config.color}-600 text-white shadow-lg`}>
              <config.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Editar: {config.title}</h3>
              <p className="text-xs text-slate-400">
                {empleado?.nombre} {empleado?.apellido_paterno}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all disabled:opacity-30"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {renderFields()}
        </form>

        <div className="flex items-center justify-end gap-4 border-t border-white/5 bg-slate-950/50 p-6 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-30"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>Guardar Cambios</>
            )}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
