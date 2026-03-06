import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs du formulaire.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending
    toast({
      title: "Message envoyé !",
      description: "Nous avons bien reçu votre message et vous contacterons sous peu."
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  };
  return <>
      <Helmet>
        <title>Contact - École Tyrannus</title>
        <meta name="description" content="Contactez l'École Tyrannus pour toute question concernant nos formations bibliques et théologiques." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contactez-nous</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Nous sommes à votre écoute pour vous accompagner dans votre appel.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
          
          {/* Section 1 - Google Map */}
          <motion.section initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
            <div className="flex items-center mb-6 text-[#1A237E]">
              <MapPin className="w-8 h-8 mr-3 text-[#D4AF37]" />
              <h2 className="text-3xl font-serif font-bold">Notre Localisation</h2>
            </div>
            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.253018861936!2d2.383186!3d6.36129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102355002cc3c847%3A0xc665e89d137ecb1e!2sFondation%20Excelle%20pour%20Christ!5e0!3m2!1sfr!2sbj!4v1709214000000!5m2!1sfr!2sbj" width="100%" height="100%" style={{
              border: 0
            }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Carte de localisation de la Fondation Excelle pour Christ"></iframe>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Section 2 - Contact Info */}
            <motion.section initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-8">
              <h2 className="text-3xl font-serif font-bold text-[#1A237E] mb-6">Informations Officielles</h2>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#D4AF37]">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-4 rounded-full flex-shrink-0">
                    <Phone className="w-8 h-8 text-[#1A237E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
                    <p className="text-gray-600 mb-2">Notre équipe est disponible pour répondre à vos questions.</p>
                    <a href="tel:0196816496" className="text-2xl font-bold text-[#1A237E] hover:text-[#D4AF37] transition-colors">
                      01 96 81 64 96
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#1A237E]">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-50 p-4 rounded-full flex-shrink-0">
                    <Mail className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-2">info@tyrannus.fec.org</p>
                    <span className="text-lg font-medium text-gray-500 italic"></span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3 - Contact Form */}
            <motion.section initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-[#1A237E] mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-600">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom et Prénom <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-gray-900" placeholder="Votre nom complet" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-gray-900" placeholder="Votre numéro de téléphone" required />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-gray-900" placeholder="votre@email.com" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all resize-none text-gray-900" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                </div>

                <Button type="submit" className="w-full bg-[#1A237E] hover:bg-[#1A237E]/90 text-white font-bold py-4 rounded-lg flex items-center justify-center space-x-2 transition-all">
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </Button>
              </form>
            </motion.section>
          </div>
        </div>
      </div>
    </>;
};
export default Contact;