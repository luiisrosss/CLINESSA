import React, { useState } from 'react'
import { X, Moon, Sun, Palette, Bell, User, Shield, Database, Globe, CreditCard, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Input } from './Input'
import { Select } from './Select'
import { Switch } from './Switch'
import { useConfig } from '@/hooks/useConfig'
import { cn } from '@/lib/utils'

interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ConfigState {
  // Theme
  darkMode: boolean
  primaryColor: string
  accentColor: string
  fontSize: string
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  appointmentReminders: boolean
  reminderTime: string
  
  // User Profile
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  specialization: string
  
  // Organization
  organizationName: string
  organizationType: string
  organizationAddress: string
  organizationPhone: string
  organizationEmail: string
  
  // System
  language: string
  timezone: string
  dateFormat: string
  timeFormat: string
  autoLogout: boolean
  sessionTimeout: number
  
  // Plan Management
  currentPlan: string
  planStatus: string
  planExpiry: string
}

const colorOptions = [
  { value: 'blue', label: 'Azul Médico', color: 'bg-blue-600', primary: 'bg-blue-500', accent: 'bg-blue-400' },
  { value: 'green', label: 'Verde Salud', color: 'bg-green-600', primary: 'bg-green-500', accent: 'bg-green-400' },
  { value: 'purple', label: 'Púrpura', color: 'bg-purple-600', primary: 'bg-purple-500', accent: 'bg-purple-400' },
  { value: 'red', label: 'Rojo', color: 'bg-red-600', primary: 'bg-red-500', accent: 'bg-red-400' },
  { value: 'indigo', label: 'Índigo', color: 'bg-indigo-600', primary: 'bg-indigo-500', accent: 'bg-indigo-400' },
  { value: 'teal', label: 'Verde Azulado', color: 'bg-teal-600', primary: 'bg-teal-500', accent: 'bg-teal-400' },
  { value: 'orange', label: 'Naranja', color: 'bg-orange-600', primary: 'bg-orange-500', accent: 'bg-orange-400' },
  { value: 'pink', label: 'Rosa', color: 'bg-pink-600', primary: 'bg-pink-500', accent: 'bg-pink-400' },
  { value: 'cyan', label: 'Cian', color: 'bg-cyan-600', primary: 'bg-cyan-500', accent: 'bg-cyan-400' },
  { value: 'emerald', label: 'Esmeralda', color: 'bg-emerald-600', primary: 'bg-emerald-500', accent: 'bg-emerald-400' },
]

const fontSizeOptions = [
  { value: 'sm', label: 'Pequeño' },
  { value: 'base', label: 'Mediano' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Extra Grande' },
]

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
]

