import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const events = [
  {
    title: "Séminaire: L'Herméneutique Biblique",
    date: "15 Janvier 2026",
    time: "9h00 - 17h00",
    location: "Campus Principal",
    description: "Formation intensive sur les méthodes d'interprétation biblique avec Dr. Samuel Koné"
  },
  {
    title: "Conférence Annuelle",
    date: "22-24 Février 2026",
    time: "Toute la journée",
    location: "Centre de Convention",
    description: "Trois jours de louange, enseignement et communion fraternelle"
  },
  {
    title: "Atelier: Leadership Chrétien",
    date: "10 Mars 2026",
    time: "14h00 - 18h00",
    location: "Salle de Conférence B",
    description: "Développer les compétences de leadership selon les principes bibliques"
  },
  {
    title: "Journée Portes Ouvertes",
    date: "5 Avril 2026",
    time: "10h00 - 16h00",
    location: "Campus Principal",
    description: "Découvrez nos programmes et rencontrez nos professeurs"
  }
];

const EventsCalendar = () => {
  const { toast } = useToast();

  const handleRegister = (eventTitle) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A237E] mb-4">
            Événements & Séminaires
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participez à nos événements enrichissants et formations spécialisées
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border-l-4 border-[#D4AF37] bg-[#F5F5F5] p-6 rounded-r-lg hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-serif font-bold text-[#1A237E] mb-4">
                {event.title}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-[#D4AF37] mr-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 text-[#D4AF37] mr-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-[#D4AF37] mr-3" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {event.description}
              </p>
              
              <Button
                onClick={() => handleRegister(event.title)}
                className="bg-[#1A237E] hover:bg-[#1A237E]/90 text-white"
              >
                S'inscrire
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsCalendar;