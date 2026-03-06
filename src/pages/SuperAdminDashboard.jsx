import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  BarChart2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const SuperAdminDashboard = () => {
  const { profile, user, signOut } = useAuth();
  const [tab, setTab] = useState("etudiants");
  const [etudiants, setEtudiants] = useState([]);
  const [profs, setProfs] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({
    etudiants: 0,
    profs: 0,
    cours: 0,
    pending: 0,
  });
  const [filterStatut, setFilterStatut] = useState("en_attente");
  const [saving, setSaving] = useState("");

  const load = async () => {
    const [{ data: e }, { data: p }, { data: d }, { data: c }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select(
            `
        id, nom, prenom, telephone, statut, created_at,
        classe:classe_id(nom, cycle:cycle_id(nom))
      `,
          )
          .eq("role", "etudiant")
          .order("created_at", { ascending: false }),

        supabase
          .from("profiles")
          .select("id, nom, prenom, telephone, statut, created_at")
          .eq("role", "professeur")
          .order("created_at", { ascending: false }),

        supabase
          .from("demandes_passage")
          .select(
            `
        id, statut, created_at,
        user:user_id(nom, prenom),
        classe_actuelle:classe_actuelle_id(nom),
        classe_suivante:classe_suivante_id(nom)
      `,
          )
          .eq("statut", "en_attente")
          .order("created_at", { ascending: false }),

        supabase.from("cours").select("id", { count: "exact" }),
      ]);

    setEtudiants(e || []);
    setProfs(p || []);
    setDemandes(d || []);
    setStats({
      etudiants: (e || []).length,
      profs: (p || []).length,
      cours: (c || []).length,
      pending: (e || []).filter((x) => x.statut === "en_attente").length,
    });
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatutEtudiant = async (id, statut) => {
    setSaving(id);
    await supabase.from("profiles").update({ statut }).eq("id", id);
    setEtudiants((prev) =>
      prev.map((e) => (e.id === id ? { ...e, statut } : e)),
    );
    setStats((s) => ({
      ...s,
      pending: statut === "valide" ? s.pending - 1 : s.pending,
    }));
    setSaving("");
  };

  const validerPassage = async (d) => {
    setSaving(d.id);
    // Set new classe
    await supabase
      .from("profiles")
      .update({ classe_id: d.classe_suivante_id })
      .eq("id", d.user_id);
    // Mark demande as validee
    await supabase
      .from("demandes_passage")
      .update({ statut: "validee" })
      .eq("id", d.id);
    setDemandes((prev) => prev.filter((x) => x.id !== d.id));
    setSaving("");
  };

  const rejeterPassage = async (id) => {
    setSaving(id);
    await supabase
      .from("demandes_passage")
      .update({ statut: "rejetee" })
      .eq("id", id);
    setDemandes((prev) => prev.filter((x) => x.id !== id));
    setSaving("");
  };

  const filteredEtudiants = etudiants.filter(
    (e) => !filterStatut || e.statut === filterStatut,
  );

  const STAT_CARDS = [
    {
      label: "Étudiants",
      value: stats.etudiants,
      icon: GraduationCap,
      color: "bg-blue-50 text-[#1A237E]",
    },
    {
      label: "Professeurs",
      value: stats.profs,
      icon: Users,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Cours",
      value: stats.cours,
      icon: BookOpen,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Super Admin — École Tyrannus</title>
      </Helmet>
      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#1A237E] text-white py-8 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Direction</p>
              <h1 className="text-2xl font-serif font-bold">
                Tableau de bord — {profile?.nom}
              </h1>
            </div>
            <button
              onClick={signOut}
              className="text-white/70 hover:text-white flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((s) => (
              <div
                key={s.label}
                className={`rounded-xl p-5 shadow flex items-center gap-4 ${s.color} bg-white`}
              >
                <div className={`p-3 rounded-lg ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              ["etudiants", "Étudiants", GraduationCap],
              ["profs", "Professeurs", Users],
              ["demandes", "Demandes de passage", Clock],
            ].map(([k, l, I]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === k
                    ? "border-[#1A237E] text-[#1A237E]"
                    : "border-transparent text-gray-500 hover:text-[#1A237E]"
                }`}
              >
                <I className="w-4 h-4" /> {l}
                {k === "demandes" && demandes.length > 0 && (
                  <span className="bg-amber-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {demandes.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: Étudiants */}
          {tab === "etudiants" && (
            <div>
              <div className="flex gap-2 mb-4">
                {["en_attente", "valide", "rejete", ""].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatut(s)}
                    className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                      filterStatut === s
                        ? "bg-[#1A237E] text-white"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {s === "" ? "Tous" : s}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A237E] text-white">
                    <tr>
                      <th className="text-left p-4">Étudiant</th>
                      <th className="text-left p-4 hidden md:table-cell">
                        Classe
                      </th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEtudiants.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-gray-400 p-8"
                        >
                          Aucun étudiant.
                        </td>
                      </tr>
                    )}
                    {filteredEtudiants.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-medium text-[#1A237E]">
                            {e.prenom} {e.nom}
                          </p>
                          <p className="text-xs text-gray-400">{e.telephone}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-gray-600 text-xs">
                          {e.classe ? (
                            `${e.classe.cycle?.nom} — ${e.classe.nom}`
                          ) : (
                            <span className="italic text-gray-400">Libre</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              e.statut === "valide"
                                ? "bg-green-100 text-green-700"
                                : e.statut === "rejete"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {e.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          {e.statut === "en_attente" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateStatutEtudiant(e.id, "valide")
                                }
                                disabled={saving === e.id}
                                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Valider
                              </button>
                              <button
                                onClick={() =>
                                  updateStatutEtudiant(e.id, "rejete")
                                }
                                disabled={saving === e.id}
                                className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Rejeter
                              </button>
                            </div>
                          )}
                          {e.statut === "valide" && (
                            <button
                              onClick={() =>
                                updateStatutEtudiant(e.id, "rejete")
                              }
                              className="text-xs text-red-400 hover:text-red-600"
                            >
                              Suspendre
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Professeurs */}
          {tab === "profs" && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#1A237E] text-white">
                  <tr>
                    <th className="text-left p-4">Professeur</th>
                    <th className="text-left p-4">Téléphone</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 p-8">
                        Aucun professeur.
                      </td>
                    </tr>
                  )}
                  {profs.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#1A237E]">
                        {p.prenom} {p.nom}
                      </td>
                      <td className="p-4 text-gray-500">{p.telephone}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            p.statut === "valide"
                              ? "bg-green-100 text-green-700"
                              : p.statut === "rejete"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {p.statut}
                        </span>
                      </td>
                      <td className="p-4">
                        {p.statut === "en_attente" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatutEtudiant(p.id, "valide")
                              }
                              className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() =>
                                updateStatutEtudiant(p.id, "rejete")
                              }
                              className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium"
                            >
                              Rejeter
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab: Demandes de passage */}
          {tab === "demandes" && (
            <div className="space-y-3">
              {demandes.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">
                  Aucune demande en attente.
                </div>
              )}
              {demandes.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-xl shadow p-5 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div>
                    <p className="font-medium text-[#1A237E]">
                      {d.user?.prenom} {d.user?.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="text-amber-600">
                        {d.classe_actuelle?.nom}
                      </span>
                      {" → "}
                      <span className="text-green-600">
                        {d.classe_suivante?.nom || "Fin de cycle"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        validerPassage({
                          ...d,
                          user_id: d.user?.id || d.user_id,
                          classe_suivante_id:
                            d.classe_suivante?.id || d.classe_suivante_id,
                        })
                      }
                      disabled={saving === d.id}
                      className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" /> Valider
                    </button>
                    <button
                      onClick={() => rejeterPassage(d.id)}
                      disabled={saving === d.id}
                      className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium"
                    >
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
