# Sistema Visual Attio - Rediseño Completo

Un sistema de diseño completamente rediseñado inspirado en Attio con esquema básico de colores: negro, blanco, gris y azul.

## 🎨 Filosofía de Diseño Attio

- **Limpieza Visual**: Diseño ultra limpio y funcional
- **Esquema Básico**: Negro, blanco, gris y azul como colores principales
- **Modernidad**: Interfaz contemporánea y profesional
- **Funcionalidad**: Cada elemento tiene un propósito claro
- **Consistencia**: Sistema unificado en toda la aplicación

## 🎯 Paleta de Colores

### Colores Principales
```css
/* Escala de grises neutros */
primary-0: #ffffff      /* Blanco puro */
primary-50: #fafafa    /* Blanco suave */
primary-100: #f5f5f5   /* Gris muy claro */
primary-200: #e5e5e5   /* Gris claro */
primary-300: #d4d4d4   /* Gris medio-claro */
primary-400: #a3a3a3   /* Gris medio */
primary-500: #737373   /* Gris medio-oscuro */
primary-600: #525252   /* Gris oscuro */
primary-700: #404040   /* Gris muy oscuro */
primary-800: #262626   /* Casi negro */
primary-900: #171717   /* Negro suave */
primary-1000: #000000  /* Negro puro */
```

### Color de Acento Azul
```css
accent-50: #eff6ff     /* Azul muy claro */
accent-100: #dbeafe    /* Azul claro */
accent-200: #bfdbfe    /* Azul medio-claro */
accent-300: #93c5fd    /* Azul medio */
accent-400: #60a5fa    /* Azul medio-oscuro */
accent-500: #3b82f6    /* Azul principal */
accent-600: #2563eb    /* Azul oscuro */
accent-700: #1d4ed8    /* Azul muy oscuro */
accent-800: #1e40af    /* Azul profundo */
accent-900: #1e3a8a    /* Azul intenso */
```

## 🧩 Componentes Rediseñados

### Botones Attio
```tsx
<Button variant="primary">Primario</Button>      // Azul sólido
<Button variant="secondary">Secundario</Button>  // Gris claro
<Button variant="outline">Outline</Button>       // Solo borde azul
<Button variant="ghost">Ghost</Button>          // Transparente
<Button variant="danger">Peligro</Button>        // Rojo para acciones críticas
```

### Tarjetas Attio
```tsx
<Card>                    // Tarjeta estándar con sombra sutil
<Card interactive>        // Con efectos hover elegantes
```

### Badges con Colores Semánticos
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="accent">Accent</Badge>      // Azul
<Badge variant="success">Éxito</Badge>      // Verde
<Badge variant="warning">Advertencia</Badge> // Amarillo
<Badge variant="error">Error</Badge>        // Rojo
<Badge variant="outline">Outline</Badge>     // Solo borde
```

## ✨ Características del Diseño Attio

### Tipografía Moderna
- **H1**: `text-4xl font-semibold` - Títulos principales
- **H2**: `text-3xl font-semibold` - Subtítulos
- **H3**: `text-2xl font-semibold` - Encabezados de sección
- **H4**: `text-xl font-medium` - Encabezados menores
- **Body**: `font-medium` - Texto regular
- **Letter-spacing**: `-0.025em` - Espaciado optimizado

### Sombras Sutiles
```css
shadow-attio: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-attio-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
shadow-attio-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
shadow-attio-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
shadow-attio-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

### Bordes Elegantes
- **Estándar**: `border-neutral-200 dark:border-neutral-700`
- **Hover**: `border-neutral-300 dark:border-neutral-600`
- **Activo**: `border-accent-600`
- **Radio**: `rounded-xl` (12px) para suavidad

### Espaciado Consistente
- **Padding**: `px-6 py-4` en tarjetas
- **Gaps**: `gap-4` entre elementos
- **Margins**: `space-y-8` entre secciones
- **Padding general**: `p-6` en contenido principal

## 🎭 Estados y Interacciones

### Hover Effects Elegantes
```css
.attio-hover-lift: hover:-translate-y-1    /* Elevación sutil */
.attio-hover-scale: hover:scale-105       /* Escala casi imperceptible */
```

### Transiciones Suaves
- **Duración**: `duration-200` (200ms)
- **Easing**: `ease-out` para naturalidad
- **Propiedades**: `transition-all` para fluidez

### Focus States Modernos
```css
focus:ring-2 ring-accent-500 ring-offset-2
```

## 🌙 Modo Oscuro

El sistema está optimizado para modo oscuro con:
- **Fondo**: `neutral-900` (negro suave)
- **Texto**: `neutral-100` (blanco suave)
- **Bordes**: `neutral-700` (gris oscuro)
- **Acentos**: Azul con opacidad reducida

## 📱 Layout Attio

### Estructura Principal
- **Sidebar**: Navegación lateral con logo y menú
- **Header**: Barra superior con título y controles
- **Main Content**: Área principal de contenido
- **Paneles Laterales**: Para información adicional

### Sidebar Attio
- **Logo**: Icono azul con texto CLINESA
- **Navegación**: Enlaces con iconos y estados activos
- **Perfil de Usuario**: Avatar con información básica
- **Estado de Conexión**: Indicador verde de actividad

## 🎯 Principios de Diseño Attio

1. **Simplicidad**: Diseño limpio sin elementos innecesarios
2. **Funcionalidad**: Cada elemento tiene un propósito claro
3. **Consistencia**: Sistema unificado en toda la aplicación
4. **Modernidad**: Interfaz contemporánea y profesional
5. **Accesibilidad**: Contraste adecuado y navegación por teclado
6. **Performance**: Animaciones optimizadas y componentes ligeros

## 🚀 Uso

```tsx
import { ShowcasePage } from '@/pages/ShowcasePage'

// Ver el showcase completo del nuevo diseño
<Route path="/showcase" element={<ShowcasePage />} />
```

## 🔧 Personalización

### Modificar Colores
```javascript
// En tailwind.config.js
accent: {
  500: '#3b82f6',  // Cambiar azul principal
  600: '#2563eb',  // Cambiar azul hover
}
```

### Ajustar Espaciado
```css
/* En index.css */
.attio-card {
  @apply px-8 py-6;  /* Aumentar padding */
}
```

### Modificar Tipografía
```css
h1 { @apply text-5xl font-bold; }  /* Más grande y bold */
```

## 📱 Responsive Design

- **Móvil**: Sidebar colapsable, elementos apilados
- **Tablet**: Grid de 2 columnas, sidebar fijo
- **Desktop**: Grid de 3+ columnas, layout completo
- **Pantallas grandes**: Contenido centrado con márgenes amplios

---

*Sistema de diseño completamente rediseñado inspirado en Attio con esquema básico de colores y interfaz moderna.*