const timezoneOptions = [
  { value: 'America/Mexico_City', label: 'México (GMT-6)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
]

const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const timeFormatOptions = [
  { value: '12h', label: '12 horas (AM/PM)' },
  { value: '24h', label: '24 horas' },
]

export function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [activeTab, setActiveTab] = useState('theme')
  const { config, updateConfig } = useConfig()
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSave = async () => {
    setSaving(true)
    try {
      // Config is already saved via updateConfig
      // Just close the modal
      onClose()
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'theme', label: 'Apariencia', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'organization', label: 'Organización', icon: Shield },
    { id: 'system', label: 'Sistema', icon: Database },
    { id: 'plans', label: 'Planes', icon: Globe },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Configuración
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(95vh-80px)] sm:h-[600px]">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-gray-50 dark:bg-gray-700 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-600">
            <nav className="flex flex-wrap lg:flex-col gap-2 lg:space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center space-x-2 lg:space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-sm',
                      'w-full lg:w-full',
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    )}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Apariencia
                </h3>
                
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cambiar entre tema claro y oscuro
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.darkMode}
                    onCheckedChange={(checked) => updateConfig('darkMode', checked)}
                  />
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color Principal
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateConfig('primaryColor', color.value)}
                        className={cn(
                          'flex flex-col items-center space-y-2 p-2 sm:p-3 rounded-lg border-2 transition-all hover:scale-105',
                          config.primaryColor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        )}
                      >
                        <div className={cn('w-6 h-6 rounded-full flex-shrink-0', color.primary)} />
                        <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                          {color.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color de Acento
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateConfig('accentColor', color.value)}
                        className={cn(
                          'flex flex-col items-center space-y-2 p-2 sm:p-3 rounded-lg border-2 transition-all hover:scale-105',
                          config.accentColor === color.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        )}
                      >
                        <div className={cn('w-6 h-6 rounded-full flex-shrink-0', color.accent)} />
                        <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                          {color.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Tamaño de Fuente
                  </label>
                  <Select
                    value={config.fontSize}
                    onValueChange={(value) => updateConfig('fontSize', value)}
                    options={fontSizeOptions}
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notificaciones
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recibir notificaciones por correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={config.emailNotifications}
                      onCheckedChange={(checked) => updateConfig('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Notificaciones Push</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recibir notificaciones en el navegador
                      </p>
                    </div>
                    <Switch
                      checked={config.pushNotifications}
                      onCheckedChange={(checked) => updateConfig('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Recordatorios de Citas</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recordar citas próximas
                      </p>
                    </div>
                    <Switch
                      checked={config.appointmentReminders}
                      onCheckedChange={(checked) => updateConfig('appointmentReminders', checked)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Tiempo de Recordatorio (minutos antes)
                    </label>
                    <Select
                      value={config.reminderTime}
                      onValueChange={(value) => updateConfig('reminderTime', value)}
                      options={[
                        { value: '5', label: '5 minutos' },
                        { value: '15', label: '15 minutos' },
                        { value: '30', label: '30 minutos' },
                        { value: '60', label: '1 hora' },
                        { value: '120', label: '2 horas' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Perfil de Usuario
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={config.firstName}
                    onChange={(e) => updateConfig('firstName', e.target.value)}
                  />
                  <Input
                    label="Apellido"
                    value={config.lastName}
                    onChange={(e) => updateConfig('lastName', e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={config.email}
                    onChange={(e) => updateConfig('email', e.target.value)}
                  />
                  <Input
                    label="Teléfono"
                    value={config.phone}
                    onChange={(e) => updateConfig('phone', e.target.value)}
                  />
                  <Input
                    label="Rol"
                    value={config.role}
                    onChange={(e) => updateConfig('role', e.target.value)}
                    disabled
                  />
                  <Input
                    label="Especialización"
                    value={config.specialization}
                    onChange={(e) => updateConfig('specialization', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Organización
                </h3>
                
                <div className="space-y-4">
                  <Input
                    label="Nombre de la Organización"
                    value={config.organizationName}
                    onChange={(e) => updateConfig('organizationName', e.target.value)}
                  />
                  <Input
                    label="Tipo de Organización"
                    value={config.organizationType}
                    onChange={(e) => updateConfig('organizationType', e.target.value)}
                    disabled
                  />
                  <Input
                    label="Dirección"
                    value={config.organizationAddress}
                    onChange={(e) => updateConfig('organizationAddress', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Teléfono"
                      value={config.organizationPhone}
                      onChange={(e) => updateConfig('organizationPhone', e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={config.organizationEmail}
                      onChange={(e) => updateConfig('organizationEmail', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configuración del Sistema
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Idioma
                    </label>
                    <Select
                      value={config.language}
                      onValueChange={(value) => updateConfig('language', value)}
                      options={languageOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Zona Horaria
                    </label>
                    <Select
                      value={config.timezone}
                      onValueChange={(value) => updateConfig('timezone', value)}
                      options={timezoneOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Formato de Fecha
                    </label>
                    <Select
                      value={config.dateFormat}
                      onValueChange={(value) => updateConfig('dateFormat', value)}
                      options={dateFormatOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Formato de Hora
                    </label>
                    <Select
                      value={config.timeFormat}
                      onValueChange={(value) => updateConfig('timeFormat', value)}
                      options={timeFormatOptions}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Cierre Automático de Sesión</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cerrar sesión automáticamente por inactividad
                      </p>
                    </div>
                    <Switch
                      checked={config.autoLogout}
                      onCheckedChange={(checked) => updateConfig('autoLogout', checked)}
                    />
                  </div>

                  {config.autoLogout && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Tiempo de Inactividad (minutos)
                      </label>
                      <Input
                        type="number"
                        value={config.sessionTimeout}
                        onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
                        min="5"
                        max="120"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Gestión de Planes
                  </h3>
                  
                  {/* Current Plan Status */}
                  <div className="bg-gradient-to-r from-medical-50 to-medical-100 dark:from-medical-900 dark:to-medical-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Plan Actual: {config.currentPlan?.toUpperCase() || 'ENTERPRISE'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Estado: <span className="text-green-600 dark:text-green-400 font-medium">
                            {config.planStatus === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Vence: {config.planExpiry || '2025-12-31'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-16 bg-medical-600 rounded-full flex items-center justify-center">
                          <Globe className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        try {
                          navigate('/billing')
                          onClose()
                        } catch (error) {
                          window.location.href = '/billing'
                        }
                      }}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span>Gestionar Suscripción</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        try {
                          navigate('/plans')
                          onClose()
                        } catch (error) {
                          window.location.href = '/plans'
                        }
                      }}
                    >
                      <Globe className="w-6 h-6" />
                      <span>Ver Planes Disponibles</span>
                    </Button>
                  </div>

                  {/* Plan Features */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Características del Plan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>5,000 pacientes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>2,000 citas/mes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Historiales médicos</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>50 usuarios</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Soporte 24/7</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Backup automático</span>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Notice */}
                  {config.currentPlan !== 'enterprise' && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                            Actualización Recomendada
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Tu plan actual tiene limitaciones. Considera actualizar para obtener acceso completo a todas las funciones.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={saving} className="w-full sm:w-auto">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
