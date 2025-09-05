import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PricingComparison } from '@/components/billing/PricingComparison'
import { useStripe } from '@/hooks/useStripe'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function PlansPage() {
  const navigate = useNavigate()
  const { createCheckoutSession, loading } = useStripe()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    try {
      setSelectedPlan(planId)
      await createCheckoutSession(planId, 'monthly')
    } catch (error) {
      console.error('Error selecting plan:', error)
      toast.error('Error al seleccionar el plan')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                CLINESA
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Ya tienes cuenta? 
                <Button
                  variant="link"
                  onClick={() => navigate('/auth/login')}
                  className="p-0 ml-1 h-auto"
                >
                  Iniciar sesión
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Elige el plan perfecto para tu consultorio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Comienza con 14 días de prueba gratuita. Sin compromisos, sin tarjeta de crédito requerida.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14 días de prueba gratuita</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sin compromisos</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancela cuando quieras</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Soporte en español</span>
            </div>
          </div>
        </div>

        {/* Pricing Comparison */}
        <PricingComparison 
          onSelectPlan={handleSelectPlan}
          loading={loading}
          selectedPlan={selectedPlan}
        />

        {/* Additional Benefits */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            ¿Por qué elegir CLINESA?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fácil de usar
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interfaz intuitiva diseñada específicamente para profesionales de la salud.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Seguro y confiable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cumplimos con los más altos estándares de seguridad y privacidad médica.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Soporte 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nuestro equipo está aquí para ayudarte cuando lo necesites.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para transformar tu consultorio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de profesionales que ya confían en CLINESA
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              onClick={() => handleSelectPlan('professional')}
              loading={loading && selectedPlan === 'professional'}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Comenzar Prueba Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth/register')}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
            >
              Crear Cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
