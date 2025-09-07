import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface DashboardStats {
  total_patients: number
  total_appointments: number
  today_appointments: number
  pending_appointments: number
  confirmed_appointments: number
  total_medical_records: number
  active_users: number
}

export interface AppointmentStats {
  total_appointments: number
  confirmed_appointments: number
  scheduled_appointments: number
  cancelled_appointments: number
  completed_appointments: number
}

export interface PatientStats {
  total_patients: number
  new_patients: number
  active_patients: number
  inactive_patients: number
}

export interface UserStats {
  total_users: number
  active_users: number
  doctors: number
  nurses: number
  receptionists: number
  admins: number
}

export interface AppointmentWithDetails {
  id: string
  title: string
  description: string | null
  appointment_date: string
  duration: number
  status: string
  patient_id: string
  patient_name: string
  patient_phone: string | null
  doctor_id: string
  doctor_name: string
  created_at: string
}

export interface MedicalRecordWithDetails {
  id: string
  chief_complaint: string | null
  symptoms: string | null
  diagnosis: string
  treatment_plan: string | null
  visit_date: string
  patient_id: string
  patient_name: string
  doctor_id: string
  doctor_name: string
  created_at: string
}

export interface PatientSearchResult {
  id: string
  patient_number: string
  first_name: string
  last_name: string
  dni: string | null
  email: string | null
  phone: string | null
  birth_date: string
  gender: string
  created_at: string
}

export function useOptimizedQueries() {
  const { organization } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get dashboard statistics
  const getDashboardStats = useCallback(async (): Promise<DashboardStats | null> => {
    if (!organization) return null

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        org_id: organization.id
      })

      if (error) throw error

      return data?.[0] || null
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
      return null
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Get appointment statistics for date range
  const getAppointmentStats = useCallback(async (
    startDate: string,
    endDate: string
  ): Promise<AppointmentStats | null> => {
    if (!organization) return null

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_appointment_stats', {
        org_id: organization.id,
        start_date: startDate,
        end_date: endDate
      })

      if (error) throw error

      return data?.[0] || null
    } catch (err) {
      console.error('Error fetching appointment stats:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas de citas')
      return null
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Get patient statistics for date range
  const getPatientStats = useCallback(async (
    startDate: string,
    endDate: string
  ): Promise<PatientStats | null> => {
    if (!organization) return null

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_patient_stats', {
        org_id: organization.id,
        start_date: startDate,
        end_date: endDate
      })

      if (error) throw error

      return data?.[0] || null
    } catch (err) {
      console.error('Error fetching patient stats:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas de pacientes')
      return null
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Get user statistics
  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!organization) return null

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_user_stats', {
        org_id: organization.id
      })

      if (error) throw error

      return data?.[0] || null
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas de usuarios')
      return null
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Search patients with full-text search
  const searchPatients = useCallback(async (
    searchTerm: string,
    limit: number = 50
  ): Promise<PatientSearchResult[]> => {
    if (!organization || !searchTerm.trim()) return []

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('search_patients', {
        org_id: organization.id,
        search_term: searchTerm.trim(),
        limit_count: limit
      })

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error searching patients:', err)
      setError(err instanceof Error ? err.message : 'Error al buscar pacientes')
      return []
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Get appointments with details for date range
  const getAppointmentsWithDetails = useCallback(async (
    startDate: string,
    endDate: string,
    doctorId?: string,
    status?: string
  ): Promise<AppointmentWithDetails[]> => {
    if (!organization) return []

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_appointments_with_details', {
        org_id: organization.id,
        start_date: startDate,
        end_date: endDate,
        doctor_id: doctorId || null,
        status_filter: status || null
      })

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error fetching appointments with details:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar citas')
      return []
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Get medical records with details
  const getMedicalRecordsWithDetails = useCallback(async (
    patientId?: string,
    doctorId?: string,
    limit: number = 100
  ): Promise<MedicalRecordWithDetails[]> => {
    if (!organization) return []

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('get_medical_records_with_details', {
        org_id: organization.id,
        patient_id: patientId || null,
        doctor_id: doctorId || null,
        limit_count: limit
      })

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error fetching medical records with details:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar historiales médicos')
      return []
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Refresh materialized views
  const refreshMaterializedViews = useCallback(async (): Promise<boolean> => {
    if (!organization) return false

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.rpc('refresh_all_materialized_views')

      if (error) throw error

      return true
    } catch (err) {
      console.error('Error refreshing materialized views:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar vistas')
      return false
    } finally {
      setLoading(false)
    }
  }, [organization])

  // Clean up old notifications
  const cleanupOldNotifications = useCallback(async (daysOld: number = 30): Promise<number> => {
    if (!organization) return 0

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc('cleanup_old_notifications', {
        days_old: daysOld
      })

      if (error) throw error

      return data || 0
    } catch (err) {
      console.error('Error cleaning up notifications:', err)
      setError(err instanceof Error ? err.message : 'Error al limpiar notificaciones')
      return 0
    } finally {
      setLoading(false)
    }
  }, [organization])

  return {
    loading,
    error,
    getDashboardStats,
    getAppointmentStats,
    getPatientStats,
    getUserStats,
    searchPatients,
    getAppointmentsWithDetails,
    getMedicalRecordsWithDetails,
    refreshMaterializedViews,
    cleanupOldNotifications
  }
}
