import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export interface MedicalRecord {
  id: string
  patient_id: string
  doctor_id: string
  record_type: string
  title: string
  description?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  vital_signs?: {
    blood_pressure?: string
    heart_rate?: string
    temperature?: string
    weight?: string
    height?: string
    oxygen_saturation?: string
  }
  notes?: string
  created_at: string
  updated_at: string
  organization_id: string
  patient?: {
    first_name: string
    last_name: string
    patient_number: string
  }
  doctor?: {
    first_name: string
    last_name: string
    specialization?: string
  }
}

export interface CreateMedicalRecordData {
  patient_id: string
  doctor_id: string
  record_type: string
  title: string
  description?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  vital_signs?: {
    blood_pressure?: string
    heart_rate?: string
    temperature?: string
    weight?: string
    height?: string
    oxygen_saturation?: string
  }
  notes?: string
}

export function useMedicalRecords() {
  const { organization } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (organization) {
      fetchRecords()
    }
  }, [organization])

  const fetchRecords = async () => {
    if (!supabase || !organization) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          patient:patients(first_name, last_name, patient_number),
          doctor:users(first_name, last_name, specialization)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRecords(data || [])
    } catch (err) {
      console.error('Error fetching medical records:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar los historiales')
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async (recordData: CreateMedicalRecordData) => {
    if (!supabase || !organization) return

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([{
          ...recordData,
          organization_id: organization.id
        }])
        .select(`
          *,
          patient:patients(first_name, last_name, patient_number),
          doctor:users(first_name, last_name, specialization)
        `)
        .single()

      if (error) throw error

      setRecords(prev => [data, ...prev])
      toast.success('Historial médico creado correctamente')
      return data
    } catch (err) {
      console.error('Error creating medical record:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el historial'
      toast.error(errorMessage)
      throw err
    }
  }

  const updateRecord = async (id: string, recordData: Partial<CreateMedicalRecordData>) => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update(recordData)
        .eq('id', id)
        .select(`
          *,
          patient:patients(first_name, last_name, patient_number),
          doctor:users(first_name, last_name, specialization)
        `)
        .single()

      if (error) throw error

      setRecords(prev => prev.map(record => 
        record.id === id ? data : record
      ))
      toast.success('Historial médico actualizado correctamente')
      return data
    } catch (err) {
      console.error('Error updating medical record:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el historial'
      toast.error(errorMessage)
      throw err
    }
  }

  const deleteRecord = async (id: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRecords(prev => prev.filter(record => record.id !== id))
      toast.success('Historial médico eliminado correctamente')
    } catch (err) {
      console.error('Error deleting medical record:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el historial'
      toast.error(errorMessage)
      throw err
    }
  }

  const getRecordById = (id: string) => {
    return records.find(record => record.id === id)
  }

  const getRecordsByPatient = (patientId: string) => {
    return records.filter(record => record.patient_id === patientId)
  }

  const getRecordsByDoctor = (doctorId: string) => {
    return records.filter(record => record.doctor_id === doctorId)
  }

  const getRecordsByType = (recordType: string) => {
    return records.filter(record => record.record_type === recordType)
  }

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordById,
    getRecordsByPatient,
    getRecordsByDoctor,
    getRecordsByType,
  }
}
