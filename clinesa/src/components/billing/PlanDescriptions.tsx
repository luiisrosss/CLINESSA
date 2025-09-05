import { 
  Zap, 
  Star, 
  Crown, 
  CheckCircle, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  BarChart3, 
  TestTube, 
  MessageSquare, 
  Download, 
  Code, 
  Building, 
  Shield, 
  Activity, 
  Database,
  Clock,
  Headphones,
  Cloud
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface PlanDescriptionsProps {
  selectedPlan?: 'basic' | 'professional' | 'enterprise'
  showPricing?: boolean
}

const planData = {
  basic: {
    name: 'Básico',
    icon: Zap,
    price: { monthly: 19.99, yearly: 199.99 },
    description: 'Para médicos independientes y consultorios pequeños',
    tagline: 'Perfecto para comenzar tu práctica médica',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
    borderColor: 'border-gray-200 dark:border-gray-700',
    features: [
      {
        category: 'Capacidad',
        items: [
          { icon: Users, text: '1 usuario', included: true },
          { icon: UserCheck, text: '200 pacientes', included: true },
          { icon: Calendar, text: '100 citas por mes', included: true },
        ]
      },
      {
        category: 'Funcionalidades Core',
        items: [
          { icon: FileText, text: 'Historiales médicos básicos', included: true },
          { icon: Calendar, text: 'Calendario de citas simple', included: true },
          { icon: Users, text: 'Gestión de pacientes', included: true },
        ]
      },
      {
        category: 'Soporte y Seguridad',
        items: [
          { icon: MessageSquare, text: 'Soporte por email (24-48h)', included: true },
          { icon: Cloud, text: 'Backup diario (7 días)', included: true },
          { icon: Shield, text: 'Seguridad básica', included: true },
        ]
      }
    ],
    limitations: [
      'Solo 1 usuario puede acceder al sistema',
      'Límite de 200 pacientes',
      'Sin reportes avanzados',
      'Sin integración con laboratorios',
      'Sin recordatorios SMS automáticos'
    ],
    idealFor: [
      'Médicos independientes',
      'Consultorios pequeños (1-2 consultorios)',
      'Prácticas que recién comienzan',
      'Profesionales que necesitan funcionalidad básica'
    ],
    psychology: {
      hook: 'Solo $19.99/mes - Menos de $1 por día',
      value: 'Perfecto para comenzar sin comprometer tu presupuesto',
      urgency: 'Ideal para médicos que están comenzando su práctica',
      social: 'Elegido por más de 1,000 médicos independientes'
    }
  },
  
  professional: {
    name: 'Profesional',
    icon: Star,
    price: { monthly: 39.99, yearly: 399.99 },
    description: '⭐ MÁS POPULAR - Para clínicas y consultorios en crecimiento',
    tagline: 'La opción más elegida por clínicas exitosas',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
    borderColor: 'border-blue-500 dark:border-blue-400',
    features: [
      {
        category: 'Capacidad',
        items: [
          { icon: Users, text: '5 usuarios', included: true },
          { icon: UserCheck, text: '1,000 pacientes', included: true },
          { icon: Calendar, text: '500 citas por mes', included: true },
        ]
      },
      {
        category: 'Funcionalidades Avanzadas',
        items: [
          { icon: FileText, text: 'Todo del plan Básico', included: true },
          { icon: BarChart3, text: 'Reportes avanzados y estadísticas', included: true },
          { icon: Users, text: 'Gestión completa de usuarios', included: true },
          { icon: TestTube, text: 'Integración con laboratorios', included: true },
          { icon: MessageSquare, text: 'Recordatorios SMS automáticos', included: true },
          { icon: Download, text: 'Exportación de datos', included: true },
        ]
      },
      {
        category: 'Soporte y Seguridad',
        items: [
          { icon: MessageSquare, text: 'Soporte prioritario (4-8h) + Chat', included: true },
          { icon: Cloud, text: 'Backup automático (30 días)', included: true },
          { icon: Shield, text: 'Seguridad avanzada', included: true },
        ]
      }
    ],
    limitations: [
      'Máximo 5 usuarios simultáneos',
      'Sin API personalizada',
      'Sin múltiples sucursales',
      'Sin soporte 24/7'
    ],
    idealFor: [
      'Clínicas medianas (3-10 consultorios)',
      'Consultorios en crecimiento',
      'Equipos médicos pequeños',
      'Prácticas que necesitan reportes y análisis'
    ],
    psychology: {
      hook: 'Solo $0.08 por paciente al mes - ¡Increíble valor!',
      value: '5x más capacidad que el plan Básico por solo 2x el precio',
      urgency: 'El plan más popular - Únete a miles de clínicas exitosas',
      social: 'Elegido por el 70% de nuestros clientes'
    }
  },
  
  enterprise: {
    name: 'Empresarial',
    icon: Crown,
    price: { monthly: 99.99, yearly: 999.99 },
    description: 'Para hospitales y grandes organizaciones médicas',
    tagline: 'La solución completa para organizaciones médicas grandes',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
    borderColor: 'border-purple-500 dark:border-purple-400',
    features: [
      {
        category: 'Capacidad',
        items: [
          { icon: Users, text: '50 usuarios', included: true },
          { icon: UserCheck, text: '5,000 pacientes', included: true },
          { icon: Calendar, text: '2,000 citas por mes', included: true },
        ]
      },
      {
        category: 'Funcionalidades Enterprise',
        items: [
          { icon: FileText, text: 'Todo del plan Profesional', included: true },
          { icon: Code, text: 'API personalizada', included: true },
          { icon: Building, text: 'Múltiples sucursales', included: true },
          { icon: Shield, text: 'Roles personalizados', included: true },
          { icon: Activity, text: 'Auditoría completa', included: true },
          { icon: Database, text: 'Integración con HIS', included: true },
        ]
      },
      {
        category: 'Soporte y Seguridad',
        items: [
          { icon: Headphones, text: 'Soporte 24/7 + Teléfono', included: true },
          { icon: Cloud, text: 'Backup enterprise (90 días)', included: true },
          { icon: Shield, text: 'Seguridad de nivel hospitalario', included: true },
          { icon: Clock, text: 'SLA garantizado', included: true },
        ]
      }
    ],
    limitations: [
      'Precio más alto (pero mejor valor por usuario)',
      'Requiere configuración inicial más compleja'
    ],
    idealFor: [
      'Hospitales y centros médicos grandes',
      'Cadenas de clínicas',
      'Organizaciones con múltiples sucursales',
      'Instituciones que necesitan integración con sistemas existentes'
    ],
    psychology: {
      hook: 'Solo $2 por usuario al mes - ¡Increíble para 50 usuarios!',
      value: '50 usuarios por menos de $100/mes - Menos de $2 por usuario',
      urgency: 'Solución enterprise probada en hospitales reales',
      social: 'Confianza de hospitales y organizaciones médicas líderes'
    }
  }
}

export function PlanDescriptions({ selectedPlan, showPricing = true }: PlanDescriptionsProps) {
  const plans = selectedPlan ? [planData[selectedPlan]] : Object.values(planData)

  return (
    <div className="space-y-8">
      {plans.map((plan) => {
        const Icon = plan.icon
        
        return (
          <Card key={plan.name} className={`${plan.bgColor} ${plan.borderColor} border-2`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <Icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>Plan {plan.name}</span>
                      {plan.name === 'Profesional' && (
                        <Badge className="bg-blue-500 text-white">MÁS POPULAR</Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {plan.description}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {plan.tagline}
                    </p>
                  </div>
                </div>
                
                {showPricing && (
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price.monthly}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      /mes o ${plan.price.yearly}/año
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Ahorra 17% con facturación anual
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Psychology Hooks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ¿Por qué elegir este plan?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">💰 Valor Excepcional</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.psychology.hook}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Perfecto Para Ti</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.psychology.value}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">⚡ Confianza</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.psychology.social}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">🚀 Oportunidad</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.psychology.urgency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features by Category */}
              <div className="space-y-6">
                {plan.features.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon
                        return (
                          <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <ItemIcon className={`w-5 h-5 ${item.included ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${item.included ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.text}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ideal For */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  🎯 Ideal para:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.idealFor.map((target, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-800 dark:text-blue-200">{target}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations (only show for basic and professional) */}
              {plan.name !== 'Empresarial' && plan.limitations.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
                    ⚠️ Limitaciones del plan:
                  </h3>
                  <div className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                        <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Value Proposition */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💡 ¿Sabías que...?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {plan.name === 'Básico' && 'Costo por paciente: $0.10/mes'}
                      {plan.name === 'Profesional' && 'Costo por paciente: $0.04/mes'}
                      {plan.name === 'Empresarial' && 'Costo por paciente: $0.02/mes'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.name === 'Básico' && 'Menos de lo que cuesta un café por paciente al mes'}
                      {plan.name === 'Profesional' && 'El mejor valor del mercado - 4x más eficiente que el plan Básico'}
                      {plan.name === 'Empresarial' && 'Increíble valor para organizaciones grandes - 5x más eficiente'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {plan.name === 'Básico' && 'ROI en 30 días'}
                      {plan.name === 'Profesional' && 'ROI en 15 días'}
                      {plan.name === 'Empresarial' && 'ROI en 7 días'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.name === 'Básico' && 'Ahorra 2 horas diarias en gestión administrativa'}
                      {plan.name === 'Profesional' && 'Ahorra 4 horas diarias + aumenta ingresos 20%'}
                      {plan.name === 'Empresarial' && 'Ahorra 6 horas diarias + aumenta ingresos 35%'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
