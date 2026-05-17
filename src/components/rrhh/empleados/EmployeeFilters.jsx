'use client';

import React from 'react';
import { Search, Building2, LayoutGrid, Briefcase, Filter, FileText } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

const EmployeeFilters = ({
  filters,
  setFilters,
  catalogs,
  handlers,
  onSearch,
  onClear
}) => {
  const { empresas, categorias, puestosFiltrados, ranchos, areas, tiposContrato } = catalogs;
  const { handleEmpresaChange, handleCategoriaChange } = handlers;

  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/30 rounded-[2.5rem] p-8 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
          <Search size={18} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Filtros de Personal</h3>
          <p className="text-slate-400 text-sm">Filtra por categoría para visualizar el listado de colaboradores</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Búsqueda */}
        <div className="space-y-2">
          <label htmlFor="search-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Search size={14} className="text-indigo-400" />
            Buscar Empleado
          </label>
          <InputField 
            id="search-filter"
            placeholder="Nombre, # empleado o CURP..." 
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
          />
        </div>

        {/* Empresa */}
        <div className="space-y-2">
          <label htmlFor="empresa-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Building2 size={14} className="text-indigo-400" />
            Empresa
          </label>
          <SelectField 
            id="empresa-filter"
            value={filters.id_empresa}
            onChange={(e) => {
              setFilters({ id_empresa: e.target.value });
              handleEmpresaChange(e.target.value);
            }}
            options={empresas.map(emp => ({
              value: emp.id_empresa,
              label: emp.nombre_empresa
            }))}
            placeholder="Todas las empresas"
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label htmlFor="categoria-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <LayoutGrid size={14} className="text-indigo-400" />
            Categoría
          </label>
          <SelectField 
            id="categoria-filter"
            value={filters.id_categoria}
            onChange={(e) => {
              setFilters({ id_categoria: e.target.value });
              handleCategoriaChange(e.target.value);
            }}
            options={categorias.map(cat => ({
              value: cat.id_categoria,
              label: cat.nombre_categoria
            }))}
            placeholder="Todas las categorías"
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
          />
        </div>

        {/* Puesto */}
        <div className="space-y-2">
          <label htmlFor="puesto-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Briefcase size={14} className="text-indigo-400" />
            Puesto
          </label>
          <SelectField 
            id="puesto-filter"
            value={filters.id_puesto}
            onChange={(e) => setFilters({ id_puesto: e.target.value })}
            options={puestosFiltrados.map(p => ({
              value: p.id_puesto,
              label: p.nombre_puesto
            }))}
            placeholder="Todos los puestos"
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
          />
        </div>

        {/* Lugar de Trabajo */}
        <div className="space-y-2">
          <label htmlFor="lugar-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter size={14} className="text-indigo-400" />
            Lugar de Trabajo
          </label>
          <select
            id="lugar-filter"
            value={filters.lugar}
            onChange={(e) => setFilters({ lugar: e.target.value })}
            className="w-full h-[46px] bg-slate-800/50 border border-slate-600/30 rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500 focus:bg-slate-800/70 transition-all appearance-none cursor-pointer"
          >
            <option value="">Cualquier lugar</option>
            <optgroup label="Ranchos">
              {ranchos.map(r => (
                <option key={`r-${r.id_rancho}`} value={`rancho-${r.id_rancho}`}>
                  {r.nombre_rancho}
                </option>
              ))}
            </optgroup>
            <optgroup label="Áreas Administrativas">
              {areas.map(a => (
                <option key={`a-${a.id_area}`} value={`area-${a.id_area}`}>
                  {a.nombre}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Tipo de Contrato */}
        <div className="space-y-2">
          <label htmlFor="contrato-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <FileText size={14} className="text-indigo-400" />
            Tipo de Contrato
          </label>
          <SelectField 
            id="contrato-filter"
            value={filters.tipo_contrato}
            onChange={(e) => setFilters({ tipo_contrato: e.target.value })}
            options={tiposContrato.map(t => ({
              value: t.id_catalogo,
              label: t.codigo
            }))}
            placeholder="Todos los tipos"
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl"
          />
        </div>

        {/* Estado Activo/Inactivo */}
        <div className="space-y-2">
          <label htmlFor="estado-filter" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Filter size={14} className="text-indigo-400" />
            Estado Laboral
          </label>
          <SelectField 
            id="estado-filter"
            value={filters.activo}
            onChange={(e) => setFilters({ activo: e.target.value })}
            options={[
              { value: 'all', label: 'Todos (Altas y Bajas)' },
              { value: 'true', label: 'Solo Activos' },
              { value: 'false', label: 'Solo Bajas' }
            ]}
            className="w-full bg-slate-800/50 border-slate-600/30 rounded-xl font-bold"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-slate-700/30">
        <Button 
          onClick={onSearch}
          variant="primary"
          size="lg"
          icon={Filter}
          className="flex-1 sm:flex-none shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300"
        >
          Buscar Empleados
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

export default EmployeeFilters;
