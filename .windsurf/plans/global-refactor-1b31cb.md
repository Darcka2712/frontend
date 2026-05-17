# Plan de Estandarización y Optimización Global del Frontend

Este plan tiene como objetivo estandarizar las reglas de desarrollo, mejorar el manejo de errores y optimizar la estructura de los componentes principales siguiendo las recomendaciones de React Doctor y las mejores prácticas de la industria.

## 1. Estandarización de Gestión de Estado (Prioridad Crítica)
- **Implementación de `useReducer`**: Refactorizar páginas complejas como `EmpleadosPage` (que tiene 16+ `useState`) para usar `useReducer`, agrupando estados relacionados (filtros, paginación, datos).
- **Eliminación de Efectos como Handlers**: Mover la lógica de los `useEffect` que simulan manejadores de eventos (ej. en `EmployeeWizard.jsx`) a funciones de callback directas (`onClick`, `onChange`).
- **Actualizaciones Funcionales**: Asegurar que todos los `setState` en el proyecto usen la forma funcional `(prev => ...)` para evitar cierres obsoletos.

## 2. Robustez y Manejo de Errores
- **Estandarización de Notificaciones**: Implementar un patrón consistente para mostrar errores de API usando `toast` o `addNotification`, asegurando que el mensaje de error sea visible y útil para el usuario.
- **Límites de Error (Error Boundaries)**: Asegurar que los componentes principales tengan captura de errores para evitar que la app completa se caiga por fallos en sub-componentes.

## 3. Accesibilidad y Diseño (a11y & Design System)
- **Asociación Global de Control**: Auditar y corregir los ~50 problemas de etiquetas (`label`) sin control asociado (`htmlFor`).
- **Contraste de Color**: Corregir el uso de texto gris sobre fondos coloridos (índigo/slate) para cumplir con WCAG 2.2.
- **Shorthands de Tailwind**: Refactorizar las 300+ instancias de `w-N h-N` al formato unificado `size-N`.

## 4. Rendimiento y Código Limpio
- **Constantes de Referencia Estática**: Extraer objetos `{}` y arrays `[]` usados como valores por defecto en props a constantes fuera de los componentes para evitar ciclos de renderizado.
- **Limpieza de Código Muerto**: Revisar y eliminar los 77 archivos detectados como no utilizados para reducir el tamaño del bundle.

## 5. Estructura Optimizada
- Crear una plantilla de componente estandarizada que incluya:
    - Tipografía semántica (`font-semibold` en lugar de `font-bold/black`).
    - Manejo de movimiento reducido.
    - Estructura de props optimizada.
