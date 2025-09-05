import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, User, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const medicalRecordSchema = z.object({
  patient_id: z.string().min(1, 'El paciente es obligatorio'),
  doctor_id: z.string().min(1, 'El médico es obligatorio'),
  record_type: z.string().min(1, 'El tipo de historial es obligatorio'),
  title: z.string().min(1, 'El título es obligatorio').max(200, 'El título debe tener menos de 200 caracteres'),
  description: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  medications: z.string().optional(),
  vital_signs: z.object({
    blood_pressure: z.string().optional(),
    heart_rate: z.string().optional(),
    temperature: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    oxygen_saturation: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
})

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>

interface MedicalRecordFormProps {
  record?: any
  onSubmit: (data: MedicalRecordFormData) => Promise<void>
  onClose: () => void
  loading?: boolean
}

const recordTypes = [
  { value: 'consultation', label: 'Consulta General' },
  { value: 'emergency', label: 'Emergencia' },
  { value: 'follow_up', label: 'Seguimiento' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'diagnostic', label: 'Diagnóstico' },
  { value: 'treatment', label: 'Tratamiento' },
  { value: 'preventive', label: 'Preventivo' },
  { value: 'other', label: 'Otro' },
]

export function MedicalRecordForm({ record, onSubmit, onClose, loading = false }: MedicalRecordFormProps) {
  const { organization } = useAuth()
  const { patients } = usePatients()
  const [doctors, setDoctors] = useState<Array<{ id: string; first_name: string; last_name: string; specialization?: string }>>([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      vital_signs: {
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygen_saturation: '',
      }
    }
  })

  // Fetch doctors
  useEffect(() => {
    if (organization) {
      fetchDoctors()
    }
  }, [organization])

  const fetchDoctors = async () => {
    if (!supabase || !organization) return

    try {
      setLoadingDoctors(true)
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, specialization')
        .eq('organization_id', organization.id)
        .eq('role', 'doctor')

      if (error) throw error
      setDoctors(data || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast.error('Error al cargar los médicos')
    } finally {
      setLoadingDoctors(false)
    }
  }

  // Set form values when editing
  useEffect(() => {
    if (record) {
      reset({
        patient_id: record.patient_id || '',
        doctor_id: record.doctor_id || '',
        record_type: record.record_type || '',
        title: record.title || '',
        description: record.description || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
        medications: record.medications || '',
        vital_signs: record.vital_signs || {
          blood_pressure: '',
          heart_rate: '',
          temperature: '',
          weight: '',
          height: '',
          oxygen_saturation: '',
        },
        notes: record.notes || '',
      })
    }
  }, [record, reset])

  const handleFormSubmit = async (data: MedicalRecordFormData) => {
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isEditing = !!record

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-bold">
              {isEditing ? 'Editar Historial Médico' : 'Nuevo Historial Médico'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-100px)]">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 sm:space-y-8">
              {/* Patient and Doctor Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paciente *
                  </label>
                  <Select
                    value={watch('patient_id')}
                    onValueChange={(value) => setValue('patient_id', value)}
                    options={patients.map(patient => ({
                      value: patient.id,
                      label: `${patient.patient_number} - ${patient.first_name} ${patient.last_name}`
                    }))}
                    placeholder="Seleccionar paciente"
                  />
                  {errors.patient_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.patient_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Médico *
                  </label>
                  {loadingDoctors ? (
                    <div className="flex items-center justify-center p-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <Select
                      value={watch('doctor_id')}
                      onValueChange={(value) => setValue('doctor_id', value)}
                      options={doctors.map(doctor => ({
                        value: doctor.id,
                        label: `Dr. ${doctor.first_name} ${doctor.last_name}${doctor.specialization ? ` - ${doctor.specialization}` : ''}`
                      }))}
                      placeholder="Seleccionar médico"
                    />
                  )}
                  {errors.doctor_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.doctor_id.message}</p>
                  )}
                </div>
              </div>

              {/* Record Type and Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Historial *
                  </label>
                  <Select
                    value={watch('record_type')}
                    onValueChange={(value) => setValue('record_type', value)}
                    options={recordTypes}
                    placeholder="Seleccionar tipo"
                  />
                  {errors.record_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.record_type.message}</p>
                  )}
                </div>

                <Input
                  label="Título *"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Ej: Consulta de seguimiento - Hipertensión"
                />
              </div>

              {/* Description */}
              <Textarea
                label="Descripción"
                {...register('description')}
                error={errors.description?.message}
                placeholder="Descripción detallada del historial médico..."
                rows={3}
              />

              {/* Diagnosis and Treatment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Diagnóstico"
                  {...register('diagnosis')}
                  error={errors.diagnosis?.message}
                  placeholder="Diagnóstico médico..."
                  rows={3}
                />
                <Textarea
                  label="Tratamiento"
                  {...register('treatment')}
                  error={errors.treatment?.message}
                  placeholder="Tratamiento prescrito..."
                  rows={3}
                />
              </div>

              {/* Medications */}
              <Textarea
                label="Medicamentos"
                {...register('medications')}
                error={errors.medications?.message}
                placeholder="Medicamentos prescritos, dosis, frecuencia..."
                rows={2}
              />

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Signos Vitales</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="Presión Arterial"
                    {...register('vital_signs.blood_pressure')}
                    placeholder="120/80"
                  />
                  <Input
                    label="Frecuencia Cardíaca"
                    {...register('vital_signs.heart_rate')}
                    placeholder="72 bpm"
                  />
                  <Input
                    label="Temperatura"
                    {...register('vital_signs.temperature')}
                    placeholder="36.5°C"
                  />
                  <Input
                    label="Peso"
                    {...register('vital_signs.weight')}
                    placeholder="70 kg"
                  />
                  <Input
                    label="Altura"
                    {...register('vital_signs.height')}
                    placeholder="170 cm"
                  />
                  <Input
                    label="Saturación de Oxígeno"
                    {...register('vital_signs.oxygen_saturation')}
                    placeholder="98%"
                  />
                </div>
              </div>

              {/* Notes */}
              <Textarea
                label="Notas Adicionales"
                {...register('notes')}
                error={errors.notes?.message}
                placeholder="Notas adicionales, observaciones, recomendaciones..."
                rows={3}
              />

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full sm:w-auto"
                >
                  {isEditing ? 'Actualizar Historial' : 'Crear Historial'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
