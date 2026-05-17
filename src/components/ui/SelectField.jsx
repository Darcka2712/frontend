'use client';

import React from 'react';

const SelectField = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  options = [], 
  className = '',
  onChange,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <select
          ref={ref}
          onChange={handleChange}
          className={`
            w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3 
            ${Icon ? 'pl-12' : 'px-4'} pr-10
            text-white font-bold appearance-none cursor-pointer 
            focus:border-indigo-500/50 focus:bg-slate-900/60 transition-all outline-none
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        >
          {props.placeholder && (
            <option value="" disabled className="bg-slate-900 text-slate-500 italic">
              {props.placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value} 
              className="bg-slate-900 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-2 animate-shake">
          {error}
        </p>
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
