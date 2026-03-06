import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Plus,
  BookOpen,
  Users,
  BarChart2,
  LogOut,
  Check,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const ProfDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [tab, setTab] = useState("cours");
  const [mesClasses, setMesClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [cours, setCours] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    url_youtube: "",
    classe_id: "",
    ordre: 0,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    // Fetch assigned classes
    supabase
      .from("prof_classes")
      .select("classe:classe_id(id, nom, cycle:cycle_id(nom))")
      .eq("prof_id", user.id)
      .then(({ data }) => {
        const cls = (data || []).map((d) => d.classe);
        setMesClasses(cls);
        if (cls.length > 0) {
          setSelectedClasse(cls[0].id);
          setForm((f) => ({ ...f, classe_id: cls[0].id }));
        }
      });
  }, [user]);

  useEffect(() => {
    if (!selectedClasse) return;
    // Fetch courses for selected class
    supabase
      .from("cours")
      .select("*")
      .eq("classe_id", selectedClasse)
      .order("ordre")
      .then(({ data }) => setCours(data || []));

    // Fetch students in selected class
    supabase
      .from("profiles")
      .select("id, nom, prenom, statut")
      .eq("classe_id", selectedClasse)
      .eq("role", "etudiant")
      .then(({ data }) => setEtudiants(data || []));
  }, [selectedClasse]);

  const handleAddCours = async (e) => {
    e.preventDefault();
    
    // Guard : pas de classe sélectionnée
    if (!form.classe_id) {
      setMsg("❌ Veuillez sélectionner une classe d'abord.");
      return;
    }
  
    setSaving(true);
    setMsg("");
  
    const { error } = await supabase.from("cours").insert({
      titre: form.titre,
      description: form.description,
      url_youtube: form.url_youtube,
      classe_id: form.classe_id,
      ordre: form.ordre,
      created_by: user.id,
      publie: false,
    });
  
    if (error) {
      console.error("Erreur ajout cours:", error.message);
      setMsg("❌ Erreur : " + error.message);
    } else {
      setMsg("✅ Cours ajouté !");
      setForm((f) => ({ ...f, titre: "", description: "", url_youtube: "", ordre: 0 }));
      // Refresh liste
      supabase.from("cours").select("*").eq("classe_id", selectedClasse).order("ordre")
        .then(({ data }) => setCours(data || []));
    }
    setSaving(false);
  };
  const togglePublish = async (c) => {
    await supabase.from("cours").update({ publie: !c.publie }).eq("id", c.id);
    setCours((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, publie: !x.publie } : x)),
    );
  };

  const deleteCours = async (id) => {
    if (!confirm("Supprimer ce cours ?")) return;
    await supabase.from("cours").delete().eq("id", id);
    setCours((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Professeur — École Tyrannus</title>
      </Helmet>
      <div className="bg-[#F5F5F5] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#1A237E] text-white py-8 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Espace Professeur</p>
              <h1 className="text-2xl font-serif font-bold">
                {profile?.prenom} {profile?.nom}
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

        <div className="max-w-5xl mx-auto px-4 mt-6">
          {/* Class selector */}
          <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Classe :
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => {
                setSelectedClasse(e.target.value);
                setForm((f) => ({ ...f, classe_id: e.target.value }));
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none flex-1"
            >
              {mesClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom} ({c.cycle?.nom})
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              ["cours", "Cours", BookOpen],
              ["etudiants", "Étudiants", Users],
              ["ajouter", "Ajouter un cours", Plus],
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? "border-[#1A237E] text-[#1A237E]"
                    : "border-transparent text-gray-500 hover:text-[#1A237E]"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Tab: Liste des cours */}
          {tab === "cours" && (
            <div className="space-y-3">
              {cours.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">
                  Aucun cours pour cette classe.
                </div>
              )}
              {cours.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A237E] truncate">
                      {c.titre}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {c.url_youtube}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${c.publie ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {c.publie ? "Publié" : "Brouillon"}
                    </span>
                    <button
                      onClick={() => togglePublish(c)}
                      title={c.publie ? "Dépublier" : "Publier"}
                      className="text-gray-400 hover:text-[#1A237E]"
                    >
                      {c.publie ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCours(c.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Étudiants */}
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
                  {etudiants.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-400 p-8">
                        Aucun étudiant dans cette classe.
                      </td>
                    </tr>
                  )}
                  {etudiants.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-[#1A237E]">
                        {e.prenom} {e.nom}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab: Ajouter un cours */}
          {tab === "ajouter" && (
            <div className="bg-white rounded-xl shadow p-6 max-w-lg">
              <h2 className="text-lg font-bold text-[#1A237E] mb-5">
                Ajouter un cours vidéo
              </h2>
              {msg && <p className="text-sm text-green-600 mb-4">{msg}</p>}
              <form onSubmit={handleAddCours} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Titre du cours *
                  </label>
                  <input
                    required
                    value={form.titre}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, titre: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                    placeholder="Introduction à l'Exégèse"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none resize-none"
                    placeholder="Courte description du cours..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Lien YouTube *
                  </label>
                  <input
                    required
                    value={form.url_youtube}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url_youtube: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Ordre (position dans la classe)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.ordre}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        ordre: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#1A237E] text-white"
                >
                  {saving ? "Enregistrement..." : "Ajouter le cours"}
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
