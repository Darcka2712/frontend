-- Active: 1774025266418@@127.0.0.1@3306
# Frontend - Sistema Corporativo Agrícola

## Descripción
Frontend moderno del Sistema Corporativo Agrícola desarrollado con Next.js 13+, React y Tailwind CSS. Proporciona una interfaz intuitiva y responsiva para la gestión completa del sistema agrícola.

## 🏗️ Arquitectura del Frontend

### **Tecnologías Principales**
- **Framework**: Next.js 13+ con App Router
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide Icons
- **State Management**: React Hooks + Context API
- **HTTP Client**: Fetch API
- **Routing**: Next.js App Router
- **TypeScript**: JavaScript con JSDoc
- **Animations**: Framer Motion

## 📚 Documentación de Estándares (Antigravity v1.0)
Hemos establecido un nuevo estándar de arquitectura y diseño para el proyecto:

- [**Guía de Arquitectura SaaS Premium**](./MD/SAAS_ARCHITECTURE_GUIDE.md): El estándar de oro para crear nuevos módulos y servicios.
- [**Biblioteca de Componentes UI**](./MD/COMPONENT_LIBRARY.md): Catálogo de componentes atómicos listos para usar (`Button`, `InputField`, `Modal`, etc).

### **Estructura del Proyecto**
```
frontend/
├── public/                       # Archivos estáticos
├── src/
│   ├── app/                      # App Router (Next.js 13+)
│   │   ├── dashboard/           # Panel principal
│   │   │   ├── rrhh/           # Recursos Humanos
│   │   │   │   ├── empleados/  # Gestión de empleados
│   │   │   │   ├── departamentos/ # Gestión de departamentos
│   │   │   │   ├── asistencia/ # Control de asistencia
│   │   │   │   └── nomina/     # Nóminas
│   │   │   ├── almacen/        # Gestión de almacén
reutilizables
│   │   ├── ui/                 # Componentes UI base
│   │   ├── forms/              # Formularios
│   │   ├── modals/             # Modales
│   │   ├── tables/             # Tablas
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utilerías y helpers
│   ├── hooks/
                  # Custom hooks
│   ├── styles/                 # Estilos globales
│   └── constants/              # Constantes y configuraciones
├── package.json                # Dependencias y scripts
└── README.md                   # Este archivo
```

## 🎨 Componentes y UI

### **Sistema de Diseño**
- **Colors**: Paleta profesional con temas light/dark
- **Typography**: Sistema de tipografía consistente
- **Spacing**: Sistema de espaciado basado en Tailwind
- **Components**: Componentes reutilizables y accesibles

### **Componentes Principales**
- **Layout**: Sidebar, Header, Footer
- **Forms**: Formularios con validación
- **Tables**: Tablas con paginación y filtros
- **Modals**: Diálogos modales reutilizables
- **Charts**: Gráficos y visualizaciones
- **Cards**: Tarjetas de información

## 📋 Módulos del Frontend

### **🏠 Dashboard Principal**
- **Overview**: Métricas y KPIs
- **Quick Actions**: Acciones rápidas
- **Recent Activity**: Actividad reciente
- **Charts**: Gráficos de rendimiento

### **👥 Recursos Humanos**
| Módulo | Descripción | Estado |
|--------|-------------|---------|
| [Empleados](src/app/dashboard/rrhh/empleados/page.jsx) | Gestión completa de empleados | ✅ Completo |
| [Departamentos](src/app/dashboard/rrhh/departamentos/page.jsx) | Administración de departamentos | ✅ Completo |
| [Asistencia](src/app/dashboard/rrhh/asistencia/) | Control de asistencia | 🚧 En desarrollo |
| [Nómina](src/app/dashboard/rrhh/nomina/) | Gestión de nóminas | 🚧 En desarrollo |

### **🏢 Administración**
| Módulo | Descripción | Estado |
|--------|-------------|---------|
| [Usuarios](src/app/dashboard/usuarios/) | Gestión de usuarios del sistema | 🚧 En desarrollo |
| [Empresas](src/app/dashboard/empresas/) | Gestión de empresas | 🚧 En desarrollo |
| [Corporativo](src/app/dashboard/corporativo/) | Panel corporativo | 🚧 En desarrollo |

