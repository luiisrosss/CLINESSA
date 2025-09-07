import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Shield, Bell, Key, Trash2, LogOut, 
  Camera, Eye, EyeOff, Download, Upload, Settings, CreditCard,
  Calendar, Clock, Globe, Smartphone, Monitor, AlertTriangle,
  CheckCircle, XCircle, Lock, Unlock, RefreshCw, Save, Edit3,
  FileText, Database, HardDrive, Activity, Zap
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const AccountPage = () => {
  const { user, userProfile, organization, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    licenseNumber: userProfile?.license_number || '',
    specialization: userProfile?.specialization || '',
    bio: '',
    timezone: 'Europe/Madrid',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    newPatientAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    reminderTime: 30
  })

  const [sessions, setSessions] = useState([
    {
      id: '1',
      device: 'Chrome - Windows',
      location: 'Madrid, España',
      lastActive: new Date(),
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: '2',
      device: 'Safari - iPhone',
      location: 'Madrid, España',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      current: false,
      ip: '192.168.1.101'
    }
  ])

  const [billingHistory] = useState([
    {
      id: '1',
      date: new Date('2024-01-15'),
      amount: 29.00,
      status: 'paid',
      description: 'Plan Profesional - Enero 2024'
    },
    {
      id: '2',
      date: new Date('2023-12-15'),
      amount: 29.00,
      status: 'paid',
      description: 'Plan Profesional - Diciembre 2023'
    }
  ])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Facturación', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferencias', icon: <Settings className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sesiones', icon: <Monitor className="w-4 h-4" /> }
  ]

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: user?.email || '',
        phone: userProfile.phone || '',
        licenseNumber: userProfile.license_number || '',
        specialization: userProfile.specialization || '',
        bio: '',
        timezone: 'Europe/Madrid',
        language: 'es',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      })
    }
  }, [userProfile, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Aquí iría la lógica para guardar el perfil
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
      toast.success('Perfil actualizado correctamente')
      setEditing(false)
    } catch (error) {
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    setLoading(true)
    try {
      // Aquí iría la lógica para cambiar la contraseña
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
      toast.success('Contraseña cambiada correctamente')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      // Aquí iría la lógica para eliminar la cuenta
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulación
      toast.success('Cuenta eliminada correctamente')
      navigate('/')
    } catch (error) {
      toast.error('Error al eliminar la cuenta')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleTerminateSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId))
    toast.success('Sesión terminada correctamente')
  }

  const renderProfileTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-primary-1000 dark:text-primary-0 mb-1">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  {formData.specialization || 'Profesional Médico'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-primary-500 dark:text-primary-500">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {formData.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {formData.phone || 'Sin teléfono'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {!editing ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                      <span>Guardar</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Nombre
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!editing}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                    Apellidos
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!editing}
                    placeholder="Apellidos"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-primary-50 dark:bg-primary-900"
                />
                <p className="text-xs text-primary-500 mt-1">
                  El email no se puede cambiar. Contacta con soporte si necesitas cambiarlo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editing}
                  placeholder="+34 612 345 678"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Número de Colegiado
                </label>
                <Input
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  disabled={!editing}
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Especialidad
                </label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  disabled={!editing}
                  placeholder="Medicina General"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Biografía
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!editing}
                  placeholder="Cuéntanos sobre tu experiencia profesional..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )

  const renderSecurityTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Cambiar Contraseña</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
              className="flex items-center space-x-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Lock className="w-4 h-4" />}
              <span>Cambiar Contraseña</span>
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Autenticación de Dos Factores</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0 mb-1">
                  Autenticación de Dos Factores
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <Button variant="outline">
                Configurar 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Sesiones Activas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      {session.device.includes('iPhone') ? (
                        <Smartphone className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-primary-1000 dark:text-primary-0">
                        {session.device}
                        {session.current && (
                          <Badge variant="success" className="ml-2">Actual</Badge>
                        )}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {session.location} • {session.ip}
                      </p>
                      <p className="text-xs text-primary-500">
                        Última actividad: {format(session.lastActive, 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Terminar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Cerrar Sesión
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Cierra tu sesión actual de forma segura
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  const renderNotificationsTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Preferencias de Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Notificaciones por Email
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Recibe notificaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Notificaciones Push
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Recibe notificaciones en tiempo real en tu navegador
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Recordatorios de Citas
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Recibe recordatorios antes de las citas programadas
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Alertas de Nuevos Pacientes
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Notificaciones cuando se registren nuevos pacientes
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newPatientAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('newPatientAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Actualizaciones del Sistema
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Notificaciones sobre nuevas funciones y mejoras
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    Emails de Marketing
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Recibe ofertas especiales y novedades del producto
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-primary-200 dark:border-primary-800">
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Tiempo de Recordatorio (minutos)
              </label>
              <Select
                value={notificationSettings.reminderTime.toString()}
                onValueChange={(value) => handleNotificationChange('reminderTime', parseInt(value))}
                options={[
                  { value: '15', label: '15 minutos' },
                  { value: '30', label: '30 minutos' },
                  { value: '60', label: '1 hora' },
                  { value: '120', label: '2 horas' },
                  { value: '240', label: '4 horas' }
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  const renderBillingTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Plan Actual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xl font-medium text-primary-1000 dark:text-primary-0">
                  Plan Profesional
                </p>
                <p className="text-primary-600 dark:text-primary-400">
                  €29/mes • Renovación el 15 de febrero
                </p>
              </div>
              <Button variant="outline">
                Cambiar Plan
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
                <p className="text-2xl font-bold text-primary-1000 dark:text-primary-0">∞</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">Pacientes</p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
                <p className="text-2xl font-bold text-primary-1000 dark:text-primary-0">∞</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">Citas</p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
                <p className="text-2xl font-bold text-primary-1000 dark:text-primary-0">24/7</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">Soporte</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    •••• •••• •••• 1234
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Expira 12/25
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {billingHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
                  <div>
                    <p className="font-medium text-primary-1000 dark:text-primary-0">
                      {bill.description}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {format(bill.date, 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-primary-1000 dark:text-primary-0">
                      €{bill.amount.toFixed(2)}
                    </span>
                    <Badge variant={bill.status === 'paid' ? 'success' : 'warning'}>
                      {bill.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  const renderPreferencesTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Preferencias Generales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Zona Horaria
                </label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                  options={[
                    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
                    { value: 'Europe/London', label: 'Londres (GMT+0)' },
                    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
                    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Idioma
                </label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                  options={[
                    { value: 'es', label: 'Español' },
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'Français' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Formato de Fecha
                </label>
                <Select
                  value={formData.dateFormat}
                  onValueChange={(value) => handleInputChange('dateFormat', value)}
                  options={[
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Formato de Hora
                </label>
                <Select
                  value={formData.timeFormat}
                  onValueChange={(value) => handleInputChange('timeFormat', value)}
                  options={[
                    { value: '24h', label: '24 horas' },
                    { value: '12h', label: '12 horas (AM/PM)' }
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Datos y Privacidad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Exportar Datos
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Descarga una copia de todos tus datos
                </p>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Importar Datos
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Importa datos desde otro sistema
                </p>
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Importar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  const renderSessionsTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Sesiones Activas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-950 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      {session.device.includes('iPhone') ? (
                        <Smartphone className="w-6 h-6 text-primary-600" />
                      ) : (
                        <Monitor className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-primary-1000 dark:text-primary-0">
                        {session.device}
                        {session.current && (
                          <Badge variant="success" className="ml-2">Sesión Actual</Badge>
                        )}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {session.location} • IP: {session.ip}
                      </p>
                      <p className="text-xs text-primary-500">
                        Última actividad: {format(session.lastActive, 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.current ? (
                      <Badge variant="success">Activa</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Terminar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Eliminar Cuenta
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Elimina permanentemente tu cuenta y todos los datos asociados
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Eliminar Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

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
            <h1 className="text-2xl font-normal text-primary-1000 dark:text-primary-0">
              Mi Cuenta
            </h1>
            <p className="text-primary-600 dark:text-primary-400 mt-1">
              Gestiona tu perfil, seguridad y preferencias
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-normal rounded-md transition-all duration-150 ease-out ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-900 dark:hover:text-primary-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'billing' && renderBillingTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'sessions' && renderSessionsTab()}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar Sesión"
      >
        <div className="space-y-4">
          <p className="text-primary-600 dark:text-primary-400">
            ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Cuenta"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200 font-medium">
              Esta acción no se puede deshacer
            </p>
          </div>
          <p className="text-primary-600 dark:text-primary-400">
            Al eliminar tu cuenta, se borrarán permanentemente todos tus datos, incluyendo:
          </p>
          <ul className="list-disc list-inside text-sm text-primary-600 dark:text-primary-400 space-y-1">
            <li>Perfil y configuración</li>
            <li>Pacientes y citas</li>
            <li>Historiales médicos</li>
            <li>Facturación y pagos</li>
          </ul>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Eliminar Cuenta'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountPage