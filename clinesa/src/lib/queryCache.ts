// Query Cache for optimizing database queries
// Implements in-memory caching with TTL (Time To Live)

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class QueryCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  // Set cache item
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  // Check if cache has valid item
  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) return false

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete cache item
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Clear expired items
  clearExpired(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Generate cache key
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    
    return `${prefix}:${sortedParams}`
  }
}

// Create singleton instance
export const queryCache = new QueryCache()

// Cache key generators
export const CacheKeys = {
  DASHBOARD_STATS: (orgId: string) => `dashboard_stats:${orgId}`,
  APPOINTMENT_STATS: (orgId: string, startDate: string, endDate: string) => 
    `appointment_stats:${orgId}:${startDate}:${endDate}`,
  PATIENT_STATS: (orgId: string, startDate: string, endDate: string) => 
    `patient_stats:${orgId}:${startDate}:${endDate}`,
  USER_STATS: (orgId: string) => `user_stats:${orgId}`,
  PATIENT_SEARCH: (orgId: string, searchTerm: string, limit: number) => 
    `patient_search:${orgId}:${searchTerm}:${limit}`,
  APPOINTMENTS_DETAILS: (orgId: string, startDate: string, endDate: string, doctorId?: string, status?: string) => 
    `appointments_details:${orgId}:${startDate}:${endDate}:${doctorId || 'all'}:${status || 'all'}`,
  MEDICAL_RECORDS_DETAILS: (orgId: string, patientId?: string, doctorId?: string, limit: number) => 
    `medical_records_details:${orgId}:${patientId || 'all'}:${doctorId || 'all'}:${limit}`,
  PATIENTS_LIST: (orgId: string, page: number, limit: number, filters: Record<string, any>) => 
    `patients_list:${orgId}:${page}:${limit}:${JSON.stringify(filters)}`,
  APPOINTMENTS_LIST: (orgId: string, page: number, limit: number, filters: Record<string, any>) => 
    `appointments_list:${orgId}:${page}:${limit}:${JSON.stringify(filters)}`,
  USERS_LIST: (orgId: string, page: number, limit: number, filters: Record<string, any>) => 
    `users_list:${orgId}:${page}:${limit}:${JSON.stringify(filters)}`,
  MEDICAL_RECORDS_LIST: (orgId: string, page: number, limit: number, filters: Record<string, any>) => 
    `medical_records_list:${orgId}:${page}:${limit}:${JSON.stringify(filters)}`
}

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
}

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate cache by pattern
  invalidateByPattern: (pattern: string) => {
    const keys = queryCache.keys()
    const regex = new RegExp(pattern)
    
    keys.forEach(key => {
      if (regex.test(key)) {
        queryCache.delete(key)
      }
    })
  },

  // Invalidate all cache for an organization
  invalidateOrganization: (orgId: string) => {
    cacheUtils.invalidateByPattern(`.*:${orgId}:.*`)
  },

  // Invalidate specific cache type
  invalidateType: (type: string) => {
    cacheUtils.invalidateByPattern(`^${type}:.*`)
  },

  // Warm up cache with common queries
  warmUp: async (orgId: string, queries: any) => {
    try {
      // Pre-load dashboard stats
      if (queries.getDashboardStats) {
        const stats = await queries.getDashboardStats()
        if (stats) {
          queryCache.set(CacheKeys.DASHBOARD_STATS(orgId), stats, CacheTTL.MEDIUM)
        }
      }

      // Pre-load user stats
      if (queries.getUserStats) {
        const userStats = await queries.getUserStats()
        if (userStats) {
          queryCache.set(CacheKeys.USER_STATS(orgId), userStats, CacheTTL.LONG)
        }
      }
    } catch (error) {
      console.error('Error warming up cache:', error)
    }
  }
}

// Auto-cleanup expired items every 5 minutes
setInterval(() => {
  queryCache.clearExpired()
}, 5 * 60 * 1000)

export default queryCache
