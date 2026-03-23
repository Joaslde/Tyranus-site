import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const getRedirectPath = (profile) => {
  if (!profile) return null;
  if (profile.role === "super_admin") return "/admin";
  if (profile.role === "professeur") return "/prof/dashboard";
  if (profile.statut !== "valide") return "/attente-validation";
  return "/etudiant/dashboard";
};

const Login = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Si AuthContext a fini de charger et user est déjà connecté → redirect direct
  useEffect(() => {
    if (loading) return;
    if (user && profile) {
      const path = getRedirectPath(profile);
      if (path) navigate(path, { replace: true });
    }
  }, [user, profile, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Email ou mot de passe incorrect.");
        setSubmitting(false);
        return;
      }

      // Fetch profil immédiatement sans attendre AuthContext
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profileData) {
        setError("Profil introuvable. Contactez l'administration.");
        setSubmitting(false);
        return;
      }

      const path = getRedirectPath(profileData);
      navigate(path, { replace: true });

    } catch (err) {
      setError("Erreur inattendue. Réessayez.");
      setSubmitting(false);
    }
  };

  // Pendant que AuthContext charge la session initiale → afficher rien (évite le flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-10 h-10 border-4 border-[#1A237E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Connexion — École Tyrannus</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-[#1A237E]">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#1A237E] mb-2">
              Mon espace 
            </h1>
            <p className="text-gray-600 text-sm">
              Connectez-vous pour accéder à vos cours
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adresse Email</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right text-sm">
              <Link to="/forgot-password" className="text-[#1A237E] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1A237E] hover:bg-[#1A237E]/90 text-white py-6 text-base"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se Connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="text-[#D4AF37] font-bold hover:underline">
              Créer un compte
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;