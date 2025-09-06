import { Bell, Search, LogOut, Settings, User, Home, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfigModal } from '@/components/ui/ConfigModal'
import { NotificationsModal } from '@/components/ui/NotificationsModal'
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className={cn(
      'flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Title and Search */}
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
        {title && (
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        )}
        
        {/* Search - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar pacientes, citas..."
              className="pl-10 w-full h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions - Right Side */}
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
        {/* Dashboard */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => navigate('/dashboard')}
          title="Dashboard"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Billing */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => navigate('/billing')}
          title="Facturación"
        >
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2"
          onClick={() => setIsNotificationsOpen(true)}
          title="Notificaciones"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setIsConfigOpen(true)}
          title="Configuración"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* User Profile */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={() => setIsProfileOpen(true)}
          title="Perfil"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
          {/* User info - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-24 lg:max-w-none">
              {fullName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {userProfile?.role}
            </span>
          </div>
          
          {/* Avatar */}
          <div className="flex items-center justify-center w-8 h-8 bg-medical-100 dark:bg-medical-900 rounded-full">
            <span className="text-sm font-medium text-medical-600 dark:text-medical-400">
              {initials}
            </span>
          </div>
          
          {/* Logout - Hidden on mobile, visible on tablet+ */}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            disabled={loading}
            className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  )
}