import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'
import { es } from 'date-fns/locale'

export interface MetricData {
  date: string
  appointments: number
  patients: number
  medicalRecords: number
  [key: string]: any
}

export interface AppointmentStatusData {
  scheduled: number
  completed: number
  cancelled: number
  no_show: number
}

export interface PatientMetrics {
  totalPatients: number
  newPatientsToday: number
  newPatientsThisWeek: number
  newPatientsThisMonth: number
  activePatients: number
  inactivePatients: number
}

export interface AppointmentMetrics {
  totalAppointments: number
  appointmentsToday: number
  appointmentsThisWeek: number
  appointmentsThisMonth: number
  statusDistribution: AppointmentStatusData
}

export interface MedicalRecordMetrics {
  totalRecords: number
  recordsToday: number
  recordsThisWeek: number
  recordsThisMonth: number
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  usersOnline: number
}

export interface RealTimeMetrics {
  patients: PatientMetrics
  appointments: AppointmentMetrics
  medicalRecords: MedicalRecordMetrics
  users: UserMetrics
  chartData: MetricData[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function useRealTimeMetrics() {
  const { organization } = useAuth()
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    patients: {
      totalPatients: 0,
      newPatientsToday: 0,
      newPatientsThisWeek: 0,
      newPatientsThisMonth: 0,
      activePatients: 0,
      inactivePatients: 0
    },
    appointments: {
      totalAppointments: 0,
      appointmentsToday: 0,
      appointmentsThisWeek: 0,
      appointmentsThisMonth: 0,
      statusDistribution: {
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        no_show: 0
      }
    },
    medicalRecords: {
      totalRecords: 0,
      recordsToday: 0,
      recordsThisWeek: 0,
      recordsThisMonth: 0
    },
    users: {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      usersOnline: 0
    },
    chartData: [],
    loading: true,
    error: null,
    lastUpdated: null
  })

