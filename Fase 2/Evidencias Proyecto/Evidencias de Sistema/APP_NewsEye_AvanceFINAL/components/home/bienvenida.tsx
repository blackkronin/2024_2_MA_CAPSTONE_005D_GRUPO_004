'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Eye, Lock, Zap, BookOpen, Users } from 'lucide-react'
import Image from 'next/image'

interface SectionProps {
  title: string
  content: string | React.ReactNode
  icon?: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, content, icon }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-center"
    >
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>
      {typeof content === 'string' ? (
        <p className="text-lg text-gray-600">{content}</p>
      ) : (
        content
      )}
    </motion.div>
  )
}

const BlinkingEye = () => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen((prev) => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { scale: 1 },
        closed: { scale: 0.95 },
      }}
    >
      <Eye size={48} className="text-purple-600" />
    </motion.div>
  )
}

const AIProcess = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate={activeSection === "recopilacion" ? "visible" : "hidden"}
          variants={iconVariants}
        >
          <Image
            src="/bionic-eye.gif"
            alt="Recopilación de Información"
            width={100}
            height={100}
            className="w-24 h-24"
          />
          <h3 className="mt-2 font-semibold">Recopilación de Información</h3>
        </motion.div>
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate={activeSection === "analisis" ? "visible" : "hidden"}
          variants={iconVariants}
        >
          <Image
            src="/data-processing.gif"
            alt="Análisis y Procesamiento"
            width={100}
            height={100}
            className="w-24 h-24"
          />
          <h3 className="mt-2 font-semibold">Análisis y Procesamiento</h3>
        </motion.div>
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate={activeSection === "generacion" ? "visible" : "hidden"}
          variants={iconVariants}
        >
          <Image
            src="/neural-net.gif"
            alt="Generación de Reportes"
            width={100}
            height={100}
            className="w-24 h-24"
          />
          <h3 className="mt-2 font-semibold">Generación de Reportes</h3>
        </motion.div>
      </div>
      <div className="w-full max-w-md">
        <button
          className={`w-full p-4 mb-2 text-left ${
            activeSection === "recopilacion" ? "bg-purple-100" : "bg-gray-100"
          } rounded-lg transition-colors`}
          onClick={() => setActiveSection("recopilacion")}
        >
          Recopilación de Información
        </button>
        {activeSection === "recopilacion" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-purple-50 rounded-lg"
          >
            Nuestra IA recopila información de fuentes confiables y actualizadas, adaptándose a las necesidades específicas de cada usuario.
          </motion.p>
        )}
        <button
          className={`w-full p-4 mb-2 text-left ${
            activeSection === "analisis" ? "bg-purple-100" : "bg-gray-100"
          } rounded-lg transition-colors`}
          onClick={() => setActiveSection("analisis")}
        >
          Análisis y Procesamiento
        </button>
        {activeSection === "analisis" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-purple-50 rounded-lg"
          >
            La información recopilada es analizada y procesada utilizando algoritmos avanzados de IA, asegurando la relevancia y precisión de los datos.
          </motion.p>
        )}
        <button
          className={`w-full p-4 mb-2 text-left ${
            activeSection === "generacion" ? "bg-purple-100" : "bg-gray-100"
          } rounded-lg transition-colors`}
          onClick={() => setActiveSection("generacion")}
        >
          Generación de Reportes
        </button>
        {activeSection === "generacion" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-purple-50 rounded-lg"
          >
            Se generan reportes personalizados y automatizados basados en la categoría del usuario, proporcionando información relevante y fácil de entender.
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default function Bienvenida() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Section
          title="Nuestra Visión"
          content="Aspiramos a revolucionar la investigación y educación mediante la automatización inteligente de reportes informativos, facilitando el acceso al conocimiento y potenciando el aprendizaje en todas las etapas de la vida."
          icon={<BlinkingEye />}
        />
        <Section
          title="Nuestro Propósito"
          content={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Lock className="mb-2 text-purple-600" size={32} />
                <h3 className="font-semibold mb-1">Confidencialidad</h3>
                <p className="text-sm">Protegemos tu información</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="mb-2 text-purple-600" size={32} />
                <h3 className="font-semibold mb-1">Eficiencia y Rapidez</h3>
                <p className="text-sm">Resultados en tiempo récord</p>
              </div>
              <div className="flex flex-col items-center">
                <BookOpen className="mb-2 text-purple-600" size={32} />
                <h3 className="font-semibold mb-1">Fuentes Confiables</h3>
                <p className="text-sm">Información de calidad garantizada</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="mb-2 text-purple-600" size={32} />
                <h3 className="font-semibold mb-1">Experiencia Personalizada</h3>
                <p className="text-sm">Adaptado a tus necesidades</p>
              </div>
            </div>
          }
        />
        <Section
          title="Cómo Funciona"
          content={
            <div>
              <p className="mb-4 text-lg text-gray-600">
                Nuestra IA recopila información y genera documentos automatizados según la categoría del usuario:
              </p>
              <ul className="list-disc list-inside mb-4 text-left text-gray-600">
                <li>Estudiantes (Enseñanza media y superior)</li>
                <li>Profesionales (Educadores, científicos, profesionales)</li>
                <li>Tercera edad</li>
              </ul>
              <AIProcess />
            </div>
          }
        />
      </div>
    </div>
  )
}

