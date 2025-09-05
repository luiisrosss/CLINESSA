import { useEffect, useState } from 'react'
import { AlertTriangle, X, CheckCircle, Users, UserCheck, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useStripe } from '@/hooks/useStripe'
import toast from 'react-hot-toast'

interface PlanLimitGuardProps {
  action: 'create_user' | 'create_patient' | 'create_appointment' | 'create_medical_record'
  onProceed?: () => void
  onCancel?: () => void
  children?: React.ReactNode
}

const actionConfig = {
  create_user: {
    resource: 'users' as const,
    label: 'usuario',
    icon: Users,
    message: 'No puedes crear más usuarios con tu plan actual',
    upgradeMessage: 'Actualiza tu plan para agregar más usuarios y gestionar tu equipo completo',
  },
  create_patient: {
    resource: 'patients' as const,
    label: 'paciente',
    icon: UserCheck,
    message: 'No puedes registrar más pacientes con tu plan actual',
    upgradeMessage: 'Actualiza tu plan para registrar más pacientes y hacer crecer tu práctica',
  },
  create_appointment: {
    resource: 'appointments' as const,
    label: 'cita',
    icon: Calendar,
    message: 'Has alcanzado el límite de citas para este mes',
    upgradeMessage: 'Actualiza tu plan para programar más citas y maximizar tus ingresos',
  },
  create_medical_record: {
    resource: 'users' as const, // Medical records depend on user permissions
    label: 'historial médico',
    icon: CheckCircle,
    message: 'No tienes permisos para crear historiales médicos',
    upgradeMessage: 'Actualiza tu plan para acceder a todas las funciones de historiales médicos',
  },
}

export function PlanLimitGuard({ action, onProceed, onCancel, children }: PlanLimitGuardProps) {
  const { 
    canAddResource, 
    isAtLimit, 
    getRemainingCapacity, 
    limits,
    usage,
    showUpgradePrompt 
  } = usePlanLimits()
  
  const { createCheckoutSession, subscription } = useStripe()
  const [upgrading, setUpgrading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const config = actionConfig[action]
  const canProceed = action === 'create_medical_record' 
    ? limits?.canCreateMedicalRecords 
    : canAddResource(config.resource)
  
  const isLimitReached = action === 'create_medical_record'
    ? !limits?.canCreateMedicalRecords
    : isAtLimit(config.resource)

  const remainingCapacity = getRemainingCapacity(config.resource)

  useEffect(() => {
    if (isLimitReached && !showModal) {
      setShowModal(true)
    }
  }, [isLimitReached, showModal])

  const handleUpgrade = async () => {
    if (!subscription) return

    try {
      setUpgrading(true)
      
      // Determine next plan
      const currentPlan = subscription.plan?.type || 'basic'
      let nextPlan = 'professional'
      
      if (currentPlan === 'basic') {
        nextPlan = 'professional'
      } else if (currentPlan === 'professional') {
        nextPlan = 'enterprise'
      }

      await createCheckoutSession(nextPlan, 'monthly')
    } catch (error) {
      console.error('Error upgrading plan:', error)
      toast.error('Error al actualizar el plan')
    } finally {
      setUpgrading(false)
    }
  }

  const handleProceed = () => {
    if (canProceed) {
      onProceed?.()
    } else {
      setShowModal(true)
    }
  }

  const handleCancel = () => {
    setShowModal(false)
    onCancel?.()
  }

  // If user can proceed, render children normally
  if (canProceed) {
    return <>{children}</>
  }

  // If limit reached, show modal
  if (showModal) {
    const Icon = config.icon
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Límite del Plan Alcanzado
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {config.message}
              </p>

              {/* Current Usage */}
              {usage && limits && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Uso actual de {config.label}s:
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {config.resource === 'users' && `${usage.currentUsers} usuarios`}
                        {config.resource === 'patients' && `${usage.currentPatients} pacientes`}
                        {config.resource === 'appointments' && `${usage.currentAppointmentsThisMonth} citas este mes`}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        de {config.resource === 'users' && limits.maxUsers}
                        {config.resource === 'patients' && limits.maxPatients}
                        {config.resource === 'appointments' && limits.maxAppointmentsPerMonth}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (config.resource === 'users' ? usage.currentUsers : 
                            config.resource === 'patients' ? usage.currentPatients : 
                            usage.currentAppointmentsThisMonth) / 
                            (config.resource === 'users' ? limits.maxUsers : 
                            config.resource === 'patients' ? limits.maxPatients : 
                            limits.maxAppointmentsPerMonth) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {config.upgradeMessage}
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={handleUpgrade}
                  loading={upgrading}
                  className="flex-1"
                >
                  Actualizar Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show warning if approaching limit
  if (showUpgradePrompt() && !isLimitReached) {
    return (
      <div className="mb-4">
        {children}
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Te estás acercando al límite de {config.label}s
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Te quedan {remainingCapacity} {config.label}s disponibles. 
                <button
                  onClick={handleUpgrade}
                  className="underline hover:no-underline ml-1"
                >
                  Actualiza tu plan
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook for easy usage in components
export function usePlanLimitGuard(action: PlanLimitGuardProps['action']) {
  const { canAddResource, isAtLimit, limits } = usePlanLimits()
  
  const config = actionConfig[action]
  const canProceed = action === 'create_medical_record' 
    ? limits?.canCreateMedicalRecords 
    : canAddResource(config.resource)
  
  const isLimitReached = action === 'create_medical_record'
    ? !limits?.canCreateMedicalRecords
    : isAtLimit(config.resource)

  return {
    canProceed,
    isLimitReached,
    config,
  }
}
