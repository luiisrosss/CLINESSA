import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useStripe } from './useStripe'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface PlanLimits {
  maxUsers: number
  maxPatients: number
  maxAppointmentsPerMonth: number
  canCreateMedicalRecords: boolean
  canManageUsers: boolean
  canViewReports: boolean
  canIntegrateLabs: boolean
  canSendSMS: boolean
  canExportData: boolean
  canUseAPI: boolean
  canHaveMultipleBranches: boolean
  canCustomizeRoles: boolean
  canAuditLogs: boolean
  canIntegrateHIS: boolean
  supportLevel: 'email' | 'priority' | '24/7'
  backupLevel: 'basic' | 'automatic' | 'enterprise'
}

interface UsageStats {
  currentUsers: number
  currentPatients: number
  currentAppointmentsThisMonth: number
  usagePercentage: {
    users: number
    patients: number
    appointments: number
  }
}

const PLAN_FEATURES = {
  basic: {
    maxUsers: 1,
    maxPatients: 200,
    maxAppointmentsPerMonth: 100,
    canCreateMedicalRecords: true,
    canManageUsers: false,
    canViewReports: false,
    canIntegrateLabs: false,
    canSendSMS: false,
    canExportData: false,
    canUseAPI: false,
    canHaveMultipleBranches: false,
    canCustomizeRoles: false,
    canAuditLogs: false,
    canIntegrateHIS: false,
    supportLevel: 'email' as const,
    backupLevel: 'basic' as const,
  },
  professional: {
    maxUsers: 1,
    maxPatients: 1000,
    maxAppointmentsPerMonth: 500,
    canCreateMedicalRecords: true,
    canManageUsers: true,
    canViewReports: true,
    canIntegrateLabs: true,
    canSendSMS: true,
    canExportData: true,
    canUseAPI: false,
    canHaveMultipleBranches: false,
    canCustomizeRoles: false,
    canAuditLogs: false,
    canIntegrateHIS: false,
    supportLevel: 'priority' as const,
    backupLevel: 'automatic' as const,
  },
  enterprise: {
    maxUsers: 50,
    maxPatients: 5000,
    maxAppointmentsPerMonth: 2000,
    canCreateMedicalRecords: true,
    canManageUsers: true,
    canViewReports: true,
    canIntegrateLabs: true,
    canSendSMS: true,
    canExportData: true,
    canUseAPI: true,
    canHaveMultipleBranches: true,
    canCustomizeRoles: true,
    canAuditLogs: true,
    canIntegrateHIS: true,
    supportLevel: '24/7' as const,
    backupLevel: 'enterprise' as const,
  },
}

