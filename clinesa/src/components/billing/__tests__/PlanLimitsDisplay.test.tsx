import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlanLimitsDisplay } from '../PlanLimitsDisplay'
import { mockUsePlanLimits, mockUseStripe } from '../../../test/utils'

// Mock the hooks
vi.mock('../../../hooks/usePlanLimits', () => ({
  usePlanLimits: vi.fn(),
}))

vi.mock('../../../hooks/useStripe', () => ({
  useStripe: vi.fn(),
}))

describe('PlanLimitsDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue({
      ...mockUsePlanLimits,
      loading: true,
    })
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('Cargando límites del plan...')).toBeInTheDocument()
  })

  it('should render error state', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue({
      ...mockUsePlanLimits,
      limits: null,
      usage: null,
    })
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('No se pudieron cargar los límites del plan')).toBeInTheDocument()
  })

  it('should render plan limits correctly', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('Uso Actual del Plan')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Pacientes')).toBeInTheDocument()
    expect(screen.getByText('Citas este mes')).toBeInTheDocument()
  })

  it('should show upgrade button when showUpgradeButton is true', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay showUpgradeButton={true} />)
    
    expect(screen.getByText('Actualizar Plan')).toBeInTheDocument()
  })

  it('should not show upgrade button when showUpgradeButton is false', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay showUpgradeButton={false} />)
    
    expect(screen.queryByText('Actualizar Plan')).not.toBeInTheDocument()
  })

  it('should show upgrade prompt when approaching limits', () => {
    const mockLimitsWithUpgrade = {
      ...mockUsePlanLimits,
      showUpgradePrompt: vi.fn(() => true),
      getUpgradeRecommendation: vi.fn(() => 'Has alcanzado el límite de usuarios'),
    }

    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockLimitsWithUpgrade)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('Recomendación de Actualización')).toBeInTheDocument()
    expect(screen.getByText('Has alcanzado el límite de usuarios')).toBeInTheDocument()
  })

  it('should render compact version', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay compact={true} />)
    
    expect(screen.getByText('Plan Profesional')).toBeInTheDocument()
    expect(screen.getByText('Soporte prioritario')).toBeInTheDocument()
  })

  it('should display usage statistics correctly', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('2 / 5')).toBeInTheDocument() // current users / max users
    expect(screen.getByText('150 / 1,000')).toBeInTheDocument() // current patients / max patients
    expect(screen.getByText('75 / 500')).toBeInTheDocument() // current appointments / max appointments
  })

  it('should show plan benefits', () => {
    vi.mocked(require('../../../hooks/usePlanLimits').usePlanLimits).mockReturnValue(mockUsePlanLimits)
    vi.mocked(require('../../../hooks/useStripe').useStripe).mockReturnValue(mockUseStripe)

    render(<PlanLimitsDisplay />)
    
    expect(screen.getByText('Características Incluidas')).toBeInTheDocument()
    expect(screen.getByText('Gestión de usuarios')).toBeInTheDocument()
    expect(screen.getByText('Reportes avanzados')).toBeInTheDocument()
  })
})
