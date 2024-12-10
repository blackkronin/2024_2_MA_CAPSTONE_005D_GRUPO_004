'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuestionCircle, FaCoffee, FaRocket } from 'react-icons/fa'

const slides = [
  {
    id: 1,
    icon: <FaQuestionCircle size={50} />,
    title: "Consulta cualquier cosa que se te venga a la mente!",
    subtitle: "Solo comienza a escribir, gracias a tu proceso de registro todo esto está automatizado a tu perfil."
  },
  {
    id: 2,
    icon: <FaCoffee size={50} />,
    title: "Tómate un café ;)",
    subtitle: "Nuestro AIReporter HuemulAI, muestra la información en tiempo real mientras se va ejecutando el proceso de busqueda de información, interacción con los datos, transformación y generación de tu reporte o busqueda."
  },
  {
    id: 3,
    icon: <FaRocket size={50} />,
    title: "Rápido y sencillo!",
    subtitle: "Porque News Eye te permite no solo aprovechar las herramientas y tecnologías que utiliza, sino que es automático y simple!"
  }
]

export default function CarruselInstrucciones() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-green-700 to-blue-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
        >
          <div className="mb-4">
            {slides[currentSlide].icon}
          </div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-2 text-3xl font-bold text-center"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-center"
          >
            {slides[currentSlide].subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}