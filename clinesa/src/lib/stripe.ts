import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Debug: Log environment variables in development
if (import.meta.env.DEV) {
  console.log('Stripe Publishable Key:', stripePublishableKey ? 'Present' : 'Missing')
}

// Check if we have valid Stripe credentials
export const hasValidStripeConfig = !!stripePublishableKey

// Initialize Stripe
export const stripePromise = hasValidStripeConfig 
  ? loadStripe(stripePublishableKey!)
  : null

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: stripePublishableKey,
  hasValidConfig: hasValidStripeConfig,
}

// Subscription plan IDs (these will be created in Stripe dashboard)
export const STRIPE_PLAN_IDS = {
  basic: {
    monthly: 'price_basic_monthly', // Replace with actual Stripe price ID
    yearly: 'price_basic_yearly',   // Replace with actual Stripe price ID
  },
  professional: {
    monthly: 'price_professional_monthly', // Replace with actual Stripe price ID
    yearly: 'price_professional_yearly',   // Replace with actual Stripe price ID
  },
  enterprise: {
    monthly: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    yearly: 'price_enterprise_yearly',   // Replace with actual Stripe price ID
  },
}

// Currency configuration
export const CURRENCY = 'usd'
export const CURRENCY_SYMBOL = '$'

// Webhook events we handle
export const STRIPE_WEBHOOK_EVENTS = {
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
} as const

export type StripeWebhookEvent = typeof STRIPE_WEBHOOK_EVENTS[keyof typeof STRIPE_WEBHOOK_EVENTS]
