'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Premium Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
            
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase italic">
              Interrupción del <span className="text-red-500">Sistema</span>
            </h1>
            
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Se ha detectado una excepción crítica en el módulo actual. 
              La integridad de los datos ha sido preservada, pero es necesario reiniciar la vista.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.reload()}
                icon={RefreshCcw}
                className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 w-full sm:w-auto"
              >
                REINICIAR INTERFAZ
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
                icon={Home}
                className="border-white/10 hover:bg-white/5 w-full sm:w-auto"
              >
                VOLVER AL PANEL
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-12 p-6 bg-black/40 rounded-2xl border border-white/5 text-left overflow-auto max-h-40">
                <p className="text-red-400 font-mono text-xs uppercase mb-2 tracking-widest">Stack Trace:</p>
                <code className="text-slate-500 text-[10px] leading-tight">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
