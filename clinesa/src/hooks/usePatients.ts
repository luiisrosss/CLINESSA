import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Patient } from '@/types/database.types'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { organization } = useAuth()

  const fetchPatients = useCallback(async () => {
    if (!organization) return
    
    if (!supabase) {
      setError('Configuración de Supabase no válida')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPatients(data || [])
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError(err instanceof Error ? err.message : 'Error fetching patients')
    } finally {
      setLoading(false)
    }
  }, [organization])

  const createPatient = async (patientData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!organization) throw new Error('No organization found')
    
    if (!supabase) {
      throw new Error('Configuración de Supabase no válida')
    }
    
    try {
      setLoading(true)
      setError(null)

      // Generate patient number
      const patientNumber = await generatePatientNumber(organization.id)
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          ...patientData,
          organization_id: organization.id,
          patient_number: patientNumber,
        } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select()
        .single()

      if (error) throw error
      
      setPatients(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating patient:', err)
      setError(err instanceof Error ? err.message : 'Error creating patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePatient = async (id: string, patientData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('patients')
        .update(patientData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setPatients(prev => prev.map(p => p.id === id ? data : p))
      return data
    } catch (err) {
      console.error('Error updating patient:', err)
      setError(err instanceof Error ? err.message : 'Error updating patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Soft delete by setting is_active to false
      const { error } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('patients')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      
      setPatients(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting patient:', err)
      setError(err instanceof Error ? err.message : 'Error deleting patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchPatients = async (query: string) => {
    if (!organization) return []
    
    if (!supabase) {
      setError('Configuración de Supabase no válida')
      return []
    }
    
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_active', true)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,dni.ilike.%${query}%,patient_number.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error searching patients:', err)
      setError(err instanceof Error ? err.message : 'Error searching patients')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getPatientById = async (id: string) => {
    if (!supabase) {
      throw new Error('Configuración de Supabase no válida')
    }
    
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_history (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching patient:', err)
      setError(err instanceof Error ? err.message : 'Error fetching patient')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Initialize patients on mount
  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    getPatientById,
    setError
  }
}

// Helper function to generate patient number
async function generatePatientNumber(organizationId: string): Promise<string> {
  if (!supabase) {
    // Fallback to timestamp-based number
    const timestamp = Date.now().toString().slice(-6)
    return `PAT-${timestamp}`
  }
  
  try {
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    const patientCount = (count || 0) + 1
    return `PAT-${patientCount.toString().padStart(4, '0')}`
  } catch {
    // Fallback to timestamp-based number
    const timestamp = Date.now().toString().slice(-6)
    return `PAT-${timestamp}`
  }
}