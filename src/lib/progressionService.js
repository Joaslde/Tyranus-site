import { supabase } from "@/lib/supabaseClient";

/**
 * Mark a single course as complete for the current user.
 * Then check if all courses in the class are done — if so, insert diploma and clear classe_id.
 */
export async function completeCours(userId, coursId, classeId) {
  // 1. Upsert the progression record
  const { error } = await supabase
    .from("progression")
    .upsert({
      user_id: userId,
      cours_id: coursId,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("cours_id", coursId);

  if (error) return { error };

  // 2. Check if all published courses of this class are now completed
  const { data: totalCours } = await supabase
    .from("cours")
    .select("id")
    .eq("classe_id", classeId)
    .eq("publie", true);

  const { data: completedCours } = await supabase
    .from("progression")
    .select("id")
    .eq("user_id", userId)
    .eq("completed", true)
    .in(
      "cours_id",
      (totalCours || []).map((c) => c.id),
    );

  const allDone =
    totalCours && completedCours && completedCours.length >= totalCours.length;

  if (allDone) {
    // Tous les cours actuels sont terminés — aucune action automatique.
    // Le passage de classe sera déclenché manuellement par l'admin (fin d'année).
    return { classeTerminee: false };
  }

  return { classeTerminee: false };
}

/**
 * Student requests to move to the next class in their cycle.
 * Finds the next class by ordre, creates a demande_passage.
 */
export async function demanderPassage(userId, classeActuelle) {
  // Find next class in same cycle
  const { data: nextClasse } = await supabase
    .from("classes")
    .select("id")
    .eq("cycle_id", classeActuelle.cycle_id)
    .eq("ordre", classeActuelle.ordre + 1)
    .single();

  const { error } = await supabase.from("demandes_passage").insert({
    user_id: userId,
    classe_actuelle_id: classeActuelle.id,
    classe_suivante_id: nextClasse?.id || null,
    statut: "en_attente",
  });

  return { error, nextClasse };
}

/**
 * Get progression percentage for a student in their current class.
 */
export async function getProgressionPourcentage(userId, classeId) {
  const { data: total } = await supabase
    .from("cours")
    .select("id", { count: "exact" })
    .eq("classe_id", classeId)
    .eq("publie", true);

  const { data: done } = await supabase
    .from("progression")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("completed", true)
    .in(
      "cours_id",
      (total || []).map((c) => c.id),
    );

  const totalCount = total?.length || 0;
  const doneCount = done?.length || 0;
  return totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
}