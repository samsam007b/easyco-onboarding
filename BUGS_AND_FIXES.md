# 🐛 Bugs Identifiés et Corrections - EasyCo Platform

## 🚨 CRITIQUES (À corriger immédiatement)

### BUG #1: Applications de groupe non gérées par les owners
**Problème:** Les owners ne peuvent pas voir/gérer les applications faites par des groupes
**Impact:** Fonctionnalité groupe inutilisable pour postuler
**Fichiers affectés:**
- `app/dashboard/owner/applications/page.tsx` (besoin d'afficher group applications)
- Base: `group_applications` table existe déjà ✅

**Solution:**
```typescript
// Dans /dashboard/owner/applications
// Ajouter requête pour group_applications
const { data: groupApps } = await supabase
  .from('group_applications')
  .select(`
    *,
    groups (name, member_count),
    properties (title, address)
  `)
  .eq('properties.owner_id', userId);
```

---

### BUG #2: localStorage vs Database pour groupe
**Problème:** GroupManagement pourrait se baser sur localStorage au lieu de la DB
**Impact:** État incohérent si user rejoint groupe puis localStorage est vidé
**Fichiers affectés:**
- `components/GroupManagement.tsx`
- `app/onboarding/searcher/group-selection/page.tsx`

**Solution:** ✅ Déjà corrigé - Le composant se base sur la DB uniquement

---

### BUG #3: User peut créer groupe puis abandonner onboarding
**Problème:** User dans un groupe mais profil incomplet = matching impossible
**Impact:** Données incohérentes, expérience cassée
**Fichiers affectés:**
- `components/GroupManagement.tsx`

**Solution:**
```typescript
// Dans GroupManagement, vérifier onboarding
if (currentGroup && !userProfile.onboarding_completed) {
  return <RedirectToOnboarding />;
}
```

---

## ⚠️ HAUTES PRIORITÉS (Cette semaine)

### BUG #4: Groupe plein - pas de vérification UI
**Problème:** Si groupe plein entre invitation et acceptation, erreur générique
**Impact:** Mauvaise UX, confusion
**Fichiers affectés:**
- `app/onboarding/searcher/join-group/page.tsx`
- `components/GroupManagement.tsx`

**Solution:**
```typescript
// Avant d'afficher l'invitation, vérifier:
if (invitation.member_count >= invitation.groups.max_members) {
  return <Badge>Groupe plein</Badge>
}
```

---

### BUG #5: Pas de preview du groupe avec invite code
**Problème:** User entre un code mais ne sait pas quel groupe il rejoint
**Impact:** Mauvaise UX, erreurs de saisie
**Fichiers affectés:**
- `app/onboarding/searcher/join-group/page.tsx`

**Solution:**
```typescript
const [previewGroup, setPreviewGroup] = useState(null);

const handlePreviewCode = async (code) => {
  const { data } = await supabase
    .from('group_invitations')
    .select('*, groups(*)')
    .eq('invite_code', code)
    .single();
  setPreviewGroup(data);
};

// Afficher preview avant bouton "Join"
```

---

### BUG #6: Invitations expirées non marquées
**Problème:** Codes expirés restent en status "pending"
**Impact:** Pollution DB, messages d'erreur incorrects
**Fichiers affectés:**
- `supabase/migrations/017_create_groups_tables.sql`

**Solution:**
```sql
-- Ajouter fonction de nettoyage
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE group_invitations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Appeler via cron ou avant chaque vérification
```

---

### BUG #7: User peut changer de rôle après onboarding
**Problème:** Middleware ne bloque pas le changement de user_type
**Impact:** Données incohérentes
**Fichiers affectés:**
- `app/welcome/page.tsx`
- `middleware.ts`

**Solution:**
```typescript
// Dans welcome/page.tsx
if (userData?.onboarding_completed) {
  // Bloquer la sélection de rôle
  router.push(`/dashboard/${userData.user_type}`);
  return;
}
```

---

## 📝 VALIDATIONS MANQUANTES

### VAL #1: Group name validation
**Fichier:** `app/onboarding/searcher/create-group/page.tsx`

**Ajouter:**
```typescript
const validateGroupName = (name: string) => {
  if (name.length < 3) return 'Minimum 3 caractères';
  if (name.length > 100) return 'Maximum 100 caractères';
  if (!/^[a-zA-Z0-9\s-]+$/.test(name)) return 'Caractères spéciaux non autorisés';
  return null;
};
```

---

### VAL #2: Move-in date dans le futur
**Fichiers:** Plusieurs pages onboarding

**Ajouter:**
```typescript
const validateMoveInDate = (date: string) => {
  const selected = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) {
    return 'La date doit être dans le futur';
  }
  return null;
};
```

---

## 🎨 AMÉLIORATIONS UX

### UX #1: Loading states
**Problème:** Certains boutons n'ont pas de feedback pendant chargement
**Impact:** User clique plusieurs fois

**Solution:**
✅ Déjà implémenté dans la plupart des cas avec `isLoading` et `disabled={isLoading}`

---

### UX #2: Notification quand membre quitte groupe
**Fichier:** `supabase/migrations/017_create_groups_tables.sql`

**Ajouter trigger:**
```sql
CREATE OR REPLACE FUNCTION notify_group_member_left()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'left' AND OLD.status = 'active' THEN
    -- Notifier les autres membres
    PERFORM create_notification(...);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### UX #3: Confirmation avant actions destructives
**Fichiers:** `components/GroupManagement.tsx`

**Status:** ✅ Déjà implémenté avec `confirm()` pour Leave Group et Remove Member

---

## 🚀 OPTIMISATIONS PERFORMANCE

### PERF #1: Images non optimisées
**Problème:** Utilisation de `<img>` au lieu de `next/Image`
**Impact:** Chargement lent, pas de lazy loading

**Solution:**
```typescript
// Remplacer partout:
<img src={url} alt={alt} />
// Par:
<Image src={url} alt={alt} width={500} height={300} />
```

**Fichiers à modifier:**
- `components/PropertyCard.tsx`
- `components/ProfilePictureUpload.tsx`
- Toutes les pages avec images

---

### PERF #2: Pas de cache pour requêtes groupe
**Fichier:** `components/GroupManagement.tsx`

**Solution:** Utiliser SWR ou React Query
```typescript
import useSWR from 'swr';

const { data, error, mutate } = useSWR(
  `/api/groups/${userId}`,
  fetcher,
  { refreshInterval: 30000 } // Refresh toutes les 30s
);
```

---

## 🔒 SÉCURITÉ

### SEC #1: Rate limiting sur création de groupes
**Problème:** User peut créer 100 groupes sans limite
**Impact:** Spam, pollution DB

**Solution:** Ajouter dans RLS policy:
```sql
CREATE POLICY "Limit group creation"
ON groups FOR INSERT
WITH CHECK (
  (SELECT COUNT(*) FROM groups WHERE created_by = auth.uid()) < 5
);
```

---

### SEC #2: Validation server-side des données groupe
**Fichier:** Créer `app/api/groups/create/route.ts`

**Solution:** API route au lieu de direct DB insert
```typescript
// Valider côté serveur:
- Group name length
- Max members range (2-10)
- User authentication
- Rate limiting
```

---

## 📊 TESTS À EFFECTUER

### Test Flow #1: Créer et rejoindre groupe ✅
- [x] User A crée groupe
- [x] User A génère code
- [x] User B rejoint avec code
- [x] Les deux voient le groupe dans dashboard

### Test Flow #2: Groupe plein ⚠️
- [ ] Créer groupe max_members=2
- [ ] Ajouter 2 membres
- [ ] User C tente de rejoindre
- [ ] Vérifier erreur appropriée

### Test Flow #3: Invitation expirée ⚠️
- [ ] Générer code expiré (modifier DB)
- [ ] Tenter de rejoindre
- [ ] Vérifier message "Code expiré"

### Test Flow #4: Quitter et re-rejoindre ⚠️
- [ ] User quitte groupe
- [ ] User rejoint à nouveau
- [ ] Vérifier status correct

---

## 🔧 CORRECTIONS IMMÉDIATES

### Correction #1: Ajouter check onboarding dans GroupManagement

```typescript
// components/GroupManagement.tsx, ligne ~50
useEffect(() => {
  // Vérifier que l'onboarding est complet
  const checkOnboarding = async () => {
    const { data: user } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (!user?.onboarding_completed) {
      router.push('/onboarding/searcher/basic-info');
      return;
    }

    loadGroupData();
  };

  checkOnboarding();
}, [userId]);
```

---

### Correction #2: Bloquer changement de rôle

```typescript
// app/welcome/page.tsx, ligne ~45
useEffect(() => {
  const checkExistingRole = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user?.user_metadata?.onboarding_completed) {
      const userType = userData.user.user_metadata.user_type;
      router.push(`/dashboard/${userType}`);
      return;
    }
  };

  checkExistingRole();
}, []);
```

---

### Correction #3: Vérifier groupe plein avant affichage

```typescript
// app/onboarding/searcher/join-group/page.tsx
// Dans le render des invitations:

{invitation.member_count >= invitation.groups.max_members ? (
  <div className="bg-gray-100 p-4 rounded">
    <p className="text-gray-600">Ce groupe est complet</p>
  </div>
) : (
  <Button onClick={() => handleAcceptInvitation(invitation)}>
    Accepter
  </Button>
)}
```

---

## 📅 PLAN D'ACTION

### Aujourd'hui:
1. ✅ Diagnostic complet effectué
2. [ ] Appliquer Correction #1, #2, #3
3. [ ] Tester flows critiques
4. [ ] Commit et push

### Cette semaine:
5. [ ] Implémenter BUG #1 (Group applications UI)
6. [ ] Ajouter validations VAL #1 et VAL #2
7. [ ] Tests end-to-end complets
8. [ ] Déploiement staging

### Ce mois:
9. [ ] Optimisations PERF #1 et #2
10. [ ] Amélioration UX #2 (notifications)
11. [ ] Tests utilisateurs beta
12. [ ] Déploiement production

---

**Dernière mise à jour:** 27 Octobre 2025
**Status:** Prêt pour corrections
