import { useState, useEffect } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { stripePromise, hasValidStripeConfig } from '@/lib/stripe'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface SubscriptionPlan {
  id: string
  name: string
  type: 'basic' | 'professional' | 'enterprise'
  price_monthly: number
  price_yearly: number
  max_users: number
  max_patients: number
  max_appointments_per_month: number
  features: string[]
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
}

interface Subscription {
  id: string
  organization_id: string
  plan_id: string
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'trial'
  trial_start_date?: string
  trial_end_date?: string
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  cancelled_at?: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  plan?: SubscriptionPlan
}

export function useStripe() {
  const { organization } = useAuth()
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])

  // Initialize Stripe
  useEffect(() => {
    if (hasValidStripeConfig) {
      stripePromise?.then(setStripe)
    }
  }, [])

  // Fetch subscription plans
  useEffect(() => {
    if (organization) {
      fetchPlans()
      fetchSubscription()
    }
  }, [organization])

  const fetchPlans = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (err) {
      console.error('Error fetching plans:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar los planes')
    }
  }

  const fetchSubscription = async () => {
    if (!supabase || !organization) return

    try {
      const { data, error } = await supabase
        .from('organization_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setSubscription(data || null)
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar la suscripción')
    }
  }

  const createCheckoutSession = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    if (!stripe || !organization) {
      throw new Error('Stripe no está configurado o no hay organización')
    }

    try {
      setLoading(true)
      setError(null)

      // Create checkout session on backend
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          organization_id: organization.id,
          plan_id: planId,
          billing_cycle: billingCycle,
          success_url: `${window.location.origin}/dashboard?subscription=success`,
          cancel_url: `${window.location.origin}/dashboard?subscription=cancelled`,
        }
      })

      if (error) throw error

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (stripeError) throw stripeError

    } catch (err) {
      console.error('Error creating checkout session:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la sesión de pago'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCustomerPortalSession = async () => {
    if (!organization) {
      throw new Error('No hay organización')
    }

    try {
      setLoading(true)
      setError(null)

      // Create customer portal session on backend
      const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
        body: {
          organization_id: organization.id,
          return_url: `${window.location.origin}/dashboard/settings`,
        }
      })

      if (error) throw error

      // Redirect to Stripe Customer Portal
      window.location.href = data.url

    } catch (err) {
      console.error('Error creating customer portal session:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la sesión del portal'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    if (!subscription || !organization) {
      throw new Error('No hay suscripción activa')
    }

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('organization_subscriptions')
        .update({ 
          cancel_at_period_end: true,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      if (error) throw error

      toast.success('Suscripción cancelada. Se mantendrá activa hasta el final del período actual.')
      await fetchSubscription()

    } catch (err) {
      console.error('Error cancelling subscription:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la suscripción'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reactivateSubscription = async () => {
    if (!subscription || !organization) {
      throw new Error('No hay suscripción para reactivar')
    }

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('organization_subscriptions')
        .update({ 
          cancel_at_period_end: false,
          cancelled_at: null
        })
        .eq('id', subscription.id)

      if (error) throw error

      toast.success('Suscripción reactivada correctamente')
      await fetchSubscription()

    } catch (err) {
      console.error('Error reactivating subscription:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al reactivar la suscripción'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const isTrialExpired = () => {
    if (!subscription || subscription.status !== 'trial') return false
    if (!subscription.trial_end_date) return false
    return new Date(subscription.trial_end_date) < new Date()
  }

  const getDaysUntilTrialEnd = () => {
    if (!subscription || subscription.status !== 'trial' || !subscription.trial_end_date) return 0
    const trialEnd = new Date(subscription.trial_end_date)
    const now = new Date()
    const diffTime = trialEnd.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const canUpgrade = (targetPlan: SubscriptionPlan) => {
    if (!subscription || !subscription.plan) return true
    
    const currentPlan = subscription.plan
    const planOrder = ['basic', 'professional', 'enterprise']
    const currentIndex = planOrder.indexOf(currentPlan.type)
    const targetIndex = planOrder.indexOf(targetPlan.type)
    
    return targetIndex > currentIndex
  }

  const canDowngrade = (targetPlan: SubscriptionPlan) => {
    if (!subscription || !subscription.plan) return true
    
    const currentPlan = subscription.plan
    const planOrder = ['basic', 'professional', 'enterprise']
    const currentIndex = planOrder.indexOf(currentPlan.type)
    const targetIndex = planOrder.indexOf(targetPlan.type)
    
    return targetIndex < currentIndex
  }

  return {
    // State
    stripe,
    loading,
    error,
    subscription,
    plans,
    
    // Computed
    isTrialExpired: isTrialExpired(),
    daysUntilTrialEnd: getDaysUntilTrialEnd(),
    hasActiveSubscription: subscription?.status === 'active',
    isTrial: subscription?.status === 'trial',
    
    // Actions
    createCheckoutSession,
    createCustomerPortalSession,
    cancelSubscription,
    reactivateSubscription,
    canUpgrade,
    canDowngrade,
    refreshSubscription: fetchSubscription,
  }
}
