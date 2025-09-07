import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Button } from '@/components/ui/Button'
import { AnimatedContainer } from '@/components/ui/AnimatedContainer'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  title?: string
  className?: string
}

export function DashboardLayout({ title, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={cn('flex h-screen bg-primary-0 dark:bg-primary-1000', className)}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center bg-primary-0 dark:bg-primary-1000 border-b border-primary-200 dark:border-primary-800">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 ml-2 hover:bg-primary-100 dark:hover:bg-primary-900"
            onClick={() => setSidebarOpen(true)}
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <Header title={title} />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-primary-0 dark:bg-primary-1000">
          <AnimatedContainer animation="fade-in" delay={100}>
            <Outlet />
          </AnimatedContainer>
        </main>
      </div>
    </div>
  )
}