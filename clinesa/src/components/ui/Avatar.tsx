import React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export function Avatar({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className,
  ...props 
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  const displayFallback = !src || imageError
  const initials = fallback?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {displayFallback ? (
        <span className="select-none">{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  max?: number
  className?: string
}

export function AvatarGroup({ children, max = 3, className, ...props }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  )
}
