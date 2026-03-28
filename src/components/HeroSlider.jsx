import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Une école de théologie et de brisement du caractère",
    image: <img alt="Groupe d'étudiants lisant la Bible ensemble" className="w-full h-full object-cover" src="https://www.excellepourchristinternational.org/photo_5956308823200959375_y.jpg" />
  },
  {
    id: 2,
    title: "Etre à l'image du maître",
    image: <img alt="Assemblée en prière et communion" className="w-full h-full object-cover" src="/IMG-20260324-WA0015.jpg" />
  },
  {
    id: 3,
    title: "L'excellence au service du Royaume de Dieu",
    image: <img alt="Moments de formation et d'adoration" className="w-full h-full object-cover" src="/IMG-20260324-WA0030.jpg" />
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[60vh] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Image — couvre tout le container */}
          <div className="absolute inset-0 w-full h-full">
            {slides[currentSlide].image}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/80 to-[#1A237E]/40 z-10" />

          {/* Title */}
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#D4AF37] w-8' : 'w-3 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;