import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  Filter, 
  RefreshCw,
  Eye,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Target,
  DollarSign
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { useAppointments } from '@/hooks/useAppointments'
import { useMedicalRecords } from '@/hooks/useMedicalRecords'
import { useUsers } from '@/hooks/useUsers'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface ReportData {
  patients: {
    total: number
    newThisMonth: number
    active: number
    inactive: number
  }
  appointments: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    confirmed: number
    pending: number
    cancelled: number
  }
  medicalRecords: {
    total: number
    thisMonth: number
    byType: Record<string, number>
  }
  users: {
    total: number
    active: number
    byRole: Record<string, number>
  }
  revenue: {
    thisMonth: number
    thisYear: number
    averagePerAppointment: number
  }
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export function ReportsPage() {
  const { organization } = useAuth()
  const { patients } = usePatients()
  const { appointments } = useAppointments()
  const { medicalRecords } = useMedicalRecords()
  const { users } = useUsers()
  
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate report data
  useEffect(() => {
    const calculateReports = async () => {
      try {
        setLoading(true)
        
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Calculate patient statistics
        const newPatientsThisMonth = patients.filter(p => 
          new Date(p.created_at) >= startOfMonth
        ).length

        const activePatients = patients.filter(p => !p.deleted_at).length
        const inactivePatients = patients.filter(p => p.deleted_at).length

        // Calculate appointment statistics
        const todayAppointments = appointments.filter(a => {
          const appointmentDate = new Date(a.appointment_date)
          return appointmentDate.toDateString() === now.toDateString()
        }).length

        const weekAppointments = appointments.filter(a => 
          new Date(a.appointment_date) >= startOfWeek
        ).length

        const monthAppointments = appointments.filter(a => 
          new Date(a.appointment_date) >= startOfMonth
        ).length

        const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
        const pendingAppointments = appointments.filter(a => a.status === 'pending').length
        const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length

        // Calculate medical records statistics
        const recordsThisMonth = medicalRecords.filter(r => 
          new Date(r.created_at) >= startOfMonth
        ).length

        const recordsByType = medicalRecords.reduce((acc, record) => {
          acc[record.type] = (acc[record.type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Calculate user statistics
        const activeUsers = users.filter(u => u.status === 'active').length
        const usersByRole = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Calculate revenue (mock data for now)
        const revenueThisMonth = monthAppointments * 150 // Mock: $150 per appointment
        const revenueThisYear = appointments.length * 150
        const averagePerAppointment = appointments.length > 0 ? revenueThisYear / appointments.length : 0

        setReportData({
          patients: {
            total: patients.length,
            newThisMonth: newPatientsThisMonth,
            active: activePatients,
            inactive: inactivePatients
          },
          appointments: {
            total: appointments.length,
            today: todayAppointments,
            thisWeek: weekAppointments,
            thisMonth: monthAppointments,
            confirmed: confirmedAppointments,
            pending: pendingAppointments,
            cancelled: cancelledAppointments
          },
          medicalRecords: {
            total: medicalRecords.length,
            thisMonth: recordsThisMonth,
            byType: recordsByType
          },
          users: {
            total: users.length,
            active: activeUsers,
            byRole: usersByRole
          },
          revenue: {
            thisMonth: revenueThisMonth,
            thisYear: revenueThisYear,
            averagePerAppointment: averagePerAppointment
          }
        })
      } catch (error) {
        console.error('Error calculating reports:', error)
        toast.error('Error al calcular los reportes')
      } finally {
        setLoading(false)
      }
    }

    calculateReports()
  }, [patients, appointments, medicalRecords, users])

  // Export reports to CSV
  const exportReports = () => {
    if (!reportData) return

    const csvData = [
      ['Métrica', 'Valor'],
      ['Total Pacientes', reportData.patients.total],
      ['Pacientes Nuevos (Mes)', reportData.patients.newThisMonth],
      ['Pacientes Activos', reportData.patients.active],
      ['Total Citas', reportData.appointments.total],
      ['Citas Hoy', reportData.appointments.today],
      ['Citas Esta Semana', reportData.appointments.thisWeek],
      ['Citas Este Mes', reportData.appointments.thisMonth],
      ['Citas Confirmadas', reportData.appointments.confirmed],
      ['Citas Pendientes', reportData.appointments.pending],
      ['Citas Canceladas', reportData.appointments.cancelled],
      ['Total Historiales', reportData.medicalRecords.total],
      ['Historiales Este Mes', reportData.medicalRecords.thisMonth],
      ['Total Usuarios', reportData.users.total],
      ['Usuarios Activos', reportData.users.active],
      ['Ingresos Este Mes', `$${reportData.revenue.thisMonth.toLocaleString()}`],
      ['Ingresos Este Año', `$${reportData.revenue.thisYear.toLocaleString()}`],
      ['Promedio por Cita', `$${reportData.revenue.averagePerAppointment.toFixed(2)}`]
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reportes_clinesa_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Reportes exportados correctamente')
  }

  // Refresh reports
  const refreshReports = () => {
    setLoading(true)
    // Trigger recalculation
    setTimeout(() => {
      setLoading(false)
      toast.success('Reportes actualizados')
    }, 1000)
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'medical', label: 'Historiales', icon: FileText },
    { id: 'revenue', label: 'Ingresos', icon: DollarSign },
  ]

  const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '1y', label: 'Último año' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Reportes y Estadísticas</h1>
            <p className="text-primary-600 dark:text-primary-400 mt-1">
              Análisis completo de datos y métricas del sistema
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={refreshReports}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={exportReports}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="notion-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Período
              </label>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
                options={dateRangeOptions}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Tipo de Gráfico
              </label>
              <Select
                value={chartType}
                onValueChange={(value: 'bar' | 'pie' | 'line') => setChartType(value)}
                options={[
                  { value: 'bar', label: 'Barras' },
                  { value: 'pie', label: 'Circular' },
                  { value: 'line', label: 'Líneas' },
                ]}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors flex items-center space-x-1 ${
                showFilters 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' 
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtros Avanzados</span>
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <motion.div 
            className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Organización
                </label>
                <input
                  type="text"
                  value={organization?.name || ''}
                  disabled
                  className="notion-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  className="notion-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  className="notion-input"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="notion-card p-4">
            <nav className="space-y-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-900 dark:hover:text-primary-100'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 2 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && reportData && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="notion-card p-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Total Pacientes</p>
                          <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{reportData.patients.total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="notion-card p-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded">
                          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Citas Este Mes</p>
                          <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{reportData.appointments.thisMonth}</p>
                        </div>
                      </div>
                    </div>

                    <div className="notion-card p-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Historiales</p>
                          <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">{reportData.medicalRecords.total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="notion-card p-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded">
                          <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-normal text-primary-600 dark:text-primary-400">Ingresos Mes</p>
                          <p className="text-xl font-normal text-primary-1000 dark:text-primary-0">${reportData.revenue.thisMonth.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts Placeholder */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="notion-card p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                          Citas por Estado
                        </h3>
                      </div>
                      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Gráfico de barras</p>
                          <p className="text-xs text-gray-400">Confirmadas: {reportData.appointments.confirmed}</p>
                          <p className="text-xs text-gray-400">Pendientes: {reportData.appointments.pending}</p>
                          <p className="text-xs text-gray-400">Canceladas: {reportData.appointments.cancelled}</p>
                        </div>
                      </div>
                    </div>

                    <div className="notion-card p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <PieChart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                          Usuarios por Rol
                        </h3>
                      </div>
                      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Gráfico circular</p>
                          {Object.entries(reportData.users.byRole).map(([role, count]) => (
                            <p key={role} className="text-xs text-gray-400">
                              {role}: {count}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'patients' && reportData && (
              <motion.div
                key="patients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Estadísticas de Pacientes
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                        {reportData.patients.total}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Nuevos (Mes)</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                        {reportData.patients.newThisMonth}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Activos</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                        {reportData.patients.active}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Inactivos</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        {reportData.patients.inactive}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appointments' && reportData && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Estadísticas de Citas
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                        {reportData.appointments.total}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Hoy</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                        {reportData.appointments.today}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Confirmadas</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                        {reportData.appointments.confirmed}
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pendientes</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
                        {reportData.appointments.pending}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'medical' && reportData && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Estadísticas de Historiales Médicos
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Historiales</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {reportData.medicalRecords.total}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {reportData.medicalRecords.thisMonth} este mes
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Por Tipo</span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(reportData.medicalRecords.byType).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-green-700 dark:text-green-300 capitalize">{type}</span>
                            <span className="text-sm font-medium text-green-900 dark:text-green-100">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'revenue' && reportData && (
              <motion.div
                key="revenue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Estadísticas de Ingresos
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Este Mes</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                        ${reportData.revenue.thisMonth.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Este Año</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                        ${reportData.revenue.thisYear.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Promedio/Cita</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                        ${reportData.revenue.averagePerAppointment.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
