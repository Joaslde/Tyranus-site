import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Award,
  ChevronRight,
  LogOut,
  Clock,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { demanderPassage } from "@/lib/progressionService";

const StudentDashboard = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [cours, setCours] = useState([]);
  const [progression, setProgression] = useState({});
  const [diplomes, setDiplomes] = useState([]);
  const [demandePending, setDemandePending] = useState(false);
  const [loadingCours, setLoadingCours] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const isLibre = !profile?.classe_id;

  useEffect(() => {
    if (!user) return;
    // Fetch diplomes archive
    supabase
      .from("diplomes")
      .select("*, classe:classe_id(nom, cycle:cycle_id(nom))")
      .eq("user_id", user.id)
      .then(({ data }) => setDiplomes(data || []));

    // Fetch pending demande pasage
    supabase
      .from("demandes_passage")
      .select("id")
      .eq("user_id", user.id)
      .eq("statut", "en_attente")
      .then(({ data }) => setDemandePending((data || []).length > 0));
  }, [user]);

  useEffect(() => {
    if (!user || !profile?.classe_id) {
      setLoadingCours(false);
      return;
    }

    // Fetch courses for current class
    supabase
      .from("cours")
      .select("*")
      .eq("classe_id", profile.classe_id)
      .eq("publie", true)
      .order("ordre")
      .then(async ({ data: coursData }) => {
        setCours(coursData || []);

        // Fetch progression for these courses
        if (coursData && coursData.length > 0) {
          const { data: prog } = await supabase
            .from("progression")
            .select("cours_id, completed")
            .eq("user_id", user.id)
            .in(
              "cours_id",
              coursData.map((c) => c.id),
            );

          const map = {};
          (prog || []).forEach((p) => {
            map[p.cours_id] = p.completed;
          });
          setProgression(map);
        }
        setLoadingCours(false);
      });
  }, [user, profile?.classe_id]);

  const completedCount = Object.values(progression).filter(Boolean).length;
  const totalCount = cours.length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleDemanderPassage = async () => {
    if (!profile?.classe) return;
    setLoadingAction(true);
    await demanderPassage(user.id, profile.classe);
    setDemandePending(true);
    setLoadingAction(false);
  };

  return (
    <>
      <Helmet>
        <title>Mon Espace — École Tyrannus</title>
      </Helmet>
      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#1A237E] text-white py-10">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">Bienvenue,</p>
              <h1 className="text-2xl font-serif font-bold">
                {profile?.prenom} {profile?.nom}
              </h1>
              {profile?.classe && (
                <p className="text-[#D4AF37] text-sm mt-1">
                  {profile.classe.cycle?.nom} — {profile.classe.nom}
                </p>
              )}
              {isLibre && (
                <p className="text-amber-300 text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Étudiant libre — En transition
                </p>
              )}
            </div>
            <button
              onClick={signOut}
              className="text-white/70 hover:text-white flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
          {/* Diplomes Archive */}
          {diplomes.length > 0 && (
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A237E] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D4AF37]" /> Classes terminées
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {diplomes.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-xl p-4 shadow flex items-center gap-4 border-l-4 border-[#D4AF37]"
                  >
                    <Award className="w-8 h-8 text-[#D4AF37]" />
                    <div>
                      <p className="font-bold text-[#1A237E]">
                        {d.classe?.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {d.classe?.cycle?.nom} · Terminé le{" "}
                        {new Date(d.completed_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Étudiant libre — options */}
          {isLibre && (
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#D4AF37]">
              <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-2">
                Vous êtes en période libre
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                Vous avez terminé votre classe précédente. Vous pouvez demander
                à passer à la classe suivante ou explorer les formations
                modulaires.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {!demandePending ? (
                  <Button
                    onClick={handleDemanderPassage}
                    disabled={loadingAction}
                    className="bg-[#1A237E] text-white"
                  >
                    {loadingAction
                      ? "Envoi..."
                      : "Demander le passage à la classe suivante →"}
                  </Button>
                ) : (
                  <p className="text-amber-600 text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Demande envoyée — En attente
                    de validation
                  </p>
                )}
                <Link to="/ressources">
                  <Button
                    variant="outline"
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                  >
                    Voir les Formations Modulaires
                  </Button>
                </Link>
              </div>
            </section>
          )}

          {/* Cours de la classe actuelle */}
          {!isLibre && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-[#1A237E] flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Mes Cours
                </h2>
                <span className="text-sm text-gray-500">
                  {completedCount}/{totalCount} terminé(s)
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-gray-200 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-[#1A237E] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              {loadingCours ? (
                <div className="text-center text-gray-500 py-10">
                  Chargement des cours...
                </div>
              ) : cours.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
                  Aucun cours disponible pour votre classe pour l'instant.
                </div>
              ) : (
                <div className="space-y-4">
                  {cours.map((c, i) => (
                    <Link key={c.id} to={`/cours/${c.id}`}>
                      <br />
                      <div
                        className={`bg-white rounded-xl p-5 shadow flex items-center gap-4 transition-all hover:shadow-md border-l-4 ${
                          progression[c.id]
                            ? "border-green-400"
                            : "border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            progression[c.id]
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {progression[c.id] ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1A237E] truncate">
                            {c.titre}
                          </p>
                          {c.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {c.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* À jour sur tous les cours */}
              {totalCount > 0 && completedCount === totalCount && (
                <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Vous êtes à jour sur tous les cours disponibles. De nouveaux cours seront ajoutés prochainement.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;