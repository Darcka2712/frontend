'use client';

import React from 'react';
import { m } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : {}}
      className={`
        bg-slate-900/40 border border-white/5 backdrop-blur-xl 
        rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden
        group ${className}
      `}
      {...props}
    >
      {/* Subtle glow effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/5 blur-[100px] rounded-full group-hover:bg-indigo-600/10 transition-colors" />
      
      <div className="relative z-10">
        {children}
      </div>
    </m.div>
  );
};

export default Card;
