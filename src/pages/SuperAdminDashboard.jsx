import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Users, BookOpen, Clock, CheckCircle, XCircle, LogOut,
  GraduationCap, AlertTriangle, ShieldOff, Filter, ChevronDown,
  CalendarCheck, CalendarX, UserCog, ArrowRight, Layers,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { setFinAnneeActive } from "@/lib/progressionService";

// ─── Modal générique ──────────────────────────────────────────────────────────
const Modal = ({ open, title, onCancel, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="font-bold text-gray-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// ─── Modal confirmation action bulk ──────────────────────────────────────────
const ConfirmModal = ({ open, action, targets, onConfirm, onCancel }) => {
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (!open) return;
    if (targets.length > 3) {
      setCountdown(5);
      const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
      return () => clearInterval(t);
    } else setCountdown(0);
  }, [open, targets.length]);

  if (!open) return null;
  const meta = {
    valide:  { label: "Valider",   color: "bg-green-600 hover:bg-green-700",   Icon: CheckCircle },
    rejete:  { label: "Rejeter",   color: "bg-red-600 hover:bg-red-700",       Icon: XCircle },
    suspend: { label: "Suspendre", color: "bg-orange-600 hover:bg-orange-700", Icon: ShieldOff },
  };
  const a = meta[action] || {};
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Confirmer l'action</h2>
            <p className="text-xs text-gray-500">{targets.length} élément(s)</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-5 max-h-40 overflow-y-auto space-y-1">
          {targets.map(t => (
            <div key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
              <span>{t.prenom} {t.nom}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={onConfirm} disabled={countdown > 0}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${countdown > 0 ? "bg-gray-300 cursor-not-allowed" : a.color}`}>
            {countdown > 0 ? `Attendre ${countdown}s...` : `${a.label} (${targets.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatutBadge = ({ statut }) => {
  const s = { valide: "bg-green-100 text-green-700", rejete: "bg-red-100 text-red-700", en_attente: "bg-amber-100 text-amber-700" };
  const l = { valide: "Validé", rejete: "Rejeté", en_attente: "En attente" };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${s[statut] || "bg-gray-100 text-gray-500"}`}>{l[statut] || statut}</span>;
};

const BulkBar = ({ selected, onAction, onClear }) => {
  if (!selected.length) return null;
  return (
    <div className="flex items-center gap-3 bg-[#1A237E] text-white rounded-xl px-4 py-3 flex-wrap">
      <span className="text-sm font-medium">{selected.length} sélectionné(s)</span>
      <div className="flex gap-2 ml-auto flex-wrap">
        {[["valide","Valider","bg-green-500 hover:bg-green-600",CheckCircle],["rejete","Rejeter","bg-red-500 hover:bg-red-600",XCircle],["suspend","Suspendre","bg-orange-500 hover:bg-orange-600",ShieldOff]].map(([a,l,c,I]) => (
          <button key={a} onClick={() => onAction(a)} className={`flex items-center gap-1.5 text-xs ${c} px-3 py-1.5 rounded-lg font-medium`}>
            <I className="w-3.5 h-3.5" /> {l}
          </button>
        ))}
        <button onClick={onClear} className="text-xs text-white/70 hover:text-white px-2">Annuler</button>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [tab, setTab]             = useState("etudiants");
  const [etudiants, setEtudiants] = useState([]);
  const [profs, setProfs]         = useState([]);
  const [demandes, setDemandes]   = useState([]);
  const [cycles, setCycles]       = useState([]);
  const [classes, setClasses]     = useState([]);
  const [stats, setStats]         = useState({ etudiants: 0, profs: 0, cours: 0, pending: 0 });
  const [saving, setSaving]       = useState(false);
  const [passationModal, setPassationModal] = useState({ open: false, action: null, demande: null });
  const [finAnnee, setFinAnnee]   = useState(false);
  const [togglingAnnee, setTogglingAnnee] = useState(false);

  const [filterStatut, setFilterStatut] = useState("en_attente");
  const [filterCycle, setFilterCycle]   = useState("");
  const [filterClasse, setFilterClasse] = useState("");

  const [selectedEtudiants, setSelectedEtudiants] = useState([]);
  const [selectedProfs, setSelectedProfs]         = useState([]);

  const [modal, setModal]         = useState({ open: false, action: "", targets: [], type: "" });
  const [finAnneeModal, setFinAnneeModal] = useState(false);

  // Assignation manuelle
  const [assignModal, setAssignModal]       = useState(false);
  const [assignEtudiant, setAssignEtudiant] = useState(null);
  const [assignClasseId, setAssignClasseId] = useState("");

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    const [{ data: e }, { data: p }, { data: d }, { data: c }, { data: cy }, { data: cl }, { data: s }] =
      await Promise.all([
        supabase.from("profiles").select("id, nom, prenom, telephone, statut, created_at, classe_id, classe:classe_id(id, nom, cycle:cycle_id(id, nom))").eq("role", "etudiant").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, nom, prenom, telephone, statut, created_at").eq("role", "professeur").order("created_at", { ascending: false }),
        supabase.from("demandes_passage").select("id, statut, created_at, user_id, classe_actuelle_id, classe_voulue_id, type, classe_actuelle:classe_actuelle_id(id, nom, ordre, cycle_id), classe_voulue:classe_voulue_id(id, nom)").eq("statut", "en_attente").order("created_at", { ascending: false }),
        supabase.from("cours").select("id", { count: "exact" }),
        supabase.from("cycles").select("id, nom").order("ordre"),
        supabase.from("classes").select("id, nom, cycle_id, ordre, est_modulaire").order("ordre"),
        supabase.from("settings").select("valeur").eq("cle", "fin_annee_active").single(),
      ]);
    // Enrichir les demandes avec les profils utilisateurs
    const demandesRaw = d || [];
    let demandesEnrichies = demandesRaw;
    if (demandesRaw.length > 0) {
      const userIds = [...new Set(demandesRaw.map(x => x.user_id))];
      const { data: usersData } = await supabase
        .from("profiles").select("id, nom, prenom").in("id", userIds);
      const usersMap = {};
      (usersData || []).forEach(u => { usersMap[u.id] = u; });
      demandesEnrichies = demandesRaw.map(dem => ({
        ...dem,
        user: usersMap[dem.user_id] || null,
      }));
    }
    setEtudiants(e || []); setProfs(p || []); setDemandes(demandesEnrichies);
    setCycles(cy || []); setClasses(cl || []);
    setFinAnnee(s?.valeur === "true");
    setStats({ etudiants: (e||[]).length, profs: (p||[]).length, cours: (c||[]).length, pending: (e||[]).filter(x => x.statut === "en_attente").length });
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSelectedEtudiants([]); setSelectedProfs([]); }, [tab]);
  useEffect(() => { setFilterClasse(""); }, [filterCycle]);

  // ── Toggle fin d'année ───────────────────────────────────────────────────────
  const handleToggleFinAnnee = async () => {
    setTogglingAnnee(true);
    setFinAnneeModal(false);
    const newVal = !finAnnee;
    const { error } = await setFinAnneeActive(newVal);
    if (!error) setFinAnnee(newVal);
    setTogglingAnnee(false);
  };

  // ── Filtrage ────────────────────────────────────────────────────────────────
  const classesDuCycle = filterCycle ? classes.filter(c => c.cycle_id === filterCycle) : classes;
  const filteredEtudiants = etudiants.filter(e => {
    if (filterStatut && e.statut !== filterStatut) return false;
    if (filterCycle  && e.classe?.cycle?.id !== filterCycle) return false;
    if (filterClasse && e.classe_id !== filterClasse) return false;
    return true;
  });

  // ── Checkboxes ──────────────────────────────────────────────────────────────
  const toggleSelect = (id, list, setList) => setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = (data, list, setList) => setList(list.length === data.length ? [] : data.map(x => x.id));

  // ── Modal bulk ───────────────────────────────────────────────────────────────
  const openModal = (action, ids, dataList, type) =>
    setModal({ open: true, action, targets: dataList.filter(x => ids.includes(x.id)), type });

  const handleConfirm = async () => {
    setSaving(true);
    setModal(m => ({ ...m, open: false }));
    const ids    = modal.targets.map(t => t.id);
    const statut = modal.action === "suspend" ? "rejete" : modal.action;
    await supabase.from("profiles").update({ statut }).in("id", ids);
    if (modal.type === "etudiant") { setEtudiants(prev => prev.map(e => ids.includes(e.id) ? { ...e, statut } : e)); setSelectedEtudiants([]); }
    else { setProfs(prev => prev.map(p => ids.includes(p.id) ? { ...p, statut } : p)); setSelectedProfs([]); }
    setSaving(false);
  };

  // ── Validation passation ─────────────────────────────────────────────────────
  const validerPassage = async (d) => {
    setSaving(true);

    // Archiver la classe actuelle dans historique
    await supabase.from("historique_classes").insert({
      user_id: d.user_id,
      classe_id: d.classe_actuelle_id,
      type: d.type || "cycle",
      validee_le: new Date().toISOString(),
    });

    let nouvelleClasseId = null;

    if (d.type === "modulaire" && d.classe_voulue_id) {
      // Modulaire : on prend la classe voulue directement
      nouvelleClasseId = d.classe_voulue_id;
    } else {
      // Cycle : on cherche la classe suivante (ordre + 1)
      const classeAct = d.classe_actuelle;
      if (classeAct) {
        const { data: next } = await supabase.from("classes").select("id")
          .eq("cycle_id", classeAct.cycle_id)
          .eq("ordre", classeAct.ordre + 1)
          .maybeSingle();
        nouvelleClasseId = next?.id || null;
      }
    }

    await supabase.from("profiles").update({ classe_id: nouvelleClasseId }).eq("id", d.user_id);
    await supabase.from("demandes_passage").update({ statut: "validee" }).eq("id", d.id);
    setDemandes(prev => prev.filter(x => x.id !== d.id));
    setSaving(false);
  };

  const rejeterPassage = async (id) => {
    setSaving(true);
    await supabase.from("demandes_passage").update({ statut: "rejetee" }).eq("id", id);
    setDemandes(prev => prev.filter(x => x.id !== id));
    setSaving(false);
  };

  // ── Assignation manuelle ─────────────────────────────────────────────────────
  const handleAssignManuel = async () => {
    if (!assignEtudiant || !assignClasseId) return;
    setSaving(true);
    await supabase.from("profiles").update({ classe_id: assignClasseId }).eq("id", assignEtudiant.id);
    setEtudiants(prev => prev.map(e => e.id === assignEtudiant.id ? { ...e, classe_id: assignClasseId } : e));
    setAssignModal(false);
    setAssignEtudiant(null);
    setAssignClasseId("");
    setSaving(false);
  };

  const STAT_CARDS = [
    { label: "Étudiants",  value: stats.etudiants, icon: GraduationCap, color: "bg-blue-50 text-[#1A237E]" },
    { label: "Professeurs",value: stats.profs,      icon: Users,         color: "bg-purple-50 text-purple-700" },
    { label: "Cours",      value: stats.cours,      icon: BookOpen,      color: "bg-green-50 text-green-700" },
    { label: "En attente", value: stats.pending,    icon: Clock,         color: "bg-amber-50 text-amber-700" },
  ];

  // ── Card étudiant mobile ─────────────────────────────────────────────────────
  const EtudiantCard = ({ e }) => (
    <div className={`bg-white rounded-xl shadow p-4 border-l-4 ${selectedEtudiants.includes(e.id) ? "border-[#1A237E] bg-blue-50" : "border-transparent"}`}>
      <div className="flex gap-3">
        <input type="checkbox" checked={selectedEtudiants.includes(e.id)} onChange={() => toggleSelect(e.id, selectedEtudiants, setSelectedEtudiants)} className="mt-1 rounded border-gray-300 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-semibold text-[#1A237E] text-sm">{e.prenom} {e.nom}</p>
            <StatutBadge statut={e.statut} />
          </div>
          <p className="text-xs text-gray-400">{e.telephone}</p>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">{e.classe ? `${e.classe.cycle?.nom} — ${e.classe.nom}` : <span className="italic">Non assigné</span>}</p>
          <div className="flex gap-2 flex-wrap">
            {e.statut === "en_attente" && (<>
              <button onClick={() => openModal("valide", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium"><CheckCircle className="w-3 h-3" /> Valider</button>
              <button onClick={() => openModal("rejete", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium"><XCircle className="w-3 h-3" /> Rejeter</button>
            </>)}
            {e.statut === "valide" && (<>
              <button onClick={() => openModal("suspend", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium"><ShieldOff className="w-3 h-3" /> Suspendre</button>
              <button onClick={() => { setAssignEtudiant(e); setAssignModal(true); }} className="flex items-center gap-1 text-xs bg-blue-100 text-[#1A237E] px-3 py-1.5 rounded-lg font-medium"><UserCog className="w-3 h-3" /> Assigner</button>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Super Admin — École Tyrannus</title></Helmet>

      <ConfirmModal open={modal.open} action={modal.action} targets={modal.targets}
        onConfirm={handleConfirm} onCancel={() => setModal(m => ({ ...m, open: false }))} />

      {/* Modal fin d'année */}
      <Modal open={finAnneeModal} title={finAnnee ? "Désactiver la fin d'année ?" : "Activer la fin d'année ?"}
        onCancel={() => setFinAnneeModal(false)}>
        <p className="text-sm text-gray-600 mb-5">
          {finAnnee
            ? "Les étudiants ne verront plus les boutons de passation de classe. La période de réinscription pourra commencer."
            : "Les étudiants ayant terminé leurs cours verront apparaître les boutons de passation de classe."
          }
        </p>
        <div className="flex gap-3">
          <button onClick={() => setFinAnneeModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={handleToggleFinAnnee} disabled={togglingAnnee}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white ${finAnnee ? "bg-gray-600 hover:bg-gray-700" : "bg-[#1A237E] hover:bg-[#1A237E]/90"}`}>
            {togglingAnnee ? "..." : finAnnee ? "Désactiver" : "Activer"}
          </button>
        </div>
      </Modal>

      {/* Modal assignation manuelle */}
      <Modal open={assignModal} title={`Assigner une classe — ${assignEtudiant?.prenom} ${assignEtudiant?.nom}`}
        onCancel={() => { setAssignModal(false); setAssignEtudiant(null); setAssignClasseId(""); }}>
        <p className="text-sm text-gray-500 mb-4">
          Classe actuelle : {assignEtudiant?.classe?.nom || <span className="italic">Non assigné</span>}
        </p>
        <div className="space-y-3 mb-5">
          <label className="text-sm font-medium text-gray-700 block">Nouvelle classe</label>
          <select value={assignClasseId} onChange={e => setAssignClasseId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
            <option value="">— Choisir une classe —</option>
            {cycles.map(cy => (
              <optgroup key={cy.id} label={cy.nom}>
                {classes.filter(cl => cl.cycle_id === cy.id).map(cl => (
                  <option key={cl.id} value={cl.id}>
                    {cl.est_modulaire ? "[Module] " : ""}{cl.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setAssignModal(false); setAssignEtudiant(null); setAssignClasseId(""); }}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
          <button onClick={handleAssignManuel} disabled={!assignClasseId || saving}
            className="flex-1 px-4 py-2.5 bg-[#1A237E] text-white rounded-lg text-sm font-medium hover:bg-[#1A237E]/90 disabled:opacity-50">
            {saving ? "..." : "Confirmer"}
          </button>
        </div>
      </Modal>

      <div className="bg-[#F5F5F5] min-h-screen pb-20">

        {/* Header */}
        <div className="bg-[#1A237E] text-white py-6 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-white/60 text-xs">Direction</p>
              <h1 className="text-lg sm:text-2xl font-serif font-bold truncate">Dashboard — {profile?.nom}</h1>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Toggle fin d'année */}
              <button onClick={() => setFinAnneeModal(true)} disabled={togglingAnnee}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  finAnnee
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}>
                {finAnnee
                  ? <><CalendarX className="w-4 h-4" /> Fin d'année active</>
                  : <><CalendarCheck className="w-4 h-4" /> Activer fin d'année</>
                }
              </button>
              <button onClick={signOut} className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${s.color}`}><s.icon className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500 truncate">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[["etudiants","Étudiants",GraduationCap],["profs","Professeurs",Users],["demandes","Demandes",Clock]].map(([k,l,I]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === k ? "border-[#1A237E] text-[#1A237E]" : "border-transparent text-gray-500"}`}>
                <I className="w-4 h-4" /> {l}
                {k === "demandes" && demandes.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{demandes.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── ÉTUDIANTS ── */}
          {tab === "etudiants" && (
            <div className="space-y-4">
              {/* Filtres */}
              <div className="bg-white rounded-xl shadow p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <Filter className="w-3.5 h-3.5" /> Filtres
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[["en_attente","En attente"],["valide","Validés"],["rejete","Rejetés"],["","Tous"]].map(([val,label]) => (
                    <button key={val} onClick={() => setFilterStatut(val)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filterStatut === val ? "bg-[#1A237E] text-white border-[#1A237E]" : "bg-white text-gray-600 border-gray-300 hover:border-[#1A237E]"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <select value={filterCycle} onChange={e => setFilterCycle(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-8 focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                      <option value="">Tous les cycles</option>
                      {cycles.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={filterClasse} onChange={e => setFilterClasse(e.target.value)} disabled={!filterCycle}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-8 focus:ring-2 focus:ring-[#1A237E] outline-none bg-white disabled:opacity-40">
                      <option value="">Toutes les classes</option>
                      {classesDuCycle.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {(filterCycle || filterClasse) && (
                  <div className="flex items-center justify-between text-xs bg-blue-50 text-[#1A237E] rounded-lg px-3 py-2">
                    <span>{filteredEtudiants.length} résultat(s) · {cycles.find(c => c.id === filterCycle)?.nom}{filterClasse && ` · ${classes.find(c => c.id === filterClasse)?.nom}`}</span>
                    <button onClick={() => { setFilterCycle(""); setFilterClasse(""); }} className="font-semibold hover:underline ml-3">Réinitialiser</button>
                  </div>
                )}
              </div>

              <BulkBar selected={selectedEtudiants}
                onAction={action => openModal(action, selectedEtudiants, filteredEtudiants, "etudiant")}
                onClear={() => setSelectedEtudiants([])} />

              {/* Tableau desktop */}
              <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A237E] text-white">
                    <tr>
                      <th className="p-4 w-10"><input type="checkbox" checked={selectedEtudiants.length === filteredEtudiants.length && filteredEtudiants.length > 0} onChange={() => toggleAll(filteredEtudiants, selectedEtudiants, setSelectedEtudiants)} className="rounded border-gray-300" /></th>
                      <th className="text-left p-4">Étudiant</th>
                      <th className="text-left p-4">Classe</th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEtudiants.length === 0 && <tr><td colSpan={5} className="text-center text-gray-400 p-8">Aucun résultat.</td></tr>}
                    {filteredEtudiants.map(e => (
                      <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${selectedEtudiants.includes(e.id) ? "bg-blue-50" : ""}`}>
                        <td className="p-4"><input type="checkbox" checked={selectedEtudiants.includes(e.id)} onChange={() => toggleSelect(e.id, selectedEtudiants, setSelectedEtudiants)} className="rounded border-gray-300 text-[#1A237E]" /></td>
                        <td className="p-4"><p className="font-medium text-[#1A237E]">{e.prenom} {e.nom}</p><p className="text-xs text-gray-400">{e.telephone}</p></td>
                        <td className="p-4 text-gray-600 text-xs">{e.classe ? `${e.classe.cycle?.nom} — ${e.classe.nom}` : <span className="italic text-gray-400">Non assigné</span>}</td>
                        <td className="p-4"><StatutBadge statut={e.statut} /></td>
                        <td className="p-4">
                          <div className="flex gap-2 flex-wrap">
                            {e.statut === "en_attente" && (<>
                              <button onClick={() => openModal("valide", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Valider</button>
                              <button onClick={() => openModal("rejete", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"><XCircle className="w-3.5 h-3.5" /> Rejeter</button>
                            </>)}
                            {e.statut === "valide" && (<>
                              <button onClick={() => openModal("suspend", [e.id], [e], "etudiant")} className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-medium"><ShieldOff className="w-3.5 h-3.5" /> Suspendre</button>
                              <button onClick={() => { setAssignEtudiant(e); setAssignModal(true); }} className="flex items-center gap-1 text-xs bg-blue-100 text-[#1A237E] px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium"><UserCog className="w-3.5 h-3.5" /> Assigner</button>
                            </>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards mobile */}
              <div className="md:hidden space-y-3">
                {filteredEtudiants.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-3 rounded-xl shadow cursor-pointer">
                    <input type="checkbox" checked={selectedEtudiants.length === filteredEtudiants.length} onChange={() => toggleAll(filteredEtudiants, selectedEtudiants, setSelectedEtudiants)} className="rounded border-gray-300" />
                    Tout sélectionner ({filteredEtudiants.length})
                  </label>
                )}
                {filteredEtudiants.length === 0 && <div className="text-center text-gray-400 py-10 bg-white rounded-xl shadow">Aucun résultat.</div>}
                {filteredEtudiants.map(e => <EtudiantCard key={e.id} e={e} />)}
              </div>
            </div>
          )}

          {/* ── PROFESSEURS ── */}
          {tab === "profs" && (
            <div className="space-y-4">
              <BulkBar selected={selectedProfs} onAction={action => openModal(action, selectedProfs, profs, "prof")} onClear={() => setSelectedProfs([])} />
              <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A237E] text-white">
                    <tr>
                      <th className="p-4 w-10"><input type="checkbox" checked={selectedProfs.length === profs.length && profs.length > 0} onChange={() => toggleAll(profs, selectedProfs, setSelectedProfs)} className="rounded border-gray-300" /></th>
                      <th className="text-left p-4">Professeur</th>
                      <th className="text-left p-4">Téléphone</th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profs.length === 0 && <tr><td colSpan={5} className="text-center text-gray-400 p-8">Aucun professeur.</td></tr>}
                    {profs.map(p => (
                      <tr key={p.id} className={`hover:bg-gray-50 ${selectedProfs.includes(p.id) ? "bg-blue-50" : ""}`}>
                        <td className="p-4"><input type="checkbox" checked={selectedProfs.includes(p.id)} onChange={() => toggleSelect(p.id, selectedProfs, setSelectedProfs)} className="rounded border-gray-300" /></td>
                        <td className="p-4 font-medium text-[#1A237E]">{p.prenom} {p.nom}</td>
                        <td className="p-4 text-gray-500 text-xs">{p.telephone}</td>
                        <td className="p-4"><StatutBadge statut={p.statut} /></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {p.statut === "en_attente" && (<>
                              <button onClick={() => openModal("valide", [p.id], [p], "prof")} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">Valider</button>
                              <button onClick={() => openModal("rejete", [p.id], [p], "prof")} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Rejeter</button>
                            </>)}
                            {p.statut === "valide" && <button onClick={() => openModal("suspend", [p.id], [p], "prof")} className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-medium"><ShieldOff className="w-3.5 h-3.5" /> Suspendre</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile profs */}
              <div className="md:hidden space-y-3">
                {profs.map(p => (
                  <div key={p.id} className={`bg-white rounded-xl shadow p-4 border-l-4 ${selectedProfs.includes(p.id) ? "border-[#1A237E] bg-blue-50" : "border-transparent"}`}>
                    <div className="flex gap-3">
                      <input type="checkbox" checked={selectedProfs.includes(p.id)} onChange={() => toggleSelect(p.id, selectedProfs, setSelectedProfs)} className="mt-1 rounded border-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold text-[#1A237E] text-sm">{p.prenom} {p.nom}</p>
                          <StatutBadge statut={p.statut} />
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{p.telephone}</p>
                        <div className="flex gap-2 flex-wrap">
                          {p.statut === "en_attente" && (<>
                            <button onClick={() => openModal("valide", [p.id], [p], "prof")} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">Valider</button>
                            <button onClick={() => openModal("rejete", [p.id], [p], "prof")} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium">Rejeter</button>
                          </>)}
                          {p.statut === "valide" && <button onClick={() => openModal("suspend", [p.id], [p], "prof")} className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium"><ShieldOff className="w-3 h-3" /> Suspendre</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}




          

          {/* ── DEMANDES DE PASSAGE ── */}
          {tab === "demandes" && (
            <div className="space-y-3">
              {demandes.length === 0 && <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">Aucune demande en attente.</div>}
              {demandes.map(d => (
                <div key={d.id} className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[#1A237E]">{d.user?.prenom} {d.user?.nom}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.type === "modulaire" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {d.type === "modulaire" ? <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Module</span> : <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Cycle</span>}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="text-amber-600">{d.classe_actuelle?.nom}</span>
                      {" → "}
                      <span className="text-green-600">
                        {d.type === "modulaire" ? d.classe_voulue?.nom : d.classe_actuelle ? "Classe suivante" : "Fin de cycle"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setPassationModal({ open: true, action: "valider", demande: d })} disabled={saving}
                      className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-medium">
                      <CheckCircle className="w-4 h-4" /> Valider
                    </button>
                    <button onClick={() => setPassationModal({ open: true, action: "rejeter", demande: d })} disabled={saving}
                      className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium">
                      <XCircle className="w-4 h-4" /> Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      {passationModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${passationModal.action === "valider" ? "bg-green-100" : "bg-red-100"}`}>
                {passationModal.action === "valider"
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <XCircle className="w-5 h-5 text-red-600" />
                }
              </div>
              <div>
                <h2 className="font-bold text-gray-800">
                  {passationModal.action === "valider" ? "Confirmer la validation" : "Confirmer le rejet"}
                </h2>
                <p className="text-xs text-gray-500">{passationModal.demande?.user?.prenom} {passationModal.demande?.user?.nom}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600">
              <span className="text-amber-600 font-medium">{passationModal.demande?.classe_actuelle?.nom}</span>
              {" → "}
              <span className="text-green-600 font-medium">
                {passationModal.demande?.type === "modulaire"
                  ? (passationModal.demande?.classe_voulue?.nom || "Module à définir")
                  : "Classe suivante (auto)"}
              </span>
              <p className="text-xs text-gray-400 mt-1">{passationModal.demande?.type === "modulaire" ? "Formation modulaire" : "Cycle"}</p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {passationModal.action === "valider"
                ? "Cette action va incrémenter la classe de l'étudiant. Elle ne peut pas être annulée."
                : "La demande sera rejetée. L'étudiant pourra en soumettre une nouvelle."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPassationModal({ open: false, action: null, demande: null })}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={() => {
                  const d = passationModal.demande;
                  setPassationModal({ open: false, action: null, demande: null });
                  if (passationModal.action === "valider") validerPassage(d);
                  else rejeterPassage(d.id);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white ${passationModal.action === "valider" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                {passationModal.action === "valider" ? "Confirmer" : "Rejeter définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};








export default SuperAdminDashboard;