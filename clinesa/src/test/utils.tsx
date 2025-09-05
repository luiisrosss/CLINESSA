import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'admin' as const,
  organization_id: 'test-org-id',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockOrganization = {
  id: 'test-org-id',
  name: 'Test Clinic',
  type: 'clinic',
  address: '123 Test St',
  phone: '+1234567890',
  email: 'test@clinic.com',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockPatient = {
  id: 'test-patient-id',
  organization_id: 'test-org-id',
  patient_number: 'P001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  date_of_birth: '1990-01-01',
  gender: 'male' as const,
  address: '123 Main St',
  emergency_contact: 'Jane Doe',
  emergency_phone: '+1234567891',
  medical_history: 'No known allergies',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockAppointment = {
  id: 'test-appointment-id',
  organization_id: 'test-org-id',
  patient_id: 'test-patient-id',
  doctor_id: 'test-user-id',
  title: 'Regular Checkup',
  description: 'Annual checkup',
  appointment_date: '2024-01-15',
  appointment_time: '10:00',
  duration: 30,
  status: 'scheduled' as const,
  notes: 'Patient feels well',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockMedicalRecord = {
  id: 'test-record-id',
  organization_id: 'test-org-id',
  patient_id: 'test-patient-id',
  doctor_id: 'test-user-id',
  record_type: 'consultation',
  title: 'Initial Consultation',
  description: 'First visit',
  diagnosis: 'Healthy',
  treatment: 'None required',
  medications: 'None',
  vital_signs: {
    blood_pressure: '120/80',
    heart_rate: '72',
    temperature: '36.5',
    weight: '70',
    height: '175',
    oxygen_saturation: '98',
  },
  notes: 'Patient in good health',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockSubscription = {
  id: 'test-subscription-id',
  organization_id: 'test-org-id',
  plan_id: 'test-plan-id',
  status: 'active' as const,
  current_period_start: '2024-01-01T00:00:00Z',
  current_period_end: '2024-02-01T00:00:00Z',
  cancel_at_period_end: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  plan: {
    id: 'test-plan-id',
    name: 'Profesional',
    type: 'professional' as const,
    price_monthly: 39.99,
    price_yearly: 399.99,
    max_users: 5,
    max_patients: 1000,
    max_appointments_per_month: 500,
    features: ['Gestión de usuarios', 'Reportes avanzados'],
  },
}

// Mock hooks
export const mockUseAuth = {
  user: mockUser,
  userProfile: mockUser,
  organization: mockOrganization,
  session: { access_token: 'test-token' },
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
}

export const mockUseStripe = {
  stripe: null,
  loading: false,
  error: null,
  subscription: mockSubscription,
  plans: [
    {
      id: 'basic',
      name: 'Básico',
      type: 'basic',
      price_monthly: 19.99,
      price_yearly: 199.99,
      max_users: 1,
      max_patients: 200,
      max_appointments_per_month: 100,
      features: ['Funciones básicas'],
    },
    {
      id: 'professional',
      name: 'Profesional',
      type: 'professional',
      price_monthly: 39.99,
      price_yearly: 399.99,
      max_users: 5,
      max_patients: 1000,
      max_appointments_per_month: 500,
      features: ['Funciones avanzadas'],
    },
  ],
  isTrialExpired: false,
  daysUntilTrialEnd: 10,
  hasActiveSubscription: true,
  isTrial: false,
  createCheckoutSession: vi.fn(),
  createCustomerPortalSession: vi.fn(),
  cancelSubscription: vi.fn(),
  reactivateSubscription: vi.fn(),
  canUpgrade: vi.fn(() => true),
  canDowngrade: vi.fn(() => false),
  refreshSubscription: vi.fn(),
}

export const mockUsePlanLimits = {
  limits: {
    maxUsers: 5,
    maxPatients: 1000,
    maxAppointmentsPerMonth: 500,
    canCreateMedicalRecords: true,
    canManageUsers: true,
    canViewReports: true,
    canIntegrateLabs: true,
    canSendSMS: true,
    canExportData: true,
    canUseAPI: false,
    canHaveMultipleBranches: false,
    canCustomizeRoles: false,
    canAuditLogs: false,
    canIntegrateHIS: false,
    supportLevel: 'priority' as const,
    backupLevel: 'automatic' as const,
  },
  usage: {
    currentUsers: 2,
    currentPatients: 150,
    currentAppointmentsThisMonth: 75,
    usagePercentage: {
      users: 40,
      patients: 15,
      appointments: 15,
    },
  },
  loading: false,
  error: null,
  canPerformAction: vi.fn(() => true),
  canAddResource: vi.fn(() => true),
  getRemainingCapacity: vi.fn(() => 3),
  isApproachingLimit: vi.fn(() => false),
  isAtLimit: vi.fn(() => false),
  getUpgradeRecommendation: vi.fn(() => null),
  getPlanBenefits: vi.fn(() => ['Gestión de usuarios', 'Reportes avanzados']),
  getSupportDescription: vi.fn(() => 'Soporte prioritario'),
  getBackupDescription: vi.fn(() => 'Backup automático'),
  showUpgradePrompt: vi.fn(() => false),
  refreshUsage: vi.fn(),
}

// Test helpers
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApiResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
})

export const mockApiError = (message: string) => ({
  data: null,
  error: { message, code: 'TEST_ERROR' },
})

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
