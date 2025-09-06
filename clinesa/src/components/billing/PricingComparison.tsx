import { Check, X, Star, Zap, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CURRENCY_SYMBOL } from '@/lib/stripe'

interface PricingComparisonProps {
  onSelectPlan: (planId: string) => void
  loading?: boolean
  selectedPlan?: string
}

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    icon: Zap,
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    description: 'Para médicos independientes',
    features: [
      { name: '1 usuario', included: true },
      { name: '200 pacientes', included: true },
      { name: '100 citas/mes', included: true },
      { name: 'Historiales médicos', included: true },
      { name: 'Calendario simple', included: true },
      { name: 'Soporte por email', included: true },
      { name: 'Backup básico', included: true },
      { name: 'Gestión de usuarios', included: false },
      { name: 'Reportes avanzados', included: false },
      { name: 'Integración laboratorios', included: false },
      { name: 'Soporte prioritario', included: false },
      { name: 'Recordatorios SMS', included: false },
    ],
    color: 'border-gray-200 dark:border-gray-700',
    gradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Profesional',
    icon: Star,
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    description: '⭐ MÁS POPULAR - Para clínicas en crecimiento',
    features: [
      { name: '5 usuarios', included: true },
      { name: '1,000 pacientes', included: true },
      { name: '500 citas/mes', included: true },
      { name: 'Todo del plan Básico', included: true },
      { name: 'Gestión de usuarios', included: true },
      { name: 'Reportes avanzados', included: true },
      { name: 'Integración laboratorios', included: true },
      { name: 'Soporte prioritario', included: true },
      { name: 'Backup automático', included: true },
      { name: 'Recordatorios SMS', included: true },
      { name: 'Facturación electrónica', included: true },
      { name: 'Estadísticas detalladas', included: true },
      { name: 'Exportación de datos', included: true },
      { name: 'Soporte por chat', included: true },
      { name: 'API personalizada', included: false },
      { name: 'Soporte 24/7', included: false },
    ],
    color: 'border-blue-500 dark:border-blue-400',
    gradient: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    icon: Crown,
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    description: 'Para hospitales y grandes organizaciones',
    features: [
      { name: '50 usuarios', included: true },
      { name: '5,000 pacientes', included: true },
      { name: '2,000 citas/mes', included: true },
      { name: 'Todo del plan Profesional', included: true },
      { name: 'API personalizada', included: true },
      { name: 'Integraciones avanzadas', included: true },
      { name: 'Soporte 24/7', included: true },
      { name: 'SLA garantizado', included: true },
      { name: 'Capacitación personalizada', included: true },
      { name: 'Múltiples sucursales', included: true },
      { name: 'Roles personalizados', included: true },
      { name: 'Auditoría completa', included: true },
      { name: 'Integración con HIS', included: true },
      { name: 'Soporte telefónico', included: true },
    ],
    color: 'border-purple-500 dark:border-purple-400',
    gradient: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
    popular: false,
  },
]

export function PricingComparison({ onSelectPlan, loading = false, selectedPlan }: PricingComparisonProps) {
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12
    const savings = monthlyTotal - yearly
    return Math.round((savings / monthlyTotal) * 100)
  }

  return (
    <div className="space-y-8 scroll-smooth">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Elige el plan perfecto para tu consultorio
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Todos los planes incluyen las funciones esenciales. 
          El plan <strong>Profesional</strong> ofrece la mejor relación calidad-precio.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-smooth">
        {plans.map((plan) => {
          const Icon = plan.icon
          const monthlySavings = calculateSavings(plan.monthlyPrice, plan.yearlyPrice)
          const isSelected = selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 hover:shadow-xl ${
                plan.popular
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-105'
                  : 'hover:shadow-lg'
              } ${plan.color} ${isSelected ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span>MÁS POPULAR</span>
                  </div>
                </div>
              )}

              <CardHeader className={`text-center pb-4 ${plan.gradient}`}>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </CardTitle>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {CURRENCY_SYMBOL}{plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1 text-lg">
                      /mes
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    o {CURRENCY_SYMBOL}{plan.yearlyPrice}/año
                  </div>
                  
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Ahorra {monthlySavings}% con facturación anual
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  loading={loading && selectedPlan === plan.id}
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                      : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900'
                  }`}
                >
                  {isSelected ? 'Seleccionado' : `Elegir ${plan.name}`}
                </Button>

                {/* Value Proposition */}
                {plan.popular && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        💰 Mejor valor por dinero
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Solo $0.08 por paciente al mes
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Comparación detallada de características
        </h3>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Características
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans[0].features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                    {feature.name}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.features[index]?.included ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Preguntas frecuentes
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              ¿Por qué el plan Profesional es el más popular?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ofrece la mejor relación calidad-precio con 5 usuarios, 1,000 pacientes y todas las funciones 
              necesarias para una clínica en crecimiento por solo $39.99/mes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              ¿Puedo cambiar de plan en cualquier momento?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán 
              en el próximo ciclo de facturación.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              ¿Hay período de prueba?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sí, todos los planes incluyen 14 días de prueba gratuita. No se requiere tarjeta de crédito.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
