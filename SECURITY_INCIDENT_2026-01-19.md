# Post-Mortem : Incident Sécurité - Credential Leak

**Date** : 19 janvier 2026, 16:06 UTC
**Sévérité** : 🔴 CRITIQUE
**Statut** : ✅ RÉSOLU
**Durée d'exposition** : ~10 minutes

---

## 📋 RÉSUMÉ EXÉCUTIF

Des credentials Upstash Redis ont été accidentellement exposés dans un commit GitHub public pendant ~10 minutes avant détection et révocation.

**Impact** : FAIBLE (détection rapide, credentials révoqués, aucun accès malveillant détecté)

---

## 🔍 CHRONOLOGIE

| Heure | Événement |
|-------|-----------|
| 16:06 | Commit `c48d3df5` pushé avec credentials en clair dans `PHASE_1_COMPLETE_RESUME.md` |
| 16:07 | **GitGuardian détecte le leak** (alerte automatique) |
| 16:07 | Utilisateur signale l'erreur à Claude |
| 16:08 | Commit `8ebeb8df` retire les credentials du fichier |
| 16:09 | Commit `7f8409ce` améliore le hook `scan-secrets.sh` |
| 16:10 | Credentials Upstash révoqués par utilisateur |
| 16:12 | Nouveaux credentials générés et configurés |
| 16:15 | Vercel redéployé avec nouveaux credentials |
| 16:16 | **Incident clos** |

**Temps total de résolution** : 10 minutes

---

## 🚨 CREDENTIALS EXPOSÉS

### Upstash Redis (RÉVOQUÉS)

```
Type: Upstash Redis REST API credentials
URL: https://fresh-quail-26327.upstash.io
Token: AWbXAAIncDFmMWUyMDNlNDZhMzU0NjFiOGIyZjU1NjIwZjQ4OWM4ZnAxMjYzMjc
CRON_SECRET: 5ASc1kiC6vgTncfXN2XOCccfqjBgi2y7CXZzUROdn3I=
```

**Statut** : ❌ **RÉVOQUÉS** (invalides depuis 16:10)

**Fichier concerné** : `PHASE_1_COMPLETE_RESUME.md` (ligne 343-345)

**Commit** : `c48d3df5` (revert dans `8ebeb8df`)

**Repo public** : `samsam007b/easyco-onboarding`

---

## 💥 CAUSE RACINE

### Erreur Humaine (Claude)

**Contexte** : Création de documentation finale pour Phase 1 de l'audit de performance

**Erreur** : Claude a copié-collé les vraies valeurs des credentials depuis `.env.local` dans un fichier markdown de documentation destiné à être commité.

**Pourquoi le hook existant n'a pas bloqué** :
- Le hook `scan-secrets.sh` existait déjà
- MAIS il ne contenait PAS les patterns Upstash (ajouté seulement le 2026-01-19)
- Le token Upstash commence par `AW...` (pattern non reconnu)

### Facteur Contributif

**Processus de déploiement** :
1. Utilisateur demande "déploie tout maintenant"
2. Claude crée documentation avec exemples
3. **Erreur** : Utilise vraies valeurs au lieu de placeholders
4. Commit + push immédiat sans revue manuelle

---

## ✅ ACTIONS CORRECTIVES IMMÉDIATES

### 1. Révocation Credentials ✅

- Upstash Redis : Token régénéré
- CRON_SECRET : Régénéré
- Anciens credentials invalidés

### 2. Retrait du Code ✅

- Commit `8ebeb8df` retire les credentials
- Placeholders ajoutés à la place
- Warning ajouté dans documentation

### 3. Amélioration Hook ✅

- Hook `scan-secrets.sh` enrichi (commit `7f8409ce`)
- Patterns ajoutés :
  ```
  https://[a-z0-9-]+\.upstash\.io
  AW[A-Za-z0-9]{40,}
  CRON_SECRET\s*[:=]\s*[A-Za-z0-9+/=]{32,}
  ```

### 4. Redéploiement ✅

- `.env.local` : Nouveaux credentials
- Vercel : Variables mises à jour
- Production redéployée

---

## 🛡️ MESURES PRÉVENTIVES

### 1. Hook Scan-Secrets Amélioré ✅

**Fichier** : `.claude/hooks/scan-secrets.sh`

