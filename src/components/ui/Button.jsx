'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10',
    outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-95',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-[8px] rounded-lg',
    sm: 'px-4 py-2 text-[10px] rounded-xl',
    md: 'px-6 py-3 text-xs rounded-2xl',
    lg: 'px-8 py-4 text-sm rounded-[1.5rem]',
    xl: 'px-10 py-5 text-base rounded-[2rem]'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={size === 'xs' ? 12 : 18} />
      ) : Icon && (
        <Icon className={`mr-2 ${size === 'xs' ? 'w-3 h-3' : 'w-5 h-5'}`} />
      )}
      {children}
    </button>
  );
};

export default Button;
