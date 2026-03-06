# Plan d'Intégration Backend — École Tyrannus (Final)

## 3 Rôles

| Rôle | Accès |
|---|---|
| `super_admin` | Tout — valide étudiants, passages de classe, liste globale |
| `professeur` | Ses classes assignées — ajoute cours, voit progression étudiants |
| `etudiant` | Ses cours selon cycle/classe actuelle |

---

## Schéma Base de Données (6 Tables)

### `profiles`
| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `nom` | text | |
| `prenom` | text | |
| `telephone` | text | |
| `role` | text | `'etudiant'`, `'professeur'`, `'super_admin'` |
| `statut` | text | `'en_attente'` / `'valide'` / `'rejete'` |
| `classe_id` | uuid FK → classes | Étudiants seulement — NULL si "libre" |
| `created_at` | timestamp | |

> Professeurs : `classe_id` non applicable, cycle/classe gérés via `prof_classes`

---

### `cycles`
| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `nom` | text |
| `ordre` | integer |

**Seed :** Cycle Fon (1), Cycle Français (2), Formations Modulaires (3)

---

### `classes`
| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `cycle_id` | uuid FK | |
| `nom` | text | |
| `ordre` | integer | Ordre dans le cycle |
| `est_modulaire` | boolean | `true` pour les modules |

**Seed — Cycle Fon :** Année Prépa (1), 1re Année (2), 2e Année (3)  
**Seed — Cycle Français :** Année Prépa (1), 1re Année (2), 2e Année (3), 3e Année (4)  
**Seed — Modulaires :** Prophétie, Missiologie, Délivrance, Évangélisation, Prédication (`est_modulaire = true`)

---

### `prof_classes` — affectation professeurs/classes
| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `prof_id` | uuid FK → profiles |
| `classe_id` | uuid FK → classes |

---

### `cours`
| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `classe_id` | uuid FK | |
| `titre` | text | |
| `description` | text | |
| `url_youtube` | text | |
| `ordre` | integer | |
| `publie` | boolean | |
| `created_by` | uuid FK → profiles | |

---

### `progression`
| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `user_id` | uuid FK → auth.users |
| `cours_id` | uuid FK → cours |
| `completed` | boolean |
| `completed_at` | timestamp |

**Contrainte unique :** [(user_id, cours_id)](file:///c:/projetsholiday/tyrannus-site/src/App.jsx#19-49)

---

### `demandes_passage` — transitions de classe
| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `classe_actuelle_id` | uuid FK | Classe terminée |
| `classe_suivante_id` | uuid FK | Classe demandée |
| `statut` | text | `'en_attente'` / `'validee'` / `'rejetee'` |
| `created_at` | timestamp | |

---

## Flux de Progression (3 étapes)

```
1. Étudiant finit tous les cours d'une classe
        ↓
2. Badge diplôme + bouton "Passer à la classe suivante ?"
   → classe_id devient NULL (étudiant "libre")
   → demande_passage créée (statut: en_attente)
        ↓
3. Super Admin valide → classe_id = classe_suivante_id
```

**Pendant la période "libre"** (classe_id = NULL) :
- L'étudiant peut accéder aux **Formations Modulaires**
- Il ne voit plus les cours de son ancien cycle

---

## Formulaires d'Inscription

**Étudiant :** Nom, Prénom, Email, Téléphone + choix Cycle + choix Classe de départ  
**Professeur :** Nom, Prénom, Email, Téléphone + choix des classes assignées (multi-sélection)

---

## Accès et Guards

| Page | Condition d'accès |
|---|---|
| `/ressources` | Preview public, cours verrouillés sans connexion |
| `/login` `/register` | Page publique |
| `/etudiant/dashboard` | `role = etudiant` + `statut = valide` |
| `/prof/dashboard` | `role = professeur` + `statut = valide` |
| `/admin` | `role = super_admin` |

---

## Architecture Pages

```
src/
├── lib/supabaseClient.js
├── lib/progressionService.js
├── contexts/AuthContext.jsx
├── components/ProtectedRoute.jsx
└── pages/
    ├── Login.jsx             ← connecter Supabase
    ├── Register.jsx          ← créer (étudiant + prof)
    ├── ForgotPassword.jsx    ← OTP Supabase
    ├── Resources.jsx         ← réécrire
    ├── StudentDashboard.jsx  ← créer
    ├── ProfDashboard.jsx     ← créer
    └── SuperAdminDashboard.jsx ← créer
```

---

## Ordre d'Implémentation (MVP)

1. 🔲 Tables SQL + seed via MCP
2. 🔲 RLS policies
3. 🔲 SDK + `.env` + `supabaseClient.js`
4. 🔲 `AuthContext` + `ProtectedRoute`
5. 🔲 Login / Register / ForgotPassword
6. 🔲 Resources (cours réels)
7. 🔲 Progression + badge diplôme
8. 🔲 `ProfDashboard`
9. 🔲 `SuperAdminDashboard`
