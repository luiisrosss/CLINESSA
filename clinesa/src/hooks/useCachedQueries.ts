import { useState, useEffect, useCallback } from 'react'
import { useOptimizedQueries } from './useOptimizedQueries'
import { queryCache, CacheKeys, CacheTTL, cacheUtils } from '@/lib/queryCache'
import { useAuth } from './useAuth'

export function useCachedQueries() {
  const { organization } = useAuth()
  const optimizedQueries = useOptimizedQueries()
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0
  })

  // Update cache stats
  const updateCacheStats = useCallback(() => {
    setCacheStats({
      hits: 0, // This would be tracked in a real implementation
      misses: 0, // This would be tracked in a real implementation
      size: queryCache.size()
    })
  }, [])

  // Get dashboard stats with cache
  const getDashboardStats = useCallback(async () => {
    if (!organization) return null

    const cacheKey = CacheKeys.DASHBOARD_STATS(organization.id)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getDashboardStats()
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.MEDIUM)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Get appointment stats with cache
  const getAppointmentStats = useCallback(async (startDate: string, endDate: string) => {
    if (!organization) return null

    const cacheKey = CacheKeys.APPOINTMENT_STATS(organization.id, startDate, endDate)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getAppointmentStats(startDate, endDate)
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.MEDIUM)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Get patient stats with cache
  const getPatientStats = useCallback(async (startDate: string, endDate: string) => {
    if (!organization) return null

    const cacheKey = CacheKeys.PATIENT_STATS(organization.id, startDate, endDate)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getPatientStats(startDate, endDate)
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.MEDIUM)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Get user stats with cache
  const getUserStats = useCallback(async () => {
    if (!organization) return null

    const cacheKey = CacheKeys.USER_STATS(organization.id)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getUserStats()
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.LONG)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Search patients with cache
  const searchPatients = useCallback(async (searchTerm: string, limit: number = 50) => {
    if (!organization || !searchTerm.trim()) return []

    const cacheKey = CacheKeys.PATIENT_SEARCH(organization.id, searchTerm, limit)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.searchPatients(searchTerm, limit)
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.SHORT)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Get appointments with details and cache
  const getAppointmentsWithDetails = useCallback(async (
    startDate: string,
    endDate: string,
    doctorId?: string,
    status?: string
  ) => {
    if (!organization) return []

    const cacheKey = CacheKeys.APPOINTMENTS_DETAILS(organization.id, startDate, endDate, doctorId, status)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getAppointmentsWithDetails(startDate, endDate, doctorId, status)
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.SHORT)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Get medical records with details and cache
  const getMedicalRecordsWithDetails = useCallback(async (
    patientId?: string,
    doctorId?: string,
    limit: number = 100
  ) => {
    if (!organization) return []

    const cacheKey = CacheKeys.MEDICAL_RECORDS_DETAILS(organization.id, patientId, doctorId, limit)
    
    // Check cache first
    const cached = queryCache.get(cacheKey)
    if (cached) {
      updateCacheStats()
      return cached
    }

    // Fetch from database
    const data = await optimizedQueries.getMedicalRecordsWithDetails(patientId, doctorId, limit)
    if (data) {
      queryCache.set(cacheKey, data, CacheTTL.MEDIUM)
    }
    
    updateCacheStats()
    return data
  }, [organization, optimizedQueries, updateCacheStats])

  // Invalidate cache functions
  const invalidateCache = useCallback(() => {
    queryCache.clear()
    updateCacheStats()
  }, [updateCacheStats])

  const invalidateOrganizationCache = useCallback(() => {
    if (organization) {
      cacheUtils.invalidateOrganization(organization.id)
      updateCacheStats()
    }
  }, [organization, updateCacheStats])

  const invalidateTypeCache = useCallback((type: string) => {
    cacheUtils.invalidateType(type)
    updateCacheStats()
  }, [updateCacheStats])

  // Refresh materialized views
  const refreshMaterializedViews = useCallback(async () => {
    const success = await optimizedQueries.refreshMaterializedViews()
    if (success) {
      // Invalidate all cache after refreshing materialized views
      invalidateCache()
    }
    return success
  }, [optimizedQueries, invalidateCache])

  // Cleanup old notifications
  const cleanupOldNotifications = useCallback(async (daysOld: number = 30) => {
    return await optimizedQueries.cleanupOldNotifications(daysOld)
  }, [optimizedQueries])

  // Warm up cache on mount
  useEffect(() => {
    if (organization) {
      cacheUtils.warmUp(organization.id, {
        getDashboardStats,
        getUserStats
      })
    }
  }, [organization, getDashboardStats, getUserStats])

  // Update cache stats on mount
  useEffect(() => {
    updateCacheStats()
  }, [updateCacheStats])

  return {
    // Cached query functions
    getDashboardStats,
    getAppointmentStats,
    getPatientStats,
    getUserStats,
    searchPatients,
    getAppointmentsWithDetails,
    getMedicalRecordsWithDetails,
    
    // Cache management
    invalidateCache,
    invalidateOrganizationCache,
    invalidateTypeCache,
    refreshMaterializedViews,
    cleanupOldNotifications,
    
    // Cache stats
    cacheStats,
    
    // Original optimized queries (for non-cached operations)
    ...optimizedQueries
  }
}
