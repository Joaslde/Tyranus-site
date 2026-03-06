import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, Download, Search, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Documents = () => {
  const documents = [
    { name: "Syllabus - Théologie Systématique I", type: "PDF", size: "2.4 MB", date: "28 Dec 2024" },
    { name: "Guide de l'Étudiant 2024-2025", type: "PDF", size: "4.1 MB", date: "15 Sep 2024" },
    { name: "Devoir d'Histoire de l'Église - Sujet 1", type: "DOCX", size: "540 KB", date: "10 Jan 2025" },
    { name: "Formulaire d'Inscription au Stage", type: "PDF", size: "1.2 MB", date: "05 Jan 2025" },
    { name: "Lecture: La Prière Efficace (Chap 1-3)", type: "PDF", size: "8.5 MB", date: "20 Dec 2024" },
  ];

  return (
    <>
      <Helmet>
        <title>Documents à Télécharger - École Tyrannus</title>
        <meta name="description" content="Espace de téléchargement des ressources académiques pour les étudiants." />
      </Helmet>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Centre de Documents</h1>
            <p className="text-white/80">Téléchargez vos supports de cours et documents administratifs.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Rechercher un document..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1A237E] flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Fichiers Récents
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <File className="w-6 h-6 text-[#1A237E]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-[#1A237E] transition-colors">{doc.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Ajouté le {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#D4AF37] hover:bg-transparent">
                    <Download className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Documents;