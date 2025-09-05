import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { log, LogLevel, LogEntry } from '@/lib/logger'
import { Download, Trash2, Filter, Eye, EyeOff } from 'lucide-react'

interface LogViewerProps {
  isOpen: boolean
  onClose: () => void
}

export function LogViewer({ isOpen, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadLogs()
    }
  }, [isOpen])

  useEffect(() => {
    filterLogs()
  }, [logs, levelFilter, searchTerm])

  const loadLogs = () => {
    const allLogs = log.getLogs()
    setLogs(allLogs)
  }

  const filterLogs = () => {
    let filtered = logs

    // Filter by level
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.feature?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.action?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }

  const clearLogs = () => {
    log.clearLogs()
    setLogs([])
    setFilteredLogs([])
  }

  const exportLogs = () => {
    const logData = log.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clinesa-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-500'
      case LogLevel.INFO:
        return 'text-blue-500'
      case LogLevel.WARN:
        return 'text-yellow-500'
      case LogLevel.ERROR:
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return '🔍'
      case LogLevel.INFO:
        return 'ℹ️'
      case LogLevel.WARN:
        return '⚠️'
      case LogLevel.ERROR:
        return '❌'
      default:
        return '📝'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Log Viewer</span>
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              <EyeOff className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Select
              value={levelFilter}
              onValueChange={(value) => setLevelFilter(value as LogLevel | 'all')}
            >
              <option value="all">All Levels</option>
              <option value={LogLevel.DEBUG}>Debug</option>
              <option value={LogLevel.INFO}>Info</option>
              <option value={LogLevel.WARN}>Warning</option>
              <option value={LogLevel.ERROR}>Error</option>
            </Select>

            <Button
              variant="outline"
              onClick={loadLogs}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={exportLogs}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>

            <Button
              variant="outline"
              onClick={clearLogs}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          </div>

          {/* Logs Display */}
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No logs found
                </div>
              ) : (
                filteredLogs.map((logEntry, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getLevelIcon(logEntry.level)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getLevelColor(logEntry.level)}`}>
                            {LogLevel[logEntry.level]}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(logEntry.timestamp)}
                          </span>
                          {logEntry.performance && (
                            <span className="text-xs text-gray-400">
                              ({logEntry.performance.duration.toFixed(2)}ms)
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {logEntry.message}
                          </p>
                          
                          {logEntry.context && (
                            <div className="mt-2">
                              <details className="text-xs">
                                <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                  Context
                                </summary>
                                <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(logEntry.context, null, 2)}
                                </pre>
                              </details>
                            </div>
                          )}
                          
                          {logEntry.error && (
                            <div className="mt-2">
                              <details className="text-xs">
                                <summary className="cursor-pointer text-red-600 hover:text-red-800">
                                  Error Details
                                </summary>
                                <div className="mt-1 p-2 bg-red-50 dark:bg-red-900 rounded text-xs">
                                  <div className="font-medium text-red-800 dark:text-red-200">
                                    {logEntry.error.name}: {logEntry.error.message}
                                  </div>
                                  {logEntry.error.stack && (
                                    <pre className="mt-1 text-red-700 dark:text-red-300 overflow-x-auto">
                                      {logEntry.error.stack}
                                    </pre>
                                  )}
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filteredLogs.length} of {logs.length} logs
            </span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-scroll</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
