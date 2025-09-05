import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, User, Mail, Phone, Shield, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { validateEmail, validatePhone } from '@/lib/utils'

const userSchema = z.object({
  first_name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .refine(val => validateEmail(val), 'Email inválido'),
  phone: z
    .string()
    .optional()
    .refine(val => !val || validatePhone(val), 'Teléfono inválido'),
  role: z.enum(['admin', 'doctor', 'nurse', 'receptionist']).refine(val => val !== undefined, {
    message: 'El rol es obligatorio'
  }),
  specialization: z.string().optional(),
  license_number: z.string().optional(),
  is_active: z.boolean().default(true),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: any
  onSubmit: (data: UserFormData) => Promise<void>
  onClose: () => void
  loading?: boolean
}

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'doctor', label: 'Médico' },
  { value: 'nurse', label: 'Enfermero/a' },
  { value: 'receptionist', label: 'Recepcionista' },
]

const specializationOptions = [
  { value: 'general', label: 'Medicina General' },
  { value: 'cardiology', label: 'Cardiología' },
  { value: 'dermatology', label: 'Dermatología' },
  { value: 'pediatrics', label: 'Pediatría' },
  { value: 'gynecology', label: 'Ginecología' },
  { value: 'orthopedics', label: 'Ortopedia' },
  { value: 'neurology', label: 'Neurología' },
  { value: 'psychiatry', label: 'Psiquiatría' },
  { value: 'ophthalmology', label: 'Oftalmología' },
  { value: 'otolaryngology', label: 'Otorrinolaringología' },
  { value: 'urology', label: 'Urología' },
  { value: 'oncology', label: 'Oncología' },
  { value: 'anesthesiology', label: 'Anestesiología' },
  { value: 'radiology', label: 'Radiología' },
  { value: 'pathology', label: 'Patología' },
  { value: 'emergency', label: 'Medicina de Emergencia' },
  { value: 'internal', label: 'Medicina Interna' },
  { value: 'surgery', label: 'Cirugía General' },
  { value: 'other', label: 'Otra' },
]

export function UserForm({ user, onSubmit, onClose, loading = false }: UserFormProps) {
  const [selectedRole, setSelectedRole] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      is_active: true
    }
  })

  // Set form values when editing
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        specialization: user.specialization || '',
        license_number: user.license_number || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
      })
      setSelectedRole(user.role || '')
    }
  }, [user, reset])

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setValue('role', role as any)
    
    // Clear specialization if role is not doctor
    if (role !== 'doctor') {
      setValue('specialization', '')
    }
  }

  const isEditing = !!user

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-bold">
              {isEditing ? 'Editar Profesional' : 'Nuevo Profesional'}
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
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre *"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    placeholder="Nombre del profesional"
                  />
                  <Input
                    label="Apellido *"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    placeholder="Apellido del profesional"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="email@ejemplo.com"
                  />
                  <Input
                    label="Teléfono"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información Profesional</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rol *
                    </label>
                    <Select
                      value={watch('role')}
                      onValueChange={handleRoleChange}
                      options={roleOptions}
                      placeholder="Seleccionar rol"
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>

                  {selectedRole === 'doctor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Especialización
                      </label>
                      <Select
                        value={watch('specialization')}
                        onValueChange={(value) => setValue('specialization', value)}
                        options={specializationOptions}
                        placeholder="Seleccionar especialización"
                      />
                      {errors.specialization && (
                        <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                      )}
                    </div>
                  )}

                  <Input
                    label="Número de Licencia"
                    {...register('license_number')}
                    error={errors.license_number?.message}
                    placeholder="Ej: LIC-123456"
                  />

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      {...register('is_active')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Usuario activo
                    </label>
                  </div>
                </div>
              </div>

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
                  {isEditing ? 'Actualizar Profesional' : 'Crear Profesional'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
