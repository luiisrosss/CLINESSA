import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Shield, Bell, Key, Trash2 } from 'lucide-react'
import { useState } from 'react'

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: 'Dr. María',
    lastName: 'González',
    email: 'maria.gonzalez@clinica.com',
    phone: '+34 612 345 678',
    clinic: 'Clínica Privada González',
    address: 'Calle Mayor 123, Madrid',
    specialty: 'Medicina General'
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Facturación', icon: <Key className="w-4 h-4" /> }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderProfileTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-primary-1000 dark:text-primary-0">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-primary-600 dark:text-primary-400">
              {formData.specialty}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="notion-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Apellidos
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="notion-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="notion-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="notion-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Clínica/Consultorio
            </label>
            <input
              type="text"
              value={formData.clinic}
              onChange={(e) => handleInputChange('clinic', e.target.value)}
              className="notion-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Especialidad
            </label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              className="notion-input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Dirección
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="notion-input min-h-[100px]"
          />
        </div>

        <div className="flex justify-end">
          <button className="notion-button-primary">
            Guardar Cambios
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderSecurityTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Cambiar Contraseña
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                className="notion-input"
                placeholder="Ingresa tu contraseña actual"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="notion-input"
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                className="notion-input"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
            <button className="notion-button-primary">
              Cambiar Contraseña
            </button>
          </div>
        </div>

        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Autenticación de Dos Factores
          </h3>
          <p className="text-primary-600 dark:text-primary-400 mb-4">
            Añade una capa extra de seguridad a tu cuenta con autenticación de dos factores.
          </p>
          <button className="notion-button-outline">
            Configurar 2FA
          </button>
        </div>

        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Sesiones Activas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-950 rounded-md">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Navegador Chrome - Windows
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Madrid, España • Hace 2 horas
                </p>
              </div>
              <button className="notion-button-ghost text-red-600 dark:text-red-400">
                Cerrar Sesión
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-950 rounded-md">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Aplicación Móvil - iPhone
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Madrid, España • Hace 1 día
                </p>
              </div>
              <button className="notion-button-ghost text-red-600 dark:text-red-400">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderNotificationsTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Preferencias de Notificaciones
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Recordatorios de Citas
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Recibe notificaciones antes de las citas programadas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-primary-200 dark:bg-primary-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-primary-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Nuevos Pacientes
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Notificaciones cuando se registren nuevos pacientes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-primary-200 dark:bg-primary-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-primary-600 peer-checked:bg-primary-600"></div>
              </label>
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-primary-200 dark:bg-primary-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-primary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-primary-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderBillingTab = () => (
    <motion.div {...fadeInUp}>
      <div className="space-y-6">
        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Plan Actual
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-primary-1000 dark:text-primary-0">
                Plan Profesional
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                €29/mes • Renovación el 15 de enero
              </p>
            </div>
            <button className="notion-button-outline">
              Cambiar Plan
            </button>
          </div>
        </div>

        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Método de Pago
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">💳</span>
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
            <button className="notion-button-ghost">
              Actualizar
            </button>
          </div>
        </div>

        <div className="notion-card p-6">
          <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
            Historial de Facturación
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-950 rounded-md">
              <div>
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  Enero 2024
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Plan Profesional
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-1000 dark:text-primary-0">
                  €29.00
                </p>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100">
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="notion-card p-6 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
              Zona de Peligro
            </h3>
          </div>
          <p className="text-primary-600 dark:text-primary-400 mb-4">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-primary-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          {...fadeInUp}
        >
          <h1 className="text-3xl font-normal text-primary-1000 dark:text-primary-0 mb-2">
            Configuración de Cuenta
          </h1>
          <p className="text-primary-600 dark:text-primary-400">
            Gestiona tu perfil, seguridad y preferencias
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            className="lg:w-64"
            {...fadeInUp}
          >
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
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'billing' && renderBillingTab()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
