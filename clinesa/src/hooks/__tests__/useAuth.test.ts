import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    userProfile: null,
    organization: null,
    session: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isAdmin: false,
    isDoctor: false,
    isNurse: false,
    isReceptionist: false,
    canManageUsers: false,
    canManagePatients: false,
    canViewMedicalRecords: false,
    canCreateMedicalRecords: false,
    canManageAppointments: false,
    fullName: '',
    initials: '',
    signIn: vi.fn(),
    signOut: vi.fn(),
    setError: vi.fn(),
  })),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return default values when not authenticated', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.organization).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should return user data when authenticated', () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
    }

    const mockOrganization = {
      id: 'org-id',
      name: 'Test Clinic',
    }

    vi.mocked(require('@/stores/authStore').useAuthStore).mockReturnValue({
      user: mockUser,
      userProfile: mockUser,
      organization: mockOrganization,
      session: { access_token: 'token' },
      loading: false,
      error: null,
      isAuthenticated: true,
      isAdmin: true,
      isDoctor: false,
      isNurse: false,
      isReceptionist: false,
      canManageUsers: true,
      canManagePatients: true,
      canViewMedicalRecords: true,
      canCreateMedicalRecords: true,
      canManageAppointments: true,
      fullName: 'Test User',
      initials: 'TU',
      signIn: vi.fn(),
      signOut: vi.fn(),
      setError: vi.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.organization).toEqual(mockOrganization)
    expect(result.current.fullName).toBe('Test User')
    expect(result.current.initials).toBe('TU')
  })

  it('should return correct role flags', () => {
    vi.mocked(require('@/stores/authStore').useAuthStore).mockReturnValue({
      user: { role: 'admin' },
      userProfile: { role: 'admin' },
      organization: null,
      session: null,
      loading: false,
      error: null,
      isAuthenticated: true,
      isAdmin: true,
      isDoctor: false,
      isNurse: false,
      isReceptionist: false,
      canManageUsers: true,
      canManagePatients: true,
      canViewMedicalRecords: true,
      canCreateMedicalRecords: true,
      canManageAppointments: true,
      fullName: 'Admin User',
      initials: 'AU',
      signIn: vi.fn(),
      signOut: vi.fn(),
      setError: vi.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isDoctor).toBe(false)
    expect(result.current.isNurse).toBe(false)
    expect(result.current.isReceptionist).toBe(false)
  })

  it('should return correct permission flags', () => {
    vi.mocked(require('@/stores/authStore').useAuthStore).mockReturnValue({
      user: { role: 'doctor' },
      userProfile: { role: 'doctor' },
      organization: null,
      session: null,
      loading: false,
      error: null,
      isAuthenticated: true,
      isAdmin: false,
      isDoctor: true,
      isNurse: false,
      isReceptionist: false,
      canManageUsers: false,
      canManagePatients: true,
      canViewMedicalRecords: true,
      canCreateMedicalRecords: true,
      canManageAppointments: true,
      fullName: 'Dr. User',
      initials: 'DU',
      signIn: vi.fn(),
      signOut: vi.fn(),
      setError: vi.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.canManageUsers).toBe(false)
    expect(result.current.canManagePatients).toBe(true)
    expect(result.current.canViewMedicalRecords).toBe(true)
    expect(result.current.canCreateMedicalRecords).toBe(true)
    expect(result.current.canManageAppointments).toBe(true)
  })

  it('should call signIn when signIn is called', async () => {
    const mockSignIn = vi.fn()
    vi.mocked(require('@/stores/authStore').useAuthStore).mockReturnValue({
      user: null,
      userProfile: null,
      organization: null,
      session: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false,
      isNurse: false,
      isReceptionist: false,
      canManageUsers: false,
      canManagePatients: false,
      canViewMedicalRecords: false,
      canCreateMedicalRecords: false,
      canManageAppointments: false,
      fullName: '',
      initials: '',
      signIn: mockSignIn,
      signOut: vi.fn(),
      setError: vi.fn(),
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'password')
    })

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('should call signOut when signOut is called', async () => {
    const mockSignOut = vi.fn()
    vi.mocked(require('@/stores/authStore').useAuthStore).mockReturnValue({
      user: null,
      userProfile: null,
      organization: null,
      session: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false,
      isNurse: false,
      isReceptionist: false,
      canManageUsers: false,
      canManagePatients: false,
      canViewMedicalRecords: false,
      canCreateMedicalRecords: false,
      canManageAppointments: false,
      fullName: '',
      initials: '',
      signIn: vi.fn(),
      signOut: mockSignOut,
      setError: vi.fn(),
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })
})
