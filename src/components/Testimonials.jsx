import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Jean-Baptiste Kouamé",
    role: "Pasteur, Promotion 2020",
    quote: "L'École Tyrannus a transformé ma vie et mon ministère. Les enseignements bibliques solides et la communion fraternelle m'ont équipé pour servir avec excellence.",
    image: <img alt="Portrait d'un étudiant diplômé souriant" src="https://images.unsplash.com/photo-1585066039196-e30d097340be" />
  },
  {
    name: "Marie-Claire Diabaté",
    role: "Missionnaire, Promotion 2019",
    quote: "Cette formation m'a donné les outils nécessaires pour comprendre la Parole de Dieu en profondeur et la communiquer avec puissance. Une expérience inoubliable.",
    image: <img alt="Portrait d'une étudiante diplômée" src="https://images.unsplash.com/photo-1676054628252-fdcf193f0cb7" />
  },
  {
    name: "David Mensah",
    role: "Enseignant Biblique, Promotion 2021",
    quote: "L'excellence académique combinée à la formation spirituelle fait de Tyrannus une école unique. Je recommande vivement à tous ceux qui aspirent au ministère.",
    image: <img alt="Portrait d'un jeune diplômé confiant" src="https://images.unsplash.com/photo-1525103781435-f2643ea8306b" />
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A237E] mb-4">
            Témoignages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les parcours inspirants de nos anciens étudiants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <Quote className="w-10 h-10 text-[#D4AF37] mb-4" />
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-[#1A237E]">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;