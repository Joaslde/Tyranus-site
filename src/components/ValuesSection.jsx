import React from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, Users, Globe } from 'lucide-react';

const values = [
  {
    icon: Globe,
    title: "Vision Missionnaire",
    description: "Former des serviteurs engagés pour l'oeuvre du Royaume"
  },
  {
    icon: Book,
    title: "Excellence Biblique",
    description: "Une étude rigoureuse et approfondie des Saintes Écritures, fondée sur l'exégèse et l'herméneutique."
  },
  {
    icon: Heart,
    title: "Intégrité Spirituelle",
    description: "Former des leaders de caractère, enracinés dans la prière et une vie de sainteté."
  },
  {
    icon: Users,
    title: "Communion Fraternelle",
    description: "Un environnement propice à la manifestation de l'amour de Christ"
  }
];

const ValuesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A237E] mb-4">
            Nos Valeurs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Les piliers qui guident notre mission de formation et d'excellence académique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#1A237E] transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1A237E] mb-3 group-hover:text-white transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;