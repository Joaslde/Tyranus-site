import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, CheckCircle, FileText, ExternalLink,
  PlayCircle, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { completeCours } from "@/lib/progressionService";

const toEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return null;
};

// Téléchargement forcé via fetch + blob (contourne l'ouverture dans onglet)
const forceDownload = async (url, nom) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = nom || "document.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback : ouverture dans un onglet
    window.open(url, "_blank");
  }
};


const CoursPlayer = () => {
  const { id: coursId } = useParams();
  const { user, refreshProfile } = useAuth();

  const [cours, setCours]           = useState(null);
  const [completed, setCompleted]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [finishing, setFinishing]   = useState(false);
  const [activeTab, setActiveTab]   = useState("video");

  useEffect(() => {
    if (!coursId || !user) return;

    supabase.from("cours")
      .select("*, classe:classe_id(id, nom, ordre, cycle_id)")
      .eq("id", coursId).single()
      .then(({ data }) => {
        setCours(data);
        // Onglet par défaut selon ce qui est disponible
        if (data && !data.url_youtube && Array.isArray(data.fichiers_pdf) && data.fichiers_pdf.length > 0) {
          setActiveTab("pdf");
        } else {
          setActiveTab("video");
        }
        setLoading(false);
      });

    supabase.from("progression").select("completed")
      .eq("user_id", user.id).eq("cours_id", coursId)
      .maybeSingle()
      .then(({ data }) => setCompleted(data?.completed || false));
  }, [coursId, user]);

  const handleMarkComplete = async () => {
    setFinishing(true);
    await completeCours(user.id, coursId, cours.classe.id);
    setCompleted(true);
    refreshProfile();
    setFinishing(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>
  );
  if (!cours) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Cours introuvable.</div>
  );

  const embedUrl = toEmbedUrl(cours.url_youtube);
  const hasVideo = !!embedUrl;

  // Rétro-compatibilité : fusion anciens cours (fichier_pdf_url) + nouveaux (fichiers_pdf)
  const pdfs = [
    ...(Array.isArray(cours.fichiers_pdf) ? cours.fichiers_pdf : []),
    ...(cours.fichier_pdf_url
      ? [{ url: cours.fichier_pdf_url, nom: cours.fichier_pdf_nom || "document.pdf" }]
      : []),
  ];
  const hasPdf  = pdfs.length > 0;
  const hasBoth = hasVideo && hasPdf;

  return (
    <>
      <Helmet><title>{cours.titre} — École Tyrannus</title></Helmet>
      <div className="bg-[#F5F5F5] min-h-screen pb-20">

        {/* Top bar */}
        <div className="bg-[#1A237E] text-white py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link to="/etudiant/dashboard" className="text-white/70 hover:text-white flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-white/60 truncate">{cours.classe?.nom}</p>
              <h1 className="font-bold truncate">{cours.titre}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">

          {/* Tabs — seulement si les deux existent */}
          {hasBoth && (
            <div className="flex gap-2 bg-white rounded-xl shadow p-2">
              <button onClick={() => setActiveTab("video")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "video" ? "bg-[#1A237E] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                <PlayCircle className="w-4 h-4" /> Vidéo
              </button>
              <button onClick={() => setActiveTab("pdf")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "pdf" ? "bg-[#1A237E] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                <FileText className="w-4 h-4" /> Document PDF
              </button>
            </div>
          )}

          {/* ── Vidéo ── */}
          {hasVideo && (!hasBoth || activeTab === "video") && (
            <>
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                <iframe
                  src={`${embedUrl}?rel=0`}
                  title={cours.titre}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-700 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> La vidéo ne s'affiche pas ?
                </p>
                <a href={cours.url_youtube} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#1A237E] hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> Ouvrir YouTube
                </a>
              </div>
            </>
          )}

          {/* ── PDFs ── */}
          {hasPdf && (!hasBoth || activeTab === "pdf") && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1A237E]" />
                  {pdfs.length} document{pdfs.length > 1 ? "s" : ""} PDF
                </p>
              </div>
              <div className="p-4 space-y-2">
                {pdfs.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <FileText className="w-4 h-4 text-[#1A237E] flex-shrink-0" />
                    <span className="text-sm text-gray-700 flex-1 truncate">{f.nom}</span>
                    <button
                      onClick={() => forceDownload(f.url, f.nom || `document-${i+1}.pdf`)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#1A237E] hover:underline flex-shrink-0">
                      <Download className="w-4 h-4" /> Télécharger
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ni vidéo ni PDF */}
          {!hasVideo && !hasPdf && (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
              Aucun contenu disponible pour ce cours.
            </div>
          )}

          {/* ── Description + Marquer terminé ── */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-serif font-bold text-[#1A237E] mb-2">{cours.titre}</h2>
            {cours.description && (
              <p className="text-gray-600 text-sm mb-5">{cours.description}</p>
            )}

            {completed ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" /> Cours terminé
              </div>
            ) : (
              <Button onClick={handleMarkComplete} disabled={finishing} className="bg-[#1A237E] text-white">
                {finishing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Marquer comme terminé
                  </span>
                )}
              </Button>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default CoursPlayer;