export function usePlanLimits() {
  const { organization } = useAuth()
  const { subscription } = useStripe()
  const [limits, setLimits] = useState<PlanLimits | null>(null)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current plan limits
  useEffect(() => {
    if (subscription?.plan) {
      const planType = subscription.plan.type as keyof typeof PLAN_FEATURES
      setLimits(PLAN_FEATURES[planType] || PLAN_FEATURES.basic)
    } else {
      // Default to basic plan limits for trial users
      setLimits(PLAN_FEATURES.basic)
    }
  }, [subscription])

  // Fetch usage statistics
  useEffect(() => {
    if (organization) {
      fetchUsageStats()
    }
  }, [organization])

  const fetchUsageStats = async () => {
    if (!supabase || !organization) return

    try {
      setLoading(true)
      setError(null)

      // Fetch current usage
      const [usersResult, patientsResult, appointmentsResult] = await Promise.all([
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization.id)
          .eq('is_active', true),
        
        supabase
          .from('patients')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization.id)
          .eq('is_active', true),
        
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('organization_id', organization.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ])

      if (usersResult.error) throw usersResult.error
      if (patientsResult.error) throw patientsResult.error
      if (appointmentsResult.error) throw appointmentsResult.error

      const currentUsers = usersResult.count || 0
      const currentPatients = patientsResult.count || 0
      const currentAppointments = appointmentsResult.count || 0

      const currentLimits = limits || PLAN_FEATURES.basic

      setUsage({
        currentUsers,
        currentPatients,
        currentAppointmentsThisMonth: currentAppointments,
        usagePercentage: {
          users: Math.round((currentUsers / currentLimits.maxUsers) * 100),
          patients: Math.round((currentPatients / currentLimits.maxPatients) * 100),
          appointments: Math.round((currentAppointments / currentLimits.maxAppointmentsPerMonth) * 100),
        }
      })
    } catch (err) {
      console.error('Error fetching usage stats:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas de uso')
    } finally {
      setLoading(false)
    }
  }

  // Check if user can perform action
  const canPerformAction = (action: keyof PlanLimits): boolean => {
    if (!limits) return false
    return limits[action] === true
  }

  // Check if user can add more of a resource
  const canAddResource = (resource: 'users' | 'patients' | 'appointments'): boolean => {
    if (!limits || !usage) return false

    switch (resource) {
      case 'users':
        return usage.currentUsers < limits.maxUsers
      case 'patients':
        return usage.currentPatients < limits.maxPatients
      case 'appointments':
        return usage.currentAppointmentsThisMonth < limits.maxAppointmentsPerMonth
      default:
        return false
    }
  }

  // Get remaining capacity
  const getRemainingCapacity = (resource: 'users' | 'patients' | 'appointments'): number => {
    if (!limits || !usage) return 0

    switch (resource) {
      case 'users':
        return Math.max(0, limits.maxUsers - usage.currentUsers)
      case 'patients':
        return Math.max(0, limits.maxPatients - usage.currentPatients)
      case 'appointments':
        return Math.max(0, limits.maxAppointmentsPerMonth - usage.currentAppointmentsThisMonth)
      default:
        return 0
    }
  }

  // Check if approaching limits
  const isApproachingLimit = (resource: 'users' | 'patients' | 'appointments', threshold: number = 80): boolean => {
    if (!usage) return false
    return usage.usagePercentage[resource] >= threshold
  }

  // Check if at limit
  const isAtLimit = (resource: 'users' | 'patients' | 'appointments'): boolean => {
    if (!usage) return false
    return usage.usagePercentage[resource] >= 100
  }

  // Get upgrade recommendation
  const getUpgradeRecommendation = (): string | null => {
    if (!limits || !usage) return null

    // Check which limits are being exceeded
    const exceededLimits = []
    
    if (usage.usagePercentage.users >= 90) exceededLimits.push('usuarios')
    if (usage.usagePercentage.patients >= 90) exceededLimits.push('pacientes')
    if (usage.usagePercentage.appointments >= 90) exceededLimits.push('citas')

    if (exceededLimits.length === 0) return null

    const currentPlan = subscription?.plan?.type || 'basic'
    
    if (currentPlan === 'basic') {
      return `Has alcanzado el límite de ${exceededLimits.join(', ')}. Actualiza al plan Profesional para obtener más capacidad.`
    } else if (currentPlan === 'professional') {
      return `Has alcanzado el límite de ${exceededLimits.join(', ')}. Actualiza al plan Empresarial para obtener más capacidad.`
    }

    return null
  }

  // Get plan benefits for current user
  const getPlanBenefits = (): string[] => {
    if (!limits) return []

    const benefits = []
    
    if (limits.canManageUsers) benefits.push('Gestión de usuarios')
    if (limits.canViewReports) benefits.push('Reportes avanzados')
    if (limits.canIntegrateLabs) benefits.push('Integración con laboratorios')
    if (limits.canSendSMS) benefits.push('Recordatorios SMS')
    if (limits.canExportData) benefits.push('Exportación de datos')
    if (limits.canUseAPI) benefits.push('API personalizada')
    if (limits.canHaveMultipleBranches) benefits.push('Múltiples sucursales')
    if (limits.canCustomizeRoles) benefits.push('Roles personalizados')
    if (limits.canAuditLogs) benefits.push('Auditoría completa')
    if (limits.canIntegrateHIS) benefits.push('Integración con HIS')

    return benefits
  }

  // Get support level description
  const getSupportDescription = (): string => {
    if (!limits) return 'Soporte por email'

    switch (limits.supportLevel) {
      case 'email':
        return 'Soporte por email (respuesta en 24-48 horas)'
      case 'priority':
        return 'Soporte prioritario (respuesta en 4-8 horas) + Chat en vivo'
      case '24/7':
        return 'Soporte 24/7 + Teléfono + Chat + Email'
      default:
        return 'Soporte por email'
    }
  }

  // Get backup level description
  const getBackupDescription = (): string => {
    if (!limits) return 'Backup básico'

    switch (limits.backupLevel) {
      case 'basic':
        return 'Backup diario (7 días de retención)'
      case 'automatic':
        return 'Backup automático (30 días de retención) + Recuperación punto en tiempo'
      case 'enterprise':
        return 'Backup enterprise (90 días de retención) + Recuperación instantánea + Múltiples ubicaciones'
      default:
        return 'Backup básico'
    }
  }

  // Show upgrade prompt if needed
  const showUpgradePrompt = (): boolean => {
    if (!usage) return false
    
    // Show prompt if any usage is above 80%
    return usage.usagePercentage.users >= 80 || 
           usage.usagePercentage.patients >= 80 || 
           usage.usagePercentage.appointments >= 80
  }

  return {
    // State
    limits,
    usage,
    loading,
    error,
    
    // Computed
    canPerformAction,
    canAddResource,
    getRemainingCapacity,
    isApproachingLimit,
    isAtLimit,
    getUpgradeRecommendation,
    getPlanBenefits,
    getSupportDescription,
    getBackupDescription,
    showUpgradePrompt,
    
    // Actions
    refreshUsage: fetchUsageStats,
  }
}