### **🌾 Operaciones Agrícolas**
| Módulo | Descripción | Estado |
|--------|-------------|---------|
| [Ranchos](src/app/dashboard/ranchos/) | Gestión de ranchos | 🚧 En desarrollo |
| [Sectores](src/app/dashboard/sectores/) | Gestión de sectores | 🚧 En desarrollo |
| [Cultivos](src/app/dashboard/cultivos/) | Ciclos productivos | 🚧 En desarrollo |

### **📦 Logística**
| Módulo | Descripción | Estado |
|--------|-------------|---------|
| [Almacén](src/app/dashboard/almacen/) | Gestión de inventario | 🚧 En desarrollo |
| [Combustible](src/app/dashboard/combustible/) | Control de combustible | 🚧 En desarrollo |

## 🚀 Inicio Rápido

### **Requisitos Previos**
- Node.js 18+
- npm o yarn
- Backend corriendo en http://localhost:3002

### **Instalación**
```bash
# Clonar repositorio
git clone <repository-url>
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### **Variables de Entorno**
```env
# API (opcional). Recomendado: dejar sin definir para usar el mismo origen + /api (rewrites en next.config).
# Si apuntas al Express directamente, incluye siempre /api:
# NEXT_PUBLIC_API_URL=http://localhost:3002/api

# Destino interno del backend para rewrites (build/servidor Next)
# BACKEND_PROXY_URL=http://localhost:3002

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME="Sistema Corporativo Agrícola"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Configuración de temas
NEXT_PUBLIC_DEFAULT_THEME="light"
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Configuración de auth
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_SESSION_TIMEOUT=3600000
```

### **Iniciar Desarrollo**
```bash
# Servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

### **Construcción para Producción**
```bash
# Construir versión de producción
npm run build

# Iniciar servidor de producción
npm start

# Analizar tamaño del bundle
npm run analyze
```

## 🎨 Sistema de Diseño

### **Colores Principales**
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Secondary Colors */
--secondary-50: #f8fafc;
--secondary-500: #64748b;
--secondary-600: #475569;

/* Success Colors */
--success-500: #10b981;
--success-600: #059669;

/* Warning Colors */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error Colors */
--error-500: #ef4444;
--error-600: #dc2626;
```

### **Tipografía**
```css
/* Font Families */
--font-sans: 'Inter', sans-serif;
--font-mono: 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

## 📱 Componentes UI

### **Botones**
```jsx
// Primary Button
<Button className="btn-primary">Guardar</Button>

// Secondary Button
<Button variant="secondary">Cancelar</Button>

// Outline Button
<Button variant="outline">Editar</Button>
```

### **Formularios**
```jsx
// Input Field
<FormField
  label="Nombre"
  type="text"
  placeholder="Ingrese nombre"
  required
/>

// Select Field
<SelectField
  label="Departamento"
  options={departments}
  onChange={handleChange}
/>
```

### **Tablas**
```jsx
// Data Table
<DataTable
  data={employees}
  columns={columns}
  searchable
  pagination
  onRowClick={handleRowClick}
/>
```

### **Modales**
```jsx
// Modal Dialog
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Nuevo Empleado"
>
  <EmployeeForm onSubmit={handleSubmit} />
</Modal>
```

## 🔐 Autenticación

### **Flujo de Autenticación**
1. **Login**: Usuario ingresa credenciales
2. **Validación**: Verificación con backend
3. **Token**: Almacenamiento de JWT
4. **Session**: Mantenimiento de sesión
5. **Logout**: Cierre seguro de sesión

### **Protected Routes**
```jsx
// Middleware de protección
export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPage />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

## 📊 Estado Global

### **Context API Usage**
```jsx
// Auth Context
const { user, login, logout, loading } = useAuth();

// Theme Context
const { theme, toggleTheme } = useTheme();

// Notification Context
const { notifications, addNotification } = useNotifications();
```

### **Custom Hooks**
```jsx
// API Hook
const { data, loading, error } = useFetch('/api/employees');

