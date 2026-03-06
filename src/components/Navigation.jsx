import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, UserCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { toast } = useToast();

  const handleNavClick = (page) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-serif font-bold text-[#1A237E]">
              École Tyrannus
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Accueil
            </Link>
            <Link
              to="/evenements"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Événements
            </Link>
            <Link
              to="/formation"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              La Formation
            </Link>
            
            <Link
              to="/ressources"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Ressources
            </Link>
            
            {/* Dropdown À Propos */}
            <div className="relative">
              <button
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
                className="flex items-center text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
              >
                À Propos
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2"
                  >
                    <Link
                      to="/visionnaire"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      La Visionnaire
                    </Link>
                    <Link
                      to="/histoire"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      Notre Histoire
                    </Link>
                    <Link
                      to="/administration"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      L'Administration
                    </Link>
                    <Link
                      to="/formateurs"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      Les Formateurs
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Nous contacter
            </Link>

            <Link to="/login">
              <Button className="bg-[#1A237E] hover:bg-[#1A237E]/90 text-white flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Connexion
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-[#D4AF37] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left"
                >
                  Accueil
                </Link>
                <Link
                  to="/evenements"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left"
                >
                  Événements
                </Link>
                <Link
                  to="/formation"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left"
                >
                  La Formation
                </Link>
                <Link
                  to="/ressources"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left"
                >
                  Ressources
                </Link>
                <div className="flex flex-col space-y-2 pl-4">
                  <span className="text-gray-900 font-medium">À Propos</span>
                  <Link
                    to="/visionnaire"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                  >
                    La Visionnaire
                  </Link>
                  <Link
                    to="/histoire"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                  >
                    Notre Histoire
                  </Link>
                  <Link
                    to="/administration"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                  >
                    L'Administration
                  </Link>
                  <Link
                    to="/formateurs"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                  >
                    Les Formateurs
                  </Link>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left"
                >
                  Nous Joindre
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-[#1A237E] font-medium flex items-center gap-2 mt-2"
                >
                  <UserCircle className="w-5 h-5" />
                  Connexion Étudiant
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;