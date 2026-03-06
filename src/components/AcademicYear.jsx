import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookMarked } from 'lucide-react';
const AcademicYear = () => {
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A237E] mb-4">
            L'Année Académique
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organisation et calendrier de nos formations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">Calendrier</h3>
                <p className="text-gray-600">
                  L'année académique se déroule de mars à février. La rentrée solennelle a lieu le 28 février. Les inscriptions pour la nouvelle année démarrent dès la fin de la cérémonie remise de parchemin qui se tient le 1er dimanche du mois de février.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">Horaires</h3>
                <p className="text-gray-600">Les cours ont lieu tous les samedis de 9h à 15h. Des séances de rattrapage peuvent être organisées en semaine.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A237E] mb-2">Évaluations</h3>
                <p className="text-gray-600">Une composition sanctionne chaque module de cours. Les étudiants de la Première année doivent soutenir leur mémoire à la fin de l'année académique alors que les étudiants de la Deuxième année font une prédication. Des méditations hebdomadaires sont instituées pour tous les étudiants</p>
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
        }} transition={{
          duration: 0.6
        }} className="bg-gradient-to-br from-[#1A237E] to-[#1A237E]/80 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-serif font-bold mb-6">Points Clés</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Rentrée solennelle: 28 février</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Début des cours: Début mars</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Cérémonie de remise de parchemin: 1er dimanche de février</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Inscriptions: Ouvertes dès le 1er dimanche du mois de février à la fin de la cérémonie d eremise de parchemin</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Clôture de l'année: Fin février</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default AcademicYear;