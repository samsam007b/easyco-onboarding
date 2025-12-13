# 🧪 Guide de Test - Scanner OCR Amélioré

## ✅ Améliorations Déployées

Le scanner OCR a été **complètement perfectionné** pour mieux fonctionner avec les tickets français et belges.

### 🚀 Nouvelles Fonctionnalités

1. **Validation et Compression Automatique**
   - ✅ Vérifie que le fichier est bien une image
   - ✅ Compresse automatiquement les images >10MB
   - ✅ Conversion en base64 pour compatibilité maximale
   - ✅ Messages d'erreur clairs et utiles

2. **Extraction de Données Perfectionnée**
   - **Total**: Reconnaît "Grand Total", "Cash", "Total:", "SOMME", etc.
   - **Date**: Support DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
   - **Marchand**: Reconnaît 20+ chaînes françaises et belges (Delhaize, Colruyt, etc.)
   - **Fallback intelligent**: Si un champ n'est pas trouvé, utilise des heuristiques

3. **Logs Détaillés**
   - Chaque étape est loggée dans la console
   - Facile de débugger en cas de problème
   - Affiche la confiance du scan (%)

---

## 🧪 Test avec le Ticket Fourni

### Ticket de Test
Le ticket que vous avez partagé contient:
- **Marchand**: "TICKET DE CAISSE TVA" (DIDOT SPRL)
- **Date**: 24.07.2019
- **Total**: 47,90€
- **Détails**:
  - PZ 4 Saisons (14,50€)
  - PZ Campericoise (14,50€)
  - 1/2 San Rouge (9,00€)
  - Café Con Panna (7,40€)
  - Ristretto (2,50€)

### Résultats Attendus

Avec la nouvelle version, le scanner devrait extraire:

✅ **Total**: `47.90` (ou `47,90`)
- Détecté via le pattern "Grand Total: 47.90" ou "Cash 47,90"

✅ **Date**: `2019-07-24`
- Détecté via le pattern "24.07.2019"

✅ **Marchand**: `DIDOT SPRL` ou fallback sur première ligne non-générique

---

## 📝 Procédure de Test

### 1. Attendez le Déploiement Vercel

