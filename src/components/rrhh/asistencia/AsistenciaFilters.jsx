'use client';

import React from 'react';
import { Filter, Search, Calendar, Users, Briefcase } from 'lucide-react';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

const AsistenciaFilters = ({
  searchTerm,
  setSearchTerm,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  categoriaFiltro,
  setCategoriaFiltro,
  puestoFiltro,
  setPuestoFiltro,
  empresaFiltro,
  setEmpresaFiltro,
  lugarFiltro,
  setLugarFiltro,
  estadoFiltro,
  setEstadoFiltro,
  categorias,
  puestos,
  empresas,
  ranchos,
  areas,
  onSearch,
  onClear
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-8 shadow-2xl shadow-black/20">
      {/* Header de Filtros */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
          <Filter size={18} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Filtros de Búsqueda</h3>
          <p className="text-slate-400 text-sm">Encuentra registros de asistencia por empleado y fecha</p>
        </div>
      </div>

      {/* Grid de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Búsqueda */}
        <div className="space-y-2">
          <label htmlFor="buscar-empleado" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Search size={14} className="text-indigo-400" />
            Buscar Empleado
          </label>
          <div className="relative">
            <input
              id="buscar-empleado"
              type="text"
              placeholder="Nombre o código..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all placeholder:text-slate-500 pr-10"
            />
            <Search size={16} className="absolute right-3 top-3.5 text-slate-500" />
          </div>
        </div>

        {/* Rango de Fechas */}
        <div className="space-y-2">
          <label htmlFor="fecha-inicio" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Calendar size={14} className="text-indigo-400" />
            Desde
          </label>
          <input
            id="fecha-inicio"
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fecha-fin" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Calendar size={14} className="text-indigo-400" />
            Hasta
          </label>
          <input
            id="fecha-fin"
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label htmlFor="categoria-filtro" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Users size={14} className="text-indigo-400" />
            Categoría
          </label>
          <select
            id="categoria-filtro"
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>)}
          </select>
        </div>

        {/* Puesto */}
        <div className="space-y-2">
          <label htmlFor="puesto-filtro" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Briefcase size={14} className="text-indigo-400" />
            Puesto
          </label>
          <select
            id="puesto-filtro"
            value={puestoFiltro}
            onChange={e => setPuestoFiltro(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todos los puestos</option>
            {puestos.map(p => <option key={p.id_puesto} value={p.id_puesto}>{p.nombre_puesto}</option>)}
          </select>
        </div>

        {/* Empresa */}
        <div className="space-y-2">
          <label htmlFor="empresa-filtro" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Briefcase size={14} className="text-indigo-400" />
            Empresa
          </label>
          <select
            id="empresa-filtro"
            value={empresaFiltro}
            onChange={e => setEmpresaFiltro(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas las empresas</option>
            {empresas.map(emp => <option key={emp.id_empresa} value={emp.id_empresa}>{emp.nombre_empresa}</option>)}
          </select>
        </div>

        {/* Lugar (Rancho o Área) */}
        <div className="space-y-2">
          <label htmlFor="lugar-filtro" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter size={14} className="text-indigo-400" />
            Lugar de Trabajo
          </label>
          <select
            id="lugar-filtro"
            value={lugarFiltro}
            onChange={e => setLugarFiltro(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          >
            <option value="">Cualquier lugar</option>
            <optgroup label="Ranchos">
              {ranchos.map(r => <option key={`r-${r.id_rancho}`} value={`rancho-${r.id_rancho}`}>{r.nombre_rancho}</option>)}
            </optgroup>
            <optgroup label="Áreas Administrativas">
              {areas.map(a => <option key={`a-${a.id_area}`} value={`area-${a.id_area}`}>{a.nombre}</option>)}
            </optgroup>
          </select>
        </div>

        {/* Estado Empleado */}
        <div className="space-y-2">
          <label htmlFor="estado-empleado" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter size={14} className="text-indigo-400" />
            Estado Empleado
          </label>
          <SelectField
            id="estado-empleado"
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
            options={[
              { value: 'all', label: 'Todos (Activos y Bajas)' },
              { value: 'true', label: 'Solo Activos' },
              { value: 'false', label: 'Solo Bajas' }
            ]}
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl font-bold"
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/30">
        <Button
          onClick={onSearch}
          variant="primary"
          size="lg"
          icon={Filter}
          className="flex-1 sm:flex-none shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300"
        >
          Aplicar Filtros
        </Button>
        <Button
          onClick={onClear}
          variant="secondary"
          size="lg"
          className="flex-1 sm:flex-none bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 transition-all duration-300"
        >
          Limpiar Todo
        </Button>
      </div>
    </div>
  );
};

export default AsistenciaFilters;
