import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded font-normal transition-colors duration-150'
  
  const variantClasses = {
    default: 'notion-badge',
    accent: 'notion-badge-accent',
    success: 'notion-badge-success',
    warning: 'notion-badge-warning',
    error: 'notion-badge-error',
    outline: 'border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 bg-transparent',
  }
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-sm',
    lg: 'px-2.5 py-1 text-base',
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
