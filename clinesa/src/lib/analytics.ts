import posthog from 'posthog-js'
import { Analytics } from '@vercel/analytics/react'

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

export function initAnalytics() {
  // Initialize PostHog
  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll capture manually
      capture_pageleave: true,
      loaded: (posthog) => {
        console.log('PostHog loaded successfully')
      },
    })
  } else {
    console.warn('PostHog key not configured. Analytics disabled.')
  }
}

// Analytics utilities
export const analytics = {
  // Page tracking
  page: (pageName: string, properties?: Record<string, any>) => {
    posthog.capture('$pageview', {
      page: pageName,
      ...properties,
    })
  },

  // Event tracking
  track: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties)
  },

  // User identification
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties)
  },

  // User properties
  setUserProperties: (properties: Record<string, any>) => {
    posthog.people.set(properties)
  },

  // Group identification (for organizations)
  group: (groupType: string, groupKey: string, properties?: Record<string, any>) => {
    posthog.group(groupType, groupKey, properties)
  },

  // Feature flags
  isFeatureEnabled: (flag: string) => {
    return posthog.isFeatureEnabled(flag)
  },

  // Reset user (on logout)
  reset: () => {
    posthog.reset()
  },

  // Custom events for CLINESA
  events: {
    // Authentication
    userLogin: (method: 'email' | 'google' | 'microsoft') => {
      analytics.track('user_login', { method })
    },
    userLogout: () => {
      analytics.track('user_logout')
    },
    userRegister: (method: 'email' | 'google' | 'microsoft') => {
      analytics.track('user_register', { method })
    },

    // Billing
    planSelected: (planType: 'basic' | 'professional' | 'enterprise', billing: 'monthly' | 'yearly') => {
      analytics.track('plan_selected', { plan_type: planType, billing })
    },
    planUpgraded: (fromPlan: string, toPlan: string) => {
      analytics.track('plan_upgraded', { from_plan: fromPlan, to_plan: toPlan })
    },
    planDowngraded: (fromPlan: string, toPlan: string) => {
      analytics.track('plan_downgraded', { from_plan: fromPlan, to_plan: toPlan })
    },
    subscriptionCancelled: (planType: string, reason?: string) => {
      analytics.track('subscription_cancelled', { plan_type: planType, reason })
    },

    // Patient management
    patientCreated: (patientId: string) => {
      analytics.track('patient_created', { patient_id: patientId })
    },
    patientUpdated: (patientId: string) => {
      analytics.track('patient_updated', { patient_id: patientId })
    },
    patientDeleted: (patientId: string) => {
      analytics.track('patient_deleted', { patient_id: patientId })
    },

    // Appointment management
    appointmentCreated: (appointmentId: string, type: string) => {
      analytics.track('appointment_created', { appointment_id: appointmentId, type })
    },
    appointmentUpdated: (appointmentId: string) => {
      analytics.track('appointment_updated', { appointment_id: appointmentId })
    },
    appointmentCancelled: (appointmentId: string, reason?: string) => {
      analytics.track('appointment_cancelled', { appointment_id: appointmentId, reason })
    },

    // Medical records
    medicalRecordCreated: (recordId: string, type: string) => {
      analytics.track('medical_record_created', { record_id: recordId, type })
    },
    medicalRecordUpdated: (recordId: string) => {
      analytics.track('medical_record_updated', { record_id: recordId })
    },

    // User management
    userInvited: (role: string) => {
      analytics.track('user_invited', { role })
    },
    userRoleChanged: (oldRole: string, newRole: string) => {
      analytics.track('user_role_changed', { old_role: oldRole, new_role: newRole })
    },

    // System events
    planLimitReached: (limitType: 'users' | 'patients' | 'appointments') => {
      analytics.track('plan_limit_reached', { limit_type: limitType })
    },
    upgradePromptShown: (currentPlan: string, suggestedPlan: string) => {
      analytics.track('upgrade_prompt_shown', { current_plan: currentPlan, suggested_plan: suggestedPlan })
    },
    upgradePromptClicked: (currentPlan: string, suggestedPlan: string) => {
      analytics.track('upgrade_prompt_clicked', { current_plan: currentPlan, suggested_plan: suggestedPlan })
    },

    // Feature usage
    featureUsed: (featureName: string, context?: Record<string, any>) => {
      analytics.track('feature_used', { feature_name: featureName, ...context })
    },
    searchPerformed: (query: string, results: number) => {
      analytics.track('search_performed', { query, results })
    },
    reportGenerated: (reportType: string) => {
      analytics.track('report_generated', { report_type: reportType })
    },
  },
}

// Performance monitoring
export const performance = {
  // Web Vitals
  measureWebVitals: () => {
    // This will be handled by Vercel Analytics
    return Analytics
  },

  // Custom performance marks
  mark: (name: string) => {
    performance.mark(name)
  },

  measure: (name: string, startMark: string, endMark?: string) => {
    if (endMark) {
      performance.measure(name, startMark, endMark)
    } else {
      performance.measure(name, startMark)
    }
  },

  // API call timing
  measureApiCall: async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    method: string = 'GET'
  ): Promise<T> => {
    const startTime = performance.now()
    const startMark = `api-${method}-${endpoint}-start`
    const endMark = `api-${method}-${endpoint}-end`
    
    performance.mark(startMark)
    
    try {
      const result = await apiCall()
      performance.mark(endMark)
      performance.measure(`api-${method}-${endpoint}`, startMark, endMark)
      
      const duration = performance.now() - startTime
      analytics.track('api_call_completed', {
        endpoint,
        method,
        duration,
        success: true,
      })
      
      return result
    } catch (error) {
      performance.mark(endMark)
      performance.measure(`api-${method}-${endpoint}-error`, startMark, endMark)
      
      const duration = performance.now() - startTime
      analytics.track('api_call_failed', {
        endpoint,
        method,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      throw error
    }
  },
}

// Error tracking integration
export const errorTracking = {
  // Track errors with context
  trackError: (error: Error, context?: Record<string, any>) => {
    analytics.track('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    })
  },

  // Track API errors
  trackApiError: (endpoint: string, error: Error, statusCode?: number) => {
    analytics.track('api_error', {
      endpoint,
      error_message: error.message,
      status_code: statusCode,
    })
  },

  // Track user feedback
  trackUserFeedback: (feedback: string, rating?: number) => {
    analytics.track('user_feedback', {
      feedback,
      rating,
    })
  },
}

export default analytics
