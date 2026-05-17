/**
 * SKELETONS PREMIUM V2
 * Adaptados para la estética Dark Mode / SaaS Premium (Stripe/Linear style)
 */

import React from 'react';

const Pulse = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

/**
 * Skeleton para tablas de alto rendimiento (Usuarios, Empleados, etc)
 */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full space-y-4">
    {/* Header Skeleton */}
    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <Pulse key={`h-${i}`} className={`h-4 ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
      ))}
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-white/5">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <Pulse className="w-12 h-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Pulse className="h-4 w-1/3" />
              <Pulse className="h-3 w-1/2" />
            </div>
          </div>
          <Pulse className="h-8 w-24 rounded-full" />
          <Pulse className="h-8 w-12 rounded-lg" />
          <div className="flex gap-2">
            <Pulse className="w-10 h-10 rounded-xl" />
            <Pulse className="w-10 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton para tarjetas de KPI / Dashboard
 */
export const KPISkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] p-6 space-y-4 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-10 w-16" />
          </div>
          <Pulse className="w-12 h-12 rounded-xl" />
        </div>
        <Pulse className="h-3 w-3/4" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton para modales de carga crítica
 */
export const ModalSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Pulse className="h-3 w-24 ml-2" />
          <Pulse className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <Pulse className="h-3 w-32 ml-2" />
      <Pulse className="h-24 w-full rounded-xl" />
    </div>
    <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
      <Pulse className="h-10 w-24 rounded-xl" />
      <Pulse className="h-10 w-40 rounded-xl" />
    </div>
  </div>
);

/**
 * Skeleton para el Dashboard General
 */
export const DashboardSkeleton = () => (
  <div className="space-y-8 max-w-[1600px] mx-auto px-6 py-8">
    <div className="flex justify-between items-end">
      <div className="space-y-3">
        <Pulse className="h-8 w-64 rounded-xl" />
        <Pulse className="h-4 w-48 rounded-lg" />
      </div>
      <Pulse className="h-12 w-56 rounded-xl" />
    </div>
    
    <KPISkeleton />
    
    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-4 shadow-2xl h-[400px]">
      <TableSkeleton rows={3} cols={4} />
    </div>
  </div>
);

// Mapeo para retrocompatibilidad
export const UserTableSkeleton = () => <TableSkeleton rows={5} cols={5} />;
export const StatsSkeleton = KPISkeleton;
export const FormModalSkeleton = ModalSkeleton;
export const FullFormSkeleton = ModalSkeleton;
export const PaginationSkeleton = () => (
  <div className="flex items-center justify-between px-10 py-8">
    <Pulse className="h-4 w-32" />
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Pulse key={i} className="w-10 h-10 rounded-xl" />
      ))}
    </div>
  </div>
);
