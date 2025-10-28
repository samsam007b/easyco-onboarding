# 👀 Comment Voir les Données de Démo avec Ton Compte

## ✅ Réponse Courte

**OUI**, tu peux voir toutes les propriétés et profils des autres utilisateurs avec ton compte personnel !

---

## 🚀 Étapes Simples

### 1. Créer les données de démo

```bash
npm run seed:demo
```

Cela crée :
- 5 propriétaires (Jean-Marc, Isabelle, Thomas, Sophie V.)
- 5 propriétés à Bruxelles (TOUTES PUBLIQUES)
- 5 chercheurs
- 3 colocataires

### 2. Login avec ton compte

```bash
npm run dev
# Aller sur http://localhost:3000/login
# Login avec TON compte (samuel.baudon@...)
```

### 3. Voir les propriétés

Va sur : **`/properties/browse`**

http://localhost:3000/properties/browse

**Tu verras :**
- ✅ Toutes les 5 propriétés de démo
- ✅ Les infos des propriétaires
- ✅ Les prix, photos, descriptions
- ✅ Possibilité de filtrer, rechercher

---

## 🏠 Ce Que Tu Verras

### Page `/properties/browse`

```
┌──────────────────────────────────────────┐
│  🏠 Propriétés Disponibles              │
├──────────────────────────────────────────┤
│                                          │
│  ✅ Appt 2ch Ixelles - €1250/mois      │
│  👤 Jean-Marc Petit                     │
│  📍 Ixelles - Flagey                    │
│                                          │
│  ✅ Studio Schaerbeek - €650/mois      │
│  👤 Thomas Janssens                     │
│  📍 Schaerbeek - Diamant                │
│                                          │
│  ✅ Coliving Forest - €695/mois        │
│  👤 Sophie Vermeulen                    │
│  📍 Forest - Altitude 100               │
│                                          │
│  ... etc (5 propriétés au total)        │
│                                          │
└──────────────────────────────────────────┘
```

### Page `/properties/[id]` (Détails)

Clique sur une propriété pour voir :
- ✅ Description complète
- ✅ Photos (Unsplash)
- ✅ Infos propriétaire (nom, email, bio)
- ✅ Toutes les amenities
- ✅ Prix détaillés
- ✅ Bouton pour postuler

---

## 📊 Voir les Profils

### Propriétaires

Les infos des propriétaires sont affichées :
1. Sur la carte de la propriété
2. Sur la page détail `/properties/[id]`
3. Nom, email, bio, expérience

**Exemple :**
```
👤 Jean-Marc Petit
📧 jeanmarc.petit@demo.easyco.com
⭐ Expérience: 5 ans
📝 "Propriétaire d'un appartement rénové..."
```

### Chercheurs (Searchers)

Pour voir les profils des chercheurs, il faudra créer :
- Une page `/profiles` ou `/searchers`
- Qui liste tous les profils searchers

*(Pas encore implémenté, mais facile à faire)*

### Colocataires (Residents)

Pour voir les résidents actuels :
- Page `/residents` ou dans le système de matching
- Afficher qui habite dans quelles propriétés

*(Pas encore implémenté)*

---

## 🔐 Permissions (RLS)

### Ce qui est PUBLIC (visible par tous)

✅ **Propriétés avec `status = 'published'`**
- N'importe qui connecté peut les voir
- C'est géré par la RLS policy:
  ```sql
  "Public properties are viewable by everyone"
  ```

✅ **Profils publics**
- Les infos de base des utilisateurs
- Nom, bio, etc.

### Ce qui est PRIVÉ

❌ **Propriétés en draft**
- Seulement visibles par le propriétaire

❌ **Infos sensibles**
- Numéros de téléphone privés
- Documents de vérification
- Messages privés

---

## 🎯 Résumé

| Question | Réponse |
|----------|---------|
| **Puis-je voir les propriétés des autres ?** | ✅ OUI (si publiées) |
| **Puis-je voir les propriétaires ?** | ✅ OUI (infos de base) |
| **Puis-je voir les chercheurs ?** | ⚠️ Pas encore de page dédiée |
| **Puis-je voir les résidents ?** | ⚠️ Pas encore de page dédiée |
| **Dois-je créer un compte séparé ?** | ❌ NON, utilise ton compte |

---

## 💡 Prochaines Étapes

Pour avoir une vue complète de tous les utilisateurs, on peut créer :

### 1. Page Admin (`/admin/users`)
- Liste de tous les utilisateurs
- Filtrer par type (owner/searcher/resident)
- Voir les détails de chaque profil

### 2. Page Searchers (`/searchers`)
- Liste publique des chercheurs
- Leurs préférences
- Leur budget
- Pour le matching

### 3. Page Residents (`/residents`)
- Colocataires actuels
- Propriétés où ils habitent
- Pour trouver des colocataires

**Veux-tu que je crée une de ces pages ? 🚀**

---

## ✅ Pour Tester Maintenant

```bash
# 1. Créer les données
npm run seed:demo

# 2. Lancer l'app
npm run dev

# 3. Login avec ton compte
# http://localhost:3000/login

# 4. Voir les propriétés
# http://localhost:3000/properties/browse

# 5. Cliquer sur une propriété pour voir les détails
```

**C'est tout ! Tu verras toutes les données de démo** 🎉
