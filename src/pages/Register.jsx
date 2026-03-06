import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("etudiant");
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    cycle_id: "",
    classe_id: "",
  });
  const [profClasses, setProfClasses] = useState([]);

  const [cycles, setCycles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Charge les cycles au démarrage
  useEffect(() => {
    supabase
      .from("cycles")
      .select("*")
      .order("ordre")
      .then(({ data, error }) => {
        if (error) console.error("Erreur cycles:", error.message);
        else setCycles(data || []);
      });
  }, []);

  // Charge les classes quand un cycle est sélectionné (étudiant)
  useEffect(() => {
    if (!form.cycle_id) { setClasses([]); return; }
    supabase
      .from("classes")
      .select("*")
      .eq("cycle_id", form.cycle_id)
      .eq("est_modulaire", false)
      .order("ordre")
      .then(({ data, error }) => {
        if (error) console.error("Erreur classes:", error.message);
        else setClasses(data || []);
      });
  }, [form.cycle_id]);

  // Charge toutes les classes pour les profs
  useEffect(() => {
    if (role !== "professeur") return;
    supabase
      .from("classes")
      .select("*, cycle:cycle_id(nom)")
      .eq("est_modulaire", false)
      .order("ordre")
      .then(({ data, error }) => {
        if (error) console.error("Erreur allClasses:", error.message);
        else setAllClasses(data || []);
      });
  }, [role]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleProfClass = (id) => {
    setProfClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (role === "etudiant" && (!form.cycle_id || !form.classe_id)) {
      setError("Veuillez sélectionner un cycle et une classe.");
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le compte Supabase Auth avec les métadonnées
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nom: form.nom,
            prenom: form.prenom,
            telephone: form.telephone,
            role: role,
            classe_id: role === "etudiant" ? form.classe_id : "",
            prof_classes: role === "professeur" ? JSON.stringify(profClasses) : "[]",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("rate limit") || authError.message.includes("over_email")) {
          setError("Trop de tentatives. Attendez quelques minutes.");
        } else if (authError.message.includes("already registered")) {
          setError("Cet email est déjà utilisé. Essayez de vous connecter.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // 2. Le trigger DB crée le profil automatiquement
      // On affiche juste le succès
      setSuccess(true);

    } catch (err) {
      setError("Erreur inattendue: " + err.message);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-[#D4AF37]">
          <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[#1A237E] mb-3">Compte créé !</h2>
          <p className="text-gray-600 mb-2">
            Votre compte est en attente de validation par l'administration.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Vous pouvez déjà vous connecter et attendre la validation.
          </p>
          <Link to="/login">
            <Button className="bg-[#1A237E] text-white w-full">
              Aller à la connexion
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Inscription — École Tyrannus</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-[#1A237E]">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#1A237E] mb-2">Créer un compte</h1>
            <p className="text-gray-600 text-sm">Rejoignez l'École Tyrannus</p>
          </div>

          {/* Toggle rôle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
            {["etudiant", "professeur"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  role === r ? "bg-[#1A237E] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r === "etudiant" ? "🎓 Étudiant" : "📚 Professeur"}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nom *</label>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => set("nom", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="Koné"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Prénom *</label>
                <input
                  required
                  value={form.prenom}
                  onChange={(e) => set("prenom", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="Samuel"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  required
                  value={form.telephone}
                  onChange={(e) => set("telephone", e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="+229 97 00 00 00"
                />
              </div>
            </div>

            {/* Cycle + Classe (étudiant) */}
            {role === "etudiant" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Cycle de formation *</label>
                  <select
                    required
                    value={form.cycle_id}
                    onChange={(e) => { set("cycle_id", e.target.value); set("classe_id", ""); }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                  >
                    <option value="">— Choisir un cycle —</option>
                    {cycles
                      .filter((c) => c.nom !== "Formations Modulaires")
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                  </select>
                  {cycles.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Chargement des cycles...</p>
                  )}
                </div>

                {classes.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Classe de départ *</label>
                    <select
                      required
                      value={form.classe_id}
                      onChange={(e) => set("classe_id", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                    >
                      <option value="">— Choisir une classe —</option>
                      {classes.map((cl) => (
                        <option key={cl.id} value={cl.id}>{cl.nom}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Classes assignées (professeur) */}
            {role === "professeur" && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">
                  Classes assignées
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  {allClasses.map((cl) => (
                    <label
                      key={cl.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={profClasses.includes(cl.id)}
                        onChange={() => toggleProfClass(cl.id)}
                        className="rounded border-gray-300 text-[#1A237E]"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{cl.nom}</span>
                        <span className="text-gray-400 text-xs ml-2">({cl.cycle?.nom})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="Min. 6 caractères"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-gray-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Confirmer le mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A237E] hover:bg-[#1A237E]/90 text-white py-6 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Inscription en cours...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-[#1A237E] font-bold hover:underline">
              Se connecter
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default Register;