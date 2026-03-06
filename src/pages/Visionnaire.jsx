import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Quote } from 'lucide-react';
const Visionnaire = () => {
  return <>
      <Helmet>
        <title>La Visionnaire - École Tyrannus</title>
        <meta name="description" content="Découvrez la vision et le cœur derrière l'École Tyrannus." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-4xl md:text-5xl font-serif font-bold mb-6">
              La Visionnaire
            </motion.h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <div className="aspect-[3/4] bg-gray-200">
                    <img alt="La Visionnaire de l'École Tyrannus" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1593267720070-2ed9337829a7" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent p-8 pt-24 text-white">
                  <h3 className="text-2xl font-serif font-bold">Apôtre Janine AHO</h3>
                  <p className="opacity-90">Fondatrice & Visionnaire</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="lg:w-1/2 space-y-6">
              <Quote className="w-16 h-16 text-[#D4AF37]/20 rotate-180 mb-4" />
              
              <h2 className="text-3xl font-serif font-bold text-[#1A237E] mb-6">
                Une Passion pour la Vérité
              </h2>
              
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Depuis plus d'une décennie, mon cœur brûle d'une passion inébranlable : voir une génération de croyants non seulement connaître Dieu, mais comprendre profondément Sa Parole pour transformer leur monde.
                </p>
                <p className="mb-4">
                  L'École Tyrannus n'est pas née d'une simple ambition académique, mais d'une révélation divine. Comme dans les Actes des Apôtres, où Paul enseignait quotidiennement dans l'école de Tyrannus, nous croyons que l'enseignement systématique et inspiré est la clé pour libérer le potentiel de chaque chrétien.
                </p>
                <p>
                  Ma vision est de bâtir une armée d'hommes et de femmes équipés, non pas seulement de diplômes, mais de la puissance de l'Esprit et de la sagesse des Écritures. Bienvenue dans cette aventure de foi et de connaissance.
                </p>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <p className="font-serif italic text-xl text-[#1A237E]">
                  "Que la Parole de Christ habite parmi vous abondamment."
                </p>
                <p className="text-sm text-gray-500 mt-2">— Colossiens 3:16</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>;
};
export default Visionnaire;