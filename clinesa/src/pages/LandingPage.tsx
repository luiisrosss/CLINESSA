"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React, { useRef } from "react";
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
  ChevronRight,
  Search,
  Bell,
  Settings,
  Plus,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Database,
  Workflow,
  Target,
  BarChart,
  PieChart,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const features = [
    {
      icon: Users,
      title: "Gestión de Pacientes",
      description: "Administra todos tus pacientes en un solo lugar con historiales completos y seguimiento detallado.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Programación de Citas",
      description: "Sistema inteligente de citas con recordatorios automáticos y gestión de horarios.",
      color: "bg-green-500"
    },
    {
      icon: FileText,
      title: "Historiales Médicos",
      description: "Historiales digitales completos con acceso rápido y búsqueda avanzada.",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "Reportes y Analytics",
      description: "Insights detallados sobre tu práctica médica con métricas en tiempo real.",
      color: "bg-orange-500"
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
    <div ref={containerRef} className="w-full bg-white">
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CLINESA</span>
            </div>

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
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
                La plataforma médica
                <span className="text-blue-600 block">que necesitas</span>
              </h1>
              <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
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

      {/* Software Preview Section - Attio Style */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Así es por dentro
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Una interfaz intuitiva y moderna que hace que la gestión médica sea simple y eficiente
            </p>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Browser Header */}
            <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-600">clinesa.com/dashboard</div>
              <div className="w-6 h-6"></div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              {/* Top Navigation */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Dashboard</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar pacientes, citas..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { title: "Pacientes Activos", value: "1,247", change: "+12%", color: "bg-blue-500" },
                  { title: "Citas Hoy", value: "23", change: "+5%", color: "bg-green-500" },
                  { title: "Ingresos Mensuales", value: "€45,230", change: "+18%", color: "bg-purple-500" },
                  { title: "Satisfacción", value: "4.8/5", change: "+0.2", color: "bg-orange-500" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patients Table */}
                <motion.div 
                  className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">Pacientes Recientes</h4>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { name: "María González", email: "maria@email.com", status: "Activo", lastVisit: "Hace 2 días" },
                        { name: "Carlos Ruiz", email: "carlos@email.com", status: "Activo", lastVisit: "Hace 1 semana" },
                        { name: "Ana Martínez", email: "ana@email.com", status: "Pendiente", lastVisit: "Hace 3 días" },
                        { name: "Luis García", email: "luis@email.com", status: "Activo", lastVisit: "Hace 1 día" }
                      ].map((patient, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-600">{patient.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              patient.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {patient.status}
                            </span>
                            <span className="text-sm text-gray-500">{patient.lastVisit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Appointments Calendar */}
                <motion.div 
                  className="bg-white rounded-xl border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">Citas de Hoy</h4>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { time: "09:00", patient: "María González", type: "Consulta", status: "Confirmada" },
                        { time: "10:30", patient: "Carlos Ruiz", type: "Revisión", status: "Confirmada" },
                        { time: "14:00", patient: "Ana Martínez", type: "Consulta", status: "Pendiente" },
                        { time: "16:30", patient: "Luis García", type: "Seguimiento", status: "Confirmada" }
                      ].map((appointment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{appointment.time}</div>
                              <div className="text-sm text-gray-600">{appointment.patient}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{appointment.type}</div>
                            <div className="text-xs text-gray-500">{appointment.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Todo lo que necesitas para tu clínica
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Una plataforma completa diseñada específicamente para profesionales de la salud
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-8"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Resultados que hablan por sí solos
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Únete a cientos de profesionales que ya han transformado su práctica médica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Profesionales de la salud que han transformado su práctica con CLINESA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ¿Listo para transformar tu práctica médica?
            </h2>
            <p className="text-2xl text-blue-100 mb-8">
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
          </motion.div>
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
    </div>
  );
};

export default LandingPage;