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
  BarChart3,
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
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pacientes',
    href: '/app/patients',
    icon: Users,
    permissions: ['canManagePatients']
  },
  {
    label: 'Citas',
    href: '/app/appointments',
    icon: Calendar,
    permissions: ['canManageAppointments']
  },
  {
    label: 'Historiales',
    href: '/app/medical-records',
    icon: FileText,
    permissions: ['canViewMedicalRecords']
  },
  {
    label: 'Profesionales',
    href: '/app/users',
    icon: UserPlus,
    permissions: ['canManageUsers']
  },
  {
    label: 'Reportes',
    href: '/app/reports',
    icon: BarChart3,
    permissions: ['canViewReports']
  },
  {
    label: 'Facturación',
    href: '/app/billing',
    icon: CreditCard,
  },
  {
    label: 'Configuración',
    href: '/app/settings',
    icon: Settings,
  },
  {
    label: 'Mi Cuenta',
    href: '/app/account',
    icon: UserPlus,
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
        'flex flex-col w-56 bg-white dark:bg-primary-1000 border-r border-primary-200 dark:border-primary-800 h-full',
        'lg:relative lg:translate-x-0 lg:z-auto',
        isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex',
        className
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-12 px-3 border-b border-primary-200 dark:border-primary-800 lg:hidden">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 bg-primary-1000 dark:bg-primary-0 rounded">
              <Stethoscope className="w-4 h-4 text-primary-0 dark:text-primary-1000" />
            </div>
            <span className="text-sm font-normal text-primary-1000 dark:text-primary-0">CLINESA</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logo and Organization */}
        <div className="hidden lg:flex items-center h-12 px-3 border-b border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 bg-primary-1000 dark:bg-primary-0 rounded">
              <Stethoscope className="w-4 h-4 text-primary-0 dark:text-primary-1000" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-normal text-primary-1000 dark:text-primary-0">CLINESA</span>
              {organization && (
                <span className="text-xs text-primary-500 dark:text-primary-500 truncate max-w-32">
                  {organization.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {/* Dashboard Section */}
          <div className="space-y-0.5">
            {filteredNavigation.filter(item => item.href === '/dashboard').map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'notion-sidebar-link',
                    isActive && 'active'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Section Divider */}
          <div className="section-divider"></div>

          {/* Main Navigation Section */}
          <div className="space-y-0.5">
            {filteredNavigation.filter(item => item.href !== '/dashboard').map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href || 
                              (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'notion-sidebar-link',
                    isActive && 'active'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-2 border-t border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded flex-shrink-0">
              <span className="text-xs font-normal text-primary-700 dark:text-primary-300">
                {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-normal text-primary-1000 dark:text-primary-0 truncate">
                {userProfile?.first_name} {userProfile?.last_name}
              </span>
              <span className="text-xs text-primary-500 dark:text-primary-500 capitalize">
                {userProfile?.role}
              </span>
            </div>
            <div className="flex items-center justify-center w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0">
              <Activity className="w-0.5 h-0.5" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}