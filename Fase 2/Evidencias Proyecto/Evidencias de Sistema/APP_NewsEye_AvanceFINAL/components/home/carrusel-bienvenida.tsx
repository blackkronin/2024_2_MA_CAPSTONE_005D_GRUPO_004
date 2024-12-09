'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 1,
    title: "Bienvenido a Nuestra Aplicación News Eye",
    subtitle: "La Mejor Experiencia para Informarte"
  },
  {
    id: 2,
    title: "Descubre Nuevas Posibilidades",
    subtitle: "Transformando tus Ideas a lo que Tú quieras llegar"
  },
  {
    id: 3,
    title: "Únete a Nuestra Comunidad",
    subtitle: "Registrate y da paso al mundo de la eficiencia, automatización y mucho más"
  }
]

export default function CarruselBienvenida() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-5xl font-bold text-center"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-center"
          >
            {slides[currentSlide].subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