// Local Storage Hook
const [preferences, setPreferences] = useLocalStorage('preferences');

// Debounce Hook
const debouncedSearch = useDebounce(searchTerm, 300);
```

## 🎯 Características Principales

### **Responsive Design**
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch Gestures**: Soporte para gestos táctiles
- **PWA Ready**: Compatible con Progressive Web Apps

### **Accessibility**
- **WCAG 2.1**: Cumplimiento de estándares
- **ARIA Labels**: Etiquetas descriptivas
- **Keyboard Navigation**: Navegación por teclado
- **Screen Reader**: Compatible con lectores de pantalla

### **Performance**
- **Code Splitting**: División automática de código
- **Image Optimization**: Optimización de imágenes
- **Lazy Loading**: Carga perezosa de componentes
- **Caching**: Estrategias de caché inteligentes

## 🧪 Pruebas

### **Tipos de Pruebas**
```bash
# Unit Tests
npm run test

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

### **Testing Libraries**
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **Cypress**: Testing E2E
- **MSW**: Mock Service Worker

## 📈 Métricas y Analytics

### **Performance Metrics**
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: Análisis de tamaño
- **Load Time**: Tiempo de carga
- **User Engagement**: Métricas de usuario

### **Analytics Integration**
```jsx
// Google Analytics
import { GoogleAnalytics } from '@/components/analytics';

// Custom Events
analytics.track('button_click', {
  button: 'save_employee',
  department: 'hr'
});
```

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# Configurar dominio
vercel domains add yourdomain.com
```

### **Docker**
```bash
# Construir imagen
docker build -t frontend-app .

# Ejecutar contenedor
docker run -p 3000:3000 frontend-app
```

### **Netlify**
```bash
# Construir y desplegar
npm run build
npx netlify-cli deploy --prod --dir=.next
```

## 📚 Documentación

### **Component Documentation**
- **Storybook**: Catálogo de componentes
- **JSDoc**: Documentación de código
- **API Docs**: Documentación de API interna

### **Style Guide**
- **Design System**: Guía de diseño
- **Component Library**: Biblioteca de componentes
- **Brand Guidelines**: Guías de marca

## 🤝 Contribución

### **Flujo de Trabajo**
1. **Fork** del repositorio
2. **Branch** específico para cada feature
3. **Commits** con mensajes descriptivos
4. **Pull Request** con descripción detallada
5. **Code Review** antes de merge

### **Estándares de Código**
- **ESLint**: Linting de código
- **Prettier**: Formato consistente
- **Husky**: Git hooks
- **Conventional Commits**: Estándar de commits

### **Guía de Estilo**
- **Component Naming**: PascalCase
- **File Naming**: kebab-case
- **CSS Classes**: BEM methodology
- **Imports**: Organizados y agrupados

## 🐛 Soporte y Troubleshooting

### **Problemas Comunes**
- **Build Errors**: Verificar dependencias y variables de entorno
- **API Errors**: Validar conexión con backend
- **CSS Issues**: Revisar configuración de Tailwind
- **Performance**: Optimizar imágenes y bundle

### **Debugging**
```bash
# Modo desarrollo con debugging
npm run dev:debug

# Análisis de bundle
npm run analyze

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📄 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

## 🎉 Roadmap

### **Próximas Versiones**
- [ ] **PWA**: Aplicación progresiva
- [ ] **Offline Mode**: Soporte offline
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Advanced Charts**: Gráficos interactivos
- [ ] **Mobile App**: Aplicación nativa

### **Mejoras Continuas**
- [ ] **Performance**: Optimización continua
- [ ] **UI/UX**: Mejoras de experiencia
- [ ] **Accessibility**: Refuerzo de accesibilidad
- [ ] **Testing**: Cobertura de pruebas completa

---

## 📞 Contacto

**Equipo de Desarrollo Frontend**
- **Email**: frontend@corporativo.com
- **Sitio Web**: https://corporativo.com
- **Documentación**: https://docs.corporativo.com/frontend

**Gracias por usar el Frontend del Sistema Corporativo Agrícola (Powered by Antigravity Standard)** 🚀🎨
