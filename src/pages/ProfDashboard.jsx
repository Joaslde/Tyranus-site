import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Plus, BookOpen, Users, LogOut, Eye, EyeOff, Layers,
  GraduationCap, X, AlertTriangle, ExternalLink, Globe,
  GlobeLock, Trash2, CheckCircle, Upload, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const toEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
};

const ConfirmModal = ({ open, title, message, danger, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-100" : "bg-amber-100"}`}>
            <AlertTriangle className={`w-4 h-4 ${danger ? "text-red-600" : "text-amber-600"}`} />
          </div>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-[#1A237E] hover:bg-[#1A237E]/90"}`}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

const PreviewModal = ({ cours, onClose, onPublishClick, toggling }) => {
  const [previewTab, setPreviewTab] = React.useState("video");

  React.useEffect(() => {
    if (cours) setPreviewTab(cours.url_youtube ? "video" : "pdf");
  }, [cours?.id]);

  if (!cours) return null;

  const embedUrl = toEmbedUrl(cours.url_youtube);
  const hasVideo = !!embedUrl;
  const pdfs = Array.isArray(cours.fichiers_pdf) ? cours.fichiers_pdf : [];
  const hasPdf = pdfs.length > 0;
  const hasBoth = hasVideo && hasPdf;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="font-bold text-[#1A237E] truncate">{cours.titre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Aperçu professeur</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs vidéo / PDF */}
        {hasBoth && (
          <div className="flex gap-2 px-4 pt-3 flex-shrink-0">
            <button onClick={() => setPreviewTab("video")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${previewTab === "video" ? "bg-[#1A237E] text-white" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}>
              <Eye className="w-3.5 h-3.5" /> Vidéo
            </button>
            <button onClick={() => setPreviewTab("pdf")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${previewTab === "pdf" ? "bg-[#1A237E] text-white" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}>
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        )}

        {/* Contenu scrollable */}
        <div className="overflow-y-auto flex-1">

          {/* Vidéo */}
          {hasVideo && (!hasBoth || previewTab === "video") && (
            <>
              <div className="bg-black aspect-video">
                <iframe src={`${embedUrl}?rel=0`} title={cours.titre}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
              <div className="flex items-center justify-between bg-amber-50 border-b border-amber-100 px-4 py-2">
                <p className="text-xs text-amber-700">Vidéo ne s'affiche pas ?</p>
                <a href={cours.url_youtube} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#1A237E] hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Ouvrir YouTube
                </a>
              </div>
            </>
          )}

          {/* PDFs — liste des documents */}
          {hasPdf && (!hasBoth || previewTab === "pdf") && (
            <div className="p-4 space-y-2">
              {pdfs.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  <FileText className="w-4 h-4 text-[#1A237E] flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{f.nom}</span>
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#1A237E] hover:underline flex items-center gap-1 flex-shrink-0">
                    <ExternalLink className="w-3 h-3" /> Ouvrir
                  </a>
                </div>
              ))}
            </div>
          )}

          {!hasVideo && !hasPdf && (
            <div className="p-8 text-center text-gray-400 text-sm">Aucun contenu disponible.</div>
          )}

          {/* Description + Publier */}
          <div className="px-5 py-4 space-y-3">
            {cours.description && <p className="text-sm text-gray-600">{cours.description}</p>}
            <button onClick={() => onPublishClick(cours)} disabled={toggling}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                cours.publie ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-[#1A237E] text-white hover:bg-[#1A237E]/90"
              }`}>
              {cours.publie
                ? <><GlobeLock className="w-4 h-4" /> Dépublier</>
                : <><Globe className="w-4 h-4" /> Publier pour les étudiants</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const SuccessModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: "16px" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">Cours ajouté !</h3>
        <p className="text-sm text-gray-500 mb-6">
          Votre cours a été enregistré. Il est en brouillon — publiez-le quand il est prêt.
        </p>
        <button onClick={onClose} className="w-full px-4 py-2.5 bg-[#1A237E] text-white rounded-xl text-sm font-medium hover:bg-[#1A237E]/90">
          D'accord
        </button>
      </div>
    </div>
  );
};


const ProfDashboard = ({ viewAsProfId = null }) => {
  const { user, profile, signOut } = useAuth();
  const effectiveUserId = viewAsProfId || user?.id;
  const [tab, setTab]               = useState("cours");
  const [mesClasses, setMesClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [cours, setCours]           = useState([]);
  const [etudiants, setEtudiants]   = useState([]);
  const [form, setForm]             = useState({ titre: "", description: "", url_youtube: "", classe_id: "" });
  const [saving, setSaving]         = useState(false);
  const [successModal, setSuccessModal]   = useState(false);
  const [pdfFiles, setPdfFiles]           = useState([]);
  const [uploadingPdf, setUploadingPdf]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewCours, setPreviewCours] = useState(null);
  const [toggling, setToggling]     = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: "", cours: null });

  useEffect(() => {
    if (!effectiveUserId) return;
    Promise.all([
      supabase.from("prof_classes").select("classe:classe_id(id, nom, ordre, est_modulaire, cycle:cycle_id(id, nom))").eq("prof_id", effectiveUserId),
      supabase.from("classes").select("id, nom, ordre, est_modulaire, cycle:cycle_id(id, nom)").eq("est_modulaire", true).order("ordre"),
    ]).then(([{ data: assigned }, { data: modulaires }]) => {
      const classesAssignees = (assigned || []).map(d => d.classe).filter(Boolean);
      const classesModulaires = modulaires || [];
      const all = [...classesAssignees, ...classesModulaires.filter(m => !classesAssignees.find(a => a.id === m.id))];
      setMesClasses(all);
      const first = all.find(c => !c.est_modulaire) || all[0];
      if (first) { setSelectedClasse(first.id); setForm(f => ({ ...f, classe_id: first.id })); }
    });
  }, [effectiveUserId]);

  useEffect(() => {
    if (!selectedClasse) return;
    supabase.from("cours").select("*").eq("classe_id", selectedClasse)
      .eq("created_by", effectiveUserId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setCours(data || []));
    supabase.from("profiles").select("id, nom, prenom, statut")
      .eq("classe_id", selectedClasse).eq("role", "etudiant")
      .then(({ data }) => setEtudiants(data || []));
  }, [selectedClasse]);

  const refreshCours = () => supabase.from("cours").select("*").eq("classe_id", selectedClasse)
    .eq("created_by", effectiveUserId)
    .order("created_at", { ascending: true }).then(({ data }) => setCours(data || []));

  const handleAddCours = async (e) => {
    e.preventDefault();
    if (!form.classe_id) return;
    if (!form.url_youtube && pdfFiles.length === 0) {
      alert("Veuillez ajouter une vidéo YouTube ou au moins un fichier PDF.");
      return;
    }
    setSaving(true);

    // Upload des PDFs (max 6) → tableau [{url, nom}]
    let fichiers_pdf = [];
    if (pdfFiles.length > 0) {
      setUploadingPdf(true);
      for (let i = 0; i < pdfFiles.length; i++) {
        setUploadProgress(Math.round((i / pdfFiles.length) * 100));
        const file = pdfFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${form.classe_id}/${Date.now()}-${i}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("cours-pdf").upload(path, file, { upsert: false });
        if (uploadError) { console.error("Upload PDF:", uploadError.message); continue; }
        const { data: urlData } = supabase.storage.from("cours-pdf").getPublicUrl(uploadData.path);
        fichiers_pdf.push({ url: urlData.publicUrl, nom: file.name });
      }
      setUploadProgress(100);
      setUploadingPdf(false);
    }

    const { error } = await supabase.from("cours").insert({
      titre: form.titre, description: form.description,
      url_youtube: form.url_youtube || null,
      fichiers_pdf,
      classe_id: form.classe_id,
      created_by: effectiveUserId, publie: false,
    });

    if (!error) {
      setSuccessModal(true);
      setForm(f => ({ ...f, titre: "", description: "", url_youtube: "" }));
      setPdfFiles([]);
      setUploadProgress(0);
      refreshCours();
    } else {
      console.error("Erreur ajout cours:", error.message);
    }
    setSaving(false);
  };

  const doTogglePublish = async (c) => {
    setToggling(true);
    await supabase.from("cours").update({ publie: !c.publie }).eq("id", c.id);
    setCours(prev => prev.map(x => x.id === c.id ? { ...x, publie: !x.publie } : x));
    if (previewCours?.id === c.id) setPreviewCours(p => ({ ...p, publie: !p.publie }));
    setToggling(false);
  };

  const handlePublishClick = (c) => setConfirmModal({
    open: true, type: c.publie ? "depublier" : "publier", cours: c,
  });

  const handleDeleteClick = (c) => setConfirmModal({ open: true, type: "supprimer", cours: c });

  const handleConfirm = async () => {
    const c = confirmModal.cours;
    setConfirmModal({ open: false, type: "", cours: null });
    if (confirmModal.type === "supprimer") {
      await supabase.from("cours").delete().eq("id", c.id);
      setCours(prev => prev.filter(x => x.id !== c.id));
      if (previewCours?.id === c.id) setPreviewCours(null);
    } else {
      await doTogglePublish(c);
    }
  };

  return (
    <>
      <Helmet><title>Dashboard Professeur — École Tyrannus</title></Helmet>

      {/* Ordre DOM : PreviewModal en premier → ConfirmModal + SuccessModal en dernier (peint au-dessus) */}
      <PreviewModal cours={previewCours} onClose={() => setPreviewCours(null)}
        onPublishClick={handlePublishClick} toggling={toggling} />

      <ConfirmModal open={confirmModal.open}
        danger={confirmModal.type === "supprimer"}
        title={
          confirmModal.type === "supprimer" ? "Supprimer ce cours ?"
          : confirmModal.type === "publier" ? "Publier ce cours ?"
          : "Dépublier ce cours ?"
        }
        message={
          confirmModal.type === "supprimer"
            ? `"${confirmModal.cours?.titre}" sera définitivement supprimé.`
            : confirmModal.type === "publier"
            ? `"${confirmModal.cours?.titre}" sera visible par tous les étudiants.`
            : `"${confirmModal.cours?.titre}" ne sera plus visible par les étudiants.`
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ open: false, type: "", cours: null })}
      />
      <SuccessModal open={successModal} onClose={() => setSuccessModal(false)} />

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {!viewAsProfId && (
          <div className="bg-[#1A237E] text-white py-8 px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Espace Professeur</p>
                <h1 className="text-2xl font-serif font-bold">{profile?.prenom} {profile?.nom}</h1>
              </div>
              <button onClick={signOut} className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Sélectionner une classe ou un module</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><GraduationCap className="w-4 h-4 text-[#1A237E]" /> Classe</label>
                <select value={!mesClasses.find(c => c.id === selectedClasse)?.est_modulaire ? selectedClasse : ""}
                  onChange={e => { if (!e.target.value) return; setSelectedClasse(e.target.value); setForm(f => ({ ...f, classe_id: e.target.value })); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                  <option value="">— Choisir une classe —</option>
                  {mesClasses.filter(c => !c.est_modulaire).map(c => <option key={c.id} value={c.id}>{c.nom} — {c.cycle?.nom}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Layers className="w-4 h-4 text-[#1A237E]" /> Formation modulaire</label>
                <select value={mesClasses.find(c => c.id === selectedClasse)?.est_modulaire ? selectedClasse : ""}
                  onChange={e => { if (!e.target.value) return; setSelectedClasse(e.target.value); setForm(f => ({ ...f, classe_id: e.target.value })); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                  <option value="">— Choisir un module —</option>
                  {mesClasses.filter(c => c.est_modulaire).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
            </div>
            {selectedClasse && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#1A237E] bg-blue-50 rounded-lg px-3 py-2">
                {mesClasses.find(c => c.id === selectedClasse)?.est_modulaire ? <Layers className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                <span>Sélection active : <strong>{mesClasses.find(c => c.id === selectedClasse)?.nom}</strong>{" — "}{mesClasses.find(c => c.id === selectedClasse)?.cycle?.nom}</span>
              </div>
            )}
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            {[["cours","Cours",BookOpen],["etudiants","Étudiants",Users],["ajouter","Ajouter un cours",Plus]].map(([key,label,Icon]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-[#1A237E] text-[#1A237E]" : "border-transparent text-gray-500 hover:text-[#1A237E]"}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === "cours" && (
            <div className="space-y-3">
              {cours.length === 0 && <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">Aucun cours pour cette classe.</div>}
              {cours.map((c, i) => (
                <div key={c.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 flex-shrink-0">{i + 1}</div>

                  <button onClick={() => setPreviewCours(c)} className="flex-1 min-w-0 text-left group">
                    <p className="font-medium text-[#1A237E] truncate group-hover:underline">{c.titre}</p>
                    <p className="text-xs text-gray-400 truncate">{c.url_youtube}</p>
                  </button>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${c.publie ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.publie ? "Publié" : "Brouillon"}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setPreviewCours(c)} title="Aperçu"
                      className="text-gray-400 hover:text-[#1A237E] p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handlePublishClick(c)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${c.publie ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                      {c.publie ? <><EyeOff className="w-3.5 h-3.5" /> Dépublier</> : <><Globe className="w-3.5 h-3.5" /> Publier</>}
                    </button>
                    <button onClick={() => handleDeleteClick(c)} title="Supprimer"
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "etudiants" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#1A237E] text-white">
                  <tr>
                    <th className="text-left p-4">Étudiant</th>
                    <th className="text-left p-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {etudiants.length === 0 && <tr><td colSpan={2} className="text-center text-gray-400 p-8">Aucun étudiant dans cette classe.</td></tr>}
                  {etudiants.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#1A237E]">{e.prenom} {e.nom}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${e.statut === "valide" ? "bg-green-100 text-green-700" : e.statut === "rejete" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                          {e.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "ajouter" && (
            <div className="bg-white rounded-xl shadow p-6 max-w-lg">
              <h2 className="text-lg font-bold text-[#1A237E] mb-5">Ajouter un cours vidéo</h2>
              <form onSubmit={handleAddCours} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Titre du cours *</label>
                  <input required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                    placeholder="Introduction à l'Exégèse" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none resize-none"
                    placeholder="Courte description du cours..." />
                </div>
                {/* Source du cours — vidéo OU PDF (au moins un requis) */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Contenu du cours — vidéo et/ou PDF (au moins un)
                  </p>

                  {/* YouTube */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5 block">
                      <Globe className="w-3.5 h-3.5 text-[#1A237E]" /> Lien YouTube
                    </label>
                    <input value={form.url_youtube} onChange={e => setForm(f => ({ ...f, url_youtube: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                      placeholder="https://www.youtube.com/watch?v=..." />
                  </div>

                  {/* PDF multi-fichiers (max 6) */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 flex items-center justify-between block">
                      <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#1A237E]" /> Fichiers PDF</span>
                      <span className="text-gray-400 font-normal">{pdfFiles.length}/6</span>
                    </label>

                    {pdfFiles.length < 6 && (
                      <label className="flex items-center gap-3 w-full px-3 py-2.5 border-2 border-dashed border-gray-300 hover:border-[#1A237E] rounded-lg text-sm cursor-pointer transition-colors bg-white">
                        <Upload className="w-4 h-4 text-[#1A237E] flex-shrink-0" />
                        <span className="text-gray-400 truncate">
                          Ajouter des PDFs ({6 - pdfFiles.length} restant{6 - pdfFiles.length > 1 ? "s" : ""})
                        </span>
                        <input type="file" accept=".pdf" multiple className="hidden"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files).filter(f => f.type === "application/pdf");
                            const total = [...pdfFiles, ...selected];
                            setPdfFiles(total.length > 6 ? total.slice(0, 6) : total);
                            e.target.value = "";
                          }} />
                      </label>
                    )}

                    {pdfFiles.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {pdfFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                            <FileText className="w-3.5 h-3.5 text-[#1A237E] flex-shrink-0" />
                            <span className="text-xs text-gray-700 flex-1 truncate">{f.name}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{(f.size / 1024 / 1024).toFixed(1)} Mo</span>
                            <button type="button" onClick={() => setPdfFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-red-400 hover:text-red-600 flex-shrink-0">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadingPdf && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Upload en cours...</span><span>{uploadProgress}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#1A237E] h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={saving || uploadingPdf} className="w-full bg-[#1A237E] text-white">
                  {uploadingPdf ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Upload {uploadProgress}%...</span>
                  ) : saving ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enregistrement...</span>
                  ) : "Ajouter le cours"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfDashboard;