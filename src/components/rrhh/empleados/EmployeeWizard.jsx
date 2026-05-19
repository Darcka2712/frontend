'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Building2,
  FileText,
  CreditCard,
  ShieldAlert,
  Loader2,
  Calendar,
  Contact,
  Mail,
  Phone,
  MapPin,
  Heart,
  Briefcase,
  DollarSign
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

const STEPS = [
  { id: 'personal', title: 'Personal', icon: User, description: 'Datos de identidad' },
  { id: 'laboral', title: 'Laboral', icon: Building2, description: 'Contratación y puesto' },
  { id: 'contrato', title: 'Contrato', icon: DollarSign, description: 'Tipo y condiciones' },
  { id: 'fiscal', title: 'Fiscal', icon: FileText, description: 'RFC, CURP y Seguro' },
  { id: 'bancario', title: 'Bancario', icon: CreditCard, description: 'Método de pago' },
  { id: 'emergencia', title: 'Emergencia', icon: ShieldAlert, description: 'Contacto de seguridad' }
];

export default function EmployeeWizard({ isOpen, onClose, onFinalize, catalogs, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    genero: 'M',
    // Laboral
    id_empresa: '',
    id_categoria: '',
    id_puesto: '',
    id_rancho: '',
    id_area: '',
    // Fiscal
    rfc: '',
    curp: '',
    nss: '',
    email: '',
    telefono: '',
    direccion_fiscal: '',
    // Bancario
    banco_id: '',
    tipo_cuenta_id: '',
    numero_cuenta: '',
    clabe: '',
    titular_cuenta: '',
    plaza: 'General',
    // Emergencia
    nombre_contacto: '',
    relacion: '',
    telefono_contacto: '',
    // Contrato
    tipo_contrato_id: '',
    tipo_pago_id: '',
    salario_diario: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: ''
  });

  const [errors, setErrors] = useState({});

  const selectedCategory = useMemo(() =>
    catalogs.categorias.find(c => c.id_categoria.toString() === formData.id_categoria.toString()),
    [catalogs.categorias, formData.id_categoria]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Dynamic catalog updates
    if (field === 'id_empresa' && catalogs.handleEmpresaChange) {
      catalogs.handleEmpresaChange(value);
    }
    if (field === 'id_categoria' && catalogs.handleCategoriaChange) {
      catalogs.handleCategoriaChange(value, formData.id_empresa);
    }

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const step = STEPS[currentStep].id;

    if (step === 'personal') {
      if (!formData.nombre) newErrors.nombre = 'Requerido';
      if (!formData.apellido_paterno) newErrors.apellido_paterno = 'Requerido';
      if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Requerido';
    }

    if (step === 'laboral') {
      if (!formData.id_empresa) newErrors.id_empresa = 'Requerido';
      if (!formData.id_categoria) newErrors.id_categoria = 'Requerido';
      if (!formData.id_puesto) newErrors.id_puesto = 'Requerido';

      const cat = catalogs.categorias.find(c => c.id_categoria.toString() === formData.id_categoria.toString());
      if (cat?.es_campo && !formData.id_rancho) newErrors.id_rancho = 'Requerido para campo';
      if (cat && !cat.es_campo && !formData.id_area) newErrors.id_area = 'Requerido para oficina';
    }

    if (step === 'fiscal') {
      // Opcionales pero con validación si se llenan
      if (formData.rfc && !/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/.test(formData.rfc)) {
        newErrors.rfc = 'RFC Inválido';
      }
    }

    if (step === 'contrato') {
      if (!formData.tipo_contrato_id) newErrors.tipo_contrato_id = 'Requerido';
      if (!formData.tipo_pago_id) newErrors.tipo_pago_id = 'Requerido';

      const tipoPago = catalogs.tiposPago?.find(p => p.id_catalogo?.toString() === formData.tipo_pago_id?.toString());
      if (tipoPago && ['FIJO', 'MIXTO'].includes(tipoPago.codigo)) {
        if (!formData.salario_diario || formData.salario_diario <= 0) {
          newErrors.salario_diario = 'Requerido para este tipo de pago';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
      else onFinalize(formData);
    }
  };

  const prevStep = () => setCurrentStep(s => s - 1);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />

      {/* Wizard Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex h-[90vh] max-h-[850px] w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Sidebar Progress */}
        <div className="hidden w-80 flex-col border-r border-white/5 bg-slate-950/30 p-10 lg:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Alta de Empleado</h2>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="relative flex gap-4">
                {/* Connector Line */}
                {idx !== STEPS.length - 1 && (
                  <div className={`absolute left-[19px] top-10 h-10 w-0.5 ${idx < currentStep ? 'bg-indigo-600' : 'bg-slate-800'}`} />
                )}

                {/* Step Circle */}
                <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${idx === currentStep ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/30' :
                  idx < currentStep ? 'bg-indigo-600/20 text-indigo-500' : 'bg-slate-800/50 text-slate-500'
                  }`}>
                  {idx < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-bold transition-colors ${idx === currentStep ? 'text-slate-100' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-900/40">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6 lg:px-10">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Paso {currentStep + 1} de 6</span>
              <h3 className="text-lg font-bold text-slate-100">{STEPS[currentStep].title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre(s)" name="nombre" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} icon={User} placeholder="Escribe el nombre" />
                    <InputField label="Apellido Paterno" name="apellido_paterno" value={formData.apellido_paterno} onChange={(e) => handleChange('apellido_paterno', e.target.value)} error={errors.apellido_paterno} placeholder="Escribe el apellido paterno" />
                    <InputField label="Apellido Materno (Opcional)" name="apellido_materno" value={formData.apellido_materno} onChange={(e) => handleChange('apellido_materno', e.target.value)} placeholder="Escribe el apellido materno" />
                    <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={(e) => handleChange('fecha_nacimiento', e.target.value)} error={errors.fecha_nacimiento} icon={Calendar} />
                    <div className="space-y-2 col-span-full">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Género</label>
                      <div className="flex gap-4">
                        {['M', 'F', 'O'].map(g => (
                          <button
                            key={g}
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
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <SelectField
                        label="Empresa de Adscripción"
                        icon={Building2}
                        options={catalogs.empresas.map(e => ({ value: e.id_empresa, label: e.nombre_empresa }))}
                        value={formData.id_empresa}
                        onChange={(val) => handleChange('id_empresa', val)}
                        error={errors.id_empresa}
                        placeholder="Seleccionar empresa"
                      />
                    </div>
                    <SelectField
                      label="Categoría"
                      icon={Heart}
                      options={catalogs.categorias.map(c => ({ value: c.id_categoria, label: c.nombre_categoria }))}
                      value={formData.id_categoria}
                      onChange={(val) => handleChange('id_categoria', val)}
                      error={errors.id_categoria}
                      disabled={!formData.id_empresa}
                      placeholder={formData.id_empresa ? "Seleccionar categoría" : "Primero seleccione empresa"}
                    />
                    <SelectField
                      label="Puesto"
                      icon={Briefcase}
                      options={catalogs.puestosFiltrados.map(p => ({ value: p.id_puesto, label: p.nombre_puesto }))}
                      value={formData.id_puesto}
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
                          options={catalogs.ranchos.map(r => ({ value: r.id_rancho, label: r.nombre_rancho }))}
                          value={formData.id_rancho}
                          onChange={(val) => handleChange('id_rancho', val)}
                          error={errors.id_rancho}
                          disabled={!formData.id_categoria}
                          placeholder="Seleccionar rancho"
                        />
                      </div>
                    ) : (
                      <div className="col-span-full">
                        <SelectField
                          label="Área Operativa"
                          icon={MapPin}
                          options={catalogs.areas.map(a => ({ value: a.id_area, label: a.nombre }))}
                          value={formData.id_area}
                          onChange={(val) => handleChange('id_area', val)}
                          error={errors.id_area}
                          disabled={!formData.id_categoria}
                          placeholder={formData.id_categoria ? "Seleccionar área" : "Primero seleccione categoría"}
                        />
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Tipo de Contrato"
                      icon={FileText}
                      options={catalogs.tiposContrato?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
                      value={formData.tipo_contrato_id}
                      onChange={(val) => handleChange('tipo_contrato_id', val)}
                      error={errors.tipo_contrato_id}
                      placeholder="Seleccionar tipo"
                    />
                    <SelectField
                      label="Tipo de Pago"
                      icon={DollarSign}
                      options={catalogs.tiposPago?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
                      value={formData.tipo_pago_id}
                      onChange={(val) => handleChange('tipo_pago_id', val)}
                      error={errors.tipo_pago_id}
                      placeholder="Seleccionar tipo"
                    />
                    {(() => {
                      const selectedTipoPago = catalogs.tiposPago?.find(p => p.id_catalogo?.toString() === formData.tipo_pago_id?.toString());
                      const codigo = selectedTipoPago?.codigo?.toUpperCase();
                      const showSalario = codigo === 'FIJO' || codigo === 'MIXTO';

                      return showSalario ? (
                        <InputField
                          label="Salario Diario"
                          name="salario_diario"
                          type="number"
                          value={formData.salario_diario}
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
                      value={formData.fecha_inicio}
                      onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                      icon={Calendar}
                    />
                    <InputField
                      label="Fecha de Fin (opcional)"
                      name="fecha_fin"
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => handleChange('fecha_fin', e.target.value)}
                      icon={Calendar}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="RFC" name="rfc" value={formData.rfc} onChange={(e) => handleChange('rfc', e.target.value)} error={errors.rfc} icon={FileText} placeholder="ABCD123456XYZ" />
                    <InputField label="CURP" name="curp" value={formData.curp} onChange={(e) => handleChange('curp', e.target.value)} placeholder="ABCD123456HABCDE12" />
                    <InputField label="NSS" name="nss" value={formData.nss} onChange={(e) => handleChange('nss', e.target.value)} placeholder="11 dígitos" />
                    <InputField label="Email Corporativo" name="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} icon={Mail} />
                    <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} icon={Phone} />
                    <div className="col-span-full">
                      <InputField label="Dirección Fiscal Completa" name="direccion_fiscal" value={formData.direccion_fiscal} onChange={(e) => handleChange('direccion_fiscal', e.target.value)} />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Banco"
                      icon={Building2}
                      options={catalogs.tiposBanco?.map(b => ({ value: b.id_catalogo, label: b.nombre })) || []}
                      value={formData.banco_id}
                      onChange={(val) => handleChange('banco_id', val)}
                      error={errors.banco_id}
                      placeholder="Seleccionar banco"
                    />
                    <SelectField
                      label="Tipo de Cuenta"
                      icon={CreditCard}
                      options={catalogs.tiposCuenta?.map(t => ({ value: t.id_catalogo, label: t.nombre })) || []}
                      value={formData.tipo_cuenta_id}
                      onChange={(val) => handleChange('tipo_cuenta_id', val)}
                      placeholder="Seleccionar tipo"
                    />
                    <InputField label="Número de Cuenta" name="numero_cuenta" value={formData.numero_cuenta} onChange={(e) => handleChange('numero_cuenta', e.target.value)} icon={CreditCard} />
                    <InputField label="CLABE Interbancaria" name="clabe" value={formData.clabe} onChange={(e) => handleChange('clabe', e.target.value)} placeholder="18 dígitos" />
                    <div className="col-span-full">
                      <InputField label="Titular de la Cuenta" name="titular_cuenta" value={formData.titular_cuenta} onChange={(e) => handleChange('titular_cuenta', e.target.value)} icon={User} />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                      <InputField label="Nombre Completo del Contacto" name="nombre_contacto" value={formData.nombre_contacto} onChange={(e) => handleChange('nombre_contacto', e.target.value)} icon={Contact} />
                    </div>
                    <InputField label="Relación / Parentesco" name="relacion" value={formData.relacion} onChange={(e) => handleChange('relacion', e.target.value)} placeholder="Ej. Esposa, Padre, Amigo..." />
                    <InputField label="Teléfono de Emergencia" name="telefono_contacto" value={formData.telefono_contacto} onChange={(e) => handleChange('telefono_contacto', e.target.value)} icon={Phone} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto flex items-center justify-between border-t border-white/5 bg-slate-950/50 p-8 lg:px-12 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0 || loading}
                className={`flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all ${currentStep === 0
                  ? 'hidden'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30'
                  }`}
              >
                <ChevronLeft className="h-5 w-5" /> Anterior
              </button>

              {/* Leyenda en el Footer */}
              <div className="hidden xl:flex items-center gap-3 text-slate-500">
                <div className="h-1 w-1 rounded-full bg-indigo-500/50" />
                <p className="text-[11px] leading-relaxed max-w-sm">
                  Completa cada sección con información verídica para generar el expediente digital del empleado.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress indicator for mobile or extra visual cue */}
              <div className="hidden sm:flex items-center gap-1.5 mr-6">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-indigo-500' : 'bg-slate-700'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={loading}
                className="group flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : currentStep === STEPS.length - 1 ? (
                  <>Finalizar Registro <Check className="h-5 w-5" /></>
                ) : (
                  <>Siguiente <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}


