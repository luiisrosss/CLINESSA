import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'none'
  delay?: number
  duration?: number
  className?: string
}

export function AnimatedContainer({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 300,
  className,
  ...props
}: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const animationClasses = {
    'fade-in': isVisible ? 'opacity-100' : 'opacity-0',
    'slide-up': isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    'slide-down': isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
    'scale-in': isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
    'none': ''
  }

  return (
    <div
      className={cn(
        'transition-all ease-attio',
        animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`
      }}
      {...props}
    >
      {children}
    </div>
  )
}

interface StaggeredContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  staggerDelay?: number
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in'
  className?: string
}

export function StaggeredContainer({
  children,
  staggerDelay = 100,
  animation = 'fade-in',
  className,
  ...props
}: StaggeredContainerProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={className} {...props}>
      {childrenArray.map((child, index) => (
        <AnimatedContainer
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  )
}

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverContent?: React.ReactNode
  className?: string
}

export function HoverCard({
  children,
  hoverContent,
  className,
  ...props
}: HoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {hoverContent && (
        <div
          className={cn(
            'absolute z-50 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-attio-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200 ease-attio',
            isHovered
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none',
            className
          )}
        >
          {hoverContent}
        </div>
      )}
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-accent-600 rounded-full animate-pulse-subtle"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}
