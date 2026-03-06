import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Clock, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AttenteValidation = () => {
  const { profile, signOut } = useAuth();

  return (
    <>
      <Helmet>
        <title>Compte en attente — École Tyrannus</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-[#D4AF37]">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1A237E] mb-3">
            Compte en attente de validation
          </h1>
          {profile && (
            <p className="text-gray-700 mb-2 font-medium">
              Bonjour {profile.prenom} {profile.nom} 👋
            </p>
          )}
          <p className="text-gray-600 text-sm mb-6">
            Votre compte a bien été créé. L'administration de l'École Tyrannus
            doit valider votre inscription avant que vous puissiez accéder aux
            cours. Vous serez notifié par email.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
            <Mail className="w-4 h-4" />
            <span>
              Vérifiez aussi votre email pour confirmer votre adresse.
            </span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white w-full"
          >
            <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
          </Button>
        </div>
      </div>
    </>
  );
};

export default AttenteValidation;
