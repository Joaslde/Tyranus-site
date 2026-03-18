import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Scroll, 
  Flame, 
  Globe2, 
  ShieldCheck, 
  Mic2, 
  Megaphone,
  Library,
  Sparkles,
  Eye,
  X
} from 'lucide-react';
import { courseModules } from '../data/courseModules';

const formationGroups = [
  {
    title: "CYCLE FON",
    icon: Scroll,
    description: "Formation biblique dispensée en langue Fon pour un impact local profond.",
    themeColor: "from-emerald-600 to-teal-600",
    lightColor: "bg-emerald-50 text-emerald-700",
    items: [
      {
        title: "Année Préparatoire",
        desc: "Les bases de la vie chrétienne et alphabétisation si nécessaire.",
        duration: "1 an"
      },
      {
        title: "1re Année",
        desc: "Étude des livres historiques et doctrines fondamentales.",
        duration: "1 an"
      },
      {
        title: "2e Année",
        desc: "Théologie pratique et préparation au service.",
        duration: "1 an"
      }
    ]
  },
  {
    title: "CYCLE FRANÇAIS",
    icon: Library,
    description: "Cursus académique complet pour former les leaders de demain.",
    themeColor: "from-blue-600 to-indigo-600",
    lightColor: "bg-blue-50 text-blue-700",
    items: [
      {
        title: "Année Préparatoire",
        desc: "Introduction à la théologie et méthodologie de travail.",
        duration: "1 an"
      },
      {
        title: "1re Année",
        desc: "Survol biblique et histoire de l'Église.",
        duration: "1 an"
      },
      {
        title: "2e Année",
        desc: "Herméneutique, homilétique et dogmatique.",
        duration: "1 an"
      },
      {
        title: "3e Année",
        desc: "Leadership avancé, éthique et stage pratique.",
        duration: "1 an"
      }
    ]
  },
  {
    title: "FORMATIONS MODULAIRES",
    icon: Sparkles,
    description: "Modules spécialisés pour le perfectionnement du ministère.",
    themeColor: "from-[#D4AF37] to-amber-600",
    lightColor: "bg-amber-50 text-amber-700",
    items: [
      {
        title: "Prophétie",
        icon: Flame,
        desc: "Comprendre et exercer le don prophétique."
      },
      {
        title: "Missiologie",
        icon: Globe2,
        desc: "Stratégies pour la mission transculturelle."
      },
      {
        title: "Délivrance",
        icon: ShieldCheck,
        desc: "Fondements bibliques du combat spirituel."
      },
      {
        title: "Évangélisation",
        icon: Megaphone,
        desc: "Techniques pour partager efficacement la foi."
      },
      {
        title: "Prédication",
        icon: Mic2,
        desc: "L'art de communiquer la Parole de Dieu."
      }
    ]
  }
];

const FormationCycles = () => {
  const [selectedModules, setSelectedModules] = useState(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A237E] mb-6">
            Nos Programmes de Formation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une structure académique flexible et rigoureuse, conçue pour répondre aux besoins de chaque appel ministériel.
          </p>
        </motion.div>

        <div className="space-y-24">
          {formationGroups.map((group, groupIndex) => (
            <div key={group.title} className="relative">
              {/* Section Header */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-br ${group.themeColor} shadow-lg text-white`}>
                  <group.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900">
                    {group.title}
                  </h3>
                  <p className="text-gray-500 mt-1 text-lg">{group.description}</p>
                </div>
              </motion.div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    {/* Top Accent Line */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${group.themeColor}`} />
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-md ${group.lightColor}`}>
                          {item.icon ? <item.icon className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                        </div>
                        {item.duration && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {item.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1A237E] transition-colors">
                        {item.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-14">
                        {item.desc}
                      </p>

                      {group.title !== "FORMATIONS MODULAIRES" && (
                        <div className="absolute bottom-4 right-4 z-10">
                          <button
                            onClick={() => {
                              const key = `${item.title}_${group.title}`;
                              const modulesForClass = courseModules[key] || [];
                              
                              setSelectedModules({
                                title: item.title,
                                cycle: group.title,
                                modules: modulesForClass,
                                themeColor: group.themeColor
                              });
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r ${group.themeColor} rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105`}
                          >
                            <Eye className="w-4 h-4" />
                            Voir les modules
                          </button>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity text-[#1A237E]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedModules && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-2xl"
            >
              <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${selectedModules.themeColor}`}>
                <div className="flex items-start justify-between">
                  <div className="text-white">
                    <h3 className="text-xs font-bold tracking-widest uppercase opacity-90">
                      {selectedModules.cycle}
                    </h3>
                    <h2 className="mt-1 text-2xl font-bold font-serif">
                      Modules - {selectedModules.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedModules(null)}
                    className="p-2 text-white bg-white/20 transition-colors rounded-full hover:bg-white/30 backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {selectedModules.modules && selectedModules.modules.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedModules.modules.map((module, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-4 p-4 transition-colors rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                      >
                        <span className={`flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-br ${selectedModules.themeColor} rounded-full shrink-0 shadow-sm mt-0.5`}>
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed font-medium">
                          {module}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-1">Aucun module</p>
                    <p className="text-sm">Les modules pour cette classe ne sont pas encore disponibles.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FormationCycles;