// src/app/layout.jsx
import { AuthProvider } from '@/context/AuthContext';
import { Geist } from "next/font/google";
import './globals.css';
import '../styles/reduced-motion.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata = {
  title: 'Sistema ERP',
  description: 'Sistema de gestión empresarial',
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-white selection:bg-indigo-500/30">
        <Toaster 
          richColors 
          position="top-center" 
          expand={false}
          visibleToasts={3}
          toastOptions={{
            style: {
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f1f5f9',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}