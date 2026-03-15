import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Quote, Award, Globe, BookOpen, Mic, Heart, Zap, GraduationCap } from 'lucide-react';

const Visionnaire = () => {
  const ministryItems = [
    {
      icon: Mic,
      title: 'Prédication',
      desc: 'Proclamation puissante de la Parole de Dieu',
    },
    {
      icon: Heart,
      title: 'Guérison',
      desc: 'Ministère de guérison et de restauration',
    },
    {
      icon: Zap,
      title: 'Délivrance',
      desc: 'Libération des captifs par la puissance de Dieu',
    },
    {
      icon: GraduationCap,
      title: 'Formation',
      desc: 'Équipement des leaders et disciples',
    },
  ];

  const badgeItems = [
    { icon: Award, label: 'Ambassadrice de la Paix' },
    { icon: Globe, label: 'Missions Internationales' },
    { icon: BookOpen, label: 'Auteure' },
  ];

  return (
    <>
      <Helmet>
        <title>La Visionnaire - École Tyrannus</title>
        <meta name="description" content="Découvrez la vision et le cœur derrière l'École Tyrannus." />
      </Helmet>

      <div className="bg-white min-h-screen">

        {/* ── HEADER ── */}
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-6"
            >
              La Visionnaire
            </motion.h1>
          </div>
        </div>

        {/* ── SECTION 1 — Une vie dédiée à Dieu ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <div className="aspect-[3/4] bg-gray-200">
                  <img
                    alt="La Visionnaire de l'École Tyrannus"
                    className="w-full h-full object-cover"
                    src="https://res.cloudinary.com/dmngvz0f4/image/upload/v1767013074/photo_2025-12-29_12-06-43_bvxxdp.jpg"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent p-8 pt-24 text-white">
                  <h3 className="text-2xl font-serif font-bold">Apôtre Janine AHO</h3>
                  <p className="opacity-90">Fondatrice &amp; Visionnaire</p>
                </div>
              </div>
            </motion.div>

            {/* Bio + badges */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-6"
            >
              <span className="inline-block bg-[#1A237E] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Biographie
              </span>

              <h2 className="text-3xl font-serif font-bold text-[#1A237E]">
                Une vie{' '}
                <span className="text-[#D4AF37]">dédiée à Dieu</span>
              </h2>

              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  L'Apôtre Janine AHO est une femme de Dieu béninoise qui a consacré sa vie au service de l'Évangile.
                  Elle a fondé Excelle pour Christ International (anciennement Fondation Internationale Mont Horeb)
                  le 5 avril 2001 à Guinkomey, Cotonou.
                </p>
                <p>
                  Dotée d'un puissant ministère prophétique et apostolique, elle parcourt les nations pour proclamer
                  la bonne nouvelle du Royaume de Dieu. Son message est caractérisé par une profondeur biblique et
                  une onction de guérison et de délivrance.
                </p>
                <p>
                  Reconnue internationalement, l'Apôtre Janine AHO a été honorée du titre d'
                  <strong className="text-[#D4AF37]">Ambassadrice de la Paix Mondiale</strong> pour son engagement
                  en faveur de la réconciliation et de l'unité entre les peuples.
                </p>
              </div>

              {/* Badge cards */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {badgeItems.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-8 h-8 text-[#D4AF37] mb-2" />
                    <span className="text-xs text-gray-500 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── SECTION 2 — Son Ministère ── */}
        <div className="bg-[#1A237E] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                Son <span className="text-[#D4AF37]">Ministère</span>
              </h2>
              <p className="text-white/60 text-base">
                Les différentes facettes du ministère de l'Apôtre Janine AHO
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ministryItems.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h5 className="text-white font-serif font-bold text-lg mb-2">{title}</h5>
                  <p className="text-white/60 text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — Citation (texte original JSX) ── */}
        <div className="bg-[#D4AF37]/10 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Quote className="w-16 h-16 text-[#D4AF37]/40 rotate-180 mx-auto mb-6" />

              <div className="space-y-5 text-gray-700 font-serif italic text-lg leading-relaxed mb-10">
                <p>
                  Depuis plus d'une décennie, mon cœur brûle d'une passion inébranlable : voir une génération de
                  croyants non seulement connaître Dieu, mais comprendre profondément Sa Parole pour transformer
                  leur monde.
                </p>
                <p>
                  L'École Tyrannus n'est pas née d'une simple ambition académique, mais d'une révélation divine.
                  Comme dans les Actes des Apôtres, où Paul enseignait quotidiennement dans l'école de Tyrannus,
                  nous croyons que l'enseignement systématique et inspiré est la clé pour libérer le potentiel de
                  chaque chrétien.
                </p>
                <p>
                  Ma vision est de bâtir une armée d'hommes et de femmes équipés, non pas seulement de diplômes,
                  mais de la puissance de l'Esprit et de la sagesse des Écritures. Bienvenue dans cette aventure
                  de foi et de connaissance.
                </p>
              </div>

              <div className="border-t border-[#D4AF37]/30 pt-6 space-y-2">
                <p className="font-serif font-bold text-[#1A237E] text-xl">— Apôtre Janine AHO</p>
                <p className="font-serif italic text-gray-500 text-sm">
                  "Que la Parole de Christ habite parmi vous abondamment." — Colossiens 3:16
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Visionnaire;