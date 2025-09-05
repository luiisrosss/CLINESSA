import { Bell, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string | undefined
  className?: string
}

export function Header({ title, className }: HeaderProps) {
  const { userProfile, fullName, initials, signOut, loading } = useAuth()

  return (
    <header className={cn(
      'flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200',
      className
    )}>
      {/* Title and Search */}
      <div className="flex items-center space-x-6">
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">
            {title}
          </h1>
        )}
        
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar pacientes, citas..."
              className="pl-10 w-80 h-9"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {fullName}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {userProfile?.role}
            </span>
          </div>
          
          <div className="flex items-center justify-center w-8 h-8 bg-medical-100 rounded-full">
            <span className="text-sm font-medium text-medical-600">
              {initials}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}