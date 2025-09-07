"use client";

import { motion } from "framer-motion";
import React from "react";
import { 
  Heart, 
  ArrowRight,
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
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ResourcesPage = () => {
  const platformResources = [
    {
      icon: BookOpen,
      title: "Refer a team",
      description: "Invite your colleagues and get rewarded for bringing them to CLINESA.",
      link: "/resources/refer-team"
    },
    {
      icon: FileText,
      title: "Changelog",
      description: "Stay up to date with the latest features and improvements.",
      link: "/resources/changelog"
    },
    {
      icon: Settings,
      title: "Gmail extension",
      description: "Integrate CLINESA directly into your Gmail workflow.",
      link: "/resources/gmail-extension"
    },
    {
      icon: Smartphone,
      title: "iOS app",
      description: "Access CLINESA on the go with our native iOS application.",
      link: "/resources/ios-app"
    },
    {
      icon: Smartphone,
      title: "Android app",
      description: "Manage your clinic from anywhere with our Android app.",
      link: "/resources/android-app"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Learn about our security measures and compliance standards.",
      link: "/resources/security"
    }
  ];

  const companyResources = [
    {
      icon: Users,
      title: "Customers",
      description: "See how other medical professionals are using CLINESA.",
      link: "/resources/customers"
    },
    {
      icon: Bell,
      title: "Announcements",
      description: "Latest news and updates from the CLINESA team.",
      link: "/resources/announcements"
    },
    {
      icon: FileText,
      title: "Engineering blog",
      description: "Technical insights and behind-the-scenes development stories.",
      link: "/resources/engineering-blog"
    },
    {
      icon: Users,
      title: "Careers",
      description: "Join our team and help build the future of medical technology.",
      link: "/resources/careers"
    },
    {
      icon: BookOpen,
      title: "Manifesto",
      description: "Our vision and principles for transforming healthcare technology.",
      link: "/resources/manifesto"
    },
    {
      icon: Handshake,
      title: "Become a partner",
      description: "Partner with us to expand CLINESA's reach and impact.",
      link: "/resources/partners"
    }
  ];

  const helpResources = [
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Find answers to common questions and learn how to use CLINESA.",
      link: "/help"
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Comprehensive guides and API documentation for developers.",
      link: "/docs"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides to help you get the most out of CLINESA.",
      link: "/tutorials"
    },
    {
      icon: Headphones,
      title: "Contact Support",
      description: "Get help from our support team when you need it most.",
      link: "/support"
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
              <a href="/platform" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Platform</a>
              <a href="/resources" className="text-gray-900 font-medium">Resources</a>
              <a href="#customers" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Customers</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Pricing</a>
              <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors text-base font-medium">Blog</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                Log in
              </Button>
              <Button size="sm" className="text-sm px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 font-medium">
                Sign up
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
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Resources
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
                Todo lo que necesitas para aprovechar al máximo CLINESA. 
                Guías, tutoriales, documentación y mucho más.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button size="lg" className="text-lg px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium">
                Get started
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                <Play className="w-5 h-5 mr-2" />
                Watch demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Resources */}
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
              Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Herramientas y extensiones para potenciar tu experiencia con CLINESA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformResources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <resource.icon className="w-8 h-8 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Company Resources */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Company
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Conoce más sobre CLINESA, nuestro equipo y nuestras oportunidades.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyResources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <resource.icon className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Help Resources */}
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
              Help & Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Encuentra la ayuda que necesitas para sacar el máximo provecho de CLINESA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpResources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors mx-auto">
                  <resource.icon className="w-8 h-8 text-purple-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {resource.description}
                </p>

                <div className="flex items-center justify-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
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
              ¿Necesitas más ayuda?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium">
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg font-medium">
                View Documentation
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

export default ResourcesPage;
