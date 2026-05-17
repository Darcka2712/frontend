'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, FileText, Phone, ShieldCheck } from 'lucide-react';

export default function EmployeeDetailsModals({ activeDetailModal, onClose, empleado }) {
  if (!activeDetailModal || !empleado) return null;

  const MODAL_CONFIG = {
    personal: { title: 'Información Personal', icon: User, bgClass: 'bg-indigo-500/10 text-indigo-500' },
    laboral: { title: 'Detalles Laborales', icon: Briefcase, bgClass: 'bg-emerald-500/10 text-emerald-500' },
    legal: { title: 'Documentación Legal', icon: FileText, bgClass: 'bg-amber-500/10 text-amber-500' },
    contacto: { title: 'Contacto de Emergencia', icon: Phone, bgClass: 'bg-rose-500/10 text-rose-500' }
  };

  const config = MODAL_CONFIG[activeDetailModal];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
               <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bgClass}`}>
                <config.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{config.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center gap-4 border-b border-slate-800 pb-6">
               <div className="h-20 w-20 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500 border border-slate-700 shadow-inner">
                 {empleado.nombre?.[0]}{empleado.apellido_paterno?.[0]}
               </div>
               <div className="text-center">
                 <h4 className="text-xl font-bold text-slate-100">{empleado.nombre} {empleado.apellido_paterno}</h4>
                 <p className="text-xs font-mono uppercase tracking-widest text-indigo-500">{empleado.codigo_empleado}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {activeModal === 'personal' && (
                <>
                  <DetailItem label="Género" value={empleado.genero === 'M' ? 'Masculino' : 'Femenino'} />
                  <DetailItem label="Nacimiento" value={new Date(empleado.fecha_nacimiento).toLocaleDateString()} />
                  <DetailItem label="Antigüedad" value="2 años" />
                  <DetailItem label="Edad" value="28 años" />
                </>
              )}
              {activeModal === 'laboral' && (
                <>
                  <DetailItem label="Puesto" value={empleado.puesto?.nombre_puesto} />
                  <DetailItem label="Categoría" value={empleado.categoria?.nombre_categoria} />
                  <DetailItem label="Empresa" value={empleado.empresa?.nombre_empresa} />
                  <DetailItem label="Ubicación" value={empleado.categoria?.es_campo ? empleado.rancho?.nombre_rancho : empleado.area?.nombre} />
                </>
              )}
              {activeModal === 'legal' && (
                <>
                  <DetailItem label="RFC" value="HASHEADO" />
                  <DetailItem label="CURP" value="HASHEADO" />
                  <DetailItem label="NSS" value="HASHEADO" />
                  <DetailItem label="Contrato" value="Indefinido" />
                </>
              )}
              {activeModal === 'contacto' && (
                <>
                  <DetailItem label="Contacto" value="Maria Lopez" />
                  <DetailItem label="Relación" value="Esposa" />
                  <DetailItem label="Teléfono" value="+52 123 456 7890" />
                  <DetailItem label="Estatus" value="Validado" />
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-950/30 p-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <p className="text-sm font-medium text-slate-200">{value || 'N/A'}</p>
    </div>
  );
}
