import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    );

    if (resetError) {
      setError("Une erreur s'est produite. Vérifiez l'adresse email.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-[#D4AF37]">
          <CheckCircle className="w-14 h-14 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-3">
            Email envoyé !
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
            Vérifiez votre boîte mail.
          </p>
          <Link to="/login">
            <Button
              variant="outline"
              className="border-[#1A237E] text-[#1A237E]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la connexion
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mot de passe oublié — École Tyrannus</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-[#1A237E]">
          <Link
            to="/login"
            className="flex items-center text-sm text-gray-500 hover:text-[#1A237E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la connexion
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#1A237E] mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-gray-600 text-sm">
              Entrez votre email et nous vous enverrons un lien de
              réinitialisation.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A237E] hover:bg-[#1A237E]/90 text-white py-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : (
                "Envoyer le lien"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
