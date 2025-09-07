# Sistema de Diseño Attio

Un sistema de diseño minimalista inspirado en [Attio](https://attio.com) con animaciones sutiles y bordes elegantes.

## 🎨 Características Principales

- **Minimalista**: Diseño limpio y funcional
- **Animaciones sutiles**: Transiciones suaves y micro-interacciones
- **Bordes elegantes**: Bordes redondeados y sombras sutiles
- **Tipografía refinada**: Inter con espaciado de letras optimizado
- **Modo oscuro**: Soporte completo para tema oscuro
- **Responsive**: Diseño adaptable a todos los dispositivos

## 🎯 Paleta de Colores

### Colores Principales
- **Primary**: Grises neutros para elementos principales
- **Accent**: Azul para elementos de acción y destacados
- **Neutral**: Escala de grises para texto y fondos

### Colores Semánticos
- **Success**: Verde para estados positivos
- **Warning**: Amarillo para advertencias
- **Error**: Rojo para errores y estados críticos

## 🧩 Componentes

### Botones
```tsx
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Peligro</Button>
```

### Tarjetas
```tsx
<Card interactive>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
</Card>
```

### Badges
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Éxito</Badge>
<Badge variant="warning">Advertencia</Badge>
<Badge variant="error">Error</Badge>
```

### Métricas
```tsx
<MetricCard
  title="Pacientes Totales"
  value="1,234"
  change={{ value: 12, type: 'increase' }}
  icon={<Users className="w-5 h-5" />}
  description="Últimos 30 días"
/>
```

### Tablas de Datos
```tsx
<DataTable
  data={data}
  columns={columns}
  onRowClick={(row) => console.log(row)}
  loading={false}
/>
```

### Avatares
```tsx
<Avatar size="md" fallback="MG" />
<AvatarGroup max={3}>
  <Avatar fallback="MG" />
  <Avatar fallback="CL" />
  <Avatar fallback="AM" />
</AvatarGroup>
```

## ✨ Animaciones

### Contenedores Animados
```tsx
<AnimatedContainer animation="fade-in" delay={100}>
  <div>Contenido animado</div>
</AnimatedContainer>

<StaggeredContainer staggerDelay={100}>
  <div>Elemento 1</div>
  <div>Elemento 2</div>
  <div>Elemento 3</div>
</StaggeredContainer>
```

### Efectos Hover
```tsx
<HoverCard hoverContent={<div>Información adicional</div>}>
  <Card>Tarjeta con hover</Card>
</HoverCard>
```

## 🎭 Estados de Carga

### Skeleton Loading
```tsx
<Skeleton className="h-4 w-full" />
<SkeletonText lines={3} />
<SkeletonCard />
```

### Loading Dots
```tsx
<LoadingDots />
```

## 🎨 Clases CSS Personalizadas

### Tarjetas
- `.attio-card`: Tarjeta estándar
- `.attio-card-interactive`: Tarjeta con efectos hover

### Botones
- `.attio-button-primary`: Botón primario
- `.attio-button-secondary`: Botón secundario
- `.attio-button-ghost`: Botón fantasma

### Efectos Hover
- `.attio-hover-lift`: Elevación al hacer hover
- `.attio-hover-scale`: Escala al hacer hover

### Sombras
- `.shadow-attio`: Sombra sutil
- `.shadow-attio-sm`: Sombra pequeña
- `.shadow-attio-md`: Sombra media
- `.shadow-attio-lg`: Sombra grande
- `.shadow-attio-xl`: Sombra extra grande

## 🎯 Principios de Diseño

1. **Simplicidad**: Menos es más
2. **Consistencia**: Elementos uniformes en toda la aplicación
3. **Accesibilidad**: Contraste adecuado y navegación por teclado
4. **Performance**: Animaciones optimizadas y componentes ligeros
5. **Flexibilidad**: Sistema adaptable a diferentes contextos

## 🚀 Uso

Para ver el showcase completo del sistema de diseño, visita la página de demostración:

```tsx
import { ShowcasePage } from '@/pages/ShowcasePage'

// En tu router
<Route path="/showcase" element={<ShowcasePage />} />
```

## 📱 Responsive Design

El sistema está diseñado para funcionar perfectamente en:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1280px+)

## 🌙 Modo Oscuro

El sistema incluye soporte completo para modo oscuro con:
- Colores adaptativos automáticos
- Contraste optimizado
- Transiciones suaves entre temas

## 🔧 Personalización

Puedes personalizar el sistema modificando:
- `tailwind.config.js`: Colores, espaciado, animaciones
- `src/index.css`: Clases CSS personalizadas
- Componentes individuales: Props y variantes

---

*Inspirado en el diseño elegante y minimalista de [Attio](https://attio.com)*
