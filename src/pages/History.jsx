import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const History = () => {
  const milestones = [
    {
      year: "2001",
      title: "La Fondation",
      text: "Le 5 avril 2001, l'Apôtre Janine AHO pose les premières pierres de ce qui allait devenir une œuvre internationale. Fondée à Guinkomey, Cotonou, sous le nom de Fondation Internationale Mont Horeb, la vision était claire : proclamer l'Évangile de Jésus-Christ avec fidélité et transformer des vies.",
      image: <img alt="Fondation de l'œuvre à Cotonou en 2001" className="w-full h-full object-cover" src="/IMG-20260324-WA0007.jpg" />
    },
    {
      year: "2005",
      title: "Première Expansion",
      text: "Portée par une croissance remarquable, l'œuvre s'étend au-delà de Cotonou. De nouvelles assemblées s'ouvrent dans plusieurs villes du Bénin, touchant des milliers de familles et posant les bases d'un réseau d'églises locales solides et enracinées.",
      image: <img alt="Expansion dans plusieurs villes du Bénin" className="w-full h-full object-cover" src="/IMG-20260324-WA0008.jpg" />
    },
    {
      year: "2010",
      title: "Naissance de l'École Tyrannus",
      text: "Comme Paul qui enseignait quotidiennement dans l'école de Tyrannus, l'Apôtre Janine AHO lance une école de formation biblique dédiée à équiper les leaders. L'École Tyrannus ouvre ses portes avec une mission : former des disciples non seulement de diplômes, mais de la puissance de l'Esprit.",
      image: <img alt="Lancement de l'École Tyrannus" className="w-full h-full object-cover" src="/IMG-20260324-WA0009.jpg" />
    },
    {
      year: "2015",
      title: "Excelle pour Christ International",
      text: "L'œuvre entre dans une nouvelle ère. La Fondation Internationale Mont Horeb est rebaptisée Excelle pour Christ International — un nom qui reflète l'ADN profond du ministère : appeler chaque croyant à l'excellence pour la gloire de Dieu, sur toutes les nations.",
      image: <img alt="Nouveau nom, nouvelle identité" className="w-full h-full object-cover" src="/IMG-20260324-WA0015.jpg" />
    },
    {
      year: "2018",
      title: "Vers les Nations",
      text: "La vision missionnaire franchit les frontières du Bénin. Excelle pour Christ International étend son impact vers d'autres pays africains, implantant des églises et envoyant des équipes pour proclamer l'Évangile du Royaume là où la Parole n'a pas encore retenti.",
      image: <img alt="Extension missionnaire internationale" className="w-full h-full object-cover" src="/IMG-20260324-WA0030.jpg" />
    },
    {
      year: "2020",
      title: "Deux Décennies de Fidélité",
      text: "En 2020, l'œuvre célèbre vingt ans de grâce et de fidélité. Des milliers de vies transformées, des leaders formés, des nations touchées — le témoignage est éloquent. Ce qui a commencé à Guinkomey est devenu une communauté vibrante de foi ancrée dans la Parole de Dieu.",
      image: <img alt="Célébration des 20 ans de l'œuvre" className="w-full h-full object-cover" src="/IMG-20260324-WA0037.jpg" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Notre Histoire - École Tyrannus</title>
        <meta name="description" content="Découvrez l'histoire inspirante d'Excelle pour Christ International et de l'École Tyrannus, de sa fondation en 2001 à aujourd'hui." />
      </Helmet>

      <div className="bg-white min-h-screen">

        {/* ── HEADER ── */}
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Notre Histoire</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Plus de deux décennies de foi, de persévérance et de grâce divine au service des nations.
            </p>
          </div>
        </div>

        {/* ── TIMELINE ── */}
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
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                    {item.image}
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#1A237E] font-bold px-4 py-2 rounded-full shadow-md">
                      {item.year}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-[#1A237E]">{item.title}</h2>
                  <div className="w-20 h-1 bg-[#D4AF37] rounded-full"></div>
                  <p className="text-lg text-gray-700 leading-relaxed">{item.text}</p>
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