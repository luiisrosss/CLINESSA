import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  description: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, description }: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600 dark:text-green-400'
      case 'negative': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="w-4 h-4" />
      case 'negative': return <TrendingDown className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold text-primary-1000 dark:text-primary-0 mb-1">
                {value}
              </p>
              <div className="flex items-center space-x-1">
                {getChangeIcon()}
                <span className={`text-sm font-medium ${getChangeColor()}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-xs text-primary-500 dark:text-primary-500">
                  {description}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ChartData {
  date: string
  value: number
  [key: string]: any
}

export function RealTimeMetrics() {
  const { organization } = useAuth()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicalRecords: 0,
    activeUsers: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [appointmentData, setAppointmentData] = useState<ChartData[]>([])
  const [patientData, setPatientData] = useState<ChartData[]>([])
  const [statusData, setStatusData] = useState<ChartData[]>([])

  // Fetch real-time metrics
  const fetchMetrics = async () => {
    if (!organization?.id) return

    try {
      setLoading(true)

      // Fetch basic counts
      const [patientsResult, appointmentsResult, medicalRecordsResult, usersResult] = await Promise.all([
        supabase
          .from('patients')
          .select('id, created_at')
          .eq('organization_id', organization.id),
        
        supabase
          .from('appointments')
          .select('id, appointment_date, status, created_at')
          .eq('organization_id', organization.id),
        
        supabase
          .from('medical_records')
          .select('id, created_at')
          .eq('organization_id', organization.id),
        
        supabase
          .from('users')
          .select('id, last_sign_in_at')
          .eq('organization_id', organization.id)
          .eq('is_active', true)
      ])

      // Calculate metrics
      const totalPatients = patientsResult.data?.length || 0
      const totalAppointments = appointmentsResult.data?.length || 0
      const totalMedicalRecords = medicalRecordsResult.data?.length || 0
      
      // Active users (logged in within last 30 days)
      const thirtyDaysAgo = subDays(new Date(), 30)
      const activeUsers = usersResult.data?.filter(user => 
        user.last_sign_in_at && new Date(user.last_sign_in_at) > thirtyDaysAgo
      ).length || 0

      setMetrics({
        totalPatients,
        totalAppointments,
        totalMedicalRecords,
        activeUsers
      })

      // Generate chart data for last 30 days
      const chartData = []
      const appointmentData = []
      const patientData = []

      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i)
        const dateStr = format(date, 'MMM dd', { locale: es })
        
        // Appointments per day
        const dayStart = startOfDay(date)
        const dayEnd = endOfDay(date)
        
        const dayAppointments = appointmentsResult.data?.filter(apt => {
          const aptDate = new Date(apt.appointment_date)
          return aptDate >= dayStart && aptDate <= dayEnd
        }) || []

        // New patients per day
        const dayPatients = patientsResult.data?.filter(patient => {
          const patientDate = new Date(patient.created_at)
          return patientDate >= dayStart && patientDate <= dayEnd
        }) || []

        chartData.push({
          date: dateStr,
          appointments: dayAppointments.length,
          patients: dayPatients.length,
          medicalRecords: Math.floor(dayAppointments.length * 0.8) // Estimate
        })

        appointmentData.push({
          date: dateStr,
          scheduled: dayAppointments.filter(apt => apt.status === 'scheduled').length,
          completed: dayAppointments.filter(apt => apt.status === 'completed').length,
          cancelled: dayAppointments.filter(apt => apt.status === 'cancelled').length
        })

        patientData.push({
          date: dateStr,
          new: dayPatients.length,
          total: totalPatients
        })
      }

      setChartData(chartData)
      setAppointmentData(appointmentData)
      setPatientData(patientData)

      // Status distribution
      const statusCounts = {
        scheduled: appointmentsResult.data?.filter(apt => apt.status === 'scheduled').length || 0,
        completed: appointmentsResult.data?.filter(apt => apt.status === 'completed').length || 0,
        cancelled: appointmentsResult.data?.filter(apt => apt.status === 'cancelled').length || 0
      }

      setStatusData([
        { name: 'Programadas', value: statusCounts.scheduled, color: '#3b82f6' },
        { name: 'Completadas', value: statusCounts.completed, color: '#10b981' },
        { name: 'Canceladas', value: statusCounts.cancelled, color: '#ef4444' }
      ])

    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [organization?.id])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-primary-600 dark:text-primary-400">Cargando métricas en tiempo real...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <MetricCard
          title="Pacientes Totales"
          value={metrics.totalPatients.toLocaleString()}
          change={12}
          changeType="positive"
          icon={Users}
          description="últimos 30 días"
        />
        <MetricCard
          title="Citas Programadas"
          value={metrics.totalAppointments.toLocaleString()}
          change={8}
          changeType="positive"
          icon={Calendar}
          description="últimos 30 días"
        />
        <MetricCard
          title="Historiales Médicos"
          value={metrics.totalMedicalRecords.toLocaleString()}
          change={15}
          changeType="positive"
          icon={FileText}
          description="últimos 30 días"
        />
        <MetricCard
          title="Usuarios Activos"
          value={metrics.activeUsers.toLocaleString()}
          change={-2}
          changeType="negative"
          icon={Activity}
          description="últimos 30 días"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend */}
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Citas por Día</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointment Status Distribution */}
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Estado de Citas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointments by Status */}
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Citas por Estado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scheduled" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" />
                    <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Growth */}
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Crecimiento de Pacientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="new"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
