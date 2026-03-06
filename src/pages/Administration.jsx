import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Mail, Phone } from 'lucide-react';

const Administration = () => {
  const members = [
    {
      role: "Directeur Général",
      name: "Jean Dupont",
      image: <img alt="Directeur Général en costume professionnel" src="https://images.unsplash.com/photo-1650490323009-96fc950a959c" />
    },
    {
      role: "Directrice Académique",
      name: "Marie Curie",
      image: <img alt="Directrice Académique avec des lunettes" src="https://images.unsplash.com/photo-1659353220422-b9308b253a32" />
    },
    {
      role: "Responsable Finances",
      name: "Pierre Martin",
      image: <img alt="Responsable Finances consultant des documents" src="https://images.unsplash.com/photo-1589959320004-bf0f2f6b13ca" />
    },
    {
      role: "Secrétaire Générale",
      name: "Sophie Lefebvre",
      image: <img alt="Secrétaire Générale accueillante" src="https://images.unsplash.com/photo-1686628120034-bbc7a35f0642" />
    },
    {
      role: "Responsable Communication",
      name: "Lucas Dubois",
      image: <img alt="Responsable Communication dynamique" src="https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd" />
    },
    {
      role: "Responsable Logistique",
      name: "Thomas Moreau",
      image: <img alt="Responsable Logistique sur le terrain" src="https://images.unsplash.com/photo-1687766011004-8cb676b03bce" />
    },
    {
      role: "Aumônier",
      name: "Paul Bernard",
      image: <img alt="Aumônier bienveillant" src="https://images.unsplash.com/photo-1441886367417-1c946b32a980" />
    },
    {
      role: "Responsable Vie Étudiante",
      name: "Julie Petit",
      image: <img alt="Responsable Vie Étudiante entourée d'étudiants" src="https://images.unsplash.com/photo-1565812229319-3ca51fd36132" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>L'Administration - École Tyrannus</title>
        <meta name="description" content="Découvrez l'équipe administrative de l'École Tyrannus, dévouée à l'excellence et au service des étudiants." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              L'Administration
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              Une équipe dévouée au service de l'excellence académique et spirituelle.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                     {member.image}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#1A237E] mb-1">{member.name}</h3>
                  <p className="text-[#D4AF37] font-medium mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-4">
                    <button className="text-gray-400 hover:text-[#1A237E] transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-[#1A237E] transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Administration;