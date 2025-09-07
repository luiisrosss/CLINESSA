import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('attio-skeleton', className)}
      {...props}
    />
  )
}

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <div className={cn('attio-card p-6', className)} {...props}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <SkeletonText lines={2} />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}
