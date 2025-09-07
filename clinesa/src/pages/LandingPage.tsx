"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import React, { useRef, useEffect } from "react";
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
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";

  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );

  return (
    <motion.span
      className={cn("inline-block text-primary-600", isSpace && "w-4")}
      style={{
        x,
        rotateX,
      }}
    >
      {char}
    </motion.span>
  );
};

const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [Math.abs(distanceFromCenter) * 50, 0],
  );

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center w-16 h-16 mx-2", isSpace && "w-4")}
      style={{
        x,
        scale,
        y,
        transformOrigin: "center",
      }}
    >
      {char}
    </motion.div>
  );
};

const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 90, 0],
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 50, 0],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [-Math.abs(distanceFromCenter) * 20, 0],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center w-16 h-16 mx-2", isSpace && "w-4")}
      style={{
        x,
        rotate,
        y,
        scale,
        transformOrigin: "center",
      }}
    >
      {char}
    </motion.div>
  );
};

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      ></path>
    </svg>
  );
};

const LandingPage = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);
  const targetRef3 = useRef<HTMLDivElement | null>(null);
  const targetRef4 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: targetRef2,
  });
  const { scrollYProgress: scrollYProgress3 } = useScroll({
    target: targetRef3,
  });
  const { scrollYProgress: scrollYProgress4 } = useScroll({
    target: targetRef4,
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const text = "CLINESA - Tu Clínica Digital";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  const features = [
    { icon: Heart, text: "Cuidado" },
    { icon: Shield, text: "Seguridad" },
    { icon: Zap, text: "Eficiencia" },
    { icon: Users, text: "Pacientes" },
    { icon: Calendar, text: "Citas" },
    { icon: FileText, text: "Historiales" },
    { icon: BarChart3, text: "Analytics" },
    { icon: Activity, text: "Tiempo Real" }
  ];
  const featureCenterIndex = Math.floor(features.length / 2);

  const benefits = [
    "Gestión completa de pacientes",
    "Citas programadas automáticamente",
    "Historiales médicos digitales",
    "Reportes y estadísticas en tiempo real",
    "Notificaciones inteligentes",
    "Acceso desde cualquier dispositivo"
  ];

  const stats = [
    { number: "10K+", label: "Pacientes Atendidos" },
    { number: "50K+", label: "Citas Programadas" },
    { number: "99.9%", label: "Tiempo de Actividad" },
    { number: "24/7", label: "Soporte Disponible" }
  ];

  return (
    <main className="w-full bg-white dark:bg-primary-1000">
      {/* Hero Section with Scroll Animation */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-1000 dark:text-primary-0">CLINESA</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              <a href="#features" className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Características</a>
              <a href="#benefits" className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Beneficios</a>
              <a href="#contact" className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Contacto</a>
              <Button variant="outline" size="sm">Iniciar Sesión</Button>
              <Button size="sm">Comenzar Gratis</Button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary-1000 dark:text-primary-0 mb-6 leading-tight">
              Revoluciona tu
              <span className="text-primary-600 block">Práctica Médica</span>
            </h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 mb-8 max-w-3xl mx-auto">
              La plataforma más avanzada para la gestión integral de clínicas médicas. 
              Conecta, organiza y optimiza todos los aspectos de tu práctica profesional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" className="text-lg px-8 py-4">
              Comenzar Ahora
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
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-primary-500 dark:text-primary-500">Desplázate para explorar</span>
            <ChevronDown className="w-6 h-6 text-primary-500 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Animated Text Section */}
      <div
        ref={targetRef}
        className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 p-[2vw]"
      >
        <div
          className="w-full max-w-6xl text-center text-4xl md:text-6xl font-bold uppercase tracking-tighter text-primary-1000 dark:text-primary-0"
          style={{
            perspective: "500px",
          }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div
        ref={targetRef2}
        className="relative -mt-[100vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-800 dark:to-primary-700 p-[2vw]"
      >
        <motion.p 
          className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-primary-1000 dark:text-primary-0 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Bracket className="h-12 text-primary-600" />
          <span className="font-medium">
            Tecnología médica de vanguardia
          </span>
          <Bracket className="h-12 scale-x-[-1] text-primary-600" />
        </motion.p>
        
        <div className="w-full max-w-6xl text-center text-4xl md:text-6xl font-bold uppercase tracking-tighter text-primary-1000 dark:text-primary-0">
          {features.map((feature, index) => (
            <CharacterV2
              key={index}
              char={
                <div className="flex flex-col items-center space-y-2">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                  <span className="text-sm font-normal">{feature.text}</span>
                </div>
              }
              index={index}
              centerIndex={featureCenterIndex}
              scrollYProgress={scrollYProgress2}
            />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div
        ref={targetRef3}
        className="relative -mt-[95vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-gradient-to-br from-primary-300 to-primary-400 dark:from-primary-700 dark:to-primary-600 p-[2vw]"
      >
        <motion.p 
          className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-primary-1000 dark:text-primary-0 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Bracket className="h-12 text-primary-600" />
          <span className="font-medium">
            Todo lo que necesitas en una plataforma
          </span>
          <Bracket className="h-12 scale-x-[-1] text-primary-600" />
        </motion.p>
        
        <div className="w-full max-w-6xl text-center text-4xl md:text-6xl font-bold uppercase tracking-tighter text-primary-1000 dark:text-primary-0">
          {features.map((feature, index) => (
            <CharacterV3
              key={index}
              char={
                <div className="flex flex-col items-center space-y-2">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                  <span className="text-sm font-normal">{feature.text}</span>
                </div>
              }
              index={index}
              centerIndex={featureCenterIndex}
              scrollYProgress={scrollYProgress3}
            />
          ))}
        </div>
      </div>

      {/* Detailed Benefits Section */}
      <div
        ref={targetRef4}
        className="relative -mt-[95vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-gradient-to-br from-primary-400 to-primary-500 dark:from-primary-600 dark:to-primary-500 p-[2vw]"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-primary-1000 dark:text-primary-0 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Transforma tu Práctica Médica
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 dark:bg-primary-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <CheckCircle className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-1000 dark:text-primary-0 mb-2">
                  {benefit}
                </h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" className="text-lg px-8 py-4">
              Comenzar tu Transformación Digital
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-1000 dark:bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CLINESA</span>
              </div>
              <p className="text-primary-300 mb-4">
                La plataforma más avanzada para la gestión integral de clínicas médicas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-primary-300">
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

          <div className="border-t border-primary-800 mt-12 pt-8 text-center text-primary-300">
            <p>&copy; 2024 CLINESA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;