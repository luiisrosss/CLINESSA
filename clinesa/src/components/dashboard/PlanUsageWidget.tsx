import { Users, UserCheck, Calendar, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useStripe } from '@/hooks/useStripe'
import { useState } from 'react'

export function PlanUsageWidget() {
  const { 
    limits, 
    usage, 
    loading, 
    isApproachingLimit, 
    isAtLimit,
    getRemainingCapacity,
    showUpgradePrompt,
    getUpgradeRecommendation
  } = usePlanLimits()
  
  const { createCheckoutSession, subscription } = useStripe()
  const [upgrading, setUpgrading] = useState(false)

  const handleUpgrade = async () => {
    if (!subscription) return

    try {
      setUpgrading(true)
      
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
    } finally {
      setUpgrading(false)
    }
  }

  if (loading || !limits || !usage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const resourceData = [
    {
      key: 'users' as const,
      label: 'Usuarios',
      icon: Users,
      current: usage.currentUsers,
      max: limits.maxUsers,
      remaining: getRemainingCapacity('users'),
      isApproaching: isApproachingLimit('users'),
      isAtLimit: isAtLimit('users'),
    },
    {
      key: 'patients' as const,
      label: 'Pacientes',
      icon: UserCheck,
      current: usage.currentPatients,
      max: limits.maxPatients,
      remaining: getRemainingCapacity('patients'),
      isApproaching: isApproachingLimit('patients'),
      isAtLimit: isAtLimit('patients'),
    },
    {
      key: 'appointments' as const,
      label: 'Citas este mes',
      icon: Calendar,
      current: usage.currentAppointmentsThisMonth,
      max: limits.maxAppointmentsPerMonth,
      remaining: getRemainingCapacity('appointments'),
      isApproaching: isApproachingLimit('appointments'),
      isAtLimit: isAtLimit('appointments'),
    },
  ]

  const hasAnyLimitReached = resourceData.some(resource => resource.isAtLimit)
  const hasAnyApproachingLimit = resourceData.some(resource => resource.isApproaching)

  return (
    <Card className={hasAnyLimitReached ? 'border-red-200 dark:border-red-800' : hasAnyApproachingLimit ? 'border-yellow-200 dark:border-yellow-800' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Uso del Plan</span>
          </CardTitle>
          {showUpgradePrompt() && (
            <Button
              size="sm"
              onClick={handleUpgrade}
              loading={upgrading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Actualizar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upgrade Recommendation */}
        {showUpgradePrompt() && getUpgradeRecommendation() && (
          <div className={`p-3 rounded-lg ${
            hasAnyLimitReached 
              ? 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
              : 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700'
          }`}>
            <div className="flex items-start space-x-2">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                hasAnyLimitReached 
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  hasAnyLimitReached 
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {getUpgradeRecommendation()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resource Usage */}
        <div className="space-y-4">
          {resourceData.map((resource) => {
            const Icon = resource.icon
            const percentage = Math.round((resource.current / resource.max) * 100)
            
            return (
              <div key={resource.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${
                      resource.isAtLimit 
                        ? 'text-red-500'
                        : resource.isApproaching 
                        ? 'text-yellow-500'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {resource.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.current.toLocaleString()} / {resource.max.toLocaleString()}
                    </span>
                    {resource.isAtLimit ? (
                      <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                        Límite
                      </span>
                    ) : resource.isApproaching ? (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                        {resource.remaining} restantes
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        {resource.remaining} disponibles
                      </span>
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    resource.isAtLimit 
                      ? 'bg-red-100 dark:bg-red-900' 
                      : resource.isApproaching 
                      ? 'bg-yellow-100 dark:bg-yellow-900' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Plan Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Plan actual: <span className="font-medium text-gray-900 dark:text-white">
                {subscription?.plan?.name || 'Básico'}
              </span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {subscription?.plan?.type === 'basic' && '$19.99/mes'}
              {subscription?.plan?.type === 'professional' && '$39.99/mes'}
              {subscription?.plan?.type === 'enterprise' && '$99.99/mes'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
