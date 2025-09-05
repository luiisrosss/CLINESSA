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
        'flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full',
        'lg:relative lg:translate-x-0 lg:z-auto',
        isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex',
        className
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-medical-600 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">CLINESA</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo and Organization */}
        <div className="hidden lg:flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-medical-600 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">CLINESA</span>
              {organization && (
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
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
                  'sidebar-link',
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-medical-100 dark:bg-medical-900 rounded-full flex-shrink-0">
              <span className="text-sm font-medium text-medical-600 dark:text-medical-400">
                {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userProfile?.first_name} {userProfile?.last_name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {userProfile?.role}
              </span>
            </div>
            <div className="flex items-center justify-center w-2 h-2 bg-green-400 rounded-full flex-shrink-0">
              <Activity className="w-1 h-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}