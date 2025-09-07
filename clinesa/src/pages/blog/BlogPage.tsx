"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  ArrowRight,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Clock,
  Eye,
  Share2,
  BookOpen,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Cómo la tecnología está revolucionando la gestión médica",
      excerpt: "Descubre las últimas tendencias en tecnología médica y cómo pueden transformar tu práctica clínica.",
      author: "Dr. María González",
      date: "15 de Enero, 2024",
      readTime: "5 min",
      category: "Tecnología",
      image: "/blog/tech-revolution.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Mejores prácticas para la gestión de citas médicas",
      excerpt: "Aprende estrategias probadas para optimizar la programación de citas y mejorar la satisfacción del paciente.",
      author: "Dr. Carlos Ruiz",
      date: "12 de Enero, 2024",
      readTime: "7 min",
      category: "Gestión",
      image: "/blog/appointment-management.jpg",
      featured: false
    },
    {
      id: 3,
      title: "Seguridad de datos en clínicas médicas: Guía completa",
      excerpt: "Todo lo que necesitas saber sobre la protección de datos médicos y el cumplimiento normativo.",
      author: "Dra. Ana Martínez",
      date: "10 de Enero, 2024",
      readTime: "8 min",
      category: "Seguridad",
      image: "/blog/data-security.jpg",
      featured: false
    },
    {
      id: 4,
      title: "Analytics médicos: Toma decisiones basadas en datos",
      excerpt: "Cómo utilizar los datos de tu clínica para tomar decisiones más informadas y mejorar los resultados.",
      author: "Dr. Luis García",
      date: "8 de Enero, 2024",
      readTime: "6 min",
      category: "Analytics",
      image: "/blog/medical-analytics.jpg",
      featured: false
    },
    {
      id: 5,
      title: "La importancia de la experiencia del paciente en la era digital",
      excerpt: "Cómo crear una experiencia digital excepcional que mejore la satisfacción y fidelidad del paciente.",
      author: "Dra. Carmen López",
      date: "5 de Enero, 2024",
      readTime: "4 min",
      category: "Experiencia",
      image: "/blog/patient-experience.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Integración de sistemas: Conecta todas tus herramientas",
      excerpt: "Guía paso a paso para integrar CLINESA con tus sistemas existentes y crear un flujo de trabajo unificado.",
      author: "Dr. Miguel Torres",
      date: "3 de Enero, 2024",
      readTime: "9 min",
      category: "Integración",
      image: "/blog/system-integration.jpg",
      featured: false
    }
  ];

  const categories = [
    "Tecnología",
    "Gestión",
    "Seguridad",
    "Analytics",
    "Experiencia",
    "Integración"
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Inicio</a>
              <a href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">Características</a>
              <a href="/#customers" className="text-gray-600 hover:text-gray-900 transition-colors">Clientes</a>
              <a href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Precios</a>
              <a href="/blog" className="text-gray-900 font-medium">Blog</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                Sign in
              </Button>
              <Button size="sm" className="text-sm px-4 py-2 bg-gray-900 text-white hover:bg-gray-800">
                Start for free
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Blog CLINESA
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
                Descubre las últimas tendencias en tecnología médica, mejores prácticas y consejos para optimizar tu práctica clínica.
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <div className="relative w-full max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar artículos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-blue-600">Artículo Destacado</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-gray-600">{featuredPost.readTime} de lectura</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{featuredPost.author}</div>
                        <div className="text-sm text-gray-600">{featuredPost.date}</div>
                      </div>
                    </div>
                    
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-200 rounded-xl h-64 md:h-80 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Últimos Artículos</h2>
            <p className="text-lg text-gray-600">Mantente al día con las últimas tendencias y mejores prácticas en tecnología médica.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{post.author}</div>
                        <div className="text-xs text-gray-600">{post.date}</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                      Leer
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mantente actualizado
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Recibe las últimas noticias y artículos directamente en tu bandeja de entrada.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
                Suscribirse
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
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/blog" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span>+34 900 123 456</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>hola@clinesa.com</span>
                </li>
                <li className="flex items-center space-x-2">
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

export default BlogPage;
