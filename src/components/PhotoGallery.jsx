import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const photos = [
  { src: '/IMG-20260324-WA0007.jpg', alt: 'Communauté en réunion', span: 'col-span-2 row-span-2' },
  { src: '/IMG-20260324-WA0008.jpg', alt: 'Moment de prière', span: 'col-span-1 row-span-1' },
  { src: '/IMG-20260324-WA0009.jpg', alt: 'Formation biblique', span: 'col-span-1 row-span-1' },
  { src: '/IMG-20260324-WA0037.jpg', alt: 'Culte et adoration', span: 'col-span-1 row-span-2' },
  { src: '/IMG-20260324-WA0015.jpg', alt: 'Assemblée générale', span: 'col-span-1 row-span-1' },
];

const PhotoGallery = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#1A237E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Notre Communauté en Images
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Des moments de grâce, de communion et de formation qui témoignent de la vie de l'École Tyrannus.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[480px] md:h-[560px]">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${photo.span}`}
              onClick={() => navigate('/histoire')}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#1A237E]/0 group-hover:bg-[#1A237E]/50 transition-all duration-400 flex items-center justify-center">
                <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#D4AF37] px-3 py-1 rounded-full">
                  {photo.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate('/histoire')}
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white font-semibold text-lg transition-colors duration-300 group"
          >
            Découvrir notre histoire complète
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoGallery;
