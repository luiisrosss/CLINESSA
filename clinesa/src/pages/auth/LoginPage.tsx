import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Stethoscope, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Debe ser un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { signIn, loading, isAuthenticated, error, setError } = useAuth()
  const location = useLocation()
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  React.useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
  }, [error, setError])

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password)
      // Show welcome toast only once after successful login
      toast.success(`¡Bienvenido a CLINESA!`)
    } catch (error) {
      // Error is handled by the auth store and shown via toast above
      console.error('Login error:', error)
    }
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-primary-1000 flex items-center justify-center px-4">
      <motion.div 
        className="w-full max-w-md"
        {...fadeInUp}
      >
        <div className="notion-card p-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-1000 dark:bg-primary-0 rounded-md">
                <Stethoscope className="w-6 h-6 text-primary-0 dark:text-primary-1000" />
              </div>
            </div>
            <h1 className="text-2xl font-normal text-primary-1000 dark:text-primary-0 mb-2">
              Bienvenido a CLINESA
            </h1>
            <p className="text-primary-600 dark:text-primary-400">
              Inicia sesión en tu cuenta
            </p>
          </motion.div>
          
          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="doctor@clinesa.com"
                className="notion-input"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="notion-input"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="notion-button-primary w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-0 dark:border-primary-1000 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
          
          {/* Footer Links */}
          <motion.div 
            className="mt-8 text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm text-primary-600 dark:text-primary-400">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/auth/register" 
                className="text-primary-1000 dark:text-primary-0 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Crear cuenta
              </Link>
            </p>
            
            <p className="text-sm text-primary-600 dark:text-primary-400">
              ¿Problemas para acceder?{' '}
              <Link 
                to="/support" 
                className="text-primary-1000 dark:text-primary-0 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Contacta soporte
              </Link>
            </p>
          </motion.div>
        </div>
        
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
      </motion.div>
    </div>
  )
}