import React from 'react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const variants = {
  primary: 'minimal-button-primary',
  secondary: 'minimal-button-secondary',
  outline: 'border border-primary-1000 dark:border-primary-0 text-primary-1000 dark:text-primary-0 bg-transparent hover:bg-primary-100 dark:hover:bg-primary-900 font-normal px-6 py-3 rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-1 focus:ring-warm-500 focus:ring-offset-1',
  ghost: 'minimal-button-ghost',
  warm: 'minimal-button-warm',
  danger: 'bg-terracotta-600 hover:bg-terracotta-700 text-primary-0 font-normal px-6 py-3 rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:ring-offset-1'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  )
}