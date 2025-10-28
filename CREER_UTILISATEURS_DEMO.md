# Guide : Créer les Utilisateurs Demo

## Problème

Le script SQL ne peut pas créer les profils car les utilisateurs Auth n'existent pas encore.

## Solution Rapide : Créer manuellement via Supabase Dashboard

### Étape 1 : Ouvrir Supabase Dashboard

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner le projet EasyCo
3. Cliquer sur **Authentication** dans la sidebar
4. Cliquer sur **Users**
5. Cliquer sur **Add user** (bouton vert en haut à droite)

### Étape 2 : Créer les 11 utilisateurs

Pour chaque utilisateur ci-dessous, cliquer sur "Add user" et remplir :

#### Searchers (5)

1. **Ahmed El Mansouri**
   - Email: `ahmed.elmansouri@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅ (cocher)

2. **Emma Van Der Berg**
   - Email: `emma.vanderberg@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

3. **Lucas Dubois**
   - Email: `lucas.dubois@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

4. **Maria Santos**
   - Email: `maria.santos@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

#### Owners (4)

5. **Jean-Marc Petit**
   - Email: `jeanmarc.petit@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

6. **Isabelle Moreau**
   - Email: `isabelle.moreau@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

7. **Thomas Janssens**
   - Email: `thomas.janssens@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

8. **Sophie Vermeulen**
   - Email: `sophie.vermeulen@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

#### Residents (3)

9. **Pierre Lecomte**
   - Email: `pierre.lecomte@demo.easyco.com`
   - Password: `Demo123!`
   - Auto Confirm User: ✅

10. **Laura Gonzalez**
    - Email: `laura.gonzalez@demo.easyco.com`
    - Password: `Demo123!`
    - Auto Confirm User: ✅

11. **Maxime Dubois**
    - Email: `maxime.dubois@demo.easyco.com`
    - Password: `Demo123!`
    - Auto Confirm User: ✅

### Étape 3 : Vérifier

Une fois tous les utilisateurs créés, tu devrais voir **12 utilisateurs** avec `@demo.easyco.com` dans la liste (incluant Sophie qui existe déjà).

### Étape 4 : Lancer le script SQL

Maintenant que les utilisateurs Auth existent, tu peux :

1. Ouvrir **SQL Editor**
2. Copier le contenu de `supabase/seed-demo-final.sql`
3. Coller et **Run**

Le script va créer les profils et les propriétés ! ✅

---

## Alternative : Script SQL pour créer les utilisateurs

Si tu préfères, tu peux aussi créer les utilisateurs via SQL, mais c'est plus complexe car il faut hasher les mots de passe avec bcrypt.

---

## Note

Sophie Laurent existe déjà (créée lors d'un test précédent), donc tu n'as besoin de créer que les 11 autres.
