import { useState, useEffect } from 'react'

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

const defaultConfig: ConfigState = {
  // Theme
  darkMode: false,
  
  // User Profile
  firstName: 'Luis',
  lastName: 'Ros',
  email: 'luis.ros.moreno2@gmail.com',
  phone: '+1234567890',
  role: 'admin',
  specialization: 'Administrador',
  
  // Organization
  organizationName: 'Clínica San Rafael',
  organizationType: 'clinic',
  organizationAddress: 'Calle Principal 123, Ciudad',
  organizationPhone: '+1234567890',
  organizationEmail: 'info@clinicasanrafael.com',
  
  // System
  language: 'es',
  timezone: 'America/Mexico_City',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  autoLogout: false,
  sessionTimeout: 30,
  
  // Plan Management
  currentPlan: 'enterprise',
  planStatus: 'active',
  planExpiry: '2025-12-31',
}

export function useConfig() {
  const [config, setConfig] = useState<ConfigState>(defaultConfig)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('clinesa-config')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsedConfig })
        applyConfig({ ...defaultConfig, ...parsedConfig })
      } else {
        applyConfig(defaultConfig)
      }
    } catch (error) {
      console.error('Error loading config:', error)
      applyConfig(defaultConfig)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const applyConfig = (newConfig: ConfigState) => {
    // Apply dark mode
    if (newConfig.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Set default colors
    document.documentElement.style.setProperty('--primary-color', '#3b82f6')
    document.documentElement.style.setProperty('--accent-color', '#3b82f6')
  }

  const updateConfig = (key: keyof ConfigState, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    
    // Save to localStorage
    try {
      localStorage.setItem('clinesa-config', JSON.stringify(newConfig))
    } catch (error) {
      console.error('Error saving config:', error)
    }
    
    // Apply changes immediately
    applyConfig(newConfig)
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    localStorage.removeItem('clinesa-config')
    applyConfig(defaultConfig)
  }

  return {
    config,
    isLoaded,
    updateConfig,
    resetConfig,
  }
}
