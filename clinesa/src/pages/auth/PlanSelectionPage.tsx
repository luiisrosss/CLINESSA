import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Star, Zap, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface Plan {
  id: string
  name: string
  type: 'basic' | 'professional' | 'enterprise'
  description: string
  priceMonthly: number
  priceYearly: number
  maxUsers: number
  maxPatients: number
  maxAppointments: number
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    type: 'basic',
    description: 'Para médicos independientes',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    maxUsers: 1,
    maxPatients: 200,
    maxAppointments: 100,
    features: [
      '1 usuario',
      '200 pacientes',
      '100 citas/mes',
      'Historiales médicos',
      'Calendario simple',
      'Soporte por email',
      'Backup básico'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'professional',
    name: 'Profesional',
    type: 'professional',
    description: '⭐ MÁS POPULAR - Para clínicas en crecimiento',
    priceMonthly: 39.99,
    priceYearly: 399.99,
    maxUsers: 1,
    maxPatients: 1000,
    maxAppointments: 500,
    features: [
      '1 usuario',
      '1,000 pacientes',
      '500 citas/mes',
      'Todo del plan Básico',
      'Gestión de usuarios',
      'Reportes avanzados',
      'Integración laboratorios',
      'Soporte prioritario',
      'Backup automático',
      'Recordatorios SMS',
      'Facturación electrónica'
    ],
    popular: true,
    icon: <Star className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    type: 'enterprise',
    description: 'Para hospitales y grandes organizaciones',
    priceMonthly: 99.99,
    priceYearly: 999.99,
    maxUsers: 50,
    maxPatients: 5000,
    maxAppointments: 2000,
    features: [
      '50 usuarios',
      '5,000 pacientes',
      '2,000 citas/mes',
      'Todo del plan Profesional',
      'API personalizada',
      'Integraciones avanzadas',
      'Soporte 24/7',
      'SLA garantizado',
      'Capacitación personalizada',
      'Múltiples sucursales',
      'Roles personalizados'
    ],
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600'
  }
]

export function PlanSelectionPage() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleContinue = () => {
    // Store selected plan in localStorage for registration
    localStorage.setItem('selectedPlan', selectedPlan)
    localStorage.setItem('billingCycle', billingCycle)
    navigate('/auth/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elige tu Plan de CLINESA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Selecciona el plan que mejor se adapte a las necesidades de tu consulta médica.
            Todos los planes incluyen 14 días de prueba gratuita.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-medical-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-medical-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-medical-500 shadow-xl scale-105'
                  : 'hover:shadow-lg'
              } ${plan.popular ? 'border-purple-200' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === 'monthly' ? 'mes' : 'año'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? 'bg-medical-600 hover:bg-medical-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlanSelect(plan.id)
                  }}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            className="bg-medical-600 hover:bg-medical-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Continuar con el Registro
          </Button>
          
          <p className="text-sm text-gray-600 mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/auth/login" 
              className="text-medical-600 hover:text-medical-700 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Trial Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎉 14 Días de Prueba Gratuita
          </h3>
          <p className="text-blue-700">
            Prueba CLINESA sin compromiso. Cancela en cualquier momento durante el período de prueba.
          </p>
        </div>
      </div>
    </div>
  )
}
