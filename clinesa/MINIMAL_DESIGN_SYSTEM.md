# Sistema Visual Ultra Minimalista

Un sistema de diseño completamente minimalista con colores cálidos terciarios y una paleta principal de blancos y negros.

## 🎨 Filosofía de Diseño

- **Ultra Minimalismo**: Máxima simplicidad visual
- **Colores Cálidos**: Terciarios cálidos como acentos sutiles
- **Blanco y Negro**: Paleta principal monocromática
- **Tipografía Ligera**: Pesos de fuente reducidos para elegancia
- **Espaciado Generoso**: Respiración visual máxima
- **Bordes Sutiles**: Bordes casi imperceptibles pero presentes

## 🎯 Paleta de Colores

### Colores Principales (Monocromáticos)
```css
primary-0: #ffffff      /* Blanco puro */
primary-50: #fefefe     /* Blanco casi puro */
primary-100: #fdfdfd    /* Blanco suave */
primary-200: #fafafa    /* Gris muy claro */
primary-300: #f5f5f5    /* Gris claro */
primary-400: #f0f0f0    /* Gris medio-claro */
primary-500: #e5e5e5    /* Gris medio */
primary-600: #d4d4d4    /* Gris medio-oscuro */
primary-700: #a3a3a3    /* Gris oscuro */
primary-800: #737373    /* Gris muy oscuro */
primary-900: #404040    /* Casi negro */
primary-950: #262626    /* Negro suave */
primary-1000: #000000   /* Negro puro */
```

### Colores Terciarios Cálidos
```css
warm-50: #fef7f0       /* Warm muy claro */
warm-500: #f29a64      /* Warm principal */
warm-600: #e88545      /* Warm oscuro */

terracotta-50: #fdf4f0 /* Terracotta muy claro */
terracotta-500: #eb9164 /* Terracotta principal */
terracotta-600: #d17b4a /* Terracotta oscuro */

beige-50: #fefcf9      /* Beige muy claro */
beige-500: #f5e1c3     /* Beige principal */
beige-600: #e6c8a0     /* Beige oscuro */
```

## 🧩 Componentes

### Botones Ultra Minimalistas
```tsx
<Button variant="primary">Primario</Button>      // Negro/Blanco
<Button variant="secondary">Secundario</Button>  // Gris claro
<Button variant="outline">Outline</Button>       // Solo borde
<Button variant="ghost">Ghost</Button>           // Transparente
<Button variant="warm">Warm</Button>              // Color cálido
<Button variant="danger">Peligro</Button>         // Terracotta
```

### Tarjetas Minimalistas
```tsx
<Card>                    // Tarjeta estándar
<Card interactive>        // Con efectos hover sutiles
```

### Badges con Colores Cálidos
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="warm">Warm</Badge>
<Badge variant="terracotta">Terracotta</Badge>
<Badge variant="beige">Beige</Badge>
<Badge variant="outline">Outline</Badge>
```

## ✨ Características del Diseño

### Tipografía Ultra Ligera
- **H1**: `text-4xl font-light` - Títulos principales
- **H2**: `text-3xl font-light` - Subtítulos
- **H3**: `text-2xl font-light` - Encabezados de sección
- **H4**: `text-xl font-normal` - Encabezados menores
- **Body**: `font-normal` - Texto regular
- **Letter-spacing**: `-0.02em` - Espaciado optimizado

### Sombras Imperceptibles
```css
shadow-minimal: 0 1px 1px 0 rgba(0, 0, 0, 0.02)
shadow-minimal-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03)
shadow-minimal-md: 0 2px 4px 0 rgba(0, 0, 0, 0.04)
shadow-warm: 0 1px 2px 0 rgba(242, 154, 100, 0.1)
```

### Bordes Sutiles
- **Estándar**: `border-primary-200 dark:border-primary-800`
- **Hover**: `border-warm-300 dark:border-warm-700`
- **Activo**: `border-warm-500`
- **Radio**: `rounded-md` (6px) para suavidad

### Espaciado Generoso
- **Padding**: `px-6 py-6` en tarjetas
- **Gaps**: `gap-6` entre elementos
- **Margins**: `space-y-12` entre secciones
- **Padding general**: `p-8` en contenido principal

## 🎭 Estados y Interacciones

### Hover Effects Sutiles
```css
.minimal-hover-lift: hover:-translate-y-0.5    /* Elevación mínima */
.minimal-hover-scale: hover:scale-102          /* Escala casi imperceptible */
```

### Transiciones Suaves
- **Duración**: `duration-200` (200ms)
- **Easing**: `ease-out` para naturalidad
- **Propiedades**: `transition-all` para fluidez

### Focus States Minimalistas
```css
focus:ring-1 ring-warm-500 ring-offset-1
```

## 🌙 Modo Oscuro

El sistema está optimizado para modo oscuro con:
- **Fondo**: `primary-1000` (negro puro)
- **Texto**: `primary-0` (blanco puro)
- **Bordes**: `primary-800` (gris muy oscuro)
- **Acentos**: Colores cálidos con opacidad reducida

## 📱 Responsive Design

- **Móvil**: Espaciado reducido, elementos apilados
- **Tablet**: Grid de 2 columnas
- **Desktop**: Grid de 3+ columnas, espaciado generoso
- **Pantallas grandes**: Contenido centrado con márgenes amplios

## 🎯 Principios de Diseño

1. **Menos es Más**: Cada elemento debe tener propósito
2. **Respiración Visual**: Espaciado generoso en todo
3. **Contraste Sutil**: Diferencias mínimas pero efectivas
4. **Colores Cálidos**: Acentos terciarios para calidez
5. **Tipografía Ligera**: Pesos reducidos para elegancia
6. **Interacciones Sutiles**: Animaciones casi imperceptibles

## 🚀 Uso

```tsx
import { ShowcasePage } from '@/pages/ShowcasePage'

// Ver el showcase completo
<Route path="/showcase" element={<ShowcasePage />} />
```

## 🔧 Personalización

### Modificar Colores Cálidos
```javascript
// En tailwind.config.js
warm: {
  500: '#f29a64',  // Cambiar color principal
  600: '#e88545',  // Cambiar color hover
}
```

### Ajustar Espaciado
```css
/* En index.css */
.minimal-card {
  @apply px-8 py-8;  /* Aumentar padding */
}
```

### Modificar Tipografía
```css
h1 { @apply text-5xl font-thin; }  /* Más ligero */
```

---

*Sistema de diseño ultra minimalista con colores cálidos terciarios y máxima simplicidad visual.*
