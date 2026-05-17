'use client';

import React from 'react';

const InputField = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full bg-slate-950/40 border rounded-2xl py-3 pr-4 
            ${Icon ? 'pl-12' : 'pl-4'}
            text-white font-bold placeholder:text-slate-700
            focus:outline-none transition-all shadow-inner
            ${error 
              ? 'border-red-500/50 focus:ring-4 focus:ring-red-500/10' 
              : 'border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-2 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
