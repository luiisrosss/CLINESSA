import { motion } from 'framer-motion'
import { Search, MessageCircle, BookOpen, Phone, Mail, HelpCircle } from 'lucide-react'
import { useState } from 'react'

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

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

  const faqItems = [
    {
      question: "¿Cómo puedo importar mis datos existentes?",
      answer: "Puedes importar tus datos usando nuestro asistente de importación. Ve a Configuración > Importar Datos y sigue las instrucciones paso a paso."
    },
    {
      question: "¿Es seguro almacenar información médica en CLINESA?",
      answer: "Sí, utilizamos encriptación de extremo a extremo y cumplimos con todas las normativas de protección de datos médicos (HIPAA, GDPR)."
    },
    {
      question: "¿Puedo usar CLINESA en múltiples dispositivos?",
      answer: "Absolutamente. CLINESA es una aplicación web responsiva que funciona perfectamente en computadoras, tablets y móviles."
    },
    {
      question: "¿Cómo funciona el sistema de respaldos?",
      answer: "Realizamos respaldos automáticos diarios de todos tus datos. También puedes crear respaldos manuales en cualquier momento desde Configuración."
    },
    {
      question: "¿Qué incluye la prueba gratuita?",
      answer: "La prueba gratuita incluye acceso completo a todas las funciones durante 14 días, sin necesidad de tarjeta de crédito."
    },
    {
      question: "¿Cómo puedo cancelar mi suscripción?",
      answer: "Puedes cancelar tu suscripción en cualquier momento desde la página de Facturación. No hay penalizaciones por cancelación."
    }
  ]

  const supportOptions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Chat en Vivo",
      description: "Obtén ayuda inmediata de nuestro equipo de soporte",
      action: "Iniciar Chat",
      available: true
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Correo Electrónico",
      description: "Envía tu consulta y recibe respuesta en 24 horas",
      action: "Enviar Email",
      available: true
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Llamada Telefónica",
      description: "Habla directamente con un especialista",
      action: "Programar Llamada",
      available: true
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Centro de Ayuda",
      description: "Documentación completa y guías paso a paso",
      action: "Explorar",
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-primary-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          {...fadeInUp}
        >
          <h1 className="text-3xl md:text-4xl font-normal text-primary-1000 dark:text-primary-0 mb-4">
            Centro de Soporte
          </h1>
          <p className="text-lg text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Encuentra respuestas rápidas o contacta con nuestro equipo.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          {...fadeInUp}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en el centro de ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notion-input pl-10 w-full"
            />
          </div>
        </motion.div>

        {/* Support Options */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {supportOptions.map((option, index) => (
            <motion.div 
              key={index}
              className="notion-card p-6 text-center"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-md text-primary-600 dark:text-primary-400">
                  {option.icon}
                </div>
              </div>
              <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-2">
                {option.title}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm mb-4">
                {option.description}
              </p>
              <button className="notion-button-primary w-full">
                {option.action}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-normal text-primary-1000 dark:text-primary-0 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                className="notion-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-medium text-primary-1000 dark:text-primary-0 mb-3">
                  {item.question}
                </h3>
                <p className="text-primary-600 dark:text-primary-400">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="bg-primary-50 dark:bg-primary-950 rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <HelpCircle className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-normal text-primary-1000 dark:text-primary-0 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-primary-600 dark:text-primary-400 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o problema que puedas tener.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="notion-button-primary">
              Contactar Soporte
            </button>
            <button className="notion-button-outline">
              Ver Estado del Sistema
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SupportPage
