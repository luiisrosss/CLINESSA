import { useState } from 'react'
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlanSelector } from '@/components/billing/PlanSelector'
import { PricingComparison } from '@/components/billing/PricingComparison'
import { PlanLimitsDisplay } from '@/components/billing/PlanLimitsDisplay'
import { useStripe } from '@/hooks/useStripe'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

export function BillingPage() {
  const { organization } = useAuth()
  const {
    subscription,
    loading,
    error,
    isTrial,
    daysUntilTrialEnd,
    hasActiveSubscription,
    createCustomerPortalSession,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription
  } = useStripe()
  
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [showPricingComparison, setShowPricingComparison] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const handleManageBilling = async () => {
    try {
      setActionLoading(true)
      await createCustomerPortalSession()
    } catch (error) {
      console.error('Error opening customer portal:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu suscripción? Se mantendrá activa hasta el final del período actual.')) {
      return
    }

    try {
      setActionLoading(true)
      await cancelSubscription()
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      setActionLoading(true)
      await reactivateSubscription()
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400'
      case 'trial':
        return 'text-blue-600 dark:text-blue-400'
      case 'cancelled':
        return 'text-orange-600 dark:text-orange-400'
      case 'expired':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle
      case 'trial':
        return Calendar
      case 'cancelled':
        return AlertTriangle
      case 'expired':
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa'
      case 'trial':
        return 'Período de Prueba'
      case 'cancelled':
        return 'Cancelada'
      case 'expired':
        return 'Expirada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando información de facturación...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={refreshSubscription}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Facturación</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu suscripción y métodos de pago
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPricingComparison(true)}
            className="flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Ver Planes</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPlanSelector(true)}
            className="flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Cambiar Plan</span>
          </Button>
          <Button
            onClick={handleManageBilling}
            loading={actionLoading}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Gestionar Facturación</span>
          </Button>
        </div>
      </div>

      {/* Trial Warning */}
      {isTrial && daysUntilTrialEnd <= 3 && daysUntilTrialEnd > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Período de Prueba Próximo a Vencer
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Tu período de prueba termina en {daysUntilTrialEnd} días. 
                Selecciona un plan para continuar usando CLINESA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Expired */}
      {isTrial && daysUntilTrialEnd <= 0 && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Período de Prueba Expirado
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Tu período de prueba ha terminado. Selecciona un plan para continuar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Subscription and Limits */}
      {subscription && (
        <PlanLimitsDisplay showUpgradeButton={true} />
      )}

      {/* No Subscription */}
      {!subscription && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay suscripción activa
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Selecciona un plan para comenzar a usar CLINESA
            </p>
            <Button onClick={() => setShowPlanSelector(true)}>
              <CreditCard className="w-4 h-4 mr-2" />
              Ver Planes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Subscription Actions */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Suscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {subscription.cancel_at_period_end ? (
                <Button
                  onClick={handleReactivateSubscription}
                  loading={actionLoading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reactivar Suscripción</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  loading={actionLoading}
                  className="flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancelar Suscripción</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleManageBilling}
                loading={actionLoading}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Gestionar Facturación</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Comparison Modal */}
      {showPricingComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Planes</CardTitle>
              </CardHeader>
              <CardContent>
                <PricingComparison 
                  onSelectPlan={(planId) => {
                    // Handle plan selection
                    setShowPricingComparison(false)
                    setShowPlanSelector(true)
                  }}
                  onClose={() => setShowPricingComparison(false)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Plan Selector Modal */}
      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <PlanSelector onClose={() => setShowPlanSelector(false)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
