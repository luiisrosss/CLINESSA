// Structured logging utility
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  userId?: string
  organizationId?: string
  sessionId?: string
  requestId?: string
  feature?: string
  action?: string
  [key: string]: any
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  performance?: {
    duration: number
    memory?: number
  }
}

class Logger {
  private currentLevel: LogLevel
  private sessionId: string
  private isDevelopment: boolean

  constructor() {
    this.currentLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO
    this.sessionId = this.generateSessionId()
    this.isDevelopment = import.meta.env.DEV
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        sessionId: this.sessionId,
        ...context,
      },
    }

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    if (this.isDevelopment) {
      logEntry.performance = {
        duration: performance.now(),
        memory: (performance as any).memory?.usedJSHeapSize,
      }
    }

    return logEntry
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel
  }

  private output(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return

    const logEntry = this.formatLog(level, message, context, error)
    
    // Console output for development
    if (this.isDevelopment) {
      const consoleMethod = this.getConsoleMethod(level)
      const styledMessage = this.getStyledMessage(level, message)
      
      if (context) {
        console[consoleMethod](styledMessage, context)
      } else {
        console[consoleMethod](styledMessage)
      }
      
      if (error) {
        console.error('Error details:', error)
      }
    }

    // Send to external logging service in production
    if (!this.isDevelopment) {
      this.sendToExternalService(logEntry)
    }
  }

  private getConsoleMethod(level: LogLevel): 'log' | 'info' | 'warn' | 'error' {
    switch (level) {
      case LogLevel.DEBUG:
        return 'log'
      case LogLevel.INFO:
        return 'info'
      case LogLevel.WARN:
        return 'warn'
      case LogLevel.ERROR:
        return 'error'
      default:
        return 'log'
    }
  }

  private getStyledMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleTimeString()
    const levelName = LogLevel[level]
    
    switch (level) {
      case LogLevel.DEBUG:
        return `🔍 [${timestamp}] DEBUG: ${message}`
      case LogLevel.INFO:
        return `ℹ️ [${timestamp}] INFO: ${message}`
      case LogLevel.WARN:
        return `⚠️ [${timestamp}] WARN: ${message}`
      case LogLevel.ERROR:
        return `❌ [${timestamp}] ERROR: ${message}`
      default:
        return `📝 [${timestamp}] ${levelName}: ${message}`
    }
  }

  private async sendToExternalService(logEntry: LogEntry): Promise<void> {
    try {
      // In production, you would send logs to your logging service
      // For now, we'll just store them in localStorage for debugging
      const logs = JSON.parse(localStorage.getItem('clinesa_logs') || '[]')
      logs.push(logEntry)
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }
      
      localStorage.setItem('clinesa_logs', JSON.stringify(logs))
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    this.output(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext): void {
    this.output(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.output(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.output(LogLevel.ERROR, message, context, error)
  }

  // Specialized logging methods
  apiCall(endpoint: string, method: string, context?: LogContext): void {
    this.info(`API Call: ${method} ${endpoint}`, {
      ...context,
      feature: 'api',
      action: 'call',
      endpoint,
      method,
    })
  }

  apiSuccess(endpoint: string, method: string, duration: number, context?: LogContext): void {
    this.info(`API Success: ${method} ${endpoint} (${duration}ms)`, {
      ...context,
      feature: 'api',
      action: 'success',
      endpoint,
      method,
      duration,
    })
  }

  apiError(endpoint: string, method: string, error: Error, statusCode?: number, context?: LogContext): void {
    this.error(`API Error: ${method} ${endpoint}`, error, {
      ...context,
      feature: 'api',
      action: 'error',
      endpoint,
      method,
      statusCode,
    })
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      feature: 'user',
      action,
    })
  }

  businessEvent(event: string, context?: LogContext): void {
    this.info(`Business Event: ${event}`, {
      ...context,
      feature: 'business',
      action: event,
    })
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation} (${duration}ms)`, {
      ...context,
      feature: 'performance',
      action: operation,
      duration,
    })
  }

  security(event: string, context?: LogContext): void {
    this.warn(`Security Event: ${event}`, {
      ...context,
      feature: 'security',
      action: event,
    })
  }

  // Utility methods
  setLevel(level: LogLevel): void {
    this.currentLevel = level
  }

  setContext(context: LogContext): void {
    // This would be used to set global context
    // Implementation depends on your needs
  }

  getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('clinesa_logs') || '[]')
    } catch {
      return []
    }
  }

  clearLogs(): void {
    localStorage.removeItem('clinesa_logs')
  }

  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2)
  }
}

// Create singleton instance
export const logger = new Logger()

// Convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  apiCall: (endpoint: string, method: string, context?: LogContext) => logger.apiCall(endpoint, method, context),
  apiSuccess: (endpoint: string, method: string, duration: number, context?: LogContext) => logger.apiSuccess(endpoint, method, duration, context),
  apiError: (endpoint: string, method: string, error: Error, statusCode?: number, context?: LogContext) => logger.apiError(endpoint, method, error, statusCode, context),
  userAction: (action: string, context?: LogContext) => logger.userAction(action, context),
  businessEvent: (event: string, context?: LogContext) => logger.businessEvent(event, context),
  performance: (operation: string, duration: number, context?: LogContext) => logger.performance(operation, duration, context),
  security: (event: string, context?: LogContext) => logger.security(event, context),
}

export default logger
