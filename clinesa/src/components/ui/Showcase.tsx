import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'
import { Avatar, AvatarGroup } from './Avatar'
import { MetricCard, MetricGrid, ProgressMetric } from './MetricCard'
import { DataTable } from './DataTable'
import { Skeleton, SkeletonCard, SkeletonText } from './Skeleton'
import { AnimatedContainer, StaggeredContainer, HoverCard, LoadingDots } from './AnimatedContainer'
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Activity,
  Star,
  Heart,
  Zap
} from 'lucide-react'

// Sample data for demonstration
const sampleUsers = [
  { id: 1, name: 'Dr. María García', email: 'maria@clinesa.com', role: 'Médico', status: 'active' },
  { id: 2, name: 'Dr. Carlos López', email: 'carlos@clinesa.com', role: 'Especialista', status: 'active' },
  { id: 3, name: 'Dra. Ana Martínez', email: 'ana@clinesa.com', role: 'Pediatra', status: 'inactive' },
]

const columns = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Rol', sortable: true },
  { 
    key: 'status', 
    header: 'Estado', 
    render: (value: string) => (
      <Badge variant={value === 'active' ? 'success' : 'default'}>
        {value === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  },
]

export function Showcase() {
  return (
    <div className="section-spacing-large">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-normal text-primary-1000 dark:text-primary-0">
          Sistema Visual Básico
        </h1>
        <p className="text-base text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
          Un sistema de diseño con colores básicos (negro, gris, blanco) y separaciones sutiles entre apartados.
        </p>
      </div>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Botones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Peligro</Button>
            <Button variant="primary" loading>Cargando</Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Éxito</Badge>
            <Badge variant="warning">Advertencia</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card interactive>
          <CardHeader>
            <CardTitle>Tarjeta Interactiva</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Esta tarjeta tiene efectos hover y es clickeable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarjeta Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Una tarjeta estándar con el nuevo diseño.
            </p>
          </CardContent>
        </Card>

        <HoverCard
          hoverContent={
            <div className="space-y-2">
              <h4 className="font-medium">Información adicional</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Contenido que aparece al hacer hover.
              </p>
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Tarjeta con Hover</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pasa el mouse sobre esta tarjeta.
              </p>
            </CardContent>
          </Card>
        </HoverCard>
      </div>

      {/* Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricGrid>
            <MetricCard
              title="Pacientes Totales"
              value="1,234"
              change={{ value: 12, type: 'increase' }}
              icon={<Users className="w-5 h-5" />}
              description="Últimos 30 días"
            />
            <MetricCard
              title="Citas Hoy"
              value="28"
              change={{ value: 5, type: 'increase' }}
              icon={<Calendar className="w-5 h-5" />}
              description="Programadas"
            />
            <MetricCard
              title="Historiales"
              value="456"
              change={{ value: 2, type: 'decrease' }}
              icon={<FileText className="w-5 h-5" />}
              description="Este mes"
            />
            <MetricCard
              title="Crecimiento"
              value="+18%"
              change={{ value: 8, type: 'increase' }}
              icon={<TrendingUp className="w-5 h-5" />}
              description="Comparado al mes anterior"
            />
          </MetricGrid>
        </CardContent>
      </Card>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressMetric
          title="Capacidad del Sistema"
          value={75}
          max={100}
          unit="%"
        />
        <ProgressMetric
          title="Uso de Almacenamiento"
          value={2.4}
          max={10}
          unit="GB"
        />
      </div>

      {/* Avatars Section */}
      <Card>
        <CardHeader>
          <CardTitle>Avatares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar size="sm" fallback="MG" />
              <Avatar size="md" fallback="CL" />
              <Avatar size="lg" fallback="AM" />
              <Avatar size="xl" fallback="JS" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Grupo de Avatares</h4>
              <AvatarGroup max={3}>
                <Avatar fallback="MG" />
                <Avatar fallback="CL" />
                <Avatar fallback="AM" />
                <Avatar fallback="JS" />
                <Avatar fallback="AB" />
              </AvatarGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sampleUsers}
            columns={columns}
            onRowClick={(row) => console.log('Clicked:', row)}
          />
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Estados de Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Skeleton Text</h4>
              <SkeletonText lines={3} />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Skeleton Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Loading Dots</h4>
              <LoadingDots />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Animaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <StaggeredContainer staggerDelay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedContainer animation="fade-in">
                <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-accent-600" />
                  <h4 className="font-medium">Fade In</h4>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Slide Up</h4>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="scale-in">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <h4 className="font-medium">Scale In</h4>
                </div>
              </AnimatedContainer>
            </div>
          </StaggeredContainer>
        </CardContent>
      </Card>
    </div>
  )
}
