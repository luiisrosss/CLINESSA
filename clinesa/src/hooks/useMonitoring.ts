import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { log } from '@/lib/logger'
import { analytics } from '@/lib/analytics'
import { sentryUtils } from '@/lib/sentry'

export function useMonitoring() {
  const { user, userProfile, organization, isAuthenticated } = useAuth()

  // Track user authentication state changes
  useEffect(() => {
    if (isAuthenticated && user && userProfile) {
      // Set user context in Sentry
      sentryUtils.setUser({
        id: user.id,
        email: user.email || undefined,
        username: userProfile.first_name + ' ' + userProfile.last_name,
      })

      // Set user context in PostHog
      analytics.identify(user.id, {
        email: user.email,
        name: userProfile.first_name + ' ' + userProfile.last_name,
        role: userProfile.role,
        organization: organization?.name,
      })

      // Set organization context
      if (organization) {
        analytics.group('organization', organization.id, {
          name: organization.name,
          type: organization.type,
        })
      }

      log.info('User authenticated and context set', {
        feature: 'monitoring',
        action: 'user_context_set',
        userId: user.id,
        organizationId: organization?.id,
      })
    } else if (!isAuthenticated) {
      // Reset contexts on logout
      sentryUtils.setUser({
        id: undefined,
        email: undefined,
        username: undefined,
      })
      analytics.reset()

      log.info('User logged out, contexts reset', {
        feature: 'monitoring',
        action: 'user_context_reset',
      })
    }
  }, [isAuthenticated, user, userProfile, organization])

  // Track page views
  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    analytics.page(pageName, properties)
    log.info(`Page viewed: ${pageName}`, {
      feature: 'navigation',
      action: 'page_view',
      page: pageName,
      ...properties,
    })
  }

  // Track user actions
  const trackUserAction = (action: string, properties?: Record<string, any>) => {
    analytics.track(action, properties)
    log.userAction(action, properties)
  }

  // Track business events
  const trackBusinessEvent = (event: string, properties?: Record<string, any>) => {
    analytics.events.businessEvent(event, properties)
    log.businessEvent(event, properties)
  }

  // Track errors
  const trackError = (error: Error, context?: Record<string, any>) => {
    sentryUtils.captureException(error, context)
    analytics.errorTracking.trackError(error, context)
    log.error('Error tracked', error, context)
  }

  // Track API calls
  const trackApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    method: string = 'GET'
  ): Promise<T> => {
    const startTime = performance.now()
    
    log.apiCall(endpoint, method, { feature: 'api', action: 'call_start' })
    
    try {
      const result = await apiCall()
      const duration = performance.now() - startTime
      
      log.apiSuccess(endpoint, method, duration, { feature: 'api', action: 'call_success' })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      const statusCode = error instanceof Error && 'status' in error ? (error as any).status : undefined
      
      log.apiError(endpoint, method, error instanceof Error ? error : new Error('Unknown error'), statusCode, { 
        feature: 'api', 
        action: 'call_error' 
      })
      
      throw error
    }
  }

  // Track performance
  const trackPerformance = (operation: string, duration: number, context?: Record<string, any>) => {
    log.performance(operation, duration, context)
    analytics.track('performance_metric', {
      operation,
      duration,
      ...context,
    })
  }

  // Track feature usage
  const trackFeatureUsage = (featureName: string, context?: Record<string, any>) => {
    analytics.events.featureUsed(featureName, context)
    log.info(`Feature used: ${featureName}`, {
      feature: 'feature_usage',
      action: 'feature_used',
      feature_name: featureName,
      ...context,
    })
  }

  // Track plan limits
  const trackPlanLimit = (limitType: 'users' | 'patients' | 'appointments', current: number, max: number) => {
    const percentage = Math.round((current / max) * 100)
    
    analytics.events.planLimitReached(limitType)
    log.warn(`Plan limit reached: ${limitType}`, {
      feature: 'plan_limits',
      action: 'limit_reached',
      limit_type: limitType,
      current,
      max,
      percentage,
    })

    // Track in Sentry for monitoring
    sentryUtils.addBreadcrumb({
      message: `Plan limit reached: ${limitType}`,
      category: 'plan_limits',
      level: 'warning',
      data: { limitType, current, max, percentage },
    })
  }

  // Track upgrade prompts
  const trackUpgradePrompt = (currentPlan: string, suggestedPlan: string, shown: boolean = true) => {
    if (shown) {
      analytics.events.upgradePromptShown(currentPlan, suggestedPlan)
      log.info('Upgrade prompt shown', {
        feature: 'upgrade_prompts',
        action: 'prompt_shown',
        current_plan: currentPlan,
        suggested_plan: suggestedPlan,
      })
    } else {
      analytics.events.upgradePromptClicked(currentPlan, suggestedPlan)
      log.info('Upgrade prompt clicked', {
        feature: 'upgrade_prompts',
        action: 'prompt_clicked',
        current_plan: currentPlan,
        suggested_plan: suggestedPlan,
      })
    }
  }

  // Track search
  const trackSearch = (query: string, results: number, filters?: Record<string, any>) => {
    analytics.events.searchPerformed(query, results)
    log.info('Search performed', {
      feature: 'search',
      action: 'search_performed',
      query,
      results,
      filters,
    })
  }

  // Track report generation
  const trackReportGeneration = (reportType: string, parameters?: Record<string, any>) => {
    analytics.events.reportGenerated(reportType)
    log.info('Report generated', {
      feature: 'reports',
      action: 'report_generated',
      report_type: reportType,
      parameters,
    })
  }

  // Track security events
  const trackSecurityEvent = (event: string, context?: Record<string, any>) => {
    log.security(event, context)
    analytics.track('security_event', {
      event,
      ...context,
    })
  }

  return {
    // Page tracking
    trackPageView,
    
    // User actions
    trackUserAction,
    trackBusinessEvent,
    trackFeatureUsage,
    
    // Error tracking
    trackError,
    
    // API tracking
    trackApiCall,
    
    // Performance tracking
    trackPerformance,
    
    // Business tracking
    trackPlanLimit,
    trackUpgradePrompt,
    trackSearch,
    trackReportGeneration,
    trackSecurityEvent,
  }
}
