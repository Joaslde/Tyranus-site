import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Users, BookOpen, Clock, CheckCircle, XCircle,
  LogOut, GraduationCap, AlertTriangle, ShieldOff,
  Filter, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// ─── Modal confirmation ───────────────────────────────────────────────────────
const ConfirmModal = ({ open, action, targets, onConfirm, onCancel }) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (targets.length > 3) {
      setCountdown(5);
      const t = setInterval(() => {
        setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
      }, 1000);
      return () => clearInterval(t);
    } else {
      setCountdown(0);
    }
  }, [open, targets.length]);

  if (!open) return null;

  const actionMeta = {
    valide:  { label: "Valider",   color: "bg-green-600 hover:bg-green-700",   Icon: CheckCircle },
    rejete:  { label: "Rejeter",   color: "bg-red-600 hover:bg-red-700",       Icon: XCircle },
    suspend: { label: "Suspendre", color: "bg-orange-600 hover:bg-orange-700", Icon: ShieldOff },
  };
  const { label, color, Icon } = actionMeta[action] || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Confirmer l'action</h2>
            <p className="text-xs text-gray-500">{targets.length} élément(s) sélectionné(s)</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-5 max-h-40 overflow-y-auto space-y-1">
          {targets.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
              {Icon && <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
              <span>{t.prenom} {t.nom}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Vous êtes sur le point de <strong>{label?.toLowerCase()}</strong>{" "}
          {targets.length > 1 ? "ces personnes" : "cette personne"}. Cette action est réversible.
        </p>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={countdown > 0}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${countdown > 0 ? "bg-gray-300 cursor-not-allowed" : color}`}>
            {countdown > 0 ? `Attendre ${countdown}s...` : `${label} (${targets.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const StatutBadge = ({ statut }) => {
  const map = {
    valide:     "bg-green-100 text-green-700",
    rejete:     "bg-red-100 text-red-700",
    en_attente: "bg-amber-100 text-amber-700",
  };
  const labels = { valide: "Validé", rejete: "Rejeté", en_attente: "En attente" };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${map[statut] || "bg-gray-100 text-gray-500"}`}>
      {labels[statut] || statut}
    </span>
  );
};

const BulkBar = ({ selected, data, type, onAction, onClear }) => {
  if (selected.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 bg-[#1A237E] text-white rounded-xl px-4 py-3 mb-4">
      <span className="text-sm font-medium">{selected.length} sélectionné(s)</span>
      <div className="flex gap-2 ml-auto flex-wrap">
        <button onClick={() => onAction("valide", selected, data, type)}
          className="flex items-center gap-1.5 text-xs bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg font-medium">
          <CheckCircle className="w-3.5 h-3.5" /> Valider
        </button>
        <button onClick={() => onAction("rejete", selected, data, type)}
          className="flex items-center gap-1.5 text-xs bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg font-medium">
          <XCircle className="w-3.5 h-3.5" /> Rejeter
        </button>
        <button onClick={() => onAction("suspend", selected, data, type)}
          className="flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg font-medium">
          <ShieldOff className="w-3.5 h-3.5" /> Suspendre
        </button>
        <button onClick={onClear} className="text-xs text-white/60 hover:text-white px-1">✕</button>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState("etudiants");
  const [etudiants, setEtudiants] = useState([]);
  const [profs, setProfs] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ etudiants: 0, profs: 0, cours: 0, pending: 0 });
  const [saving, setSaving] = useState(false);

  const [filterStatut, setFilterStatut] = useState("en_attente");
  const [filterCycle, setFilterCycle] = useState("");
  const [filterClasse, setFilterClasse] = useState("");

  const [selectedEtudiants, setSelectedEtudiants] = useState([]);
  const [selectedProfs, setSelectedProfs] = useState([]);
  const [modal, setModal] = useState({ open: false, action: "", targets: [], type: "" });

  const load = useCallback(async () => {
    const [{ data: e }, { data: p }, { data: d }, { data: c }, { data: cy }, { data: cl }] =
      await Promise.all([
        supabase.from("profiles")
          .select("id, nom, prenom, telephone, statut, created_at, classe:classe_id(id, nom, cycle:cycle_id(id, nom))")
          .eq("role", "etudiant").order("created_at", { ascending: false }),
        supabase.from("profiles")
          .select("id, nom, prenom, telephone, statut, created_at")
          .eq("role", "professeur").order("created_at", { ascending: false }),
        supabase.from("demandes_passage")
          .select("id, statut, created_at, user_id, classe_suivante_id, user:user_id(nom, prenom), classe_actuelle:classe_actuelle_id(nom), classe_suivante:classe_suivante_id(nom)")
          .eq("statut", "en_attente").order("created_at", { ascending: false }),
        supabase.from("cours").select("id", { count: "exact" }),
        supabase.from("cycles").select("id, nom").order("ordre"),
        supabase.from("classes").select("id, nom, cycle_id").order("ordre"),
      ]);
    setEtudiants(e || []);
    setProfs(p || []);
    setDemandes(d || []);
    setCycles(cy || []);
    setClasses(cl || []);
    setStats({
      etudiants: (e || []).length,
      profs: (p || []).length,
      cours: (c || []).length,
      pending: (e || []).filter((x) => x.statut === "en_attente").length,
    });
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSelectedEtudiants([]); setSelectedProfs([]); }, [tab]);
  useEffect(() => { setFilterClasse(""); }, [filterCycle]);

  const classesDuCycle = filterCycle ? classes.filter((c) => c.cycle_id === filterCycle) : classes;

  const filteredEtudiants = etudiants.filter((e) => {
    if (filterStatut && e.statut !== filterStatut) return false;
    if (filterCycle && e.classe?.cycle?.id !== filterCycle) return false;
    if (filterClasse && e.classe?.id !== filterClasse) return false;
    return true;
  });

  const toggleSelect = (id, list, setList) =>
    setList((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleSelectAll = (data, setList, selected) =>
    setList(selected.length === data.length ? [] : data.map((x) => x.id));

  const openModal = (action, ids, dataList, type) =>
    setModal({ open: true, action, targets: dataList.filter((x) => ids.includes(x.id)), type });

  const handleConfirm = async () => {
    setSaving(true);
    setModal((m) => ({ ...m, open: false }));
    const ids = modal.targets.map((t) => t.id);
    const statut = modal.action === "suspend" ? "rejete" : modal.action;
    await supabase.from("profiles").update({ statut }).in("id", ids);
    if (modal.type === "etudiant") {
      setEtudiants((prev) => prev.map((e) => ids.includes(e.id) ? { ...e, statut } : e));
      setSelectedEtudiants([]);
    } else {
      setProfs((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, statut } : p));
      setSelectedProfs([]);
    }
    setSaving(false);
  };

  const validerPassage = async (d) => {
    setSaving(true);
    await supabase.from("profiles").update({ classe_id: d.classe_suivante_id }).eq("id", d.user_id);
    await supabase.from("demandes_passage").update({ statut: "validee" }).eq("id", d.id);
    setDemandes((prev) => prev.filter((x) => x.id !== d.id));
    setSaving(false);
  };

  const rejeterPassage = async (id) => {
    setSaving(true);
    await supabase.from("demandes_passage").update({ statut: "rejetee" }).eq("id", id);
    setDemandes((prev) => prev.filter((x) => x.id !== id));
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>Super Admin — École Tyrannus</title></Helmet>

      <ConfirmModal open={modal.open} action={modal.action} targets={modal.targets}
        onConfirm={handleConfirm} onCancel={() => setModal((m) => ({ ...m, open: false }))} />

      <div className="bg-[#F5F5F5] min-h-screen pb-20">

        {/* Header */}
        <div className="bg-[#1A237E] text-white py-6 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Direction</p>
              <h1 className="text-lg sm:text-2xl font-serif font-bold">Tableau de bord — {profile?.nom}</h1>
            </div>
            <button onClick={signOut} className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Étudiants",  value: stats.etudiants, Icon: GraduationCap, cls: "bg-blue-50 text-[#1A237E]" },
              { label: "Professeurs",value: stats.profs,      Icon: Users,         cls: "bg-purple-50 text-purple-700" },
              { label: "Cours",      value: stats.cours,      Icon: BookOpen,      cls: "bg-green-50 text-green-700" },
              { label: "En attente", value: stats.pending,    Icon: Clock,         cls: "bg-amber-50 text-amber-700" },
            ].map(({ label, value, Icon, cls }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${cls}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              ["etudiants", "Étudiants", GraduationCap],
              ["profs", "Professeurs", Users],
              ["demandes", "Demandes", Clock],
            ].map(([k, l, I]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  tab === k ? "border-[#1A237E] text-[#1A237E]" : "border-transparent text-gray-500 hover:text-[#1A237E]"
                }`}>
                <I className="w-4 h-4" /> {l}
              </button>
            ))}
          </div>

          {/* ── Tab Étudiants ── */}
          {tab === "etudiants" && (
            <div>
              {/* Panneau filtres */}
              <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <Filter className="w-3.5 h-3.5" /> Filtres
                </div>

                {/* Filtre statut */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: "en_attente", label: "En attente" },
                    { val: "valide",     label: "Validés" },
                    { val: "rejete",     label: "Rejetés" },
                    { val: "",           label: "Tous" },
                  ].map(({ val, label }) => (
                    <button key={val} onClick={() => setFilterStatut(val)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                        filterStatut === val
                          ? "bg-[#1A237E] text-white border-[#1A237E]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#1A237E]"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Filtre cycle + classe */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <select value={filterCycle} onChange={(e) => setFilterCycle(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-[#1A237E] outline-none bg-white">
                      <option value="">Tous les cycles</option>
                      {cycles.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative flex-1">
                    <select value={filterClasse} onChange={(e) => setFilterClasse(e.target.value)}
                      disabled={!filterCycle}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-[#1A237E] outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400">
                      <option value="">Toutes les classes</option>
                      {classesDuCycle.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {(filterCycle || filterClasse) && (
                    <button onClick={() => { setFilterCycle(""); setFilterClasse(""); }}
                      className="text-xs text-[#1A237E] hover:underline self-center whitespace-nowrap">
                      Réinitialiser
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-400">{filteredEtudiants.length} étudiant(s) affiché(s)</p>
              </div>

              <BulkBar selected={selectedEtudiants} data={filteredEtudiants} type="etudiant"
                onAction={openModal} onClear={() => setSelectedEtudiants([])} />

              {/* Table — desktop uniquement */}
              <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A237E] text-white">
                    <tr>
                      <th className="p-4 w-10">
                        <input type="checkbox"
                          checked={selectedEtudiants.length === filteredEtudiants.length && filteredEtudiants.length > 0}
                          onChange={() => toggleSelectAll(filteredEtudiants, setSelectedEtudiants, selectedEtudiants)}
                          className="rounded" />
                      </th>
                      <th className="text-left p-4">Étudiant</th>
                      <th className="text-left p-4">Classe</th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEtudiants.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 p-8">Aucun étudiant.</td></tr>
                    )}
                    {filteredEtudiants.map((e) => (
                      <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${selectedEtudiants.includes(e.id) ? "bg-blue-50" : ""}`}>
                        <td className="p-4">
                          <input type="checkbox" checked={selectedEtudiants.includes(e.id)}
                            onChange={() => toggleSelect(e.id, selectedEtudiants, setSelectedEtudiants)}
                            className="rounded text-[#1A237E]" />
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-[#1A237E]">{e.prenom} {e.nom}</p>
                          <p className="text-xs text-gray-400">{e.telephone}</p>
                        </td>
                        <td className="p-4 text-gray-600 text-xs">
                          {e.classe ? `${e.classe.cycle?.nom} — ${e.classe.nom}` : <span className="italic text-gray-400">Libre</span>}
                        </td>
                        <td className="p-4"><StatutBadge statut={e.statut} /></td>
                        <td className="p-4">
                          <div className="flex gap-2 flex-wrap">
                            {e.statut === "en_attente" && (<>
                              <button onClick={() => openModal("valide", [e.id], [e], "etudiant")}
                                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" /> Valider
                              </button>
                              <button onClick={() => openModal("rejete", [e.id], [e], "etudiant")}
                                className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">
                                <XCircle className="w-3.5 h-3.5" /> Rejeter
                              </button>
                            </>)}
                            {e.statut === "valide" && (
                              <button onClick={() => openModal("suspend", [e.id], [e], "etudiant")}
                                className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-medium">
                                <ShieldOff className="w-3.5 h-3.5" /> Suspendre
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile uniquement */}
              <div className="md:hidden space-y-3">
                {filteredEtudiants.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">Aucun étudiant.</div>
                )}
                {filteredEtudiants.map((e) => (
                  <div key={e.id} className={`bg-white rounded-xl shadow p-4 ${selectedEtudiants.includes(e.id) ? "ring-2 ring-[#1A237E]" : ""}`}>
                    <div className="flex gap-3">
                      <input type="checkbox" checked={selectedEtudiants.includes(e.id)}
                        onChange={() => toggleSelect(e.id, selectedEtudiants, setSelectedEtudiants)}
                        className="rounded text-[#1A237E] mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-[#1A237E]">{e.prenom} {e.nom}</p>
                          <StatutBadge statut={e.statut} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{e.telephone}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {e.classe ? `${e.classe.cycle?.nom} — ${e.classe.nom}` : "Étudiant libre"}
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {e.statut === "en_attente" && (<>
                            <button onClick={() => openModal("valide", [e.id], [e], "etudiant")}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">Valider</button>
                            <button onClick={() => openModal("rejete", [e.id], [e], "etudiant")}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium">Rejeter</button>
                          </>)}
                          {e.statut === "valide" && (
                            <button onClick={() => openModal("suspend", [e.id], [e], "etudiant")}
                              className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium">Suspendre</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab Professeurs ── */}
          {tab === "profs" && (
            <div>
              <BulkBar selected={selectedProfs} data={profs} type="prof"
                onAction={openModal} onClear={() => setSelectedProfs([])} />

              {/* Table desktop */}
              <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A237E] text-white">
                    <tr>
                      <th className="p-4 w-10">
                        <input type="checkbox"
                          checked={selectedProfs.length === profs.length && profs.length > 0}
                          onChange={() => toggleSelectAll(profs, setSelectedProfs, selectedProfs)}
                          className="rounded" />
                      </th>
                      <th className="text-left p-4">Professeur</th>
                      <th className="text-left p-4">Téléphone</th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profs.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 p-8">Aucun professeur.</td></tr>
                    )}
                    {profs.map((p) => (
                      <tr key={p.id} className={`hover:bg-gray-50 ${selectedProfs.includes(p.id) ? "bg-blue-50" : ""}`}>
                        <td className="p-4">
                          <input type="checkbox" checked={selectedProfs.includes(p.id)}
                            onChange={() => toggleSelect(p.id, selectedProfs, setSelectedProfs)}
                            className="rounded text-[#1A237E]" />
                        </td>
                        <td className="p-4 font-medium text-[#1A237E]">{p.prenom} {p.nom}</td>
                        <td className="p-4 text-gray-500">{p.telephone}</td>
                        <td className="p-4"><StatutBadge statut={p.statut} /></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {p.statut === "en_attente" && (<>
                              <button onClick={() => openModal("valide", [p.id], [p], "prof")}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">Valider</button>
                              <button onClick={() => openModal("rejete", [p.id], [p], "prof")}
                                className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Rejeter</button>
                            </>)}
                            {p.statut === "valide" && (
                              <button onClick={() => openModal("suspend", [p.id], [p], "prof")}
                                className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-medium">
                                <ShieldOff className="w-3.5 h-3.5" /> Suspendre
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards mobile */}
              <div className="md:hidden space-y-3">
                {profs.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">Aucun professeur.</div>
                )}
                {profs.map((p) => (
                  <div key={p.id} className={`bg-white rounded-xl shadow p-4 ${selectedProfs.includes(p.id) ? "ring-2 ring-[#1A237E]" : ""}`}>
                    <div className="flex gap-3">
                      <input type="checkbox" checked={selectedProfs.includes(p.id)}
                        onChange={() => toggleSelect(p.id, selectedProfs, setSelectedProfs)}
                        className="rounded text-[#1A237E] mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-[#1A237E]">{p.prenom} {p.nom}</p>
                          <StatutBadge statut={p.statut} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{p.telephone}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {p.statut === "en_attente" && (<>
                            <button onClick={() => openModal("valide", [p.id], [p], "prof")}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">Valider</button>
                            <button onClick={() => openModal("rejete", [p.id], [p], "prof")}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium">Rejeter</button>
                          </>)}
                          {p.statut === "valide" && (
                            <button onClick={() => openModal("suspend", [p.id], [p], "prof")}
                              className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium">Suspendre</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab Demandes de passage ── */}
          {tab === "demandes" && (
            <div className="space-y-3">
              {demandes.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">Aucune demande en attente.</div>
              )}
              {demandes.map((d) => (
                <div key={d.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#1A237E]">{d.user?.prenom} {d.user?.nom}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      <span className="text-amber-600">{d.classe_actuelle?.nom}</span>
                      {" → "}
                      <span className="text-green-600">{d.classe_suivante?.nom || "Fin de cycle"}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => validerPassage(d)} disabled={saving}
                      className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-medium">
                      <CheckCircle className="w-4 h-4" /> Valider
                    </button>
                    <button onClick={() => rejeterPassage(d.id)} disabled={saving}
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
    </>
  );
};

export default SuperAdminDashboard;