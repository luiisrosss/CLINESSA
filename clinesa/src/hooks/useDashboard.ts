import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface DashboardStats {
  appointmentsToday: number
  activePatients: number
  medicalRecords: number
  averageConsultationTime: number
  pendingAppointments: number
  completedAppointments: number
  newPatientsThisMonth: number
  updatedRecordsThisWeek: number
}

interface TodayAppointment {
  id: string
  patient_name: string
  time: string
  type: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  doctor_name?: string
}

export function useDashboard() {
  const { organization, userProfile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    appointmentsToday: 0,
    activePatients: 0,
    medicalRecords: 0,
    averageConsultationTime: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    newPatientsThisMonth: 0,
    updatedRecordsThisWeek: 0
  })
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (organization && userProfile) {
      fetchDashboardData()
    }
  }, [organization, userProfile])

  const fetchDashboardData = async () => {
    if (!supabase || !organization) return

    try {
      setLoading(true)
      setError(null)

      const today = new Date().toISOString().split('T')[0]
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Fetch all data in parallel
      const [
        appointmentsTodayResult,
        activePatientsResult,
        medicalRecordsResult,
        todayAppointmentsResult,
        newPatientsResult,
        updatedRecordsResult
      ] = await Promise.all([
        // Appointments today
        supabase
          .from('appointments')
          .select('id, status, duration')
          .eq('organization_id', organization.id)
          .gte('appointment_date', `${today}T00:00:00`)
          .lt('appointment_date', `${today}T23:59:59`),

        // Active patients
        supabase
          .from('patients')
          .select('id')
          .eq('organization_id', organization.id)
          .eq('is_active', true),

        // Medical records
        supabase
          .from('medical_records')
          .select('id, updated_at')
          .eq('organization_id', organization.id),

        // Today's appointments with details
        supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            type,
            duration,
            patient:patients(first_name, last_name),
            doctor:users(first_name, last_name)
          `)
          .eq('organization_id', organization.id)
          .gte('appointment_date', `${today}T00:00:00`)
          .lt('appointment_date', `${today}T23:59:59`)
          .order('appointment_date'),

        // New patients this month
        supabase
          .from('patients')
          .select('id')
          .eq('organization_id', organization.id)
          .gte('created_at', startOfMonth),

        // Updated records this week
        supabase
          .from('medical_records')
          .select('id')
          .eq('organization_id', organization.id)
          .gte('updated_at', startOfWeek)
      ])

      // Process appointments data
      const appointments = appointmentsTodayResult.data || []
      const pendingAppointments = appointments.filter(apt => apt.status === 'scheduled').length
      const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
      const totalDuration = appointments
        .filter(apt => apt.duration)
        .reduce((sum, apt) => sum + (apt.duration || 0), 0)
      const averageTime = appointments.length > 0 ? Math.round(totalDuration / appointments.length) : 0

      // Process today's appointments for display
      const formattedAppointments: TodayAppointment[] = (todayAppointmentsResult.data || []).map(apt => ({
        id: apt.id,
        patient_name: `${apt.patient?.first_name || ''} ${apt.patient?.last_name || ''}`.trim(),
        time: new Date(apt.appointment_date).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: apt.type || 'Consulta',
        status: apt.status as 'confirmed' | 'pending' | 'completed' | 'cancelled',
        doctor_name: apt.doctor ? `${apt.doctor.first_name} ${apt.doctor.last_name}` : undefined
      }))

      // Update stats
      setStats({
        appointmentsToday: appointments.length,
        activePatients: activePatientsResult.data?.length || 0,
        medicalRecords: medicalRecordsResult.data?.length || 0,
        averageConsultationTime: averageTime,
        pendingAppointments,
        completedAppointments,
        newPatientsThisMonth: newPatientsResult.data?.length || 0,
        updatedRecordsThisWeek: updatedRecordsResult.data?.length || 0
      })

      setTodayAppointments(formattedAppointments)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    todayAppointments,
    loading,
    error,
    refetch: fetchDashboardData
  }
}
