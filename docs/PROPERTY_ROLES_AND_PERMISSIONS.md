# Système de Rôles et Permissions pour les Résidences

## Vue d'ensemble

Ce document décrit le système de rôles et permissions implémenté pour gérer l'accès aux fonctionnalités de gestion des résidences dans l'application EasyCo.

## Rôles disponibles

### 1. **Owner** (Propriétaire)
- **Description** : Le propriétaire légal de la résidence
- **Comment obtenir ce rôle** : En utilisant le `owner_code` fourni lors de la création de la résidence
- **Permissions** : Accès complet à toutes les fonctionnalités

### 2. **Main Resident** (Résident Principal)
- **Description** : La personne qui a créé la résidence dans l'application
- **Comment obtenir ce rôle** : Automatiquement attribué lors de la création d'une nouvelle résidence
- **Caractéristiques** :
  - `is_creator = TRUE` dans la base de données
  - Accès aux codes d'invitation et owner code
  - Peut gérer les membres et les documents
  - Permissions élevées mais pas total control

### 3. **Resident** (Résident Standard)
- **Description** : Colocataire qui a rejoint via un code d'invitation
- **Comment obtenir ce rôle** : En rejoignant une résidence existante avec un code d'invitation
- **Caractéristiques** :
  - `is_creator = FALSE`
  - Permissions limitées
  - Peut consulter et participer mais pas gérer

## Matrice de Permissions

| Permission | Owner | Main Resident | Resident |
|-----------|-------|---------------|----------|
| Voir la propriété | ✅ | ✅ | ✅ |
| Modifier la propriété | ✅ | ✅ | ❌ |
| Supprimer la propriété | ✅ | ❌ | ❌ |
| Gérer les membres | ✅ | ✅ | ❌ |
| Voir les codes d'invitation | ✅ | ✅ | ✅ |
| Voir le code propriétaire | ✅ | ✅ | ❌ |
| Gérer les documents | ✅ | ✅ | ❌ |
| Upload documents personnels | ✅ | ✅ | ✅ |
| Gérer les finances | ✅ | ✅ | ✅ |
| Créer/gérer les règles | ✅ | ✅ | ❌ |
| Voter sur les règles | ✅ | ✅ | ✅ |

## Migrations Base de Données

### Migration 1 : Ajout des rôles et permissions
**Fichier** : `20250114_add_property_member_roles.sql`

```sql
-- Ajoute le champ is_creator
ALTER TABLE property_members ADD COLUMN is_creator BOOLEAN DEFAULT FALSE;

-- Étend les rôles pour inclure 'owner' et 'main_resident'
ALTER TABLE property_members DROP CONSTRAINT property_members_role_check;
ALTER TABLE property_members ADD CONSTRAINT property_members_role_check
  CHECK (role IN ('resident', 'tenant', 'roommate', 'owner', 'main_resident'));
```

### Migration 2 : Fonctions de création et jonction
**Fichier** : `20250114_create_resident_property_function.sql`

Crée 3 fonctions principales :

1. **create_resident_property** : Crée une propriété et assigne le créateur comme main_resident
2. **join_property_as_resident** : Permet de rejoindre une propriété comme résident standard
3. **claim_property_as_owner** : Permet au propriétaire légal de revendiquer la propriété

## Utilisation côté Frontend

### Hook usePropertyPermissions

```typescript
import { usePropertyPermissions } from '@/lib/hooks/usePropertyPermissions';

function MyComponent() {
  const {
    role,
    isCreator,
    isOwner,
    isMainResident,
    canEditProperty,
    canManageMembers,
    hasPermission
  } = usePropertyPermissions(propertyId);

  // Vérifier une permission spécifique
  if (hasPermission('manage_documents')) {
    // Afficher le bouton de gestion des documents
  }

  // Vérifier le rôle
  if (isMainResident) {
    // Afficher les codes d'invitation
  }
}
```

### Mise à jour de property-setup/page.tsx

Le fichier doit maintenant utiliser :
- `create_resident_property` pour créer une résidence (attribue role='main_resident', is_creator=TRUE)
- `join_property_as_resident` pour rejoindre (attribue role='resident', is_creator=FALSE)

## Parcours Utilisateur

### Parcours 1 : Création d'une résidence
1. Utilisateur clique sur "Créer une colocation"
2. Remplit le formulaire (nom, adresse, ville, etc.)
3. Système appelle `create_resident_property`
4. Utilisateur devient **Main Resident** (is_creator=TRUE, role='main_resident')
5. Codes générés : `invitation_code` et `owner_code`
6. Redirection vers le hub avec accès complet

