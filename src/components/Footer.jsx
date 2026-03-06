import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
const Footer = () => {
  const {
    toast
  } = useToast();
  const handleLinkClick = () => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };
  return <footer className="bg-[#0D1321] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À Propos */}
          <div>
            <h3 className="text-xl font-serif font-bold text-[#D4AF37] mb-4">
              École Tyrannus
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Une institution dédiée à la formation biblique et théologique d'excellence, équipant les leaders spirituels de demain.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <button onClick={handleLinkClick} className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={handleLinkClick} className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm">
                  Nos Formations
                </button>
              </li>
              <li>
                <button onClick={handleLinkClick} className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm">
                  Admission
                </button>
              </li>
              <li>
                <button onClick={handleLinkClick} className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm">
                  Actualités
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#D4AF37] mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">Fifadji, Rue du Commissariat sièg de l'Eglise Exelle pour Christ International</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                <span className="text-white/80 text-sm">+229 01 96 30 06 11</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                <span className="text-white/80 text-sm">
                  info@ecoletyrannus.org
                </span>
              </li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              Suivez-nous
            </h3>
            <div className="flex space-x-4">
              <button onClick={handleLinkClick} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button onClick={handleLinkClick} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button onClick={handleLinkClick} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6">
              <button onClick={handleLinkClick} className="text-white/80 hover:text-[#D4AF37] transition-colors text-sm underline">
                Site Officiel
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 École Tyrannus. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <button onClick={handleLinkClick} className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
              Mentions Légales
            </button>
            <button onClick={handleLinkClick} className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
              Politique de Confidentialité
            </button>
            <button onClick={handleLinkClick} className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
              Conditions d'Utilisation
            </button>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;