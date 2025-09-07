import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Star, Users, Shield, Zap, Globe, Calendar, FileText } from 'lucide-react'

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestión de Pacientes",
      description: "Organiza y gestiona toda la información de tus pacientes de manera eficiente."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Citas Médicas",
      description: "Programa y administra citas médicas con recordatorios automáticos."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Historial Clínico",
      description: "Mantén un registro completo y seguro del historial médico de cada paciente."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Seguridad Total",
      description: "Cumplimiento con normativas de protección de datos médicos."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rápido y Eficiente",
      description: "Interfaz intuitiva que acelera tu flujo de trabajo diario."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Acceso Global",
      description: "Accede a tu información desde cualquier lugar, en cualquier momento."
    }
  ]

  const testimonials = [
    {
      name: "Dr. María González",
      role: "Clínica Privada",
      content: "CLINESA ha transformado completamente la gestión de mi consulta. Es intuitivo y eficiente.",
      rating: 5
    },
    {
      name: "Dr. Carlos Ruiz",
      role: "Centro Médico",
      content: "La seguridad y facilidad de uso son excepcionales. Recomiendo CLINESA sin dudarlo.",
      rating: 5
    },
    {
      name: "Dra. Ana Martínez",
      role: "Consultorio",
      content: "Perfecto para gestionar pacientes y citas. Ahorra mucho tiempo en el día a día.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-primary-1000">

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        {...fadeInUp}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-normal text-primary-1000 dark:text-primary-0 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Gestión Médica
            <br />
            <span className="text-primary-600 dark:text-primary-400">Simplificada</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-primary-600 dark:text-primary-400 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            La plataforma más intuitiva para gestionar tu consulta médica. 
            Organiza pacientes, citas y historiales clínicos con total seguridad.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/auth/register"
              className="notion-button-primary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              Comenzar Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/plans"
              className="notion-button-outline text-lg px-8 py-3"
            >
              Ver Precios
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-sm text-primary-500 dark:text-primary-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Sin tarjeta de crédito • Prueba gratuita de 14 días
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50 dark:bg-primary-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-normal text-primary-1000 dark:text-primary-0 mb-4">
              Todo lo que necesitas para tu consulta
            </h2>
            <p className="text-lg text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para profesionales de la salud
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="notion-card p-6"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-md text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary-600 dark:text-primary-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-normal text-primary-1000 dark:text-primary-0 mb-4">
              Confiado por profesionales médicos
            </h2>
            <p className="text-lg text-primary-600 dark:text-primary-400">
              Descubre por qué miles de médicos eligen CLINESA
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="notion-card p-6"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-primary-600 dark:text-primary-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-medium text-primary-1000 dark:text-primary-0">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-primary-500 dark:text-primary-500">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-1000 dark:bg-primary-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-normal text-primary-0 dark:text-primary-1000 mb-4">
              ¿Listo para transformar tu consulta?
            </h2>
            <p className="text-lg text-primary-200 dark:text-primary-800 mb-8">
              Únete a miles de profesionales médicos que ya confían en CLINESA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/register"
                className="bg-primary-0 dark:bg-primary-1000 text-primary-1000 dark:text-primary-0 font-normal px-8 py-3 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-all duration-150 ease-out text-lg inline-flex items-center justify-center"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/plans"
                className="border border-primary-300 dark:border-primary-700 text-primary-200 dark:text-primary-800 bg-transparent hover:bg-primary-900 dark:hover:bg-primary-100 font-normal px-8 py-3 rounded-md transition-all duration-150 ease-out text-lg"
              >
                Ver Precios
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="py-12 px-4 sm:px-6 lg:px-8 border-t border-primary-200 dark:border-primary-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-4">
                CLINESA
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm">
                La plataforma más intuitiva para la gestión médica profesional.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary-1000 dark:text-primary-0 mb-4">
                Producto
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Características</a></li>
                <li><a href="#pricing" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Precios</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-primary-1000 dark:text-primary-0 mb-4">
                Soporte
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Contacto</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-primary-1000 dark:text-primary-0 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Términos</a></li>
                <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-200 dark:border-primary-800 mt-8 pt-8 text-center">
            <p className="text-sm text-primary-500 dark:text-primary-500">
              © 2024 CLINESA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default LandingPage