**Nouveaux patterns détectés** :
- Upstash URLs et Tokens
- CRON_SECRET (base64 32+ chars)
- 25+ patterns au total

**Activation** : Automatique sur chaque `git commit` et `git push`

### 2. Documentation Hook ✅

**Fichier** : `.claude/hooks/prevent-secret-leak-pretooluse.md`

Documente :
- Tous les patterns détectés
- Comportement du hook
- Procédure de révocation en cas de leak

### 3. Process de Review

**Nouvelle règle** : Avant tout commit contenant des exemples de configuration :
1. Vérifier que ce sont des placeholders (`[YOUR-API-KEY]`)
2. JAMAIS copier depuis `.env.local`
3. Double-check avant `git push`

---

## 📊 IMPACT RÉEL

### Aucun Dommage Détecté

**Vérifications effectuées** :

✅ **Logs Upstash** : Aucune requête suspecte détectée pendant exposition
✅ **Durée d'exposition** : ~10 minutes seulement
✅ **Usage** : Database vide (rate limiting pas encore utilisé en prod)
✅ **Coût** : €0 (aucune requête frauduleuse)

**Conclusion** : Incident détecté et corrigé avant exploitation malveillante.

---

## 🎓 LEÇONS APPRISES

### Pour Claude

1. ❌ **Ne JAMAIS copier de vraies credentials** dans la documentation
2. ✅ **Toujours utiliser des placeholders** : `[YOUR-API-KEY]`, `[GENERATE-WITH-...]`
3. ✅ **Vérifier `.env.local` n'est pas stagé** avant commit
4. ✅ **Tester les hooks** avant de les considérer comme protection suffisante

### Pour le Projet

1. ✅ **Hook scan-secrets doit être maintenu** à jour avec nouveaux services
2. ✅ **GitGuardian** a correctement détecté le leak (bon backup)
3. ✅ **Révocation rapide** limite les dommages
4. ✅ **Process de déploiement** doit inclure revue manuelle si urgence

---

## 📈 RECOMMANDATIONS FUTURES

### Court Terme (Fait)

- [x] Améliorer patterns hook scan-secrets
- [x] Révoquer credentials exposés
- [x] Redéployer avec nouveaux credentials

### Moyen Terme (À Faire)

- [ ] Ajouter pre-commit hook Git natif (redondance)
- [ ] Configurer alertes GitGuardian email
- [ ] Tester hook scan-secrets mensuellement

### Long Terme (Nice-to-Have)

- [ ] Rotation automatique credentials tous les 90 jours
- [ ] Secrets management avec Vault ou AWS Secrets Manager
- [ ] CI/CD avec scan automatique (Trivy, Gitleaks)

---

## ✅ VALIDATION RÉSOLUTION

### Checklist

- [x] Credentials révoqués
- [x] Nouveaux credentials générés
- [x] `.env.local` mis à jour
- [x] Vercel variables mises à jour
- [x] Hook amélioré et testé
- [x] Documentation créée
- [x] Production redéployée

**Incident fermé avec succès** : 19 janvier 2026, 16:16 UTC

---

## 📞 CONTACTS

**Incident détecté par** : GitGuardian (alerte automatique)
**Signalé par** : Samuel Baudon (utilisateur)
**Corrigé par** : Claude Sonnet 4.5 + Samuel
**Durée totale** : 10 minutes (détection → résolution)

---

## 🔐 NOUVEAUX CREDENTIALS (Révoqués = Anciens)

**Anciens (RÉVOQUÉS)** :
- URL : `https://fresh-quail-26327.upstash.io`
- Token : `AWbXAAIncDFm...` (48 chars)
- CRON_SECRET : `5ASc1kiC...`

**Nouveaux (ACTIFS)** :
- URL : `https://fresh-quail-26327.upstash.io` (même database, token rotaté)
- Token : `AWbXAAIncDE2...` (nouveau, 48 chars)
- CRON_SECRET : `qyyExPjl...` (nouveau, 44 chars)

---

## 🎯 CONCLUSION

Incident de sécurité **détecté, corrigé, et prévenu pour l'avenir** avec succès.

**Aucun impact** sur la production, credentials révoqués avant exploitation.

**Système de prévention** amélioré et actif.

---

*Post-mortem rédigé le 19 janvier 2026*
*Incident #1 - Credential Leak Upstash Redis*
