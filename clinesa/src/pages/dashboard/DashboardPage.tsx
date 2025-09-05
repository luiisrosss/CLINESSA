import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { PlanUsageWidget } from '@/components/dashboard/PlanUsageWidget'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-medical-50 rounded-lg">
            <Icon className="w-6 h-6 text-medical-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
  disabled?: boolean
}

function QuickAction({ title, description, icon: Icon, onClick, disabled }: QuickActionProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="h-auto p-4 justify-start text-left hover:bg-gray-50 border border-gray-200"
    >
      <div className="flex items-center space-x-3 w-full">
        <div className="flex items-center justify-center w-10 h-10 bg-medical-100 rounded-lg">
          <Icon className="w-5 h-5 text-medical-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Button>
  )
}

export function DashboardPage() {
  const { userProfile, isDoctor, canManagePatients } = useAuth()
  const { stats, todayAppointments, loading, error } = useDashboard()
  const navigate = useNavigate()
  
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches'

  const statsCards = [
    {
      title: 'Citas Hoy',
      value: stats.appointmentsToday,
      description: `${stats.pendingAppointments} pendientes, ${stats.completedAppointments} completadas`,
      icon: Calendar,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Pacientes Activos',
      value: stats.activePatients,
      description: `${stats.newPatientsThisMonth} nuevos este mes`,
      icon: Users,
      trend: { value: 6, isPositive: true }
    },
    {
      title: 'Historiales',
      value: stats.medicalRecords,
      description: `${stats.updatedRecordsThisWeek} actualizados esta semana`,
      icon: FileText,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Tiempo Promedio',
      value: `${stats.averageConsultationTime}min`,
      description: 'Por consulta',
      icon: Clock,
      trend: { value: 3, isPositive: false }
    }
  ]

  const quickActions = [
    {
      title: 'Nueva Cita',
      description: 'Agendar cita para un paciente',
      icon: Calendar,
      onClick: () => navigate('/appointments'),
      disabled: false
    },
    {
      title: 'Nuevo Paciente',
      description: 'Registrar nuevo paciente',
      icon: Users,
      onClick: () => navigate('/patients'),
      disabled: !canManagePatients
    },
    {
      title: 'Historial Médico',
      description: 'Crear nuevo historial',
      icon: FileText,
      onClick: () => navigate('/medical-records'),
      disabled: !isDoctor
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes',
      icon: TrendingUp,
      onClick: () => navigate('/settings'),
      disabled: false
    }
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error al cargar los datos</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting}, {userProfile?.first_name}
            </h1>
            <p className="text-medical-100 mt-1">
              Tienes {stats.appointmentsToday} citas programadas para hoy
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Sistema activo</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              <CardDescription>
                Accede a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Plan Usage Widget */}
        <div className="xl:col-span-1">
          <PlanUsageWidget />
        </div>

        {/* Today's Appointments */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Citas de Hoy</CardTitle>
              <CardDescription>
                Próximas citas programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="text-center flex-shrink-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.time}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {appointment.patient_name || 'Paciente sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                          appointment.status === 'confirmed' 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : appointment.status === 'completed'
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : appointment.status === 'cancelled'
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        )}>
                          {appointment.status === 'confirmed' ? 'Confirmada' : 
                           appointment.status === 'completed' ? 'Completada' :
                           appointment.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay citas programadas para hoy</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/appointments')}
                >
                  Ver todas las citas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts/Notifications */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                Recordatorio: Paciente María González tiene alergia a la penicilina
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Cita programada a las 09:30
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}