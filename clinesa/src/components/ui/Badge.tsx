import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'warm' | 'terracotta' | 'beige' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-normal transition-colors duration-200'
  
  const variantClasses = {
    default: 'minimal-badge',
    warm: 'minimal-badge-warm',
    terracotta: 'minimal-badge-terracotta',
    beige: 'minimal-badge-beige',
    outline: 'border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 bg-transparent',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
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
