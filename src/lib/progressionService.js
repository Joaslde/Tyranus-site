import { supabase } from "@/lib/supabaseClient";

export async function getFinAnneeActive() {
  const { data } = await supabase
    .from("settings").select("valeur").eq("cle", "fin_annee_active").single();
  return data?.valeur === "true";
}

export async function setFinAnneeActive(value) {
  const { error } = await supabase
    .from("settings").update({ valeur: value ? "true" : "false" }).eq("cle", "fin_annee_active");
  return { error };
}

export async function completeCours(userId, coursId, classeId) {
  const { error } = await supabase.from("progression").upsert({
    user_id: userId, cours_id: coursId, completed: true,
    completed_at: new Date().toISOString(),
  }, { onConflict: "user_id,cours_id" });

  if (error) return { error };

  const { data: totalCours } = await supabase
    .from("cours").select("id").eq("classe_id", classeId).eq("publie", true);
  const { data: completedCours } = await supabase
    .from("progression").select("id").eq("user_id", userId).eq("completed", true)
    .in("cours_id", (totalCours || []).map(c => c.id));

  const allDone = totalCours && completedCours && completedCours.length >= totalCours.length;
  return { classeTerminee: allDone || false };
}

// ─── Passation Cycle ──────────────────────────────────────────────────────────
// classeActuelle doit avoir : id, ordre, cycle_id (champ direct, pas l'objet jointé)
export async function demanderPassageCycle(userId, classeActuelle) {
  // cycle_id peut venir soit du champ direct, soit de l'objet cycle jointé
  const cycleId = classeActuelle.cycle_id || classeActuelle.cycle?.id;

  const { data: nextClasse } = await supabase
    .from("classes").select("id, nom, ordre")
    .eq("cycle_id", cycleId)
    .eq("ordre", classeActuelle.ordre + 1)
    .maybeSingle();

  const { data: demande, error } = await supabase
    .from("demandes_passage")
    .insert({
      user_id: userId,
      classe_actuelle_id: classeActuelle.id,
      classe_suivante_id: nextClasse?.id || null,
      classe_voulue_id: nextClasse?.id || null,
      statut: "en_attente",
      type: "cycle",
    })
    .select("id")
    .single();

  return { error, id: demande?.id, estDerniereClasse: !nextClasse };
}

// ─── Passation Modulaire ──────────────────────────────────────────────────────
export async function demanderPassageModulaire(userId, classeActuelleId, classeVoulueId) {
  const { data: demande, error } = await supabase
    .from("demandes_passage")
    .insert({
      user_id: userId,
      classe_actuelle_id: classeActuelleId,
      classe_suivante_id: classeVoulueId,
      classe_voulue_id: classeVoulueId,
      statut: "en_attente",
      type: "modulaire",
    })
    .select("id")
    .single();

  return { error, id: demande?.id };
}

// ─── Annulation ───────────────────────────────────────────────────────────────
export async function annulerDemande(demandeId) {
  const { error } = await supabase
    .from("demandes_passage").delete().eq("id", demandeId);
  return { error };
}

export async function getProgressionPourcentage(userId, classeId) {
  const { data: total } = await supabase
    .from("cours").select("id").eq("classe_id", classeId).eq("publie", true);
  const { data: done } = await supabase
    .from("progression").select("id").eq("user_id", userId).eq("completed", true)
    .in("cours_id", (total || []).map(c => c.id));
  const totalCount = total?.length || 0;
  const doneCount = done?.length || 0;
  return totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
}