import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { validateDNI, validateEmail, validatePhone } from '@/lib/utils'
import type { Patient } from '@/types/database.types'

const patientSchema = z.object({
  first_name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: z
    .string()
    .optional()
    .refine(val => !val || validateDNI(val), 'DNI inválido'),
  email: z
    .string()
    .optional()
    .refine(val => !val || validateEmail(val), 'Email inválido'),
  phone: z
    .string()
    .optional()
    .refine(val => !val || validatePhone(val), 'Teléfono inválido'),
  birth_date: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine(date => {
      const birthDate = new Date(date)
      const today = new Date()
      const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
      return birthDate <= today && birthDate >= minDate
    }, 'Fecha de nacimiento inválida'),
  gender: z.enum(['male', 'female', 'other']).refine(val => val !== undefined, {
    message: 'El género es obligatorio'
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  
  // Insurance information
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  insurance_expiry: z.string().optional(),
  
  // Emergency contact
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z
    .string()
    .optional()
    .refine(val => !val || validatePhone(val), 'Teléfono de contacto inválido'),
  emergency_contact_relationship: z.string().optional(),
  
  // Medical information
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  chronic_conditions: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: PatientFormData) => Promise<void>
  onClose: () => void
  loading?: boolean
}

export function PatientForm({ patient, onSubmit, onClose, loading = false }: PatientFormProps) {
  const isEditing = !!patient

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      dni: patient.dni || '',
      email: patient.email || '',
      phone: patient.phone || '',
      birth_date: patient.birth_date,
      gender: patient.gender,
      address: patient.address || '',
      city: patient.city || '',
      postal_code: patient.postal_code || '',
      insurance_provider: patient.insurance_provider || '',
      insurance_number: patient.insurance_number || '',
      insurance_expiry: patient.insurance_expiry || '',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
      emergency_contact_relationship: patient.emergency_contact_relationship || '',
      blood_type: patient.blood_type || '',
      allergies: patient.allergies || '',
      chronic_conditions: patient.chronic_conditions || '',
      medications: patient.medications || '',
      notes: patient.notes || '',
    } : undefined,
  })

  const handleFormSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (error) {
      // Error handled by parent component
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="text-xl font-bold">
              {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
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
          
          <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre *"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                  />
                  <Input
                    label="Apellido *"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                  />
                  <Input
                    label="DNI"
                    {...register('dni')}
                    error={errors.dni?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Teléfono"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Fecha de Nacimiento *"
                    type="date"
                    {...register('birth_date')}
                    error={errors.birth_date?.message}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género *
                    </label>
                    <select
                      {...register('gender')}
                      className="medical-input"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Sangre
                    </label>
                    <select
                      {...register('blood_type')}
                      className="medical-input"
                    >
                      <option value="">Seleccionar tipo de sangre</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Dirección"
                      {...register('address')}
                      error={errors.address?.message}
                    />
                  </div>
                  <Input
                    label="Ciudad"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    label="Código Postal"
                    {...register('postal_code')}
                    error={errors.postal_code?.message}
                  />
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seguro Médico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Proveedor de Seguro"
                    {...register('insurance_provider')}
                    error={errors.insurance_provider?.message}
                  />
                  <Input
                    label="Número de Seguro"
                    {...register('insurance_number')}
                    error={errors.insurance_number?.message}
                  />
                  <Input
                    label="Fecha de Vencimiento"
                    type="date"
                    {...register('insurance_expiry')}
                    error={errors.insurance_expiry?.message}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de Emergencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Nombre del Contacto"
                    {...register('emergency_contact_name')}
                    error={errors.emergency_contact_name?.message}
                  />
                  <Input
                    label="Teléfono de Contacto"
                    type="tel"
                    {...register('emergency_contact_phone')}
                    error={errors.emergency_contact_phone?.message}
                  />
                  <Input
                    label="Relación"
                    {...register('emergency_contact_relationship')}
                    error={errors.emergency_contact_relationship?.message}
                    placeholder="Ej: Esposo/a, Hijo/a, Padre/Madre"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alergias
                    </label>
                    <textarea
                      {...register('allergies')}
                      rows={3}
                      className="medical-input"
                      placeholder="Describe cualquier alergia conocida..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condiciones Crónicas
                    </label>
                    <textarea
                      {...register('chronic_conditions')}
                      rows={3}
                      className="medical-input"
                      placeholder="Describe condiciones crónicas o enfermedades previas..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicamentos Actuales
                    </label>
                    <textarea
                      {...register('medications')}
                      rows={3}
                      className="medical-input"
                      placeholder="Lista de medicamentos que toma actualmente..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Adicionales
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="medical-input"
                      placeholder="Cualquier información adicional relevante..."
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {isEditing ? 'Actualizar Paciente' : 'Crear Paciente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}