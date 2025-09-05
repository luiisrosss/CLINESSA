import { Stethoscope, Database, Key, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl">
                  <Stethoscope className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">CLINESA - Sistema de Gestión Médica</h1>
              <p className="text-blue-100 text-center max-w-2xl mx-auto">
                Sistema completo de gestión médica con gestión de pacientes, citas y historiales clínicos.
                Configura tu base de datos para comenzar.
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Setup Steps */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Configuración Rápida</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold text-sm">
                          1
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Crear proyecto Supabase</h3>
                        <p className="text-blue-700 text-sm mb-2">
                          Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">supabase.com</a> y crea un nuevo proyecto
                        </p>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open('https://supabase.com/dashboard/new', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Crear Proyecto
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white font-bold text-sm">
                          2
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">Configurar base de datos</h3>
                        <p className="text-green-700 text-sm mb-2">
                          Ejecuta los archivos SQL en el orden indicado
                        </p>
                        <div className="space-y-1 text-xs text-green-600">
                          <div className="flex items-center">
                            <Database className="w-3 h-3 mr-2" />
                            <code>database/migrations/001_initial_schema.sql</code>
                          </div>
                          <div className="flex items-center">
                            <Database className="w-3 h-3 mr-2" />
                            <code>database/migrations/002_row_level_security.sql</code>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Database className="w-3 h-3 mr-2" />
                            <code>database/migrations/003_sample_data.sql</code> (opcional)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white font-bold text-sm">
                          3
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900 mb-1">Configurar variables de entorno</h3>
                        <p className="text-purple-700 text-sm mb-2">
                          Actualiza tu archivo <code>.env.local</code> con las credenciales
                        </p>
                        <div className="bg-gray-900 rounded-md p-3 text-xs text-gray-300 font-mono">
                          <div>VITE_SUPABASE_URL=tu-url-de-proyecto</div>
                          <div>VITE_SUPABASE_ANON_KEY=tu-clave-anonima</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Funcionalidades Incluidas</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Dashboard interactivo con estadísticas</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Gestión completa de pacientes</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Sistema de citas con calendario</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Historiales médicos estructurados</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Autenticación con roles de usuario</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Arquitectura multi-tenant segura</span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Key className="w-5 h-5 text-amber-600 mt-0.5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Instrucciones Detalladas</h3>
                        <p className="text-amber-800 text-sm">
                          Consulta el archivo <code>database/QUICK_SETUP.md</code> para 
                          instrucciones paso a paso con pantallas de ejemplo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Una vez configurado, recarga la página para acceder al sistema completo
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Recargar Página
                  </Button>
                  <Button 
                    onClick={() => window.open('https://docs.supabase.com', '_blank')}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    📚 Documentación Supabase
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}