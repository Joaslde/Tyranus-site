import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase envoie le token dans le hash de l'URL (#access_token=...&type=recovery)
  // onAuthStateChange le détecte automatiquement et crée une session temporaire
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
      }
    });

    // Vérif si session déjà active (page rechargée)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Erreur lors de la mise à jour. Le lien a peut-être expiré.");
    } else {
      setDone(true);
      // Déconnecte la session temporaire après reset
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  // Succès
  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-green-500">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-3">
            Mot de passe mis à jour !
          </h2>
          <p className="text-gray-600 text-sm mb-2">
            Votre mot de passe a été changé avec succès.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Redirection vers la connexion dans 3 secondes...
          </p>
          <Link to="/login">
            <Button className="bg-[#1A237E] text-white">
              Se connecter maintenant
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Token pas encore détecté (page chargée sans hash valide)
  if (!sessionReady) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-red-400">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-3">
            Lien invalide ou expiré
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Ce lien de réinitialisation n'est plus valide. Veuillez faire une nouvelle demande.
          </p>
          <Link to="/forgot-password">
            <Button className="bg-[#1A237E] text-white">
              Demander un nouveau lien
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nouveau mot de passe — École Tyrannus</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-[#1A237E]">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#1A237E] mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 text-sm">
              Choisissez un nouveau mot de passe sécurisé.
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
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
                  placeholder="Minimum 6 caractères"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>

            {/* Indicateur force mot de passe */}
            {password && (() => {
              const score =
                password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
                : password.length >= 12 && /[A-Z]/.test(password) ? 3
                : password.length >= 10 ? 2
                : password.length >= 6 ? 1 : 0;
              const colors = ["bg-gray-200", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
              const labels = ["Trop court", "Faible", "Moyen", "Bon", "Fort"];
              return (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{labels[score]}</p>
                </div>
              );
            })()}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A237E] hover:bg-[#1A237E]/90 text-white py-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mise à jour...
                </span>
              ) : (
                "Enregistrer le nouveau mot de passe"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;