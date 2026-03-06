import React from 'react';
import { motion } from 'framer-motion';
import { Play, Mic, FileText, Download, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Resources = () => {
  const videos = [
    {
      title: "Introduction à l'Exégèse",
      author: "Dr. Samuel Koné",
      duration: "45 min",
      thumbnail: <img alt="Miniature vidéo cours exégèse avec Bible ouverte" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1692949962839-b6260b54f499" />
    },
    {
      title: "Histoire de l'Église Primitive",
      author: "Prof. Marie Diabaté",
      duration: "52 min",
      thumbnail: <img alt="Miniature vidéo histoire de l'église avec carte ancienne" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544947680-bfd032ea5641" />
    },
    {
      title: "Les Épîtres de Paul",
      author: "Pasteur Jean Kouamé",
      duration: "38 min",
      thumbnail: <img alt="Miniature vidéo cours épitres avec manuscrit" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1674526270469-67815aa3ea93" />
    }
  ];

  const audios = [
    {
      title: "La Sainteté de Dieu",
      author: "Dr. Samuel Koné",
      duration: "1h 15min"
    },
    {
      title: "Le Leadership Serviteur",
      author: "Pasteur David Mensah",
      duration: "55 min"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Ressources - École Tyrannus</title>
        <meta name="description" content="Accédez à nos cours en ligne, vidéos, audios et documents pédagogiques pour votre formation biblique." />
      </Helmet>
      
      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#1A237E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              Ressources Pédagogiques
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              Enrichissez votre apprentissage avec notre bibliothèque de contenus numériques.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
          
          {/* Section Documents à Télécharger (New Call to Action) */}
          <section>
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-8 border-[#D4AF37] flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-3">
                  <Download className="w-8 h-8 text-[#1A237E] mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-[#1A237E]">Espace Téléchargements</h2>
                </div>
                <p className="text-gray-600 max-w-xl">
                  Accédez à la zone de téléchargement pour récupérer les syllabi, les devoirs et les lectures obligatoires pour vos cours actuels.
                </p>
              </div>
              <Link to="/ressources/documents">
                <Button size="lg" className="bg-[#1A237E] hover:bg-[#1A237E]/90 text-white shadow-md">
                  Accéder aux Documents <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Videos Section */}
          <section>
            <div className="flex items-center mb-8">
              <div className="bg-[#D4AF37] p-3 rounded-full mr-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#1A237E]">Cours Vidéo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                      {video.thumbnail}
                    </div>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1A237E] mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{video.author}</p>
                    <Button variant="outline" className="w-full border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white">
                      Regarder
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Audio Section */}
          <section>
            <div className="flex items-center mb-8">
              <div className="bg-[#D4AF37] p-3 rounded-full mr-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#1A237E]">Enseignements Audio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audios.map((audio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:border-l-4 hover:border-[#D4AF37] transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#F5F5F5] p-3 rounded-full">
                      <Mic className="w-6 h-6 text-[#1A237E]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A237E]">{audio.title}</h3>
                      <p className="text-sm text-gray-600">{audio.author} • {audio.duration}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#1A237E] hover:bg-[#1A237E]/90">
                    <Play className="w-4 h-4 mr-2" /> Écouter
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Resources;