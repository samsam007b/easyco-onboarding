# 🐛 Debug: Failed to Save Profile

## Problème
L'erreur "Failed to save profile" apparaît lors de la soumission du profil searcher.

## Pour diagnostiquer, j'ai besoin de voir l'erreur exacte

### Option 1: Console Safari (Mac)
1. Menu **Safari** → **Réglages** (Préférences)
2. Onglet **Avancées**
3. Cocher **"Afficher le menu Développement dans la barre des menus"**
4. Menu **Développement** → **Afficher la Console Web**
   (ou raccourci: **Cmd + Option + C**)
5. Retourner sur la page review
6. Cliquer "Submit My Profile"
7. Dans la console, chercher les messages en **rouge**
8. Copier tout le texte de l'erreur

### Option 2: Chrome/Brave (plus simple)
1. Ouvrir http://localhost:3001 dans Chrome ou Brave
2. **Cmd + Option + J** (ouvre directement la console)
3. Cliquer "Submit My Profile"
4. Copier l'erreur rouge

## Ce que je cherche

L'erreur devrait ressembler à quelque chose comme:

```
Error saving onboarding data: [message d'erreur]
  at saveOnboardingData (onboarding-helpers.ts:XX)
  ...
```

ou

```
PostgresError: column "xxx" does not exist
```

ou

```
Error: insert or update on table "user_profiles" violates check constraint "..."
```

## Hypothèses probables

1. **Nom de colonne incorrect**
   - Le champ s'appelle `languages` dans le local storage mais `languages_spoken` dans la DB

2. **Contrainte CHECK violation**
   - Une valeur ne respecte pas les contraintes (ex: age hors range 18-100)

3. **RLS Policy block**
   - L'utilisateur n'a pas les permissions d'insérer dans user_profiles

4. **Type de données incorrect**
   - Un nombre est envoyé comme string ou vice-versa

## Solution temporaire

Pour contourner et tester, on peut:
1. Regarder directement dans Supabase Dashboard les logs
2. Désactiver temporairement les contraintes CHECK
3. Ajouter plus de logging dans le code

## Prochaine étape

Une fois que j'ai le message d'erreur exact, je peux:
- Identifier exactement quel champ pose problème
- Corriger le mapping camelCase ↔ snake_case
- Ajuster les contraintes si nécessaire
- Fix le code en 2 minutes
