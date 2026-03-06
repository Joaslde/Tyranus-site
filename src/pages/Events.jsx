import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Events = () => {
  const articles = [
    {
      id: 1,
      title: "Retour sur la Conférence de Réveil 2024",
      date: "15 Décembre 2024",
      category: "Conférence",
      excerpt: "Plus de 500 participants ont vécu des moments inoubliables de la présence divine lors de notre dernière conférence annuelle.",
      image: <img alt="Foule en louange lors d'une conférence" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1662965792297-3a1ed29248d4" />
    },
    {
      id: 2,
      title: "Séminaire : L'Impact du Chrétien dans la Cité",
      date: "20 Janvier 2025",
      category: "Formation",
      excerpt: "Un atelier pratique pour équiper les croyants à être des agents de transformation dans leur sphère professionnelle.",
      image: <img alt="Orateur parlant à un groupe de professionnels" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1595819492006-5310d129e010" />
    },
    {
      id: 3,
      title: "Cérémonie de Remise de Diplômes - Promotion Josué",
      date: "5 Février 2025",
      category: "Vie Académique",
      excerpt: "Nous célébrons la fin de parcours de 45 étudiants qui sont maintenant prêts à être envoyés dans la moisson.",
      image: <img alt="Étudiants diplômés lançant leurs chapeaux" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1658235081452-c2ded30b8d9f" />
    },
    {
      id: 4,
      title: "Camp Biblique Jeunesse",
      date: "10-15 Mars 2025",
      category: "Jeunesse",
      excerpt: "Une semaine intensive d'étude biblique et d'activités récréatives pour la prochaine génération.",
      image: <img alt="Jeunes autour d'un feu de camp" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519220143972-ce436b7b700e" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Événements & Blog - École Tyrannus</title>
        <meta name="description" content="Suivez l'actualité et les événements à venir de l'École Tyrannus." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Actualités & Événements</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Restez connectés avec la vie vibrante de notre communauté.
            </p>
          </div>
        </div>

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
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                    {article.image}
                  </div>
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#1A237E] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>
                
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
                    Lire l'article complet <ArrowRight className="w-4 h-4 ml-2" />
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