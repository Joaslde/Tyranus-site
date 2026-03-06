import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { completeCours } from "@/lib/progressionService";

// Convert YouTube URL to embed URL
const toEmbedUrl = (url) => {
  if (!url) return "";
  // Already an embed
  if (url.includes("youtube.com/embed/")) return url;
  // youtu.be shortlink
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=
  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return url;
};

const CoursPlayer = () => {
  const { id: coursId } = useParams();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [cours, setCours] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [classeTerminee, setClasseTerminee] = useState(false);

  useEffect(() => {
    if (!coursId || !user) return;
    supabase
      .from("cours")
      .select("*, classe:classe_id(id, nom, ordre, cycle_id)")
      .eq("id", coursId)
      .single()
      .then(({ data }) => {
        setCours(data);
        setLoading(false);
      });

    // Check if already completed (.maybeSingle évite le crash si 0 lignes)
    supabase
      .from("progression")
      .select("completed")
      .eq("user_id", user.id)
      .eq("cours_id", coursId)
      .maybeSingle()
      .then(({ data }) => setCompleted(data?.completed || false));
  }, [coursId, user]);

  const handleMarkComplete = async () => {
    setFinishing(true);
    const { classeTerminee: done } = await completeCours(
      user.id,
      coursId,
      cours.classe.id,
    );
    setCompleted(true);
    if (done) {
      setClasseTerminee(true);
      refreshProfile(); // update context: classe_id → null
    }
    setFinishing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!cours) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cours introuvable.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{cours.titre} — École Tyrannus</title>
      </Helmet>
      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {/* Top bar */}
        <div className="bg-[#1A237E] text-white py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link
              to="/etudiant/dashboard"
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-white/60">{cours.classe?.nom}</p>
              <h1 className="font-bold">{cours.titre}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
          {/* YouTube iframe */}
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
            <iframe
              src={`${toEmbedUrl(cours.url_youtube)}?rel=0`}
              title={cours.titre}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Fallback si YouTube bloque l'embed */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-sm text-amber-700">🎬 La vidéo ne s'affiche pas ?</p>
            <a
              href={cours.url_youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#1A237E] hover:underline"
            >
              Regarder sur YouTube →
            </a>
          </div>

          {/* Description + Mark as done */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-2">
              {cours.titre}
            </h2>
            {cours.description && (
              <p className="text-gray-600 text-sm mb-5">{cours.description}</p>
            )}

            {completed ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" /> Cours terminé
              </div>
            ) : (
              <Button
                onClick={handleMarkComplete}
                disabled={finishing}
                className="bg-[#1A237E] text-white"
              >
                {finishing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  "✅ Marquer comme terminé"
                )}
              </Button>
            )}
          </div>

          {/* Classe terminée banner */}
          {classeTerminee && (
            <div className="bg-gradient-to-r from-[#1A237E] to-blue-700 text-white rounded-xl p-6 text-center shadow-xl">
              <p className="text-4xl mb-2">🏆</p>
              <h3 className="text-xl font-serif font-bold mb-2">
                Classe terminée !
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Félicitations ! Vous avez terminé tous les cours de cette
                classe. Retournez sur votre tableau de bord pour demander le
                passage à la classe suivante.
              </p>
              <Link to="/etudiant/dashboard">
                <Button className="bg-[#D4AF37] text-[#1A237E] font-bold hover:bg-[#D4AF37]/90">
                  Aller au tableau de bord →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursPlayer;