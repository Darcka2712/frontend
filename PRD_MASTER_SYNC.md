# 📘 PRD Maestro: Sincronización Full-Stack - Sistema Mezclas

Este documento sirve como la **verdad única** para que cualquier agente (Backend o Frontend) pueda desarrollar componentes perfectamente sincronizados.

---

## 🚀 1. Visión del Proyecto
**Sistema Mezclas** es un ERP agrícola de alto rendimiento diseñado para gestionar la producción, asistencia y nómina de una fuerza laboral compleja (Campo vs Administrativa) en un entorno multi-empresa.

### Objetivos Clave:
- **Precisión en Nómina**: Sincronización perfecta entre asistencia, producción (destajo) y periodos de pago.
- **UI Premium**: Interfaz limpia, moderna (estilo Stripe/Linear) y altamente responsive.
- **Seguridad Robusta**: Control de acceso basado en roles (RBAC) con bypass para el rol MASTER.

---

## 🛠️ 2. Arquitectura de Sincronización (Backend-Frontend)

### A. El Contrato de API
Todas las respuestas siguen este formato estándar:
```json
// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa" // Opcional
}

// Error
{
  "success": false,
  "message": "Descripción amigable del error",
  "errors": [ ... ] // Opcional, para validaciones
}
```

### B. Autenticación y Multi-tenancy
- **Auth**: JWT enviado en el header `Authorization: Bearer <token>`.
- **Tenant Context**: El `id_empresa` NO se envía en el body (regla de seguridad). Se extrae automáticamente del JWT en el backend. El frontend solo debe asegurarse de que el usuario haya seleccionado una empresa activa si tiene acceso a varias.

### C. Reglas de Persistencia (Crítico)
- **Soft Delete**: NUNCA usar `DELETE`. Siempre enviar `activo = 0` o usar el endpoint de desactivación.
- **Filtrado Activo**: El frontend debe asumir que el backend filtra por `activo = 1` por defecto, pero debe permitir filtros para ver inactivos si el rol lo permite.

---

## 📦 3. Blueprints de Módulos (Referencia para Frontend)

| Módulo | Endpoint Base | Componentes Clave Requeridos | Notas de Negocio |
|--------|---------------|------------------------------|------------------|
| **Usuarios** | `/api/usuario` | Gestión de Perfil, Asignación de Roles | Ocultar usuarios `es_sistema=1`. |
| **Empleados** | `/api/empleados` | Expediente Digital, Carga de Fotos | Separar lógica Campo (Ranchos) vs Admin (Áreas). |
| **Asistencia** | `/api/asistencia` | Marcaje de entrada/salida, Vista Calendario | Crucial para el cálculo de nómina. |
| **Producción** | `/api/produccion` | Captura de Destajo (Cajas, Kilos) | El `total` NO se envía, lo calcula el backend. |
| **Nómina** | `/api/nomina` | Generación de Periodos, Recibos PDF | Depende de Asistencia + Producción + Bonos. |
| **Bonos** | `/api/bonos` | Reglas de Productividad | Aplicación automática o manual según reglas. |

---

## 🎨 4. Estándares de UI (SaaS Premium)
Para el agente de Frontend:
- **Framework**: React / Next.js (App Router).
- **Styling**: TailwindCSS puro.
- **Estética**:
    - Bordes redondeados (`rounded-xl`).
    - Sombras suaves (`shadow-sm`).
    - Colores neutros (Slate/Zinc) con acentos elegantes (Indigo/Emerald).
    - Layouts: Sidebar colapsable + Topbar con migas de pan (breadcrumbs).
- **Componentes**: Usar el sistema de componentes atómicos (Buttons, Inputs, Modals, Tables con paginación).

---

## 🔄 5. Flujo de Desarrollo para Nuevos Módulos
1. **Backend**: Crear Modelo → Repository → Service → Controller → DTO → Route → Registry.
2. **Frontend**:
    - Crear `service` en `src/lib/api/`.
    - Crear `hook` de SWR/React Query para fetching.
    - Crear `page.jsx` orquestadora.
    - Dividir en sub-componentes (KPIs, Tabla, Modales).

---

## ⚠️ 6. Reglas de Oro para el Agente de Frontend
1. **Validación**: Siempre usar los esquemas DTO del backend como referencia para la validación en el cliente.
2. **Errores de Base de Datos**: Si el backend retorna un error con mensaje de trigger (ej. "Empresa inconsistente"), mostrarlo tal cual al usuario en un Toast de error.
3. **Rol MASTER**: Nunca mostrar opciones de "Configuración de Sistema" o "Roles Maestro" a menos que el JWT indique explícitamente el nivel de acceso correspondiente.
4. **Estado de Carga**: Implementar esqueletos (Skeletons) para todas las tablas y listas durante el fetching.

---
*Este documento es dinámico y debe actualizarse cada vez que se agregue un nuevo flujo de negocio.*
