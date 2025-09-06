import React from 'react'
import { X, Bell, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { cn } from '@/lib/utils'

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Cita próxima',
    message: 'Tienes una cita con Juan Pérez en 30 minutos',
    time: 'Hace 5 min',
    unread: true,
    icon: Calendar,
  },
  {
    id: 2,
    type: 'system',
    title: 'Sistema actualizado',
    message: 'Se han aplicado las últimas mejoras de seguridad',
    time: 'Hace 1 hora',
    unread: true,
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Recordatorio importante',
    message: 'No olvides revisar los historiales médicos pendientes',
    time: 'Hace 2 horas',
    unread: false,
    icon: AlertCircle,
  },
  {
    id: 4,
    type: 'email',
    title: 'Nuevo mensaje',
    message: 'Has recibido un correo de la clínica',
    time: 'Ayer',
    unread: false,
    icon: Mail,
  },
]

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-medical-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notificaciones
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No tienes notificaciones
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors',
                      notification.unread && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        notification.type === 'appointment' && 'bg-blue-100 dark:bg-blue-900',
                        notification.type === 'system' && 'bg-green-100 dark:bg-green-900',
                        notification.type === 'alert' && 'bg-yellow-100 dark:bg-yellow-900',
                        notification.type === 'email' && 'bg-purple-100 dark:bg-purple-900'
                      )}>
                        <Icon className={cn(
                          'w-4 h-4',
                          notification.type === 'appointment' && 'text-blue-600 dark:text-blue-400',
                          notification.type === 'system' && 'text-green-600 dark:text-green-400',
                          notification.type === 'alert' && 'text-yellow-600 dark:text-yellow-400',
                          notification.type === 'email' && 'text-purple-600 dark:text-purple-400'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={cn(
                            'text-sm font-medium',
                            notification.unread 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                          )}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              // Mark all as read
              onClose()
            }}
          >
            Marcar todas como leídas
          </Button>
        </div>
      </div>
    </div>
  )
}
