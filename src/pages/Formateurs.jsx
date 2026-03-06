import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Award } from 'lucide-react';

const Formateurs = () => {
  // Creating an array of 20 formateurs
  const teachers = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Formateur ${i + 1}`,
    specialty: i % 2 === 0 ? "Théologie Systématique" : "Histoire de l'Église",
    bio: "Expert passionné avec plusieurs années d'expérience dans l'enseignement et le ministère pastoral.",
    // Using a pattern to cycle through some nice placeholder images
    image: `https://images.unsplash.com/photo-${[
      "1687600154336-71d3d1a5701c",
      "1573167163550-a465bb58f41b", 
      "1500917293017-c6b238bc1232",
      "1507003211169-0a1dd7228f2d",
      "1560250097-0b93528c311a"
    ][i % 5]}`
  }));

  // Manually overriding the first few to be specific examples if desired, 
  // but keeping the loop for the bulk request of 20 items.
  teachers[0] = { ...teachers[0], name: "Dr. Samuel Koné", specialty: "Exégèse", bio: "Docteur en Théologie, Doyen de la faculté." };
  teachers[1] = { ...teachers[1], name: "Prof. Sarah N'Dri", specialty: "Missiologie", bio: "Missionnaire et enseignante internationale." };

  return (
    <>
      <Helmet>
        <title>Nos Formateurs - École Tyrannus</title>
        <meta name="description" content="Découvrez notre corps professoral composé de 20 formateurs qualifiés." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              Nos Formateurs
            </motion.h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Un corps professoral d'excellence dédié à votre formation.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 bg-gray-200">
                  <img 
                    alt={teacher.name}
                    src={teacher.image}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#1A237E] mb-1">{teacher.name}</h3>
                  <div className="flex items-center text-sm text-[#D4AF37] font-medium mb-3">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {teacher.specialty}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {teacher.bio}
                  </p>
                  <div className="pt-4 border-t border-gray-100 flex items-center text-xs text-gray-500">
                    <Award className="w-3 h-3 mr-1" />
                    <span>Certifié</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Formateurs;