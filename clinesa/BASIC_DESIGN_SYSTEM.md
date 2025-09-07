# Sistema Visual Básico - Negro, Gris, Blanco

Un sistema de diseño con colores básicos (negro, gris, blanco) y separaciones sutiles entre apartados.

## 🎨 Filosofía de Diseño Básico

- **Colores Básicos**: Solo negro, gris y blanco como colores principales
- **Separaciones Sutiles**: Líneas divisorias discretas entre secciones
- **Toques de Color Mínimos**: Pequeños acentos de color solo cuando sea necesario
- **Simplicidad Visual**: Máxima reducción de elementos visuales
- **Funcionalidad**: Cada elemento tiene un propósito específico

## 🎯 Paleta de Colores Básicos

### Colores Principales
```css
/* Escala monocromática básica */
primary-0: #ffffff      /* Blanco puro */
primary-50: #fafafa     /* Gris muy claro */
primary-100: #f5f5f5    /* Gris claro */
primary-200: #e5e5e5    /* Gris claro */
primary-300: #d4d4d4    /* Gris medio-claro */
primary-400: #a3a3a3    /* Gris medio */
primary-500: #737373    /* Gris medio */
primary-600: #525252    /* Gris medio-oscuro */
primary-700: #404040    /* Gris oscuro */
primary-800: #262626    /* Gris muy oscuro */
primary-900: #171717    /* Casi negro */
primary-1000: #000000   /* Negro puro */
```

### Toques de Color Mínimos
```css
/* Solo cuando sea necesario */
accent-100: #e0f2fe     /* Azul muy sutil */
accent-600: #0284c7     /* Azul para elementos especiales */
green-100: #dcfce7      /* Verde para éxito */
green-600: #16a34a      /* Verde para confirmaciones */
yellow-100: #fef3c7     /* Amarillo para advertencias */
yellow-600: #d97706     /* Amarillo para alertas */
red-100: #fee2e2        /* Rojo para errores */
red-600: #dc2626        /* Rojo para acciones críticas */
```

## 🧩 Componentes con Separaciones Sutiles

### Separaciones entre Secciones
```css
.section-divider {
  @apply border-t border-primary-200 dark:border-primary-800 my-4;
}

.section-divider-thick {
  @apply border-t border-primary-300 dark:border-primary-700 my-6;
}

.section-spacing {
  @apply space-y-4;
}

.section-spacing-large {
  @apply space-y-6;
}
```

### Botones Básicos
```tsx
<Button variant="primary">Primario</Button>      // Negro/blanco sólido
<Button variant="secondary">Secundario</Button>  // Gris claro
<Button variant="outline">Outline</Button>       // Solo borde sutil
<Button variant="ghost">Ghost</Button>          // Transparente
<Button variant="danger">Peligro</Button>        // Rojo solo para acciones críticas
```

### Tarjetas con Separaciones
```tsx
<Card>                    // Tarjeta estándar con bordes sutiles
<Card interactive>        // Con efectos hover mínimos
```

### Badges con Colores Mínimos
```tsx
<Badge variant="default">Default</Badge>        // Gris básico
<Badge variant="accent">Accent</Badge>          // Azul sutil
<Badge variant="success">Éxito</Badge>          // Verde solo para éxito
<Badge variant="warning">Advertencia</Badge>     // Amarillo solo para alertas
<Badge variant="error">Error</Badge>            // Rojo solo para errores
<Badge variant="outline">Outline</Badge>         // Solo borde
```

## ✨ Características del Diseño Básico

### Tipografía Básica
- **H1**: `text-3xl font-normal` - Títulos principales
- **H2**: `text-2xl font-normal` - Subtítulos
- **H3**: `text-xl font-normal` - Encabezados de sección
- **H4**: `text-lg font-normal` - Encabezados menores
- **Body**: `font-normal` - Texto regular
- **Letter-spacing**: `-0.01em` - Espaciado mínimo

### Sombras Ultra Sutiles
```css
shadow-notion: 0 1px 1px 0 rgba(0, 0, 0, 0.02)
shadow-notion-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03)
shadow-notion-md: 0 2px 4px 0 rgba(0, 0, 0, 0.04)
shadow-notion-lg: 0 4px 8px 0 rgba(0, 0, 0, 0.05)
shadow-notion-xl: 0 8px 16px 0 rgba(0, 0, 0, 0.06)
```

### Bordes Sutiles
- **Estándar**: `border-primary-200 dark:border-primary-800`
- **Hover**: `border-primary-300 dark:border-primary-700`
- **Activo**: `border-primary-600`
- **Radio**: `rounded-md` (6px) para suavidad mínima

### Espaciado Compacto
- **Padding**: `px-4 py-3` en tarjetas
- **Gaps**: `gap-4` entre elementos
- **Margins**: `space-y-6` entre secciones
- **Padding general**: `p-4` en contenido principal

## 🎭 Estados y Interacciones Sutiles

### Hover Effects Mínimos
```css
.notion-hover-lift: hover:-translate-y-0.5    /* Elevación casi imperceptible */
.notion-hover-scale: hover:scale-102         /* Escala mínima */
```

