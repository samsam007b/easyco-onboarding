---
name: prevent-secret-leak
description: Empêche les commits contenant des credentials, API keys, ou secrets
events: [PreToolUse]
prompts:
  - git commit
  - git push
  - git add
---

# Hook de Sécurité : Prévention Leak de Secrets

Ce hook bloque automatiquement les commits contenant des credentials ou secrets.

## Patterns Détectés

- API Keys (32+ caractères)
- URLs Upstash (`https://xxx.upstash.io`)
- Tokens Upstash (`AW...`)
- JWT Supabase (`eyJ...`)
- Clés Stripe (`sk_live_`, `sk_test_`)
- AWS Access Keys (`AKIA...`)
- Patterns génériques : `api_key=`, `secret_key=`, `password=`, `token=`

## Fichiers Toujours Bloqués

- `.env.local`
- `.env.production`
- `.env`
- `.env.development`
- Tout fichier contenant "secret" ou "credential" dans le nom

## Comportement

1. **Scan avant chaque `git commit` ou `git push`**
2. **Bloque** si secret détecté
3. **Affiche** : fichier + type de secret + action corrective
4. **Graceful degradation** : en cas d'erreur du hook, laisse passer (ne bloque pas le workflow)

## Utilisation

Le hook est automatiquement activé. Aucune configuration requise.

Si un commit est bloqué :
1. Retirer la valeur secrète (remplacer par placeholder comme `[YOUR-API-KEY]`)
2. Re-commiter
3. Si faux positif : utiliser `git commit --no-verify` (déconseillé)

## Exemple de Message de Blocage

```
🚨 SÉCURITÉ CRITIQUE : Secret détecté dans le commit !

Fichier : PHASE_1_COMPLETE_RESUME.md
Type : Upstash Token
Pattern trouvé : AWbXAAIncDFmMWUyMDNlNDZh...

Les secrets ne doivent JAMAIS être commités dans Git.

Actions :
1. Retirer la valeur secrète du fichier
2. git add PHASE_1_COMPLETE_RESUME.md
3. Re-commiter

COMMIT BLOQUÉ.
```

## Limitations

- Ne détecte que les patterns connus
- Peut avoir des faux positifs
- Ne scanne pas les fichiers binaires
- Ne protège pas contre les secrets obfusqués

## Révocation en Cas de Leak

Si un secret a été exposé malgré le hook :

1. **Révoquer immédiatement** le secret sur le service concerné
2. **Générer** un nouveau secret
3. **Updater** `.env.local` et Vercel avec nouveau secret
4. **Vérifier** l'historique Git : `git log --all --full-history -- "*secret*"`
5. **(Optionnel)** Utiliser BFG Repo-Cleaner pour nettoyer l'historique

---

*Hook créé le 19 janvier 2026 suite à incident de leak Upstash*
