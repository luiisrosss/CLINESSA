"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Eye,
  Share2,
  BookOpen,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ArticlePage = () => {
  const article = {
    id: 1,
    title: "Cómo la tecnología está revolucionando la gestión médica",
    excerpt: "Descubre las últimas tendencias en tecnología médica y cómo pueden transformar tu práctica clínica.",
    content: `
      <p>La tecnología médica está experimentando una transformación sin precedentes. En los últimos años, hemos visto cómo las innovaciones tecnológicas están revolucionando la forma en que los profesionales de la salud gestionan sus prácticas clínicas.</p>
      
      <h2>El impacto de la digitalización en la medicina</h2>
      <p>La digitalización de los procesos médicos ha traído consigo numerosos beneficios. Desde la gestión de historiales médicos hasta la programación de citas, la tecnología está simplificando tareas que antes requerían horas de trabajo manual.</p>
      
      <h3>Beneficios clave de la tecnología médica:</h3>
      <ul>
        <li><strong>Eficiencia operativa:</strong> Reducción del 60% en tiempo administrativo</li>
        <li><strong>Satisfacción del paciente:</strong> Mejora del 40% en la experiencia del usuario</li>
        <li><strong>Precisión diagnóstica:</strong> Herramientas de apoyo que mejoran la precisión</li>
        <li><strong>Acceso 24/7:</strong> Disponibilidad continua de información médica</li>
      </ul>
      
      <h2>Plataformas de gestión médica modernas</h2>
      <p>Las plataformas como CLINESA están liderando esta revolución, ofreciendo soluciones integrales que combinan:</p>
      
      <ul>
        <li>Gestión de pacientes inteligente</li>
        <li>Programación automática de citas</li>
        <li>Historiales médicos digitales</li>
        <li>Analytics en tiempo real</li>
        <li>Integración con sistemas existentes</li>
      </ul>
      
      <h2>El futuro de la medicina digital</h2>
      <p>Mirando hacia el futuro, podemos esperar ver:</p>
      
      <ul>
        <li>Inteligencia artificial más avanzada en diagnósticos</li>
        <li>Telemedicina integrada en plataformas principales</li>
        <li>Análisis predictivo para la salud preventiva</li>
        <li>Interoperabilidad total entre sistemas médicos</li>
      </ul>
      
      <p>La revolución tecnológica en la medicina no es solo una tendencia, es una necesidad. Los profesionales de la salud que adopten estas tecnologías estarán mejor preparados para ofrecer una atención de calidad en el mundo digital actual.</p>
    `,
    author: {
      name: "Dr. María González",
      role: "Directora Médica",
      company: "Clínica San Rafael",
      avatar: "/avatars/maria-gonzalez.jpg",
      bio: "Especialista en medicina interna con más de 15 años de experiencia en gestión clínica y tecnología médica."
    },
    date: "15 de Enero, 2024",
    readTime: "5 min",
    category: "Tecnología",
    image: "/blog/tech-revolution.jpg",
    views: 1250,
    shares: 45,
    tags: ["Tecnología", "Gestión Médica", "Digitalización", "Innovación"]
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Mejores prácticas para la gestión de citas médicas",
      excerpt: "Aprende estrategias probadas para optimizar la programación de citas y mejorar la satisfacción del paciente.",
      author: "Dr. Carlos Ruiz",
      date: "12 de Enero, 2024",
      readTime: "7 min",
      category: "Gestión",
      image: "/blog/appointment-management.jpg"
    },
    {
      id: 3,
      title: "Seguridad de datos en clínicas médicas: Guía completa",
      excerpt: "Todo lo que necesitas saber sobre la protección de datos médicos y el cumplimiento normativo.",
      author: "Dra. Ana Martínez",
      date: "10 de Enero, 2024",
      readTime: "8 min",
      category: "Seguridad",
      image: "/blog/data-security.jpg"
    },
    {
      id: 4,
      title: "Analytics médicos: Toma decisiones basadas en datos",
      excerpt: "Cómo utilizar los datos de tu clínica para tomar decisiones más informadas y mejorar los resultados.",
      author: "Dr. Luis García",
      date: "8 de Enero, 2024",
      readTime: "6 min",
      category: "Analytics",
      image: "/blog/medical-analytics.jpg"
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

      {/* Article Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime} de lectura
              </span>
              <span className="text-sm text-gray-600 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.views} vistas
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{article.author.name}</div>
                  <div className="text-sm text-gray-600">{article.author.role} • {article.author.company}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartir artículo</h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.author.name}</h3>
                <p className="text-gray-600 mb-3">{article.author.role} • {article.author.company}</p>
                <p className="text-gray-700 leading-relaxed">{article.author.bio}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Artículos Relacionados</h2>
            <p className="text-lg text-gray-600">Descubre más contenido que podría interesarte.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle, index) => (
              <motion.article
                key={relatedArticle.id}
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
                      {relatedArticle.category}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {relatedArticle.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {relatedArticle.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {relatedArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{relatedArticle.author}</div>
                        <div className="text-xs text-gray-600">{relatedArticle.date}</div>
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
              ¿Te gustó este artículo?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Suscríbete para recibir más contenido como este directamente en tu bandeja de entrada.
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

export default ArticlePage;
