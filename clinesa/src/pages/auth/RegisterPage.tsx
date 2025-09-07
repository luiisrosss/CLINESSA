import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Stethoscope, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-white dark:bg-primary-1000 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          {...fadeInUp}
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-1000 dark:bg-primary-0 rounded-md">
              <Stethoscope className="w-6 h-6 text-primary-0 dark:text-primary-1000" />
            </div>
          </div>
          <h1 className="text-3xl font-normal text-primary-1000 dark:text-primary-0 mb-2">
            Crear Cuenta en CLINESA
          </h1>
          <p className="text-lg text-primary-600 dark:text-primary-400">
            Configura tu consulta médica en minutos
          </p>
        </motion.div>

        {/* Plan Selection */}
        {selectedPlan && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="notion-card p-6 bg-primary-50 dark:bg-primary-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-primary-1000 dark:text-primary-0">
                      Plan {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} 
                      {' '}({billingCycle === 'monthly' ? 'Mensual' : 'Anual'})
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Incluye 14 días de prueba gratuita
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium text-primary-1000 dark:text-primary-0">
                    €{selectedPlan === 'basic' ? (billingCycle === 'monthly' ? '19' : '199') : 
                      selectedPlan === 'professional' ? (billingCycle === 'monthly' ? '39' : '399') : 
                      (billingCycle === 'monthly' ? '99' : '999')}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {billingCycle === 'yearly' ? 'Ahorra 17%' : 'por mes'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div 
          className="notion-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="section-divider-thick"
                variants={fadeInUp}
              >
                <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-6">
                  Información Personal
                </h3>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="notion-input"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Tu apellido"
                    className="notion-input"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="notion-input"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div className="relative">
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="notion-input pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="notion-input"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Professional Information */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="section-divider-thick"
                variants={fadeInUp}
              >
                <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-6">
                  Información Profesional
                </h3>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Rol
                  </label>
                  <select
                    className="notion-input"
                    {...register('role')}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="doctor">Médico</option>
                    <option value="nurse">Enfermero/a</option>
                    <option value="receptionist">Recepcionista</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="+34 612 345 678"
                    className="notion-input"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {selectedRole === 'doctor' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={fadeInUp}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                      Número de Matrícula
                    </label>
                    <input
                      type="text"
                      placeholder="MP-12345"
                      className="notion-input"
                      {...register('licenseNumber')}
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.licenseNumber.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                      Especialización
                    </label>
                    <input
                      type="text"
                      placeholder="Medicina General"
                      className="notion-input"
                      {...register('specialization')}
                    />
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {selectedRole === 'nurse' && (
                <motion.div 
                  variants={fadeInUp}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Número de Matrícula
                  </label>
                  <input
                    type="text"
                    placeholder="ENF-123"
                    className="notion-input"
                    {...register('licenseNumber')}
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Organization Information */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="section-divider-thick"
                variants={fadeInUp}
              >
                <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-6">
                  Información de la Organización
                </h3>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Nombre de la Organización
                  </label>
                  <input
                    type="text"
                    placeholder="Clínica San Rafael"
                    className="notion-input"
                    {...register('organizationName')}
                  />
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Tipo de Organización
                  </label>
                  <select
                    className="notion-input"
                    {...register('organizationType')}
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="clinic">Clínica</option>
                    <option value="hospital">Hospital</option>
                    <option value="private_practice">Consultorio Privado</option>
                  </select>
                  {errors.organizationType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.organizationType.message}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Calle Mayor 123, Madrid"
                  className="notion-input"
                  {...register('organizationAddress')}
                />
                {errors.organizationAddress && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.organizationAddress.message}
                  </p>
                )}
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Teléfono de la Organización
                  </label>
                  <input
                    type="tel"
                    placeholder="+34 91 123 45 67"
                    className="notion-input"
                    {...register('organizationPhone')}
                  />
                  {errors.organizationPhone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.organizationPhone.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Email de la Organización
                  </label>
                  <input
                    type="email"
                    placeholder="info@clinica.com"
                    className="notion-input"
                    {...register('organizationEmail')}
                  />
                  {errors.organizationEmail && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.organizationEmail.message}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="pt-6"
              variants={fadeInUp}
            >
              <button
                type="submit"
                className="notion-button-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-0 dark:border-primary-1000 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-8 text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-primary-600 dark:text-primary-400">
              ¿Quieres cambiar de plan?{' '}
              <Link 
                to="/auth/plans" 
                className="text-primary-1000 dark:text-primary-0 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Ver planes disponibles
              </Link>
            </p>
            
            <p className="text-sm text-primary-600 dark:text-primary-400">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/auth/login" 
                className="text-primary-1000 dark:text-primary-0 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xs text-primary-500 dark:text-primary-500">
            © 2024 CLINESA - Gestión Médica Profesional
          </p>
        </motion.div>
      </div>
    </div>
  )
}
