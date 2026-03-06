import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Book, Globe, CheckCircle, GraduationCap, ShieldCheck, Globe2, Flame, Mic2, Megaphone, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Formation = () => {
  return (
    <>
      <Helmet>
        <title>La Formation - École Tyrannus</title>
        <meta name="description" content="Découvrez nos cycles de formation en Fon, en Français, nos cours en ligne et nos formations modulaires." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Nos Programmes</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Des parcours adaptés à chaque appel et à chaque langue.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          
          <Tabs defaultValue="francais" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white p-2 rounded-2xl md:rounded-full shadow-md flex flex-wrap h-auto justify-center gap-2">
                <TabsTrigger value="francais" className="rounded-full px-4 md:px-6 py-3 data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Classes Français</TabsTrigger>
                <TabsTrigger value="fon" className="rounded-full px-4 md:px-6 py-3 data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Classes FON</TabsTrigger>
                <TabsTrigger value="modulaires" className="rounded-full px-4 md:px-6 py-3 data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Formations Modulaires</TabsTrigger>
                <TabsTrigger value="online" className="rounded-full px-4 md:px-6 py-3 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1A237E] font-bold">Cours en Ligne</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="francais">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Année Préparatoire", desc: "Fondements de la foi et introduction à la vie chrétienne victorieuse." },
                  { title: "1ère Année", desc: "Panorama biblique, Herméneutique de base et Histoire de l'Église primitive." },
                  { title: "2ème Année", desc: "Théologie systématique, Homilétique et Éthique chrétienne." },
                  { title: "3ème Année", desc: "Leadership avancé, Missiologie et stage pratique de ministère." }
                ].map((level, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#1A237E] hover:scale-105 transition-transform"
                  >
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6 text-[#1A237E]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A237E] mb-3">{level.title}</h3>
                    <p className="text-gray-600">{level.desc}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fon">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Année Préparatoire (Wemaxɔ)", desc: "Kplɔ́n ɖo nǔ e kàn nǔɖiɖi kpo gbɛ̀ zinzǎn Klisanwun tɔn kpo wu é." },
                  { title: "1ère Année (Xwè Nukɔntɔn)", desc: "Biblu kplɔnkplɔn gɔ̌nǔ, kpodo tan Igleza tɔn kpo." },
                  { title: "2ème Année (Xwè Wegɔ)", desc: "Nǔkplɔnkplɔn ɖo Mawuxó, Nǔɖiɖi kpo Sinsɛnzɔ́ kpo wu." }
                ].map((level, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#D4AF37] hover:scale-105 transition-transform"
                  >
                    <div className="bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Book className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A237E] mb-3">{level.title}</h3>
                    <p className="text-gray-600 italic">{level.desc}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modulaires">
              <div className="mb-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4 text-[#1A237E]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-[#1A237E] mb-4">Formations Modulaires</h2>
                <p className="text-lg text-gray-600">
                  Ce sont des modules de renforcement de courtes durée pour aider dans le ministère.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Délivrance", icon: ShieldCheck, desc: "Fondements bibliques et principes pratiques du combat spirituel et de la délivrance." },
                  { title: "Missiologie", icon: Globe2, desc: "Stratégies d'implantation d'églises et mission transculturelle." },
                  { title: "Prophétie", icon: Flame, desc: "Comprendre, discerner et exercer sainement le don prophétique dans l'église." },
                  { title: "Prédication", icon: Mic2, desc: "L'art de préparer et communiquer efficacement le message de la Parole de Dieu." },
                  { title: "Évangélisation", icon: Megaphone, desc: "Techniques et approches pratiques pour partager sa foi avec impact." }
                ].map((module, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#1A237E] hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                      <module.icon className="w-7 h-7 text-[#1A237E]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A237E] mb-3">{module.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{module.desc}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="online">
              <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden mt-8">
                <Globe className="absolute top-4 right-4 w-64 h-64 text-white/5" />
                
                <div className="relative z-10 max-w-3xl">
                  <h2 className="text-3xl font-serif font-bold mb-6 flex items-center">
                    <Globe className="w-8 h-8 mr-3 text-[#D4AF37]" />
                    Programme de Cours en Ligne
                  </h2>
                  
                  <p className="text-lg text-white/90 mb-8 leading-relaxed">
                    L'École Tyrannus brise les barrières géographiques. Notre programme en ligne offre la même qualité d'enseignement que nos cours en présentiel, adapté à votre rythme.
                  </p>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
                    <h3 className="text-[#D4AF37] font-bold text-xl mb-4">Conditions d'Éligibilité</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-[#D4AF37] mr-3 flex-shrink-0" />
                        <span>Résider à l'extérieur du Bénin</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-[#D4AF37] font-bold">OU</div>
                        <span>Obtenir une autorisation spéciale de la Fondatrice (pour les résidents au Bénin avec contraintes majeures)</span>
                      </li>
                    </ul>
                  </div>

                  <button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1A237E] font-bold py-3 px-8 rounded-lg transition-colors">
                    Faire une demande d'admission
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </>
  );
};

export default Formation;