  const fetchMetrics = useCallback(async () => {
    if (!organization?.id) {
      setMetrics(prev => ({ ...prev, loading: false }))
      return
    }

    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }))

      const now = new Date()
      const today = startOfDay(now)
      const weekAgo = subDays(now, 7)
      const monthAgo = subDays(now, 30)

      // Fetch all data in parallel
      const [
        patientsResult,
        appointmentsResult,
        medicalRecordsResult,
        usersResult
      ] = await Promise.all([
        // Patients
        supabase
          .from('patients')
          .select('id, created_at, is_active, last_visit')
          .eq('organization_id', organization.id),

        // Appointments
        supabase
          .from('appointments')
          .select('id, appointment_date, status, created_at')
          .eq('organization_id', organization.id),

        // Medical Records
        supabase
          .from('medical_records')
          .select('id, created_at')
          .eq('organization_id', organization.id),

        // Users
        supabase
          .from('users')
          .select('id, is_active, last_sign_in_at, created_at')
          .eq('organization_id', organization.id)
      ])

      if (patientsResult.error) throw patientsResult.error
      if (appointmentsResult.error) throw appointmentsResult.error
      if (medicalRecordsResult.error) throw medicalRecordsResult.error
      if (usersResult.error) throw usersResult.error

      const patients = patientsResult.data || []
      const appointments = appointmentsResult.data || []
      const medicalRecords = medicalRecordsResult.data || []
      const users = usersResult.data || []

      // Calculate patient metrics
      const patientMetrics: PatientMetrics = {
        totalPatients: patients.length,
        newPatientsToday: patients.filter(p => 
          new Date(p.created_at) >= today
        ).length,
        newPatientsThisWeek: patients.filter(p => 
          new Date(p.created_at) >= weekAgo
        ).length,
        newPatientsThisMonth: patients.filter(p => 
          new Date(p.created_at) >= monthAgo
        ).length,
        activePatients: patients.filter(p => p.is_active).length,
        inactivePatients: patients.filter(p => !p.is_active).length
      }

      // Calculate appointment metrics
      const appointmentMetrics: AppointmentMetrics = {
        totalAppointments: appointments.length,
        appointmentsToday: appointments.filter(a => 
          new Date(a.appointment_date) >= today
        ).length,
        appointmentsThisWeek: appointments.filter(a => 
          new Date(a.appointment_date) >= weekAgo
        ).length,
        appointmentsThisMonth: appointments.filter(a => 
          new Date(a.appointment_date) >= monthAgo
        ).length,
        statusDistribution: {
          scheduled: appointments.filter(a => a.status === 'scheduled').length,
          completed: appointments.filter(a => a.status === 'completed').length,
          cancelled: appointments.filter(a => a.status === 'cancelled').length,
          no_show: appointments.filter(a => a.status === 'no_show').length
        }
      }

      // Calculate medical record metrics
      const medicalRecordMetrics: MedicalRecordMetrics = {
        totalRecords: medicalRecords.length,
        recordsToday: medicalRecords.filter(r => 
          new Date(r.created_at) >= today
        ).length,
        recordsThisWeek: medicalRecords.filter(r => 
          new Date(r.created_at) >= weekAgo
        ).length,
        recordsThisMonth: medicalRecords.filter(r => 
          new Date(r.created_at) >= monthAgo
        ).length
      }

      // Calculate user metrics
      const thirtyDaysAgo = subDays(now, 30)
      const userMetrics: UserMetrics = {
        totalUsers: users.length,
        activeUsers: users.filter(u => 
          u.is_active && u.last_sign_in_at && 
          new Date(u.last_sign_in_at) > thirtyDaysAgo
        ).length,
        inactiveUsers: users.filter(u => !u.is_active).length,
        usersOnline: users.filter(u => 
          u.last_sign_in_at && 
          new Date(u.last_sign_in_at) > subDays(now, 1)
        ).length
      }

      // Generate chart data for last 30 days
      const chartData: MetricData[] = []
      for (let i = 29; i >= 0; i--) {
        const date = subDays(now, i)
        const dateStr = format(date, 'MMM dd', { locale: es })
        const dayStart = startOfDay(date)
        const dayEnd = endOfDay(date)

        const dayAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointment_date)
          return aptDate >= dayStart && aptDate <= dayEnd
        })

        const dayPatients = patients.filter(p => {
          const patientDate = new Date(p.created_at)
          return patientDate >= dayStart && patientDate <= dayEnd
        })

        const dayRecords = medicalRecords.filter(r => {
          const recordDate = new Date(r.created_at)
          return recordDate >= dayStart && recordDate <= dayEnd
        })

        chartData.push({
          date: dateStr,
          appointments: dayAppointments.length,
          patients: dayPatients.length,
          medicalRecords: dayRecords.length,
          scheduled: dayAppointments.filter(a => a.status === 'scheduled').length,
          completed: dayAppointments.filter(a => a.status === 'completed').length,
          cancelled: dayAppointments.filter(a => a.status === 'cancelled').length
        })
      }

      setMetrics({
        patients: patientMetrics,
        appointments: appointmentMetrics,
        medicalRecords: medicalRecordMetrics,
        users: userMetrics,
        chartData,
        loading: false,
        error: null,
        lastUpdated: now
      })

    } catch (error: any) {
      console.error('Error fetching real-time metrics:', error)
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar las métricas'
      }))
    }
  }, [organization?.id])

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!organization?.id) return

    const channel = supabase
      .channel('metrics_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
          filter: `organization_id=eq.${organization.id}`
        },
        () => {
          console.log('Patients data changed, refreshing metrics...')
          fetchMetrics()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `organization_id=eq.${organization.id}`
        },
        () => {
          console.log('Appointments data changed, refreshing metrics...')
          fetchMetrics()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_records',
          filter: `organization_id=eq.${organization.id}`
        },
        () => {
          console.log('Medical records data changed, refreshing metrics...')
          fetchMetrics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organization?.id, fetchMetrics])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchMetrics])

  return {
    ...metrics,
    refetch: fetchMetrics
  }
}