### Parcours 2 : Rejoindre une résidence
1. Utilisateur clique sur "Rejoindre une colocation"
2. Entre le code d'invitation
3. Système appelle `join_property_as_resident`
4. Utilisateur devient **Resident** standard (is_creator=FALSE, role='resident')
5. Redirection vers le hub avec permissions limitées

### Parcours 3 : Revendiquer comme propriétaire
1. Utilisateur possède le `owner_code`
2. Utilise la fonctionnalité "Revendiquer la propriété"
3. Système appelle `claim_property_as_owner`
4. Rôle mis à jour vers **Owner** (role='owner')
5. Accès complet à toutes les fonctionnalités

## Interface Onboarding Complémentaire

### Pour Main Resident
Après création, afficher un modal/page avec :
- ✅ Codes d'invitation (à partager avec colocataires)
- ✅ Code propriétaire (à donner au propriétaire légal)
- ℹ️ Explication des permissions
- 📋 Guide des prochaines étapes :
  - Inviter des colocataires
  - Ajouter une photo de la résidence
  - Configurer les finances
  - Définir les règles de la maison

### Pour Resident Standard
Après avoir rejoint :
- 👋 Message de bienvenue
- 📝 Présentation de la résidence
- ℹ️ Explication des fonctionnalités disponibles
- 🚫 Informations sur les limitations (pas d'accès à certaines fonctionnalités de gestion)

### Pour Owner
Interface spéciale avec :
- 🏠 Gestion complète de la propriété
- 👥 Gestion des membres (ajouter/retirer)
- 💰 Gestion financière avancée
- 📄 Gestion des documents officiels
- ⚙️ Paramètres de la résidence

## Exemples de Code

### Vérifier si l'utilisateur peut voir le owner code

```tsx
import { usePropertyPermissions } from '@/lib/hooks/usePropertyPermissions';

function InvitationCodesDisplay({ propertyId }: { propertyId: string }) {
  const { canViewOwnerCode, isOwner, isMainResident } = usePropertyPermissions(propertyId);

  return (
    <div>
      {/* Tout le monde voit le code d'invitation */}
      <div>
        <label>Code pour les colocataires</label>
        <p>{invitationCode}</p>
      </div>

      {/* Seulement Main Resident et Owner voient le owner code */}
      {canViewOwnerCode && (
        <div>
          <label>Code propriétaire</label>
          <p>{ownerCode}</p>
          {isMainResident && (
            <span className="text-sm text-gray-600">
              Partagez ce code avec le propriétaire légal
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

### Afficher les boutons conditionnellement

```tsx
function PropertyActions({ propertyId }: { propertyId: string }) {
  const {
    canEditProperty,
    canManageMembers,
    role
  } = usePropertyPermissions(propertyId);

  return (
    <div className="flex gap-2">
      {canEditProperty && (
        <Button onClick={() => router.push('/settings/residence-profile')}>
          Modifier
        </Button>
      )}

      {canManageMembers && (
        <Button onClick={() => setShowInviteModal(true)}>
          Inviter
        </Button>
      )}

      {role === 'owner' && (
        <Button variant="destructive" onClick={handleDelete}>
          Supprimer
        </Button>
      )}
    </div>
  );
}
```

## TODO - Prochaines Étapes

- [ ] Appliquer les migrations à la base de données Supabase
- [ ] Mettre à jour `property-setup/page.tsx` pour utiliser les nouvelles fonctions
- [ ] Créer l'interface onboarding complémentaire pour main_resident
- [ ] Créer l'interface spéciale pour owner (claim property flow)
- [ ] Tester les 3 parcours utilisateur
- [ ] Ajouter des tests unitaires pour le hook usePropertyPermissions
- [ ] Documenter les endpoints API

## Notes Importantes

1. **Sécurité** : Toutes les fonctions DB utilisent `SECURITY DEFINER` pour bypasser RLS de manière contrôlée
2. **Cache** : Le propertyId est mis en cache dans sessionStorage pour performance
3. **Validation** : Les codes sont automatiquement convertis en UPPERCASE et trimmed
4. **Unique constraint** : Un utilisateur ne peut avoir qu'une seule adhésion active par propriété

## Support

Pour toute question sur l'implémentation du système de rôles et permissions, consultez :
- `/lib/hooks/usePropertyPermissions.ts` - Hook principal
- `/supabase/migrations/20250114_add_property_member_roles.sql` - Migration DB
- `/supabase/migrations/20250114_create_resident_property_function.sql` - Fonctions DB
