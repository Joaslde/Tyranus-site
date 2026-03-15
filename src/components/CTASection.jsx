import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-[#1A237E] to-[#1A237E]/90 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Prêt à Commencer Votre Parcours?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez la prochaine promotion de l'École Tyrannus et transformez votre vie à travers une formation biblique et théologique d'excellence.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/contact')}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white text-lg px-8 py-6 rounded-lg shadow-xl"
            >
              S'inscrire à la Prochaine Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          
          <p className="text-white/70 mt-6 text-sm">
            Les inscriptions pour la rentrée de septembre 2026 sont ouvertes
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;