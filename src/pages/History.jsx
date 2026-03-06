import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const History = () => {
  const milestones = [
    {
      year: "2010",
      title: "La Fondation",
      text: "Tout a commencé par une vision reçue lors d'une nuit de prière. L'École Tyrannus a ouvert ses portes dans un petit local avec seulement 12 étudiants passionnés.",
      image: <img alt="Bâtiment modeste des débuts de l'école" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1541490934015-c75206d75062" />
    },
    {
      year: "2013",
      title: "Première Expansion",
      text: "Face à la croissance rapide des effectifs, l'école a déménagé vers son campus actuel. C'était une étape de foi majeure qui a permis d'accueillir plus de 100 étudiants.",
      image: <img alt="Construction du nouveau campus" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1671036627297-ff1034a0f572" />
    },
    {
      year: "2016",
      title: "Reconnaissance Officielle",
      text: "L'accréditation par les instances religieuses et académiques a marqué un tournant, validant la qualité de notre enseignement au niveau national.",
      image: <img alt="Cérémonie de remise de diplômes officielle" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1702740205505-6a2997365ab7" />
    },
    {
      year: "2019",
      title: "Lancement du Cycle Supérieur",
      text: "Pour répondre aux besoins de formation avancée des leaders, nous avons inauguré le cycle supérieur, offrant des spécialisations en théologie et leadership.",
      image: <img alt="Étudiants en bibliothèque universitaire" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1575581535069-f9ef30a209b3" />
    },
    {
      year: "2023",
      title: "L'Ère Numérique",
      text: "Le lancement de notre plateforme de cours en ligne a permis à l'École Tyrannus de toucher des étudiants au-delà des frontières du Bénin.",
      image: <img alt="Personne étudiant sur ordinateur portable" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1624388611710-bdf95023d1c2" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Notre Histoire - École Tyrannus</title>
        <meta name="description" content="Découvrez l'histoire inspirante de l'École Tyrannus, de sa fondation à aujourd'hui." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Notre Histoire</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Un parcours de foi, de persévérance et de grâce divine.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-24">
            {milestones.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                    {item.image}
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#1A237E] font-bold px-4 py-2 rounded-full shadow-md">
                      {item.year}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-[#1A237E]">{item.title}</h2>
                  <div className="w-20 h-1 bg-[#D4AF37] rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;