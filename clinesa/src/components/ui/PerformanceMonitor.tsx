import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Database, 
  Clock, 
  HardDrive, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'
import { queryCache, CacheTTL } from '@/lib/queryCache'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'

interface PerformanceMetrics {
  cacheSize: number
  cacheHitRate: number
  averageQueryTime: number
  activeConnections: number
  memoryUsage: number
  lastRefresh: Date | null
}

interface PerformanceMonitorProps {
  className?: string
  showDetails?: boolean
}

export function PerformanceMonitor({ className, showDetails = false }: PerformanceMonitorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheSize: 0,
    cacheHitRate: 0,
    averageQueryTime: 0,
    activeConnections: 0,
    memoryUsage: 0,
    lastRefresh: null
  })
  const [alerts, setAlerts] = useState<string[]>([])

  // Update metrics
  const updateMetrics = () => {
    const cacheSize = queryCache.size()
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
    const maxMemory = (performance as any).memory?.totalJSHeapSize || 0
    const memoryPercentage = maxMemory > 0 ? (memoryUsage / maxMemory) * 100 : 0

    setMetrics(prev => ({
      ...prev,
      cacheSize,
      memoryUsage: memoryPercentage,
      lastRefresh: new Date()
    }))

    // Check for alerts
    const newAlerts: string[] = []
    
    if (cacheSize > 100) {
      newAlerts.push('Cache size is high (>100 items)')
    }
    
    if (memoryPercentage > 80) {
      newAlerts.push('Memory usage is high (>80%)')
    }
    
    if (prev.averageQueryTime > 1000) {
      newAlerts.push('Average query time is slow (>1s)')
    }

    setAlerts(newAlerts)
  }

  // Clear cache
  const clearCache = () => {
    queryCache.clear()
    updateMetrics()
  }

  // Refresh materialized views
  const refreshViews = async () => {
    // This would call the actual refresh function
    updateMetrics()
  }

  // Update metrics every 5 seconds
  useEffect(() => {
    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500'
    if (value >= thresholds.warning) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <X className="w-4 h-4" />
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
        title="Performance Monitor"
      >
        <Activity className="w-5 h-5" />
        {alerts.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {alerts.length}
          </motion.span>
        )}
      </button>

      {/* Monitor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-primary-1000 rounded-lg shadow-lg border border-primary-200 dark:border-primary-800 z-50"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-primary-1000 dark:text-primary-0">
                    Performance Monitor
                  </CardTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Alerts */}
                {alerts.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Alerts
                      </span>
                    </div>
                    <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                      {alerts.map((alert, index) => (
                        <li key={index}>• {alert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-3">
                  {/* Cache Size */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-primary-700 dark:text-primary-300">
                        Cache Size
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getStatusColor(metrics.cacheSize, { warning: 50, critical: 100 })}`}>
                        {metrics.cacheSize}
                      </span>
                      {getStatusIcon(metrics.cacheSize, { warning: 50, critical: 100 })}
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-primary-700 dark:text-primary-300">
                        Memory Usage
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getStatusColor(metrics.memoryUsage, { warning: 70, critical: 90 })}`}>
                        {metrics.memoryUsage.toFixed(1)}%
                      </span>
                      {getStatusIcon(metrics.memoryUsage, { warning: 70, critical: 90 })}
                    </div>
                  </div>

                  {/* Query Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-primary-700 dark:text-primary-300">
                        Avg Query Time
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getStatusColor(metrics.averageQueryTime, { warning: 500, critical: 1000 })}`}>
                        {metrics.averageQueryTime.toFixed(0)}ms
                      </span>
                      {getStatusIcon(metrics.averageQueryTime, { warning: 500, critical: 1000 })}
                    </div>
                  </div>

                  {/* Last Refresh */}
                  {metrics.lastRefresh && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-primary-500" />
                        <span className="text-sm text-primary-700 dark:text-primary-300">
                          Last Refresh
                        </span>
                      </div>
                      <span className="text-xs text-primary-500">
                        {metrics.lastRefresh.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-primary-200 dark:border-primary-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCache}
                    className="flex-1 text-xs"
                  >
                    Clear Cache
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshViews}
                    className="flex-1 text-xs"
                  >
                    Refresh Views
                  </Button>
                </div>

                {/* Cache TTL Info */}
                {showDetails && (
                  <div className="text-xs text-primary-500 space-y-1">
                    <div>Cache TTL: {CacheTTL.SHORT / 1000}s - {CacheTTL.VERY_LONG / 1000 / 60}m</div>
                    <div>Auto-cleanup: Every 5 minutes</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
