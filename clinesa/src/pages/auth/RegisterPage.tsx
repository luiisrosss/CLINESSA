import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Stethoscope, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Debe ser un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
  firstName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  role: z
    .enum(['admin', 'doctor', 'nurse', 'receptionist'])
    .refine(val => val !== undefined, {
      message: 'Selecciona un rol'
    }),
  phone: z
    .string()
    .optional(),
  licenseNumber: z
    .string()
    .optional(),
  specialization: z
    .string()
    .optional(),
  organizationName: z
    .string()
    .min(1, 'El nombre de la organización es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  organizationType: z
    .enum(['clinic', 'hospital', 'private_practice'])
    .refine(val => val !== undefined, {
      message: 'Selecciona el tipo de organización'
    }),
  organizationAddress: z
    .string()
    .optional(),
  organizationPhone: z
    .string()
    .optional(),
  organizationEmail: z
    .string()
    .email('Email de organización inválido')
    .optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const selectedRole = watch('role')

  // Load selected plan from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan')
    const savedBilling = localStorage.getItem('billingCycle')
    if (savedPlan) setSelectedPlan(savedPlan)
    if (savedBilling) setBillingCycle(savedBilling as 'monthly' | 'yearly')
  }, [])

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true)

      if (!supabase) {
        throw new Error('Configuración de Supabase no válida. Por favor, configura las variables de entorno.')
      }

      // Get the selected plan
      const { data: planData, error: planError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('subscription_plans')
        .select('*')
        .eq('type', selectedPlan)
        .single()

      if (planError) {
        throw new Error('Error al obtener el plan seleccionado: ' + planError.message)
      }

      // Create organization first
      const { data: orgData, error: orgError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('organizations')
        .insert({
          name: data.organizationName,
          type: data.organizationType,
          address: data.organizationAddress || null,
          phone: data.organizationPhone || null,
          email: data.organizationEmail || null,
        })
        .select()
        .single()

      if (orgError) {
        throw new Error('Error al crear la organización: ' + orgError.message)
      }

      // Create subscription
      const { data: subscriptionData, error: subscriptionError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('organization_subscriptions')
        .insert({
          organization_id: orgData.id,
          plan_id: planData.id,
          status: 'trial',
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        })
        .select()
        .single()

      if (subscriptionError) {
        throw new Error('Error al crear la suscripción: ' + subscriptionError.message)
      }

      // Update organization with subscription_id
      const { error: updateOrgError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .from('organizations')
        .update({ subscription_id: subscriptionData.id })
        .eq('id', orgData.id)

      if (updateOrgError) {
        console.warn('Error al actualizar organización con subscription_id:', updateOrgError)
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw new Error('Error al crear la cuenta: ' + authError.message)
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          .from('users')
          .insert({
            id: authData.user.id,
            organization_id: orgData.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            phone: data.phone || null,
            license_number: data.licenseNumber || null,
            specialization: data.specialization || null,
          })

        if (profileError) {
          throw new Error('Error al crear el perfil: ' + profileError.message)
        }

        toast.success('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.')
        navigate('/auth/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-blue-100 px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-medical-600 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crear Cuenta en CLINESA
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Configura tu consulta médica en minutos
            </p>
            {selectedPlan && (
              <div className="mt-4 p-4 bg-gradient-to-r from-medical-50 to-blue-50 rounded-lg border border-medical-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-medical-800">
                      Plan {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} 
                      {' '}({billingCycle === 'monthly' ? 'Mensual' : 'Anual'})
                    </p>
                    <p className="text-xs text-medical-600 mt-1">
                      Incluye 14 días de prueba gratuita
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-medical-800">
                      ${selectedPlan === 'basic' ? (billingCycle === 'monthly' ? '19.99' : '199.99') : 
                        selectedPlan === 'professional' ? (billingCycle === 'monthly' ? '39.99' : '399.99') : 
                        (billingCycle === 'monthly' ? '99.99' : '999.99')}
                    </p>
                    <p className="text-xs text-medical-600">
                      {billingCycle === 'yearly' ? 'Ahorra 17%' : 'por mes'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    placeholder="Tu nombre"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  
                  <Input
                    label="Apellido"
                    placeholder="Tu apellido"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <Input
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Información Profesional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Rol"
                    error={errors.role?.message}
                    {...register('role')}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="doctor">Médico</option>
                    <option value="nurse">Enfermero/a</option>
                    <option value="receptionist">Recepcionista</option>
                  </Select>

                  <Input
                    label="Teléfono"
                    placeholder="+54 11 1234-5678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                {selectedRole === 'doctor' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Número de Matrícula"
                      placeholder="MP-12345"
                      error={errors.licenseNumber?.message}
                      {...register('licenseNumber')}
                    />
                    
                    <Input
                      label="Especialización"
                      placeholder="Medicina General"
                      error={errors.specialization?.message}
                      {...register('specialization')}
                    />
                  </div>
                )}

                {selectedRole === 'nurse' && (
                  <Input
                    label="Número de Matrícula"
                    placeholder="ENF-123"
                    error={errors.licenseNumber?.message}
                    {...register('licenseNumber')}
                  />
                )}
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Información de la Organización
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la Organización"
                    placeholder="Clínica San Rafael"
                    error={errors.organizationName?.message}
                    {...register('organizationName')}
                  />
                  
                  <Select
                    label="Tipo de Organización"
                    error={errors.organizationType?.message}
                    {...register('organizationType')}
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="clinic">Clínica</option>
                    <option value="hospital">Hospital</option>
                    <option value="private_practice">Consultorio Privado</option>
                  </Select>
                </div>

                <Input
                  label="Dirección"
                  placeholder="Av. Libertador 1234, Buenos Aires"
                  error={errors.organizationAddress?.message}
                  {...register('organizationAddress')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono de la Organización"
                    placeholder="+54 11 4567-8900"
                    error={errors.organizationPhone?.message}
                    {...register('organizationPhone')}
                  />
                  
                  <Input
                    label="Email de la Organización"
                    type="email"
                    placeholder="info@clinica.com"
                    error={errors.organizationEmail?.message}
                    {...register('organizationEmail')}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Crear Cuenta
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                ¿Quieres cambiar de plan?{' '}
                <Link 
                  to="/auth/plans" 
                  className="text-medical-600 hover:text-medical-700 font-medium"
                >
                  Ver planes disponibles
                </Link>
              </p>
              
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-medical-600 hover:text-medical-700 font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 CLINESA - Gestión Médica Profesional
          </p>
        </div>
      </div>
    </div>
  )
}
