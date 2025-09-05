import { useState } from 'react'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  BarChart3, 
  TestTube, 
  MessageSquare, 
  Download, 
  Code, 
  Building, 
  Shield, 
  Activity, 
  Database,
  AlertTriangle,
  CheckCircle,
  Crown,
  Star,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useStripe } from '@/hooks/useStripe'

interface PlanLimitsDisplayProps {
  showUpgradeButton?: boolean
  compact?: boolean
}

const featureIcons = {
  canManageUsers: Users,
  canViewReports: BarChart3,
  canIntegrateLabs: TestTube,
  canSendSMS: MessageSquare,
  canExportData: Download,
  canUseAPI: Code,
  canHaveMultipleBranches: Building,
  canCustomizeRoles: Shield,
  canAuditLogs: Activity,
  canIntegrateHIS: Database,
}

const planIcons = {
  basic: Zap,
  professional: Star,
  enterprise: Crown,
}

const planColors = {
  basic: 'text-gray-600 dark:text-gray-400',
  professional: 'text-blue-600 dark:text-blue-400',
  enterprise: 'text-purple-600 dark:text-purple-400',
}

const planGradients = {
  basic: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
  professional: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
  enterprise: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
}

export function PlanLimitsDisplay({ showUpgradeButton = true, compact = false }: PlanLimitsDisplayProps) {
  const { 
    limits, 
    usage, 
    loading, 
    canAddResource, 
    getRemainingCapacity, 
    isApproachingLimit, 
    isAtLimit,
    getUpgradeRecommendation,
    getPlanBenefits,
    getSupportDescription,
    getBackupDescription,
    showUpgradePrompt
  } = usePlanLimits()
  
  const { subscription, createCheckoutSession } = useStripe()
  const [upgrading, setUpgrading] = useState(false)

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
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando límites del plan...</span>
      </div>
    )
  }

  if (!limits || !usage) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No se pudieron cargar los límites del plan</p>
      </div>
    )
  }

  const currentPlan = subscription?.plan?.type || 'basic'
  const PlanIcon = planIcons[currentPlan as keyof typeof planIcons] || Zap
  const upgradeRecommendation = getUpgradeRecommendation()
  const shouldShowUpgradePrompt = showUpgradePrompt()

  const resourceData = [
    {
      key: 'users' as const,
      label: 'Usuarios',
      icon: Users,
      current: usage.currentUsers,
      max: limits.maxUsers,
      remaining: getRemainingCapacity('users'),
      canAdd: canAddResource('users'),
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
      canAdd: canAddResource('patients'),
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
      canAdd: canAddResource('appointments'),
      isApproaching: isApproachingLimit('appointments'),
      isAtLimit: isAtLimit('appointments'),
    },
  ]

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlanIcon className={`w-6 h-6 ${planColors[currentPlan as keyof typeof planColors]}`} />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Plan {subscription?.plan?.name || 'Básico'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getSupportDescription()}
              </p>
            </div>
          </div>
          {showUpgradeButton && (
            <Button
              size="sm"
              onClick={handleUpgrade}
              loading={upgrading}
              variant="outline"
            >
              Actualizar
            </Button>
          )}
        </div>

        {/* Usage Summary */}
        <div className="grid grid-cols-3 gap-4">
          {resourceData.map((resource) => {
            const Icon = resource.icon
            const percentage = Math.round((resource.current / resource.max) * 100)
            
            return (
              <div key={resource.key} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.current}/{resource.max}
                  </span>
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
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {resource.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Upgrade Prompt */}
        {shouldShowUpgradePrompt && upgradeRecommendation && (
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {upgradeRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Header */}
      <Card className={`${planGradients[currentPlan as keyof typeof planGradients]} border-0`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <PlanIcon className={`w-6 h-6 ${planColors[currentPlan as keyof typeof planColors]}`} />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Plan {subscription?.plan?.name || 'Básico'}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  {subscription?.plan?.description || 'Para médicos independientes y consultorios pequeños'}
                </p>
              </div>
            </div>
            {showUpgradeButton && (
              <Button
                onClick={handleUpgrade}
                loading={upgrading}
                className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Actualizar Plan
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Uso Actual del Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {resourceData.map((resource) => {
              const Icon = resource.icon
              const percentage = Math.round((resource.current / resource.max) * 100)
              
              return (
                <div key={resource.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {resource.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.current.toLocaleString()} / {resource.max.toLocaleString()}
                      </span>
                      {resource.isAtLimit ? (
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                          Límite alcanzado
                        </span>
                      ) : resource.isApproaching ? (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                          Cerca del límite
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
                    className={`h-3 ${
                      resource.isAtLimit 
                        ? 'bg-red-100 dark:bg-red-900' 
                        : resource.isApproaching 
                        ? 'bg-yellow-100 dark:bg-yellow-900' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  />
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage}% utilizado
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Características Incluidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getPlanBenefits().map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support & Backup Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Soporte</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              {getSupportDescription()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              {getBackupDescription()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Recommendation */}
      {shouldShowUpgradePrompt && upgradeRecommendation && (
        <Card className="border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Recomendación de Actualización
                </h3>
                <p className="text-orange-800 dark:text-orange-200 mb-4">
                  {upgradeRecommendation}
                </p>
                {showUpgradeButton && (
                  <Button
                    onClick={handleUpgrade}
                    loading={upgrading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Actualizar Plan Ahora
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
