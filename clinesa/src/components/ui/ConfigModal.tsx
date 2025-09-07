import React, { useState } from 'react'
import { X, Moon, Sun, Palette, User, Shield, Database, Globe, CreditCard, AlertCircle, Save, RefreshCw } from 'lucide-react'
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
  const { config, updateConfig, resetConfig } = useConfig()
  const [saving, setSaving] = useState(false)

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


            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Perfil de Usuario
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Última actualización: {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                {/* Información Personal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Nombre"
                        value={config.firstName}
                        onChange={(e) => updateConfig('firstName', e.target.value)}
                        placeholder="Ingresa tu nombre"
                      />
                      <Input
                        label="Apellido"
                        value={config.lastName}
                        onChange={(e) => updateConfig('lastName', e.target.value)}
                        placeholder="Ingresa tu apellido"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={config.email}
                        onChange={(e) => updateConfig('email', e.target.value)}
                        placeholder="tu@email.com"
                      />
                      <Input
                        label="Teléfono"
                        value={config.phone}
                        onChange={(e) => updateConfig('phone', e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Información Profesional */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información Profesional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rol
                        </label>
                        <Select
                          value={config.role}
                          onValueChange={(value) => updateConfig('role', value)}
                          options={[
                            { value: 'admin', label: 'Administrador' },
                            { value: 'doctor', label: 'Médico' },
                            { value: 'nurse', label: 'Enfermero/a' },
                            { value: 'receptionist', label: 'Recepcionista' },
                            { value: 'manager', label: 'Gerente' }
                          ]}
                        />
                      </div>
                      <Input
                        label="Especialización"
                        value={config.specialization}
                        onChange={(e) => updateConfig('specialization', e.target.value)}
                        placeholder="Ej: Cardiología, Pediatría, etc."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Preferencias de Usuario */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Preferencias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notificaciones por Email
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Recibir notificaciones importantes por correo
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => console.log('Email notifications:', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Modo Oscuro
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Usar tema oscuro por defecto
                        </p>
                      </div>
                      <Switch
                        checked={config.darkMode}
                        onCheckedChange={(checked) => updateConfig('darkMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Información de la Organización
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: ORG-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                </div>
                
                {/* Información Básica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información Básica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Nombre de la Organización"
                      value={config.organizationName}
                      onChange={(e) => updateConfig('organizationName', e.target.value)}
                      placeholder="Ej: Clínica San Rafael"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Organización
                      </label>
                      <Select
                        value={config.organizationType}
                        onValueChange={(value) => updateConfig('organizationType', value)}
                        options={[
                          { value: 'clinic', label: 'Clínica' },
                          { value: 'hospital', label: 'Hospital' },
                          { value: 'center', label: 'Centro Médico' },
                          { value: 'consultory', label: 'Consultorio' },
                          { value: 'laboratory', label: 'Laboratorio' },
                          { value: 'pharmacy', label: 'Farmacia' }
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Contacto */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Dirección"
                      value={config.organizationAddress}
                      onChange={(e) => updateConfig('organizationAddress', e.target.value)}
                      placeholder="Calle, número, colonia, ciudad, estado"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Teléfono"
                        value={config.organizationPhone}
                        onChange={(e) => updateConfig('organizationPhone', e.target.value)}
                        placeholder="+1234567890"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={config.organizationEmail}
                        onChange={(e) => updateConfig('organizationEmail', e.target.value)}
                        placeholder="contacto@organizacion.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de la Organización */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configuración</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Horario de Atención
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Configurar horarios de operación
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Políticas de Privacidad
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Gestionar políticas de datos
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Gestionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Configuración del Sistema
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    v1.0.0 - Última actualización: {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                {/* Configuración Regional */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configuración Regional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Idioma
                        </label>
                        <Select
                          value={config.language}
                          onValueChange={(value) => updateConfig('language', value)}
                          options={languageOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Zona Horaria
                        </label>
                        <Select
                          value={config.timezone}
                          onValueChange={(value) => updateConfig('timezone', value)}
                          options={timezoneOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Formato de Fecha
                        </label>
                        <Select
                          value={config.dateFormat}
                          onValueChange={(value) => updateConfig('dateFormat', value)}
                          options={dateFormatOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Formato de Hora
                        </label>
                        <Select
                          value={config.timeFormat}
                          onValueChange={(value) => updateConfig('timeFormat', value)}
                          options={timeFormatOptions}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Seguridad */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Seguridad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tiempo de Inactividad (minutos)
                        </label>
                        <Input
                          type="number"
                          value={config.sessionTimeout}
                          onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
                          min="5"
                          max="120"
                          placeholder="30"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Autenticación de Dos Factores</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Requerir código adicional para iniciar sesión
                        </p>
                      </div>
                      <Switch
                        checked={false}
                        onCheckedChange={(checked) => console.log('2FA:', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Rendimiento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Caché de Datos</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Almacenar datos temporalmente para mejor rendimiento
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => console.log('Cache:', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sincronización Automática</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Sincronizar datos automáticamente en segundo plano
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => console.log('Auto-sync:', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Herramientas de Sistema */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Herramientas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Limpiar Caché
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Verificar Base de Datos
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Ver Logs del Sistema
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Auditoría de Seguridad
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gestión de Planes
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Última actualización: {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                {/* Current Plan Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Plan Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {config.currentPlan?.toUpperCase() || 'ENTERPRISE'}
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
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <Globe className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Acciones de Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center space-y-2"
                        onClick={() => {
                          try {
                            window.location.href = '/billing'
                          } catch (error) {
                            console.error('Navigation error:', error)
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
                            window.location.href = '/plans'
                          } catch (error) {
                            console.error('Navigation error:', error)
                          }
                        }}
                      >
                        <Globe className="w-6 h-6" />
                        <span>Ver Planes Disponibles</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Características del Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                        <span>5 usuarios</span>
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
                  </CardContent>
                </Card>

                {/* Upgrade Notice */}
                {config.currentPlan !== 'enterprise' && (
                  <Card>
                    <CardContent className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
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
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-2 sm:space-y-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => resetConfig()}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restaurar
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleSave} 
              loading={saving}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
