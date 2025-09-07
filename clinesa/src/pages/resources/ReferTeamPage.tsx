"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  ArrowLeft,
  Users,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Play,
  Gift,
  Star,
  Share2,
  Copy,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ReferTeamPage = () => {
  const benefits = [
    {
      icon: Gift,
      title: "Recompensas Generosas",
      description: "Obtén créditos y beneficios por cada colega que invites.",
      details: [
        "€50 de crédito por cada referido",
        "1 mes gratis por cada 5 referidos",
        "Acceso premium por 6 meses",
        "Descuentos especiales en planes"
      ]
    },
    {
      icon: Users,
      title: "Crecimiento del Equipo",
      description: "Ayuda a tu clínica a crecer con los mejores profesionales.",
      details: [
        "Invita a colegas de confianza",
        "Comparte tu experiencia",
        "Construye una red profesional",
        "Mejora la colaboración"
      ]
    },
    {
      icon: Star,
      title: "Programa VIP",
      description: "Accede a beneficios exclusivos como referidor frecuente.",
      details: [
        "Soporte prioritario",
        "Funciones beta tempranas",
        "Eventos exclusivos",
        "Consultoría personalizada"
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
              <a href="/platform" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Plataforma</a>
              <a href="/resources" className="text-gray-900 font-medium">Recursos</a>
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
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-100">
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
                  Volver a Recursos
                </Button>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Invita a tu Equipo
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl font-light">
                Invita a tus colegas y obtén recompensas increíbles. 
                Ayuda a tu clínica a crecer con los mejores profesionales.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button size="lg" className="text-lg px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium">
                <UserPlus className="w-5 h-5 mr-2" />
                Invitar Colegas
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                <Play className="w-5 h-5 mr-2" />
                Ver demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Beneficios del Programa de Referidos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Descubre todas las ventajas de invitar a tus colegas a CLINESA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                <ul className="space-y-3">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Invita a tus Colegas
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Comparte tu enlace de referido o invita directamente por email.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu enlace de referido
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value="https://clinesa.com/invite/ref123456"
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-r-lg">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Invitar por Email
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email del colega"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Mensaje personal (opcional)"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Enviar Invitación
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
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
              ¿Listo para invitar a tu equipo?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Comienza a ganar recompensas invitando a tus colegas a CLINESA.
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

export default ReferTeamPage;
