# Guía de Arquitectura SaaS Premium: Antigravity

Esta guía define los estándares técnicos y de diseño para la modernización de la plataforma. Cualquier nuevo módulo o refactorización debe seguir estos principios para mantener la consistencia "SaaS Premium" (inspirada en Stripe, Linear y Vercel).

## 1. Principios de Diseño Visual

La interfaz debe sentirse profesional, limpia y viva.

- **Colores**: Uso predominante de `slate-900` para fondos y `white/indigo` para acentos. Evitar colores planos; preferir gradientes sutiles y transparencias.
- **Espaciado**: Generoso. Uso de `gap-6` o `gap-8` como estándar de rejilla.
- **Bordes**: Redondeados profesionales (`rounded-2xl` o `rounded-3xl`).
- **Interactividad**: Micro-animaciones con `framer-motion` en cada interacción (hover, click, entrada de modales).

## 2. Estructura de Archivos (Frontend)

Ubicación: `src/`

- `components/ui/`: **Componentes Atómicos**. Button, InputField, SelectField, Modal, Badge. No deben contener lógica de negocio, solo propiedades de estilo.
- `components/[modulo]/`: **Componentes de Dominio**. Componentes específicos de un módulo (ej: `EmployeeWizard`, `DeptTable`).
- `hooks/`: **Lógica de Estado y API**. Concentrar aquí las llamadas a servicios y manejo de estados complejos.
- `app/dashboard/[ruta]/page.jsx`: **Orquestadores**. Las páginas deben ser archivos pequeños (~100-200 líneas) que solo importan componentes y coordinan el flujo.

## 3. Estándar de Componentes Críticos

### 3.1 Modales (React Portals)
Todos los modales deben usar el componente `src/components/ui/Modal.jsx`. 
**Importante**: Este componente utiliza `createPortal` para renderizarse en `document.body`, permitiendo que el `z-index` cubra globalmente el Header y Sidebar del dashboard.

### 3.2 Formularios
Usar `InputField` y `SelectField` para mantener el estilo consistente (iconos a la izquierda, bordes con glow en focus).

## 4. Patrón de Integración Backend

Los servicios en el backend modular (`mezclas/src/modules/...`) deben usar este flujo:

1. **Validación (DTO)**: Cada petición debe ser validada por un DTO que defina el esquema y las reglas (ej: `EmpleadoFiltersDTO`).
2. **Servicio (Override)**: Si un módulo requiere búsquedas complejas (ej: parámetro `search` que busque en múltiples campos), se debe sobrescribir el método `findAll` en el servicio correspondiente para llamar a métodos específicos del repositorio (ej: `findAllWithIncludes`).
3. **Paginación**: El estándar es usar `page` y `pageSize`.

## 5. Instrucciones para Agentes IA (Auto-Configuración)

Al crear un nuevo módulo:
1. **Analiza** el módulo de Empleados (`src/app/dashboard/rrhh/empleados`) como referencia dorada.
2. **Utiliza** los componentes existentes en `src/components/ui`. NO crees nuevos botones o inputs si ya existen en la librería.
3. **Modulariza**: No escribas código de +300 líneas en un solo archivo. Separa en Table, Wizard y Modales de detalle.
4. **Anima**: Cada cambio de estado o navegación interna debe usar `AnimatePresence` de `framer-motion`.

---
*Fin del Estándar Oficial v1.0*
