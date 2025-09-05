import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// Sentry configuration
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development'

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      new BrowserTracing({
        // Set tracing origins to control which requests are traced
        tracingOrigins: [
          'localhost',
          'clinesa.vercel.app',
          /^https:\/\/.*\.vercel\.app/,
          /^https:\/\/.*\.supabase\.co/,
          /^https:\/\/api\.stripe\.com/,
        ],
        // Capture interactions with these elements
        // Routing instrumentation will be handled by Sentry automatically
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException
        if (error instanceof Error) {
          // Filter out common non-critical errors
          if (
            error.message.includes('ResizeObserver loop limit exceeded') ||
            error.message.includes('Non-Error promise rejection captured') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('Loading CSS chunk')
          ) {
            return null
          }
        }
      }
      return event
    },
    // User context
    initialScope: {
      tags: {
        component: 'clinesa-frontend',
      },
    },
  })

  // Set user context when available
  Sentry.setUser({
    id: undefined,
    email: undefined,
    username: undefined,
  })

  console.log('Sentry initialized successfully')
}

// Helper functions for manual error reporting
export const sentryUtils = {
  // Capture exceptions
  captureException: (error: Error, context?: Record<string, any>) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context)
      }
      Sentry.captureException(error)
    })
  },

  // Capture messages
  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    Sentry.captureMessage(message, level)
  },

  // Set user context
  setUser: (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser(user)
  },

  // Set additional context
  setContext: (key: string, context: any) => {
    Sentry.setContext(key, context)
  },

  // Set tags
  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value)
  },

  // Add breadcrumb
  addBreadcrumb: (breadcrumb: {
    message: string
    category?: string
    level?: 'info' | 'warning' | 'error'
    data?: Record<string, any>
  }) => {
    Sentry.addBreadcrumb(breadcrumb)
  },

  // Start transaction for performance monitoring
  startTransaction: (name: string, op: string) => {
    return Sentry.startTransaction({ name, op })
  },

  // Capture user feedback
  captureUserFeedback: (feedback: {
    eventId: string
    name: string
    email: string
    comments: string
  }) => {
    // User feedback will be handled through PostHog analytics
    console.log('User feedback:', feedback)
  },
}

// Error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary

// Performance monitoring hooks
export const useSentryTransaction = (name: string, op: string) => {
  const transaction = Sentry.startTransaction({ name, op })
  
  return {
    transaction,
    finish: () => transaction.finish(),
    setStatus: (status: 'ok' | 'cancelled' | 'internal_error' | 'unknown_error' | 'invalid_argument' | 'deadline_exceeded' | 'not_found' | 'already_exists' | 'permission_denied' | 'resource_exhausted' | 'failed_precondition' | 'aborted' | 'out_of_range' | 'unimplemented' | 'unavailable' | 'data_loss' | 'unauthenticated') => {
      transaction.setStatus(status)
    },
  }
}

export default Sentry
