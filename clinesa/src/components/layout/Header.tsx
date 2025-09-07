import { Search, LogOut, Settings, User, Home, CreditCard, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfigModal } from '@/components/ui/ConfigModal'
import { ProfileModal } from '@/components/ui/ProfileModal'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string | undefined
  className?: string
}

export function Header({ title, className }: HeaderProps) {
  const { userProfile, fullName, initials, signOut, loading } = useAuth()
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className={cn(
      'w-full flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-primary-1000 border-b border-primary-200 dark:border-primary-800',
      className
    )}>
      {/* Left Section - Logo/Brand */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-1000 dark:bg-primary-0 rounded-md flex items-center justify-center">
            <span className="text-primary-0 dark:text-primary-1000 font-medium text-sm">C</span>
          </div>
          <span className="text-lg font-normal text-primary-1000 dark:text-primary-0 hidden sm:block">
            CLINESA
          </span>
        </div>
        
        {title && (
          <h1 className="text-lg sm:text-xl font-normal text-primary-1000 dark:text-primary-0 truncate ml-4">
            {title}
          </h1>
        )}
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 justify-center px-4 sm:px-6 lg:px-8 hidden md:flex">
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Buscar pacientes, citas..."
              className="notion-input pl-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Actions and User */}
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
        {/* Notifications */}
        <button 
          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
          title="Notificaciones"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dashboard */}
        <button 
          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
          onClick={() => {
            try {
              navigate('/app/dashboard')
            } catch (error) {
              window.location.href = '/app/dashboard'
            }
          }}
          title="Dashboard"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Billing */}
        <button 
          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
          onClick={() => {
            try {
              navigate('/app/billing')
            } catch (error) {
              window.location.href = '/app/billing'
            }
          }}
          title="Facturación"
        >
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Settings */}
        <button 
          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors"
          onClick={() => setIsConfigOpen(true)}
          title="Configuración"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* User info - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-primary-1000 dark:text-primary-0 truncate max-w-24 lg:max-w-none">
              {fullName}
            </span>
            <span className="text-xs text-primary-500 dark:text-primary-500 capitalize">
              {userProfile?.role}
            </span>
          </div>
          
          {/* Avatar */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            title="Perfil"
          >
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {initials}
            </span>
          </button>
          
          {/* Logout - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={signOut}
            disabled={loading}
            className="hidden sm:flex p-2 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md transition-colors disabled:opacity-50"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  )
}