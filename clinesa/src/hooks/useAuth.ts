import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

export function useAuth() {
  const {
    user,
    userProfile,
    organization,
    session,
    loading,
    error,
    signIn,
    signOut,
    initialize,
    setError
  } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const isAuthenticated = !!user && !!session
  const isAdmin = userProfile?.role === 'admin'
  const isDoctor = userProfile?.role === 'doctor'
  const isNurse = userProfile?.role === 'nurse'
  const isReceptionist = userProfile?.role === 'receptionist'

  const canManageUsers = isAdmin
  const canManagePatients = isAdmin || isDoctor || isNurse || isReceptionist
  const canViewMedicalRecords = isAdmin || isDoctor || isNurse
  const canCreateMedicalRecords = isAdmin || isDoctor
  const canManageAppointments = isAdmin || isDoctor || isReceptionist

  const fullName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''
  const initials = fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    // State
    user,
    userProfile,
    organization,
    session,
    loading,
    error,
    isAuthenticated,
    
    // Role checks
    isAdmin,
    isDoctor,
    isNurse,
    isReceptionist,
    
    // Permission checks
    canManageUsers,
    canManagePatients,
    canViewMedicalRecords,
    canCreateMedicalRecords,
    canManageAppointments,
    
    // User info
    fullName,
    initials,
    
    // Actions
    signIn,
    signOut,
    setError,
  }
}