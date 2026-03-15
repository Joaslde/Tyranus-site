import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, UserCircle, Home, CalendarDays, BookOpen, Info, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const handleNavClick = (page) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀"
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
    setMobileAboutOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium ${isActive(path) ? 'text-[#D4AF37]' : ''}`;

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
            <Link to="/" className={linkClass('/')}>Accueil</Link>
            <Link to="/evenements" className={linkClass('/evenements')}>Événements</Link>
            <Link to="/formation" className={linkClass('/formation')}>La Formation</Link>

            {/* <Link
              to="/ressources"
              className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Ressources
            </Link>
             */}

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
                    {/* <Link
                      to="/administration"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      L'Administration
                    </Link> */}
                    {/* <Link
                      to="/formateurs"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F5F5F5] hover:text-[#D4AF37] transition-colors"
                    >
                      Les Formateurs
                    </Link> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/contact" className={linkClass('/contact')}>Nous contacter</Link>

            <Link to="/login">
              <Button className="bg-[#1A237E] hover:bg-[#1A237E]/90 text-white flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Connexion
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Ouvrir le menu"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-[#1A237E] hover:bg-[#1A237E]/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="font-serif font-bold text-[#1A237E] text-lg">Menu</span>
                <button
                  onClick={closeMenu}
                  aria-label="Fermer le menu"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">

                <MobileNavLink to="/" icon={<Home className="w-5 h-5" />} label="Accueil" onClick={closeMenu} active={isActive('/')} />
                <MobileNavLink to="/evenements" icon={<CalendarDays className="w-5 h-5" />} label="Événements" onClick={closeMenu} active={isActive('/evenements')} />
                <MobileNavLink to="/formation" icon={<BookOpen className="w-5 h-5" />} label="La Formation" onClick={closeMenu} active={isActive('/formation')} />

                {/* <MobileNavLink to="/ressources" icon={...} label="Ressources" onClick={closeMenu} active={isActive('/ressources')} /> */}

                {/* À Propos accordion */}
                <div>
                  <button
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-[#1A237E] flex-shrink-0">
                      <Info className="w-5 h-5" />
                    </span>
                    <span className="flex-1 text-left font-medium">À Propos</span>
                    <motion.span
                      animate={{ rotate: mobileAboutOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 pl-6 border-l-2 border-[#D4AF37]/40 flex flex-col gap-1 pb-2 mt-1">
                          <Link
                            to="/visionnaire"
                            onClick={closeMenu}
                            className={`block py-2.5 px-2 rounded-lg text-sm font-medium transition-colors ${isActive('/visionnaire') ? 'text-[#D4AF37]' : 'text-gray-600 hover:text-[#D4AF37]'}`}
                          >
                            La Visionnaire
                          </Link>
                          <Link
                            to="/histoire"
                            onClick={closeMenu}
                            className={`block py-2.5 px-2 rounded-lg text-sm font-medium transition-colors ${isActive('/histoire') ? 'text-[#D4AF37]' : 'text-gray-600 hover:text-[#D4AF37]'}`}
                          >
                            Notre Histoire
                          </Link>
                          {/* <Link
                            to="/administration"
                            onClick={closeMenu}
                            className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                          >
                            L'Administration
                          </Link> */}
                          {/* <Link
                            to="/formateurs"
                            onClick={closeMenu}
                            className="text-gray-700 hover:text-[#D4AF37] transition-colors text-left pl-4"
                          >
                            Les Formateurs
                          </Link> */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <MobileNavLink to="/contact" icon={<Phone className="w-5 h-5" />} label="Nous Joindre" onClick={closeMenu} active={isActive('/contact')} />
              </nav>

              {/* Drawer footer — CTA */}
              <div className="px-4 pb-8 pt-4 border-t border-gray-100">
                <Link to="/login" onClick={closeMenu} className="block">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#1A237E] hover:bg-[#1A237E]/90 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
                    <UserCircle className="w-5 h-5" />
                    Connexion
                  </button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ── Helper: single mobile nav link ── */
const MobileNavLink = ({ to, icon, label, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-3 py-3.5 rounded-xl transition-colors ${
      active
        ? 'bg-[#1A237E]/8 text-[#D4AF37] font-semibold'
        : 'text-gray-700 hover:bg-[#F5F5F5] font-medium'
    }`}
  >
    <span className={`w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 ${active ? 'bg-[#1A237E] text-white' : 'bg-gray-100 text-[#1A237E]'}`}>
      {icon}
    </span>
    <span>{label}</span>
    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
  </Link>
);

export default Navigation;