import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BillingPage } from '../../pages/billing/BillingPage'
import { mockUseAuth, mockUseStripe, mockUsePlanLimits } from '../utils'

// Mock all the hooks
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../hooks/useStripe', () => ({
  useStripe: vi.fn(),
}))

vi.mock('../../hooks/usePlanLimits', () => ({
  usePlanLimits: vi.fn(),
}))

describe('BillingPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    vi.mocked(require('../../hooks/useAuth').useAuth).mockReturnValue(mockUseAuth)
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)
    vi.mocked(require('../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
  })

  it('should render billing page with subscription details', () => {
    render(<BillingPage />)
    
    expect(screen.getByText('Facturación')).toBeInTheDocument()
    expect(screen.getByText('Gestiona tu suscripción y métodos de pago')).toBeInTheDocument()
  })

  it('should show plan limits display when subscription exists', () => {
    render(<BillingPage />)
    
    expect(screen.getByText('Uso Actual del Plan')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Pacientes')).toBeInTheDocument()
  })

  it('should show no subscription message when no subscription', () => {
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      subscription: null,
    })

    render(<BillingPage />)
    
    expect(screen.getByText('No hay suscripción activa')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un plan para comenzar a usar CLINESA')).toBeInTheDocument()
  })

  it('should open plan selector when clicking "Ver Planes"', async () => {
    render(<BillingPage />)
    
    const verPlanesButton = screen.getByText('Ver Planes')
    fireEvent.click(verPlanesButton)
    
    await waitFor(() => {
      expect(screen.getByText('Comparación de Planes')).toBeInTheDocument()
    })
  })

  it('should open plan selector when clicking "Cambiar Plan"', async () => {
    render(<BillingPage />)
    
    const cambiarPlanButton = screen.getByText('Cambiar Plan')
    fireEvent.click(cambiarPlanButton)
    
    await waitFor(() => {
      expect(screen.getByText('Seleccionar Plan')).toBeInTheDocument()
    })
  })

  it('should show trial warning when trial is expiring', () => {
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      isTrial: true,
      daysUntilTrialEnd: 2,
    })

    render(<BillingPage />)
    
    expect(screen.getByText('Período de Prueba Próximo a Vencer')).toBeInTheDocument()
    expect(screen.getByText('Tu período de prueba termina en 2 días')).toBeInTheDocument()
  })

  it('should show trial expired message when trial has expired', () => {
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      isTrial: true,
      daysUntilTrialEnd: -1,
    })

    render(<BillingPage />)
    
    expect(screen.getByText('Período de Prueba Expirado')).toBeInTheDocument()
    expect(screen.getByText('Tu período de prueba ha terminado')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      loading: true,
    })

    render(<BillingPage />)
    
    expect(screen.getByText('Cargando información de facturación...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      error: 'Error loading billing information',
    })

    render(<BillingPage />)
    
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Error loading billing information')).toBeInTheDocument()
  })

  it('should handle manage billing button click', async () => {
    const mockCreateCustomerPortalSession = vi.fn()
    vi.mocked(require('../../hooks/useStripe').useStripe).mockReturnValue({
      ...mockUseStripe,
      createCustomerPortalSession: mockCreateCustomerPortalSession,
    })

    render(<BillingPage />)
    
    const manageBillingButton = screen.getByText('Gestionar Facturación')
    fireEvent.click(manageBillingButton)
    
    await waitFor(() => {
      expect(mockCreateCustomerPortalSession).toHaveBeenCalled()
    })
  })
})
