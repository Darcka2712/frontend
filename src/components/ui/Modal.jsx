'use client';

import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[999] pointer-events-none">
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`
                w-full ${sizes[size]} bg-slate-900 border border-white/10 
                rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] 
                pointer-events-auto flex flex-col max-h-[90vh] relative overflow-hidden
                ${className}
              `}
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all group"
                >
                  <X size={24} className="group-rotate-90 transition-transform" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
