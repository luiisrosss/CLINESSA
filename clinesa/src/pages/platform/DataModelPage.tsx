"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  ArrowLeft,
  Database,
  Users,
  Zap,
  Settings,
  Workflow,
  Target,
  Activity,
  BarChart,
  Shield,
  Globe,
  Lock,
  Clock,
  Award,
  TrendingUp,
  PieChart,
  LineChart,
  Bell,
  MoreHorizontal,
  ExternalLink,
  Star,
  Play,
  ChevronDown,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Search,
  Plus,
  Filter,
  BookOpen,
  FileText,
  Download,
  Video,
  Headphones,
  HelpCircle,
  Code,
  Layers,
  Cpu,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const DataModelPage = () => {
  const features = [
    {
      icon: Database,
      title: "Modelo de Datos Flexible",
      description: "Crea y personaliza campos según las necesidades específicas de tu clínica médica.",
      details: [
        "Campos personalizados ilimitados",
        "Tipos de datos médicos especializados",
        "Validación automática de datos",
        "Sincronización en tiempo real"
      ]
    },
    {
      icon: Layers,
      title: "Estructura Jerárquica",
      description: "Organiza la información de manera lógica con relaciones entre entidades.",
      details: [
        "Relaciones entre pacientes y citas",
        "Historiales médicos vinculados",
        "Jerarquía de especialidades",
        "Datos de contacto estructurados"
      ]
    },
    {
      icon: Cpu,
      title: "Procesamiento Inteligente",
      description: "IA integrada para enriquecer y validar automáticamente los datos.",
      details: [
        "Enriquecimiento automático de datos",
        "Detección de duplicados",
        "Validación de información médica",
        "Sugerencias inteligentes"
      ]
    },
    {
      icon: Network,
      title: "Integración Total",
      description: "Conecta con sistemas externos para mantener datos actualizados.",
      details: [
        "APIs de sistemas hospitalarios",
        "Sincronización con laboratorios",
        "Integración con seguros médicos",
        "Conectores pre-construidos"
      ]
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CLINESA</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Inicio</a>
              <a href="/platform" className="text-gray-900 font-medium">Plataforma</a>
              <a href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Recursos</a>
              <a href="#customers" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Clientes</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Precios</a>
              <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Blog</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                Iniciar sesión
              </Button>
              <Button size="sm" className="text-sm px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 font-medium">
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Plataforma
                </Button>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Modelo de Datos
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl font-light">
                Un modelo de datos flexible y potente diseñado específicamente para clínicas médicas. 
                Sincroniza y enriquece automáticamente toda tu información.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button size="lg" className="text-lg px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium">
                Comenzar
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                <Play className="w-5 h-5 mr-2" />
                Ver demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Características del Modelo de Datos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Descubre cómo nuestro modelo de datos revoluciona la gestión de información médica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              ¿Listo para revolucionar tu modelo de datos?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Descubre cómo nuestro modelo de datos puede transformar la gestión de información en tu clínica.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium">
                Comenzar
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg font-medium">
                Ver demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-900 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">CLINESA</span>
              </div>
              <p className="text-gray-600 mb-4">
                La plataforma más avanzada para la gestión integral de clínicas médicas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Integraciones</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+34 900 123 456</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hola@clinesa.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Madrid, España</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 CLINESA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataModelPage;
