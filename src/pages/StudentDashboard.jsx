import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Award, ChevronRight, LogOut, Clock,
  CheckCircle, Trophy, ArrowRight, Layers, AlertTriangle, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  demanderPassageCycle,
  demanderPassageModulaire,
  annulerDemande,
  getFinAnneeActive,
} from "@/lib/progressionService";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, danger }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-100" : "bg-blue-100"}`}>
            <AlertTriangle className={`w-4 h-4 ${danger ? "text-red-600" : "text-[#1A237E]"}`} />
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

const StudentDashboard = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();

  const [cours, setCours]               = useState([]);
  const [progression, setProgression]   = useState({});
  const [historique, setHistorique]     = useState([]);
  const [classeInfo, setClasseInfo]     = useState(null);
  const [finAnneeActive, setFinAnneeActive] = useState(false);
  const [nextClasseExists, setNextClasseExists] = useState(false);
  const [modulesDisponibles, setModulesDisponibles] = useState([]);
  // demandePending stocke { id, type } pour pouvoir annuler
  const [demandePending, setDemandePending] = useState(null);
  const [loadingCours, setLoadingCours] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "", title: "", message: "", danger: false });

  // ── Chargement initial ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    supabase.from("historique_classes")
      .select("*, classe:classe_id(nom, cycle:cycle_id(nom))")
      .eq("user_id", user.id).order("validee_le", { ascending: false })
      .then(({ data }) => setHistorique(data || []));

    // Charge la demande en attente avec l'ID pour pouvoir annuler
    supabase.from("demandes_passage")
      .select("id, type")
      .eq("user_id", user.id).eq("statut", "en_attente")
      .maybeSingle()
      .then(({ data }) => setDemandePending(data || null));

    getFinAnneeActive().then(setFinAnneeActive);
  }, [user]);

  // ── Classe + cycle (fix bug #11 : on sélectionne cycle_id explicitement) ─────
  useEffect(() => {
    if (!profile?.classe_id) { setClasseInfo(null); return; }

    supabase.from("classes")
      // cycle_id en champ direct + objet jointé pour l'affichage
      .select("id, nom, ordre, cycle_id, est_modulaire, cycle:cycle_id(id, nom, ordre)")
      .eq("id", profile.classe_id).single()
      .then(({ data }) => {
        setClasseInfo(data || null);
        if (data && !data.est_modulaire) {
          supabase.from("classes").select("id")
            .eq("cycle_id", data.cycle_id)
            .eq("ordre", data.ordre + 1)
            .maybeSingle()
            .then(({ data: next }) => setNextClasseExists(!!next));
        }
      });
  }, [profile?.classe_id]);

  // ── Cours + progression ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !profile?.classe_id) { setLoadingCours(false); return; }
    supabase.from("cours").select("*")
      .eq("classe_id", profile.classe_id).eq("publie", true).order("created_at", { ascending: true })
      .then(async ({ data: coursData }) => {
        setCours(coursData || []);
        if (coursData && coursData.length > 0) {
          const { data: prog } = await supabase
            .from("progression").select("cours_id, completed")
            .eq("user_id", user.id)
            .in("cours_id", coursData.map(c => c.id));
          const map = {};
          (prog || []).forEach(p => { map[p.cours_id] = p.completed; });
          setProgression(map);
        }
        setLoadingCours(false);
      });
  }, [user, profile?.classe_id]);

  // ── Modules disponibles ──────────────────────────────────────────────────────
  useEffect(() => {
    supabase.from("classes").select("id, nom")
      .eq("est_modulaire", true)
      .neq("id", profile?.classe_id || "00000000-0000-0000-0000-000000000000")
      .order("nom")
      .then(({ data }) => setModulesDisponibles(data || []));
  }, [profile?.classe_id]);

  const completedCount  = Object.values(progression).filter(Boolean).length;
  const totalCount      = cours.length;
  const percent         = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const tousCoursTermines = totalCount > 0 && completedCount === totalCount;
  const estModulaire    = classeInfo?.est_modulaire || false;

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleDemanderCycle = () => setModal({
    open: true, type: "cycle", danger: false,
    title: "Passer en classe suivante",
    message: `Demander à rejoindre la classe suivante dans le ${classeInfo?.cycle?.nom}. L'administrateur devra valider.`,
  });

  const handleDemanderModulaire = () => {
    const module = modulesDisponibles.find(m => m.id === selectedModuleId);
    setModal({
      open: true, type: "modulaire", danger: false,
      title: "S'inscrire à un module",
      message: `Demander à rejoindre le module "${module?.nom}". L'administrateur devra valider.`,
    });
  };

  const handleAnnuler = () => setModal({
    open: true, type: "annuler", danger: true,
    title: "Annuler la demande",
    message: "Êtes-vous sûr de vouloir annuler votre demande de passage ?",
  });

  const handleConfirm = async () => {
    setModal(m => ({ ...m, open: false }));
    setLoadingAction(true);

    if (modal.type === "cycle") {
      const { error, id } = await demanderPassageCycle(user.id, classeInfo);
      if (!error) setDemandePending({ id, type: "cycle" });

    } else if (modal.type === "modulaire") {
      const { error, id } = await demanderPassageModulaire(user.id, profile.classe_id, selectedModuleId);
      if (!error) {
        setDemandePending({ id, type: "modulaire" });
        setShowModuleDropdown(false);
      }

    } else if (modal.type === "annuler") {
      if (!demandePending?.id) {
        // Re-fetch l'id si on ne l'a pas (sécurité)
        const { data } = await supabase.from("demandes_passage")
          .select("id").eq("user_id", user.id).eq("statut", "en_attente").maybeSingle();
        if (data?.id) {
          await annulerDemande(data.id);
        }
      } else {
        await annulerDemande(demandePending.id);
      }
      setDemandePending(null);
    }

    setLoadingAction(false);
  };

  // ── Section passation ────────────────────────────────────────────────────────
  const renderPassationSection = () => {
    if (!tousCoursTermines) return null;

    if (demandePending) {
      return (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-700">
                {demandePending.type === "modulaire"
                  ? "Votre demande d'inscription au module est en attente."
                  : "Votre demande de passage est en attente de validation."}
              </p>
              <p className="text-xs text-amber-600 mt-1">Elle sera traitée prochainement par l'administration.</p>
            </div>
            <button onClick={handleAnnuler} disabled={loadingAction}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium flex-shrink-0">
              <X className="w-3.5 h-3.5" /> Annuler
            </button>
          </div>
        </div>
      );
    }

    if (estModulaire) {
      return (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-gray-700">Vous avez terminé tous les cours de ce module.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A237E] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Choisir un autre module
            </p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <select value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                <option value="">— Sélectionner un module —</option>
                {modulesDisponibles.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
              <Button onClick={handleDemanderModulaire} disabled={!selectedModuleId || loadingAction}
                className="bg-[#1A237E] text-white flex-shrink-0">
                {loadingAction ? "Envoi..." : "Demander →"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (!finAnneeActive) {
      return (
        <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Vous êtes à jour sur tous les cours disponibles. De nouveaux cours seront ajoutés prochainement.
          </p>
        </div>
      );
    }

    if (!nextClasseExists) {
      return (
        <div className="mt-4 space-y-3">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-50 border border-[#D4AF37] rounded-xl p-5 text-center">
            <Trophy className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
            <p className="font-bold text-[#1A237E] text-lg font-serif">Félicitations !</p>
            <p className="text-sm text-gray-600 mt-1">
              Vous avez terminé le cursus complet du <strong>{classeInfo?.cycle?.nom}</strong>.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1A237E]" /> Souhaitez-vous suivre une formation modulaire ?
            </p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <select value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                <option value="">— Sélectionner un module —</option>
                {modulesDisponibles.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
              <Button onClick={handleDemanderModulaire} disabled={!selectedModuleId || loadingAction}
                className="bg-[#1A237E] text-white flex-shrink-0">
                {loadingAction ? "Envoi..." : "Demander →"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-gray-700">
            Tous les cours terminés — l'année académique est close.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleDemanderCycle} disabled={loadingAction}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1A237E] text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#1A237E]/90 transition-colors">
            <ArrowRight className="w-4 h-4" /> Passer en classe suivante
          </button>
          <button onClick={() => setShowModuleDropdown(v => !v)}
            className="flex-1 flex items-center justify-center gap-2 border border-[#1A237E] text-[#1A237E] px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
            <Layers className="w-4 h-4" /> Suivre un module
          </button>
        </div>
        {showModuleDropdown && (
          <div className="flex gap-2 flex-col sm:flex-row">
            <select value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
              <option value="">— Sélectionner un module —</option>
              {modulesDisponibles.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
            <Button onClick={handleDemanderModulaire} disabled={!selectedModuleId || loadingAction}
              className="bg-[#1A237E] text-white flex-shrink-0">
              {loadingAction ? "Envoi..." : "Demander →"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet><title>Mon Espace — École Tyrannus</title></Helmet>

      <ConfirmModal open={modal.open} title={modal.title} message={modal.message}
        danger={modal.danger} onConfirm={handleConfirm}
        onCancel={() => setModal(m => ({ ...m, open: false }))} />

      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        <div className="bg-[#1A237E] text-white py-10">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">Bienvenue,</p>
              <h1 className="text-2xl font-serif font-bold">{profile?.prenom} {profile?.nom}</h1>
              {classeInfo && (
                <p className="text-[#D4AF37] text-sm mt-1">
                  {classeInfo.est_modulaire
                    ? `Module — ${classeInfo.nom}`
                    : `${classeInfo.cycle?.nom} — ${classeInfo.nom}`}
                </p>
              )}
              {!profile?.classe_id && (
                <p className="text-amber-300 text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> En attente d'assignation
                </p>
              )}
            </div>
            <button onClick={signOut} className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">

          {historique.length > 0 && (
            <section>
              <h2 className="text-lg font-serif font-bold text-[#1A237E] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D4AF37]" /> Parcours validé
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {historique.map(d => (
                  <div key={d.id} className="bg-white rounded-xl p-4 shadow flex items-center gap-4 border-l-4 border-[#D4AF37]">
                    <Award className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A237E] truncate">{d.classe?.nom}</p>
                      <p className="text-xs text-gray-500">
                        {d.classe?.cycle?.nom} · Validé le {new Date(d.validee_le).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!profile?.classe_id && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400 text-center">
              <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h2 className="text-lg font-serif font-bold text-[#1A237E] mb-2">En attente d'assignation</h2>
              <p className="text-gray-600 text-sm">Votre compte est validé. L'administrateur vous assignera bientôt à une classe.</p>
            </div>
          )}

          {profile?.classe_id && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-[#1A237E] flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Mes Cours
                </h2>
                <span className="text-sm text-gray-500">{completedCount}/{totalCount} terminé(s)</span>
              </div>

              <div className="bg-gray-200 rounded-full h-2 mb-6">
                <motion.div className="bg-[#1A237E] h-2 rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} />
              </div>

              {loadingCours ? (
                <div className="text-center text-gray-500 py-10">Chargement des cours...</div>
              ) : cours.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
                  Aucun cours disponible pour votre classe pour l'instant.
                </div>
              ) : (
                <div className="space-y-4">
                  {cours.map((c, i) => (
                    <Link key={c.id} to={`/cours/${c.id}`}>
                      <div className={`bg-white rounded-xl p-5 shadow flex items-center gap-4 transition-all hover:shadow-md border-l-4 ${progression[c.id] ? "border-green-400" : "border-gray-200"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${progression[c.id] ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {progression[c.id] ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1A237E] truncate">{c.titre}</p>
                          {c.description && <p className="text-xs text-gray-500 truncate">{c.description}</p>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      </div> <br />
                    </Link>
                  ))}
                </div>
              )}

              {renderPassationSection()}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;