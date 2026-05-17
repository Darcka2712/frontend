# Biblioteca de Componentes UI: Antigravity

Ubicación: `src/components/ui/`

Todos los componentes están construidos con **Tailwind CSS** y **Framer Motion**.

## 1. Button (`Button.jsx`)
Botón premium con animaciones de click y estados de carga.

**Props:**
- `variant`: `primary` (índigo), `secondary` (glass), `danger` (rojo).
- `size`: `sm`, `md`, `lg`.
- `icon`: Componente de icono de Lucide.
- `loading`: Booleano para mostrar spinner.

## 2. InputField (`InputField.jsx`)
Campo de texto con soporte para iconos y estilos de foco animados.

**Props:**
- `label`: Título del campo.
- `icon`: Icono a la izquierda.
- `error`: Mensaje de error para mostrar en rojo.
- `props`: Soporta todos los atributos estándar de `<input />`.

## 3. SelectField (`SelectField.jsx`)
Selector estilizado para catálogos.

**Props:**
- `options`: Array de objetos `{ value, label }`.
- `label`: Título del campo.

## 4. Modal (`Modal.jsx`)
Componente críptico que usa Portals para sobreponerse a toda la UI.

**Props:**
- `isOpen`: Booleano de visibilidad.
- `onClose`: Función para cerrar.
- `title`: Título principal (H3).
- `subtitle`: (Opcional) Texto descriptivo bajo el título.
- `maxWidth`: Clase de Tailwind para ancho (ej: `max-w-4xl`).

## 5. Badge (`Badge.jsx`)
Indicador de estado (Status pills).

**Props:**
- `variant`: `success`, `warning`, `error`, `info`, `neutral`.
- `children`: Contenido de texto.

## 6. Card (`Card.jsx`)
Contenedor con efecto de cristal y hover sutil.

**Props:**
- `className`: Clases adicionales.
- `children`: Contenido.

---
*Para añadir nuevos componentes, seguir el patrón de exportación `default` y asegurar el uso de `framer-motion` para transiciones.*
