import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_test-key',
    DEV: true,
  },
  writable: true,
})

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => Promise.resolve({ data: null, error: null })),
        delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    auth: {
      signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: null, error: null })),
    },
  },
  hasValidSupabaseConfig: true,
}))

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
  stripePromise: Promise.resolve({
    redirectToCheckout: vi.fn(() => Promise.resolve({ error: null })),
  }),
  hasValidStripeConfig: true,
  STRIPE_CONFIG: {
    publishableKey: 'pk_test_test-key',
    hasValidConfig: true,
  },
  STRIPE_PLAN_IDS: {
    basic: {
      monthly: 'price_basic_monthly',
      yearly: 'price_basic_yearly',
    },
    professional: {
      monthly: 'price_professional_monthly',
      yearly: 'price_professional_yearly',
    },
    enterprise: {
      monthly: 'price_enterprise_monthly',
      yearly: 'price_enterprise_yearly',
    },
  },
  CURRENCY: 'usd',
  CURRENCY_SYMBOL: '$',
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/dashboard' }),
  NavLink: ({ children, ...props }: any) => {
    const React = require('react')
    return React.createElement('a', props, children)
  },
  Navigate: ({ to }: any) => {
    const React = require('react')
    return React.createElement('div', { 'data-testid': 'navigate', 'data-to': to })
  },
}))

// Mock React Hot Toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => {
    const React = require('react')
    return React.createElement('div', { 'data-testid': 'toaster' })
  },
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => '01/01/2024'),
  addDays: vi.fn((date, days) => new Date()),
  subDays: vi.fn((date, days) => new Date()),
  isAfter: vi.fn(() => true),
  isBefore: vi.fn(() => false),
}))

// Mock Zustand
vi.mock('zustand', () => ({
  create: vi.fn(() => () => ({
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

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}