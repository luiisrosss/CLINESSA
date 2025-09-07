import { Search, LogOut, Settings, User, Home, CreditCard, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfigModal } from '@/components/ui/ConfigModal'
import { ProfileModal } from '@/components/ui/ProfileModal'
import { NotificationCenter } from '@/components/ui/NotificationCenter'
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
      'w-full flex items-center justify-between h-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-primary-1000 border-b border-primary-200 dark:border-primary-800',
      className
    )}>
      {/* Left Section - Logo/Brand */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-primary-1000 dark:bg-primary-0 rounded-sm flex items-center justify-center">
            <span className="text-primary-0 dark:text-primary-1000 font-medium text-xs">C</span>
          </div>
          <span className="text-sm font-normal text-primary-1000 dark:text-primary-0 hidden sm:block">
            CLINESA
          </span>
        </div>
        
        {title && (
          <h1 className="text-sm sm:text-base font-normal text-primary-1000 dark:text-primary-0 truncate ml-3">
            {title}
          </h1>
        )}
      </div>


      {/* Right Section - Minimal User */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Notifications */}
        <NotificationCenter />
        
        {/* User info - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-primary-1000 dark:text-primary-0 truncate max-w-24 lg:max-w-none">
            {fullName}
          </span>
          <span className="text-xs text-primary-500 dark:text-primary-500 capitalize">
            {userProfile?.role}
          </span>
        </div>
        
        {/* Avatar - Smaller */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          title="Perfil"
        >
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {initials}
          </span>
        </button>
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