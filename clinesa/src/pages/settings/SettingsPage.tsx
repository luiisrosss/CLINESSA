import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Building, Globe, Shield, Bell, User, Database, AlertCircle, CheckCircle, Download, Upload, RefreshCw, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { useAuth } from '@/hooks/useAuth'
import { useConfig } from '@/hooks/useConfig'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface OrganizationSettings {
  name: string
  type: string
  address: string
  phone: string
  email: string
  website?: string
  description?: string
}

interface SystemSettings {
  timezone: string
  date_format: string
  time_format: string
  language: string
  auto_logout: boolean
  session_timeout: number
  email_notifications: boolean
  push_notifications: boolean
  appointment_reminders: boolean
  reminder_time: number
}

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

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
]

export function SettingsPage() {
  const { organization, userProfile } = useAuth()
  const { config, updateConfig } = useConfig()
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>({
    name: '',
    type: 'clinic',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  })
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    timezone: 'America/Mexico_City',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    language: 'es',
    auto_logout: false,
    session_timeout: 30,
    email_notifications: true,
    push_notifications: true,
    appointment_reminders: true,
    reminder_time: 15,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('organization')
  const [hasChanges, setHasChanges] = useState(false)
  const [backupData, setBackupData] = useState<any>(null)

  // Load organization settings
  useEffect(() => {
    if (organization) {
      setOrganizationSettings({
        name: organization.name || '',
        type: organization.type || 'clinic',
        address: organization.address || '',
        phone: organization.phone || '',
        email: organization.email || '',
        website: organization.website || '',
        description: organization.description || '',
      })
    }
  }, [organization])

  // Load system settings from config
  useEffect(() => {
    if (config) {
      setSystemSettings({
        timezone: config.timezone || 'America/Mexico_City',
        date_format: config.dateFormat || 'DD/MM/YYYY',
        time_format: config.timeFormat || '24h',
        language: config.language || 'es',
        auto_logout: config.autoLogout || false,
        session_timeout: config.sessionTimeout || 30,
        email_notifications: config.emailNotifications || true,
        push_notifications: config.pushNotifications || true,
        appointment_reminders: config.appointmentReminders || true,
        reminder_time: parseInt(config.reminderTime) || 15,
      })
    }
  }, [config])

  const handleOrganizationSave = async () => {
    if (!organization) return

    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('organizations')
        .update(organizationSettings)
        .eq('id', organization.id)

      if (error) throw error

      toast.success('Configuración de organización guardada correctamente')
    } catch (error) {
      console.error('Error saving organization settings:', error)
      toast.error('Error al guardar la configuración de organización')
    } finally {
      setSaving(false)
    }
  }

  const handleSystemSave = async () => {
    try {
      setSaving(true)
      
      // Update config hook
      updateConfig('timezone', systemSettings.timezone)
      updateConfig('dateFormat', systemSettings.date_format)
      updateConfig('timeFormat', systemSettings.time_format)
      updateConfig('language', systemSettings.language)
      updateConfig('autoLogout', systemSettings.auto_logout)
      updateConfig('sessionTimeout', systemSettings.session_timeout)
      updateConfig('emailNotifications', systemSettings.email_notifications)
      updateConfig('pushNotifications', systemSettings.push_notifications)
      updateConfig('appointmentReminders', systemSettings.appointment_reminders)
      updateConfig('reminderTime', systemSettings.reminder_time.toString())

      setHasChanges(false)
      toast.success('Configuración del sistema guardada correctamente')
    } catch (error) {
      console.error('Error saving system settings:', error)
      toast.error('Error al guardar la configuración del sistema')
    } finally {
      setSaving(false)
    }
  }

  // Export configuration
  const exportConfiguration = () => {
    const configData = {
      organization: organizationSettings,
      system: systemSettings,
      exported_at: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `configuracion_clinesa_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Configuración exportada correctamente')
  }

  // Import configuration
  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const configData = JSON.parse(e.target?.result as string)
        
        if (configData.organization) {
          setOrganizationSettings(configData.organization)
        }
        if (configData.system) {
          setSystemSettings(configData.system)
        }
        
        setHasChanges(true)
        toast.success('Configuración importada correctamente')
      } catch (error) {
        toast.error('Error al importar la configuración')
      }
    }
    reader.readAsText(file)
  }

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('¿Está seguro que desea restaurar la configuración por defecto?')) {
      setOrganizationSettings({
        name: '',
        type: 'clinic',
        address: '',
        phone: '',
        email: '',
        website: '',
        description: '',
      })
      setSystemSettings({
        timezone: 'America/Mexico_City',
        date_format: 'DD/MM/YYYY',
        time_format: '24h',
        language: 'es',
        auto_logout: false,
        session_timeout: 30,
        email_notifications: true,
        push_notifications: true,
        appointment_reminders: true,
        reminder_time: 15,
      })
      setHasChanges(true)
      toast.success('Configuración restaurada a valores por defecto')
    }
  }

  const tabs = [
    { id: 'organization', label: 'Organización', icon: Building },
    { id: 'system', label: 'Sistema', icon: Database },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl font-normal text-primary-1000 dark:text-primary-0">Configuración</h1>
            <p className="text-primary-600 dark:text-primary-400 mt-1">
              Administra la configuración de la organización y el sistema
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={exportConfiguration}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            
            <label className="notion-button-outline cursor-pointer flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={importConfiguration}
                className="hidden"
              />
            </label>
            
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restaurar</span>
            </Button>
          </div>
        </div>
        
        {/* Changes Indicator */}
        {hasChanges && (
          <motion.div 
            className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Tienes cambios sin guardar
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="notion-card p-4">
            <nav className="space-y-1">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-900 dark:hover:text-primary-100'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 2 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'organization' && (
              <motion.div
                key="organization"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Building className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Configuración de Organización
                    </h2>
                  </div>
                  <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la Organización"
                    value={organizationSettings.name}
                    onChange={(e) => setOrganizationSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Clínica San Rafael"
                  />
                  <Input
                    label="Tipo de Organización"
                    value={organizationSettings.type}
                    onChange={(e) => setOrganizationSettings(prev => ({ ...prev, type: e.target.value }))}
                    disabled
                  />
                </div>

                <Textarea
                  label="Dirección"
                  value={organizationSettings.address}
                  onChange={(e) => setOrganizationSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Calle Principal 123, Ciudad, Estado"
                  rows={3}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    value={organizationSettings.phone}
                    onChange={(e) => setOrganizationSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1234567890"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={organizationSettings.email}
                    onChange={(e) => setOrganizationSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@clinica.com"
                  />
                </div>

                <Input
                  label="Sitio Web"
                  value={organizationSettings.website}
                  onChange={(e) => setOrganizationSettings(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://www.clinica.com"
                />

                <Textarea
                  label="Descripción"
                  value={organizationSettings.description}
                  onChange={(e) => setOrganizationSettings(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción de la organización..."
                  rows={3}
                />

                    <div className="flex justify-end">
                      <Button onClick={handleOrganizationSave} loading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Configuración del Sistema
                    </h2>
                  </div>
                  <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Zona Horaria
                    </label>
                    <Select
                      value={systemSettings.timezone}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}
                      options={timezoneOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Idioma
                    </label>
                    <Select
                      value={systemSettings.language}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, language: value }))}
                      options={languageOptions}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Formato de Fecha
                    </label>
                    <Select
                      value={systemSettings.date_format}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, date_format: value }))}
                      options={dateFormatOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Formato de Hora
                    </label>
                    <Select
                      value={systemSettings.time_format}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, time_format: value }))}
                      options={timeFormatOptions}
                    />
                  </div>
                </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSystemSave} loading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Configuración de Notificaciones
                    </h2>
                  </div>
                  <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recibir notificaciones por correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.email_notifications}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, email_notifications: checked }))}
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
                      checked={systemSettings.push_notifications}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, push_notifications: checked }))}
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
                      checked={systemSettings.appointment_reminders}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, appointment_reminders: checked }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tiempo de Recordatorio (minutos antes)
                    </label>
                    <Select
                      value={systemSettings.reminder_time.toString()}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, reminder_time: parseInt(value) }))}
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

                    <div className="flex justify-end">
                      <Button onClick={handleSystemSave} loading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notion-card p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-medium text-primary-1000 dark:text-primary-0">
                      Configuración de Seguridad
                    </h2>
                  </div>
                  <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Cierre Automático de Sesión</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cerrar sesión automáticamente por inactividad
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.auto_logout}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, auto_logout: checked }))}
                    />
                  </div>

                  {systemSettings.auto_logout && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tiempo de Inactividad (minutos)
                      </label>
                      <Input
                        type="number"
                        value={systemSettings.session_timeout}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                        min="5"
                        max="120"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Información de Seguridad
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Para cambiar tu contraseña, ve a tu perfil de usuario. 
                          Los cambios de seguridad se aplicarán inmediatamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSystemSave} loading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
