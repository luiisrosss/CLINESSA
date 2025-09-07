import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  description?: string
  className?: string
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  description,
  className,
  loading = false
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={cn('attio-hover-lift', className)}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="attio-skeleton h-4 w-24" />
              {icon && <div className="attio-skeleton h-6 w-6 rounded" />}
            </div>
            <div className="attio-skeleton h-8 w-16" />
            {description && <div className="attio-skeleton h-3 w-32" />}
          </div>
        </CardContent>
      </Card>
    )
  }

  const changeColor = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-neutral-600 dark:text-neutral-400'
  }

  const changeIcon = {
    increase: '↗',
    decrease: '↘',
    neutral: '→'
  }

  return (
    <Card className={cn('attio-hover-lift', className)}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {title}
            </h3>
            {icon && (
              <div className="text-neutral-400 dark:text-neutral-500">
                {icon}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {value}
            </div>
            
            {change && (
              <div className="flex items-center space-x-1">
                <span className={cn('text-sm font-medium', changeColor[change.type])}>
                  {changeIcon[change.type]} {Math.abs(change.value)}%
                </span>
                <Badge 
                  variant={change.type === 'increase' ? 'success' : change.type === 'decrease' ? 'error' : 'default'}
                  size="sm"
                >
                  {change.type === 'increase' ? 'Up' : change.type === 'decrease' ? 'Down' : 'Same'}
                </Badge>
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricGridProps {
  children: React.ReactNode
  className?: string
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {children}
    </div>
  )
}

interface ProgressMetricProps {
  title: string
  value: number
  max: number
  unit?: string
  className?: string
  loading?: boolean
}

export function ProgressMetric({
  title,
  value,
  max,
  unit = '%',
  className,
  loading = false
}: ProgressMetricProps) {
  const percentage = Math.min((value / max) * 100, 100)

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="attio-skeleton h-4 w-32" />
            <div className="attio-skeleton h-2 w-full rounded-full" />
            <div className="attio-skeleton h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-900 dark:text-neutral-100">
                {value}{unit}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {max}{unit}
              </span>
            </div>
            
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-500 ease-attio"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
