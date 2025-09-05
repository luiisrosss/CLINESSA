import { useState } from 'react'
import { Check, Star, Zap, Crown, CreditCard, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStripe } from '@/hooks/useStripe'
import { CURRENCY_SYMBOL } from '@/lib/stripe'
import toast from 'react-hot-toast'

interface PlanSelectorProps {
  onClose?: () => void
  showCurrentPlan?: boolean
}

const planIcons = {
  basic: CreditCard,
  professional: Star,
  enterprise: Crown,
}

const planDescriptions = {
  basic: 'Para médicos independientes y consultorios pequeños',
  professional: '⭐ MÁS POPULAR - Para clínicas y consultorios en crecimiento',
  enterprise: 'Para hospitales y grandes organizaciones médicas',
}

const planColors = {
  basic: 'border-gray-200 dark:border-gray-700',
  professional: 'border-blue-500 dark:border-blue-400',
  enterprise: 'border-purple-500 dark:border-purple-400',
}

const planGradients = {
  basic: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
  professional: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
  enterprise: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
}

export function PlanSelector({ onClose, showCurrentPlan = true }: PlanSelectorProps) {
  const { 
    plans, 
    subscription, 
    loading, 
    createCheckoutSession, 
    canUpgrade, 
    canDowngrade,
    isTrial,
    daysUntilTrialEnd 
  } = useStripe()
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (!subscription && !isTrial) {
      setSelectedPlan(planId)
      return
    }

    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    const canChange = subscription?.plan?.type === plan.type 
      ? false 
      : subscription?.plan?.type && plan.type 
        ? (canUpgrade(plan) || canDowngrade(plan))
        : true

    if (!canChange) {
      toast.error('No puedes cambiar a este plan')
      return
    }

    try {
      await createCheckoutSession(planId, billingCycle)
    } catch (error) {
      console.error('Error selecting plan:', error)
    }
  }

  const getPlanPrice = (plan: any) => {
    return billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly
  }

  const getPlanSavings = (plan: any) => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = plan.price_monthly * 12
      const savings = monthlyTotal - plan.price_yearly
      return Math.round((savings / monthlyTotal) * 100)
    }
    return 0
  }

  const isCurrentPlan = (plan: any) => {
    return subscription?.plan?.id === plan.id
  }

  const isPopular = (plan: any) => {
    return plan.type === 'professional'
  }

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando planes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trial Banner */}
      {isTrial && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Período de Prueba Activo
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {daysUntilTrialEnd > 0 
                  ? `Te quedan ${daysUntilTrialEnd} días de prueba gratuita`
                  : 'Tu período de prueba ha expirado'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Anual
            <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = planIcons[plan.type as keyof typeof planIcons]
          const isCurrent = isCurrentPlan(plan)
          const isPopularPlan = isPopular(plan)
          const price = getPlanPrice(plan)
          const savings = getPlanSavings(plan)
          const canChange = !isCurrent && (canUpgrade(plan) || canDowngrade(plan))

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isCurrent
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                  : isPopularPlan
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                  : 'hover:shadow-md'
              } ${planColors[plan.type as keyof typeof planColors]}`}
            >
              {/* Popular Badge */}
              {isPopularPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Más Popular</span>
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Plan Actual
                  </div>
                </div>
              )}

              <CardHeader className={`text-center pb-4 ${planGradients[plan.type as keyof typeof planGradients]}`}>
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {planDescriptions[plan.type as keyof typeof planDescriptions]}
                </p>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {CURRENCY_SYMBOL}{price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    /{billingCycle === 'yearly' ? 'año' : 'mes'}
                  </span>
                  {savings > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Ahorra {savings}% con facturación anual
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Usuarios:</span>
                    <span className="font-medium">{plan.max_users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pacientes:</span>
                    <span className="font-medium">{plan.max_patients.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Citas/mes:</span>
                    <span className="font-medium">{plan.max_appointments_per_month.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrent ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Plan Actual
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      loading={loading && selectedPlan === plan.id}
                      disabled={!canChange}
                      className={`w-full ${
                        isPopularPlan
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : ''
                      }`}
                    >
                      {canChange ? 'Seleccionar Plan' : 'No Disponible'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      )}
    </div>
  )
}
