'use client';

import React from 'react';

const variants = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const Badge = ({
  children,
  variant = 'default',
  dot = false,
  uppercase = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black
        border ${variants[variant] || variants.default}
        ${uppercase ? 'uppercase tracking-widest' : ''}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variants[variant]?.split(' ')[1] || 'bg-slate-400'}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
