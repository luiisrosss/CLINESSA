import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
// import { log } from '@/lib/logger'
// import { analytics } from '@/lib/analytics'

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

  const isAuthenticated = !!user && !!session

  useEffect(() => {
    if (!user && !session) {
      initialize()
    }
  }, [initialize, user, session])

  // Removed welcome toast from here - it will be handled in LoginPage
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