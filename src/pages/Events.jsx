import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Events = () => {
  const articles = [
    {
      id: 1,
      title: "Le Dieu des sanctifiés",
      date: "17 – 19 Février 2026",
      category: "Séminaire",
      status: "Terminé",
      excerpt: "Clôture exceptionnelle du jeûne de 40 jours avec le Prophète Isaac Frimpong.",
      image: <img alt="Le Dieu des sanctifiés - séminaire de clôture du jeûne" className="w-full h-full object-cover" src="https://www.excellepourchristinternational.org/event-image/17-fevrier.jpg" />
    },
    {
      id: 2,
      title: "Prière de délivrance et de guerre spirituelle",
      date: "21 – 23 Janvier 2026",
      category: "Séminaire",
      status: "Terminé",
      excerpt: "Un séminaire intense de libération conduit par l'Apôtre Janine Aho et le Pasteur Paul Uzoma.",
      image: <img alt="Séminaire de prière de délivrance et guerre spirituelle" className="w-full h-full object-cover" src="https://www.excellepourchristinternational.org/event-image/21-Janvier.jpg" />
    },
  ];

  const statusColor = {
    'Terminé':  'bg-gray-400 text-white',
    'En cours': 'bg-green-500 text-white',
    'À venir':  'bg-[#D4AF37] text-[#1A237E]',
  };

  return (
    <>
      <Helmet>
        <title>Événements & Blog - École Tyrannus</title>
        <meta name="description" content="Retrouvez tous les moments forts, séminaires, conférences et rassemblements d'Excelle pour Christ International." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">

        {/* ── HEADER ── */}
        <div className="bg-[#1A237E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Actualités & Événements</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Retrouvez ici tous les moments forts, les séminaires, les conférences et les rassemblements
              qui marquent notre marche avec Christ. Chaque événement est une opportunité de croissance
              spirituelle et de communion fraternelle.
            </p>
          </div>
        </div>

        {/* ── CARDS ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                    {article.image}
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#1A237E] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </div>
                  {/* Status badge */}
                  <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColor[article.status] ?? 'bg-gray-300 text-gray-700'}`}>
                    {article.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {article.date}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#1A237E] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <Button variant="link" className="p-0 text-[#1A237E] font-bold hover:text-[#D4AF37] transition-colors">
                    Voir l'événement <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Events;