### Transiciones Ultra Rápidas
- **Duración**: `duration-150` (150ms)
- **Easing**: `ease-out` para naturalidad
- **Propiedades**: `transition-all` para fluidez

### Focus States Sutiles
```css
focus:ring-1 ring-primary-600 ring-offset-1
```

## 🌙 Modo Oscuro Básico

El sistema está optimizado para modo oscuro con:
- **Fondo**: `primary-1000` (negro puro)
- **Texto**: `primary-0` (blanco puro)
- **Bordes**: `primary-800` (gris muy oscuro)
- **Acentos**: Colores sutiles con opacidad reducida

## 📱 Layout con Separaciones Sutiles

### Estructura Principal
- **Sidebar**: Navegación lateral con separaciones entre secciones
- **Header**: Barra superior con bordes sutiles
- **Main Content**: Área principal con separaciones entre apartados
- **Separaciones**: Líneas divisorias discretas entre secciones

### Sidebar con Separaciones
- **Logo**: Icono pequeño con texto mínimo
- **Navegación**: Separación sutil entre Dashboard y otras secciones
- **Perfil de Usuario**: Separación con borde superior
- **Elementos**: Espaciado compacto con separaciones claras

### Separaciones entre Apartados
- **Dashboard**: Separación entre welcome, stats, acciones rápidas y citas
- **Pacientes**: Separación entre header, stats y lista
- **Citas**: Separación entre controles y contenido
- **Todas las páginas**: Separaciones sutiles entre secciones principales

## 🎯 Principios de Diseño Básico

1. **Colores Básicos**: Solo negro, gris y blanco
2. **Separaciones Sutiles**: Líneas divisorias discretas
3. **Toques de Color Mínimos**: Solo cuando sea necesario
4. **Simplicidad Visual**: Máxima reducción de elementos
5. **Funcionalidad**: Cada elemento tiene un propósito específico
6. **Consistencia**: Sistema unificado en toda la aplicación
7. **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🚀 Uso

```tsx
import { ShowcasePage } from '@/pages/ShowcasePage'

// Ver el showcase completo del nuevo diseño
<Route path="/showcase" element={<ShowcasePage />} />
```

## 🔧 Personalización Básica

### Modificar Separaciones
```css
/* En index.css */
.section-divider {
  @apply border-t border-primary-300 dark:border-primary-700 my-6; /* Más visible */
}
```

### Ajustar Espaciado
```css
.section-spacing-large {
  @apply space-y-8; /* Más espaciado */
}
```

### Modificar Colores Básicos
```javascript
// En tailwind.config.js
primary: {
  200: '#e0e0e0',  // Cambiar gris claro
  600: '#666666',  // Cambiar gris medio-oscuro
}
```

## 📱 Responsive Design con Separaciones

- **Móvil**: Separaciones adaptadas, elementos apilados
- **Tablet**: Separaciones consistentes, grid de 2 columnas
- **Desktop**: Separaciones completas, layout completo
- **Pantallas grandes**: Separaciones centradas con márgenes amplios

## 🎨 Ejemplos de Separaciones Sutiles

### Dashboard
```tsx
<div className="section-spacing-large">
  {/* Welcome Section */}
  <div className="bg-primary-1000 dark:bg-primary-0 rounded-md p-4">
    {/* Welcome content */}
  </div>

  {/* Section Divider */}
  <div className="section-divider"></div>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Stats cards */}
  </div>

  {/* Section Divider */}
  <div className="section-divider"></div>

  {/* Quick Actions and Appointments */}
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
    {/* Content */}
  </div>
</div>
```

### Pacientes
```tsx
<div className="section-spacing-large">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
    {/* Header content */}
  </div>

  {/* Section Divider */}
  <div className="section-divider"></div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Stats */}
  </div>

  {/* Search and List */}
  {/* Content continues */}
</div>
```

## 🔍 Características Únicas del Diseño Básico

1. **Separaciones Sutiles**: Líneas divisorias discretas entre secciones
2. **Colores Básicos**: Solo negro, gris y blanco como base
3. **Toques de Color Mínimos**: Verde, amarillo, rojo solo cuando sea necesario
4. **Espaciado Compacto**: Elementos más pequeños y espaciado reducido
5. **Tipografía Normal**: font-normal en lugar de font-bold
6. **Sombras Sutiles**: Opacidad máxima 0.06
7. **Transiciones Rápidas**: 150ms en lugar de 200ms
8. **Bordes Sutiles**: border-primary-200 en lugar de colores más visibles

## 📊 Comparación con Diseños Anteriores

### Antes (Notion)
- Colores más sutiles pero aún con acentos
- Separaciones menos visibles
- Espaciado más generoso

### Ahora (Básico)
- Solo colores básicos (negro, gris, blanco)
- Separaciones sutiles pero visibles
- Espaciado compacto
- Toques de color solo cuando sea necesario

---

*Sistema de diseño con colores básicos (negro, gris, blanco) y separaciones sutiles entre apartados.*
