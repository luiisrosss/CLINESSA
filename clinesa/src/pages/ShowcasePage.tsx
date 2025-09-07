import React from 'react'
import { Showcase } from '@/components/ui/Showcase'

export function ShowcasePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Showcase />
      </div>
    </div>
  )
}