Le déploiement est en cours:
- ⏳ Temps estimé: ~2-3 minutes
- 🔗 URL: [www.izzico.be](https://www.izzico.be)

Vérifiez que le déploiement est terminé sur [Vercel Dashboard](https://vercel.com/dashboard)

### 2. Videz le Cache

**IMPORTANT**: Pour voir la nouvelle version:

**Chrome/Edge/Brave**:
1. Ouvrir DevTools (F12)
2. Clic droit sur le bouton rafraîchir
3. "Vider le cache et effectuer une actualisation forcée"

**OU utilisez la navigation privée** (Ctrl+Shift+N / Cmd+Shift+N)

### 3. Testez le Scanner

1. Allez sur **[www.izzico.be/hub/finances](https://www.izzico.be/hub/finances)**
2. Connectez-vous
3. Cliquez sur **"Scanner un ticket"**
4. Uploadez **le ticket de caisse que vous avez partagé**
5. **Ouvrez la console** (F12 → onglet Console)

### 4. Vérifiez les Résultats

Dans la console, vous devriez voir:

```
[OCR] 📸 Starting receipt scan...
[OCR] 📄 File details: { name: "...", size: ..., type: "image/..." }
[OCR] ✅ Image converted to base64
[OCR] Initializing Tesseract worker... (si première fois)
[OCR] 🔍 Starting Tesseract recognition...
[OCR] ✅ Scan completed in XXXXms
[OCR] 📊 Confidence: XX.X%
[OCR] 📝 Text length: XXX characters
[OCR] 🔍 Parsing receipt text...
[OCR] Extracting merchant from text...
[OCR] ✅ Known merchant found: ... (ou autre)
[OCR] Extracting total from text...
[OCR] ✅ Total found: 47.9 (pattern: ...)
[OCR] Extracting date from text...
[OCR] ✅ Date found: 2019-07-24
```

Si tout fonctionne, le formulaire devrait être **pré-rempli** avec:
- **Titre**: Le nom du marchand extrait
- **Montant**: 47.90 (ou proche)
- **Date**: 24/07/2019

---

## ⚠️ Troubleshooting

### Si l'OCR Échoue Encore

1. **Vérifiez la console**:
   - Cherchez `[OCR] ❌ Scan failed:`
   - Lisez le message d'erreur

2. **Erreurs Communes**:

   | Erreur | Cause | Solution |
   |--------|-------|----------|
   | `Error attempting to read image` | Image corrompue ou format non supporté | Convertir en JPEG/PNG |
   | `Failed to fetch` / `network` | CDN Tesseract.js bloqué | Vérifier connexion, firewall |
   | `Worker not initialized` | Tesseract n'a pas pu démarrer | Rafraîchir la page (F5) |

3. **Test de Fallback**:
   - Si l'OCR échoue, le formulaire devrait **rester disponible**
   - Vous pouvez **saisir manuellement** les informations
   - C'est le comportement attendu pour les images de mauvaise qualité

---

## 📊 Critères de Qualité d'Image

Pour un scan OCR réussi:

| Critère | ✅ Bon | ❌ Mauvais |
|---------|--------|------------|
| **Netteté** | Photo nette, texte lisible à l'œil | Flou, bougé |
| **Éclairage** | Bien éclairé, sans ombres | Trop sombre, surexposé |
| **Contraste** | Texte noir sur fond blanc/clair | Faible contraste |
| **État** | Ticket à plat, non froissé | Froissé, déchiré |
| **Cadrage** | Ticket entier visible, bien cadré | Coupé, angle bizarre |
| **Format** | JPEG, PNG | PDF, HEIC (non supportés) |
| **Taille** | 500KB - 10MB (optimal: 1-3MB) | <100KB ou >10MB |

---

## 🎯 Résultats Attendus

### ✅ Scénario Idéal

Avec votre ticket de caisse:
1. Upload → ✅ Accepté
2. Scan → ✅ Réussi en 5-15 secondes
3. Formulaire pré-rempli:
   - **Montant**: 47.90€
   - **Date**: 24/07/2019
   - **Marchand**: Extrait automatiquement
4. Vous vérifiez et ajustez si besoin
5. Vous choisissez une catégorie
6. Vous créez la dépense

### ⚠️ Scénario Dégradé

Si le scan échoue:
1. Upload → ✅ Accepté
2. Scan → ⚠️ Échec avec message clair
3. Formulaire vide → **saisie manuelle**
4. Vous entrez les infos manuellement
5. Reste du flow identique

---

## 📞 Que Faire Ensuite?

### Si ça Fonctionne ✅
- Testez avec d'autres tickets
- Vérifiez que les montants/dates sont exacts
- Essayez différents magasins

### Si ça ne Fonctionne Pas ❌
1. **Partagez les logs de la console**:
   - Copiez tout le log entre `[OCR] 📸 Starting...` et `[OCR] ❌ Scan failed`
   - Incluez le message d'erreur complet

2. **Testez avec un autre ticket**:
   - Prenez une photo nette d'un ticket récent
   - Bon éclairage, ticket à plat
   - Texte bien lisible à l'œil nu

3. **Vérifiez le réseau**:
   - L'OCR télécharge des fichiers depuis CDN (jsdelivr.net, tessdata.projectnaptha.com)
   - Si un firewall bloque ces domaines → OCR ne peut pas fonctionner

---

## 🚀 Prochaines Étapes (Après Tests)

Si les tests sont concluants:
- ✅ Documenter les cas d'usage réussis
- ✅ Créer un guide utilisateur pour le scanner
- ✅ Optionnellement: Ajouter d'autres patterns de tickets

Si les tests échouent systématiquement:
- ❌ Investiguer les erreurs CDN
- ❌ Envisager une alternative (OCR côté serveur avec Google Vision API)
- ❌ Ou simplifier en permettant uniquement la saisie manuelle

---

**Le scanner est maintenant prêt à être testé!** 🎉

Attendez le déploiement Vercel (2-3 min), videz le cache, et testez avec votre ticket de 47,90€.
