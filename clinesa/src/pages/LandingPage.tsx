"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Globe,
  Lock,
  Activity,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: Users,
      title: "Gestión de Pacientes",
      description: "Administra todos tus pacientes en un solo lugar con historiales completos y seguimiento detallado.",
      image: "/screenshots/patients-dashboard.png"
    },
    {
      icon: Calendar,
      title: "Programación de Citas",
      description: "Sistema inteligente de citas con recordatorios automáticos y gestión de horarios.",
      image: "/screenshots/appointments-calendar.png"
    },
    {
      icon: FileText,
      title: "Historiales Médicos",
      description: "Historiales digitales completos con acceso rápido y búsqueda avanzada.",
      image: "/screenshots/medical-records.png"
    },
    {
      icon: BarChart3,
      title: "Reportes y Analytics",
      description: "Insights detallados sobre tu práctica médica con métricas en tiempo real.",
      image: "/screenshots/analytics-dashboard.png"
    }
  ];

  const benefits = [
    "Reducción del 60% en tiempo administrativo",
    "Mejora del 40% en la satisfacción del paciente",
    "Ahorro de 8 horas semanales en gestión",
    "Acceso 24/7 desde cualquier dispositivo",
    "Cumplimiento total con normativas médicas",
    "Integración con sistemas existentes"
  ];

  const stats = [
    { number: "10K+", label: "Pacientes Atendidos" },
    { number: "50K+", label: "Citas Programadas" },
    { number: "99.9%", label: "Tiempo de Actividad" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  const testimonials = [
    {
      name: "Dr. María González",
      role: "Directora Médica",
      company: "Clínica San Rafael",
      content: "CLINESA ha revolucionado completamente nuestra práctica. La eficiencia que hemos ganado es increíble.",
      avatar: "/avatars/maria-gonzalez.jpg"
    },
    {
      name: "Dr. Carlos Ruiz",
      role: "Cardiólogo",
      company: "Centro Cardiovascular",
      content: "La interfaz es intuitiva y las funcionalidades son exactamente lo que necesitábamos para nuestro centro.",
      avatar: "/avatars/carlos-ruiz.jpg"
    },
    {
      name: "Dra. Ana Martínez",
      role: "Pediatra",
      company: "Clínica Infantil",
      content: "Nuestros pacientes están encantados con la facilidad para programar citas y acceder a sus historiales.",
      avatar: "/avatars/ana-martinez.jpg"
    }
  ];

  return (
    <main className="w-full bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CLINESA</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Características</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Beneficios</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonios</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Precios</a>
              <Button variant="outline" size="sm">Iniciar Sesión</Button>
              <Button size="sm">Comenzar Gratis</Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                La plataforma médica
                <span className="text-blue-600 block">que necesitas</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Gestiona tu clínica de forma inteligente con nuestra plataforma integral. 
                Pacientes, citas, historiales y reportes en un solo lugar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button size="lg" className="text-lg px-8 py-4">
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Todo lo que necesitas para tu clínica
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa diseñada específicamente para profesionales de la salud
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "flex flex-col",
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
              >
                <div className="flex-1 mb-8 lg:mb-0 lg:mr-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-xl p-4 shadow-lg">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Así es por dentro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una interfaz intuitiva y moderna que hace que la gestión médica sea simple y eficiente
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-4 text-sm text-gray-600">clinesa.com/dashboard</div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-8 bg-blue-600 rounded-lg w-32"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="h-4 bg-blue-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="h-4 bg-green-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="h-32 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resultados que hablan por sí solos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Únete a cientos de profesionales que ya han transformado su práctica médica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales de la salud que han transformado su práctica con CLINESA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu práctica médica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comienza tu prueba gratuita de 14 días. Sin compromisos, sin tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
              Comenzar Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CLINESA</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma más avanzada para la gestión integral de clínicas médicas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
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

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CLINESA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;