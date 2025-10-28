# 🔐 Guide d'Utilisation - Compte Personnel

## ❓ Pourquoi les données de démo ne sont pas visibles ?

Les données créées par `npm run seed:demo` créent des **comptes séparés** avec leurs propres IDs utilisateur. Ton compte personnel (samuel.baudon@...) existe déjà avec un ID différent.

**Résultat :**
- ❌ Les propriétés appartiennent à Jean-Marc, Isabelle, etc. (pas à toi)
- ❌ Les profils searchers sont des comptes distincts
- ❌ Ton compte n'a aucun lien avec ces données

---

## ✅ Solutions

### Option 1 : Utiliser les Comptes de Démo (RECOMMANDÉ)

Pour tester rapidement, connecte-toi avec les comptes créés :

```bash
# Searcher (chercheur de logement)
Email: sophie.laurent@demo.easyco.com
Password: Demo123!

# Owner (propriétaire)
Email: jeanmarc.petit@demo.easyco.com
Password: Demo123!

# Resident (colocataire actuel)
Email: pierre.lecomte@demo.easyco.com
Password: Demo123!
```

**Avantages :**
- ✅ Données déjà configurées
- ✅ Propriétés déjà publiées
- ✅ Profils complets
- ✅ Tous les types d'utilisateurs disponibles

---

### Option 2 : Ajouter une Propriété à Ton Compte

Pour utiliser TON compte personnel avec une propriété de test :

#### 1. Lister toutes les propriétés existantes

```bash
npm run property:list
```

Cela affiche toutes les propriétés dans la base de données.

#### 2. Ajouter une propriété à ton compte

```bash
npm run property:add votre.email@example.com
```

**Exemple :**
```bash
npm run property:add samuel.baudon@gmail.com
```

**Ce qui sera créé :**
- ✅ Profil owner si nécessaire
- ✅ Propriété de test à Ixelles
- ✅ Publiée et disponible immédiatement
- ✅ Avec images Unsplash

**Détails de la propriété :**
- 📍 Ixelles, Avenue Louise
- 🏠 2 chambres, 75m²
- 💰 €1100/mois + €120 charges
- ✅ Meublé, ascenseur, balcon

#### 3. Vérifier dans le dashboard

```bash
# Démarrer l'app
npm run dev

# Puis aller sur :
http://localhost:3000/dashboard/owner/properties
```

---

## 🎯 Cas d'Usage

### Je veux tester en tant que Propriétaire

**Avec les démos :**
```bash
Login: jeanmarc.petit@demo.easyco.com
Password: Demo123!
```

**Avec ton compte :**
```bash
npm run property:add ton.email@example.com
# Puis login avec ton compte habituel
```

### Je veux tester en tant que Chercheur

**Avec les démos :**
```bash
Login: sophie.laurent@demo.easyco.com
Password: Demo123!
```

**Avec ton compte :**
Tu devras modifier ton profil pour être de type "searcher" dans Supabase Dashboard :
1. Aller sur Supabase Dashboard
2. Table Editor > user_profiles
3. Trouver ton user_id
4. Changer `user_type` à `'searcher'`
5. Ajouter `budget_min`, `budget_max`, `preferred_cities`

### Je veux tester en tant que Colocataire

**Avec les démos :**
```bash
Login: pierre.lecomte@demo.easyco.com
Password: Demo123!
```

---

## 📊 Comparaison

| Aspect | Comptes Démo | Ton Compte Personnel |
|--------|--------------|---------------------|
| **Setup** | Automatique | Nécessite script |
| **Données** | Complètes | À configurer |
| **Propriétés** | 5 existantes | À créer |
| **Profils** | Variés (12) | Le tien uniquement |
| **Mot de passe** | Demo123! | Ton mot de passe |
| **Email** | @demo.easyco.com | Ton vrai email |

---

## 🛠️ Commandes Disponibles

### Voir toutes les propriétés
```bash
npm run property:list
```

**Output exemple :**
```
✅ Superbe appartement 2 chambres - Ixelles
   📍 Ixelles - Flagey
   🏠 apartment | 🛏️  2ch | 🚿 1 SDB
   💰 €1250/mois + €150 charges = €1400 total
   ✅ Status: published (Available)
   👤 Owner: Jean-Marc Petit (jeanmarc.petit@demo.easyco.com)
```

### Ajouter une propriété à un compte
```bash
npm run property:add <email>
```

### Créer tous les comptes de démo
```bash
npm run seed:demo
```

---

## 🔄 Workflow Recommandé

### Pour Développement Rapide
1. ✅ Utiliser les comptes de démo
2. ✅ Login avec différents comptes pour tester flows
3. ✅ Données déjà prêtes

### Pour Tests Personnalisés
1. ✅ Créer propriété sur ton compte : `npm run property:add ton.email`
2. ✅ Login avec ton compte
3. ✅ Tester avec tes propres données

### Pour Tests Complets
1. ✅ `npm run seed:demo` (données de base)
2. ✅ `npm run property:add ton.email` (ta propriété)
3. ✅ Tester à la fois avec démos et ton compte

---

## 🗑️ Nettoyage

### Supprimer ta propriété de test

```sql
-- Via Supabase Dashboard > SQL Editor
DELETE FROM properties
WHERE owner_id = (
  SELECT user_id FROM user_profiles
  WHERE email = 'ton.email@example.com'
);
```

### Supprimer toutes les données de démo

```sql
DELETE FROM properties WHERE owner_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%@demo.easyco.com'
);
DELETE FROM user_profiles WHERE email LIKE '%@demo.easyco.com';
```

Puis supprimer les users Auth dans :
- Supabase Dashboard > Authentication > Users

---

## 💡 Conseils

### Pour bien tester :

1. **Commence avec les démos** - C'est le plus rapide
   ```bash
   npm run seed:demo
   # Login: sophie.laurent@demo.easyco.com / Demo123!
   ```

2. **Ajoute une propriété perso** si tu veux tester ton dashboard owner
   ```bash
   npm run property:add ton.email@example.com
   ```

3. **Utilise les deux** pour comparer comportements
   - Démos = données complètes et variées
   - Ton compte = contrôle total

### Pour voir les données :

```bash
# Liste toutes les propriétés
npm run property:list

# Voir dans Supabase Dashboard
# Table Editor > properties
# Table Editor > user_profiles
```

---

## ❓ FAQ

### Q : Pourquoi créer des comptes séparés ?
**R :** Les données de démo sont isolées pour éviter de polluer ton compte principal.

### Q : Puis-je voir les propriétés de démo en tant que searcher ?
**R :** Oui ! Les propriétés `published` sont visibles par tous les searchers, même avec ton compte personnel (si ton profil est de type `searcher`).

### Q : Comment tester le matching ?
**R :** Login avec un compte searcher (Sophie, Ahmed, etc.) qui a des `preferred_cities` et `budget_min/max` configurés.

### Q : Les images fonctionnent-elles offline ?
**R :** Non, elles viennent d'Unsplash. Une connexion internet est nécessaire.

---

## 📞 Besoin d'Aide ?

Si tu rencontres des problèmes :

1. Vérifie que `.env.local` contient :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. Liste les propriétés pour vérifier :
   ```bash
   npm run property:list
   ```

3. Vérifie dans Supabase Dashboard :
   - Authentication > Users (voir les comptes créés)
   - Table Editor > properties (voir les propriétés)

---

**Bon développement ! 🚀**
