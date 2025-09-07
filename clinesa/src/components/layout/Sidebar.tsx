import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  UserPlus,
  Stethoscope,
  Activity,
  CreditCard,
  X,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permissions?: string[]
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pacientes',
    href: '/patients',
    icon: Users,
    permissions: ['canManagePatients']
  },
  {
    label: 'Citas',
    href: '/appointments',
    icon: Calendar,
    permissions: ['canManageAppointments']
  },
  {
    label: 'Historiales',
    href: '/medical-records',
    icon: FileText,
    permissions: ['canViewMedicalRecords']
  },
  {
    label: 'Profesionales',
    href: '/users',
    icon: UserPlus,
    permissions: ['canManageUsers']
  },
  {
    label: 'Facturación',
    href: '/billing',
    icon: CreditCard,
  },
  {
    label: 'Configuración',
    href: '/settings',
    icon: Settings,
  }
]

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()
  const { userProfile, organization, ...permissions } = useAuth()

  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    
    return requiredPermissions.some(permission => {
      const permissionKey = permission as keyof typeof permissions
      return permissions[permissionKey]
    })
  }

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permissions)
  )

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'flex flex-col w-64 bg-primary-0 dark:bg-primary-1000 border-r border-primary-200 dark:border-primary-800 h-full',
        'lg:relative lg:translate-x-0 lg:z-auto',
        isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex',
        className
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-200 dark:border-primary-800 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-warm-500 rounded-md">
              <Stethoscope className="w-5 h-5 text-primary-0" />
            </div>
            <span className="text-lg font-light text-primary-1000 dark:text-primary-0">CLINESA</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo and Organization */}
        <div className="hidden lg:flex items-center justify-center h-16 px-6 border-b border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-warm-500 rounded-md">
              <Stethoscope className="w-5 h-5 text-primary-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-light text-primary-1000 dark:text-primary-0">CLINESA</span>
              {organization && (
                <span className="text-xs text-primary-600 dark:text-primary-400 truncate max-w-32 font-normal">
                  {organization.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
                            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  'minimal-sidebar-link',
                  isActive && 'active'
                )}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-warm-100 dark:bg-warm-900/30 rounded-full flex-shrink-0">
              <span className="text-sm font-normal text-warm-700 dark:text-warm-300">
                {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-normal text-primary-1000 dark:text-primary-0 truncate">
                {userProfile?.first_name} {userProfile?.last_name}
              </span>
              <span className="text-xs text-primary-600 dark:text-primary-400 capitalize font-normal">
                {userProfile?.role}
              </span>
            </div>
            <div className="flex items-center justify-center w-2 h-2 bg-warm-500 rounded-full flex-shrink-0">
              <Activity className="w-1 h-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}