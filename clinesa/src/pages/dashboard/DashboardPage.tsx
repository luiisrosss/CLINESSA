import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
// import { useMonitoring } from '@/hooks/useMonitoring'
import { PlanUsageWidget } from '@/components/dashboard/PlanUsageWidget'
import { PatientMetricsTable, mockPatientMetrics } from '@/components/dashboard/PatientMetricsTable'
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
    <motion.div
      className={cn("notion-card p-6", className)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-normal text-primary-600 dark:text-primary-400 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2 mb-1">
            <p className="text-2xl font-normal text-primary-1000 dark:text-primary-0">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-normal px-1.5 py-0.5 rounded",
                trend.isPositive ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900" : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="text-xs text-primary-500 dark:text-primary-500">{description}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-md">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </motion.div>
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
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full p-4 text-left notion-card hover:shadow-notion-md transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-md">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-1000 dark:text-primary-0">{title}</p>
          <p className="text-xs text-primary-500 dark:text-primary-500 mt-1">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-primary-400" />
      </div>
    </motion.button>
  )
}

export function DashboardPage() {
  const { userProfile, isDoctor, canManagePatients } = useAuth()
  const { stats, todayAppointments, loading, error } = useDashboard()
  // const { trackPageView, trackFeatureUsage } = useMonitoring()
  const navigate = useNavigate()

  // Track page view
  // useEffect(() => {
  //   trackPageView('Dashboard', {
  //     userRole: userProfile?.role,
  //   })
  // }, [trackPageView, userProfile?.role])
  
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
      onClick: () => navigate('/app/appointments'),
      disabled: false
    },
    {
      title: 'Nuevo Paciente',
      description: 'Registrar nuevo paciente',
      icon: Users,
      onClick: () => navigate('/app/patients'),
      disabled: !canManagePatients
    },
    {
      title: 'Historial Médico',
      description: 'Crear nuevo historial',
      icon: FileText,
      onClick: () => navigate('/app/medical-records'),
      disabled: !isDoctor
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes',
      icon: TrendingUp,
      onClick: () => navigate('/app/settings'),
      disabled: false
    }
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        className="notion-card p-6 bg-primary-1000 dark:bg-primary-0"
        {...fadeInUp}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-primary-0 dark:text-primary-1000 mb-2">
              {greeting}, {userProfile?.first_name}
            </h1>
            <p className="text-primary-200 dark:text-primary-800">
              Tienes {stats.appointmentsToday} citas programadas para hoy
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-primary-200 dark:text-primary-800">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Sistema activo</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statsCards.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div 
          className="xl:col-span-1"
          {...fadeInUp}
        >
          <div className="notion-card p-6">
            <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
              Acciones Rápidas
            </h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-6">
              Accede a las funciones más utilizadas
            </p>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <QuickAction {...action} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Plan Usage Widget */}
        <motion.div 
          className="xl:col-span-1"
          {...fadeInUp}
        >
          <PlanUsageWidget />
        </motion.div>

        {/* Today's Appointments */}
        <motion.div 
          className="xl:col-span-1"
          {...fadeInUp}
        >
          <div className="notion-card p-6">
            <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
              Citas de Hoy
            </h2>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-6">
              Próximas citas programadas
            </p>
            
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment, index) => (
                  <motion.div 
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-md border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="text-center flex-shrink-0">
                        <p className="text-sm font-medium text-primary-1000 dark:text-primary-0">
                          {appointment.time}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary-1000 dark:text-primary-0 truncate">
                          {appointment.patient_name || 'Paciente sin nombre'}
                        </p>
                        <p className="text-xs text-primary-500 dark:text-primary-500 truncate">
                          {appointment.type}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-normal whitespace-nowrap",
                      appointment.status === 'confirmed' 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : appointment.status === 'completed'
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : appointment.status === 'cancelled'
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    )}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 
                       appointment.status === 'completed' ? 'Completada' :
                       appointment.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                    </span>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Calendar className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                  <p className="text-primary-500">No hay citas programadas para hoy</p>
                </motion.div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-primary-200 dark:border-primary-800">
              <button 
                className="notion-button-outline w-full flex items-center justify-center"
                onClick={() => navigate('/app/appointments')}
              >
                Ver todas las citas
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Patient Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <PatientMetricsTable
          patients={mockPatientMetrics}
          loading={loading}
          onPatientClick={(patient) => {
            console.log('Patient clicked:', patient)
            // Navigate to patient details
            navigate(`/app/patients?id=${patient.id}`)
          }}
          onViewDetails={(patient) => {
            console.log('View details for:', patient)
            // Navigate to patient details modal
            navigate(`/app/patients?id=${patient.id}&tab=details`)
          }}
        />
      </motion.div>

      {/* Alerts/Notifications */}
      <motion.div 
        className="notion-card p-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Recordatorio: Paciente María González tiene alergia a la penicilina
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Cita programada a las 09:30
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}