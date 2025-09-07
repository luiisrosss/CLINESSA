"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
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
  LineChart,
  Video,
  Image,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: 0,
      title: "Diseñado para la medicina moderna",
      subtitle: "La plataforma más avanzada para clínicas médicas",
      description: "CLINESA combina inteligencia artificial, diseño intuitivo y funcionalidades médicas especializadas para revolucionar tu práctica.",
      image: "/screenshots/dashboard-hero.jpg",
      video: "/videos/dashboard-demo.mp4",
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 1,
      title: "Gestión inteligente de pacientes",
      subtitle: "Todo en un solo lugar",
      description: "Administra historiales médicos, programación de citas y seguimiento de tratamientos con una interfaz diseñada específicamente para profesionales de la salud.",
      image: "/screenshots/patients-management.jpg",
      video: "/videos/patients-demo.mp4",
      color: "from-green-600 to-green-800"
    },
    {
      id: 2,
      title: "Analytics en tiempo real",
      subtitle: "Toma decisiones basadas en datos",
      description: "Visualiza el rendimiento de tu clínica con reportes detallados, métricas de satisfacción del paciente y análisis predictivos.",
      image: "/screenshots/analytics-dashboard.jpg",
      video: "/videos/analytics-demo.mp4",
      color: "from-purple-600 to-purple-800"
    },
    {
      id: 3,
      title: "Seguridad y privacidad",
      subtitle: "Protección total de datos médicos",
      description: "Cumplimiento total con normativas médicas, encriptación de extremo a extremo y controles de acceso granulares para proteger la información de tus pacientes.",
      image: "/screenshots/security-features.jpg",
      video: "/videos/security-demo.mp4",
      color: "from-orange-600 to-orange-800"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Gestión de Pacientes",
      description: "Historiales completos, seguimiento de tratamientos y comunicación directa con pacientes.",
      image: "/screenshots/patients-feature.jpg",
      video: "/videos/patients-feature.mp4"
    },
    {
      icon: Calendar,
      title: "Programación Inteligente",
      description: "Sistema de citas automático con recordatorios, reprogramación y gestión de horarios.",
      image: "/screenshots/appointments-feature.jpg",
      video: "/videos/appointments-feature.mp4"
    },
    {
      icon: FileText,
      title: "Historiales Digitales",
      description: "Documentación médica completa con búsqueda avanzada y acceso instantáneo.",
      image: "/screenshots/records-feature.jpg",
      video: "/videos/records-feature.mp4"
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzados",
      description: "Métricas en tiempo real, reportes personalizados y análisis predictivos.",
      image: "/screenshots/analytics-feature.jpg",
      video: "/videos/analytics-feature.mp4"
    }
  ];

  const testimonials = [
    {
      name: "Dr. María González",
      role: "Directora Médica",
      company: "Clínica San Rafael",
      content: "CLINESA ha revolucionado completamente nuestra práctica. La eficiencia que hemos ganado es increíble.",
      avatar: "/avatars/maria-gonzalez.jpg",
      rating: 5
    },
    {
      name: "Dr. Carlos Ruiz",
      role: "Cardiólogo",
      company: "Centro Cardiovascular",
      content: "La interfaz es intuitiva y las funcionalidades son exactamente lo que necesitábamos para nuestro centro.",
      avatar: "/avatars/carlos-ruiz.jpg",
      rating: 5
    },
    {
      name: "Dra. Ana Martínez",
      role: "Pediatra",
      company: "Clínica Infantil",
      content: "Nuestros pacientes están encantados con la facilidad para programar citas y acceder a sus historiales.",
      avatar: "/avatars/ana-martinez.jpg",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Pacientes Atendidos" },
    { number: "50K+", label: "Citas Programadas" },
    { number: "99.9%", label: "Tiempo de Actividad" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  return (
    <div ref={containerRef} className="w-full bg-black text-white">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800"
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
              <span className="text-xl font-bold text-white">CLINESA</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Características</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonios</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Precios</a>
              <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black">Iniciar Sesión</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Comenzar Gratis</Button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Apple-style slides */}
      <section className="relative h-screen overflow-hidden">
        {/* Background slides */}
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              slide.color,
              "flex items-center justify-center"
            )}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Background image/video */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-black/50 to-black/30"></div>
              <div className="absolute inset-0 bg-[url('/screenshots/dashboard-hero.jpg')] bg-cover bg-center opacity-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 50
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <h2 className="text-3xl md:text-5xl font-light mb-8 text-gray-200">
                  {slide.subtitle}
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 30
                }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button size="lg" className="text-lg px-8 py-4 bg-white text-black hover:bg-gray-100">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-black">
                  <Play className="mr-2 w-5 h-5" />
                  Ver Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentSlide === index ? "bg-white" : "bg-white/50"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 flex flex-col items-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="text-sm text-gray-400">Desplázate</span>
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </motion.div>
      </section>

      {/* Features Section with Apple-style reveals */}
      <section id="features" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Funcionalidades principales
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Descubre cómo CLINESA transforma la gestión médica con tecnología de vanguardia
            </p>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "flex flex-col lg:flex-row items-center mb-32",
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              )}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Content */}
              <div className="flex-1 mb-12 lg:mb-0 lg:mr-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-gray-400 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Explorar Funcionalidad
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {/* Mock device frame */}
                  <div className="relative bg-gray-900 rounded-3xl p-4 shadow-2xl">
                    <div className="bg-black rounded-2xl overflow-hidden">
                      {/* Device header */}
                      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-400">clinesa.com/{feature.title.toLowerCase().replace(/\s+/g, '-')}</div>
                        <div className="w-6 h-6"></div>
                      </div>

                      {/* Content area */}
                      <div className="p-8">
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-bold">{feature.title}</h4>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Nuevo
                            </Button>
                          </div>

                          {/* Content grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                              <div key={item} className="bg-gray-800 rounded-xl p-4">
                                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>

                          {/* Main content */}
                          <div className="bg-gray-800 rounded-xl p-6">
                            <div className="space-y-3">
                              <div className="h-4 bg-gray-600 rounded w-full"></div>
                              <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-600 rounded w-4/5"></div>
                              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Profesionales de la salud que han transformado su práctica con CLINESA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-blue-400">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic text-lg">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 to-blue-800">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
      <footer className="bg-black text-white py-16 border-t border-gray-800">
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