# 🧾 Guide de Test - Extraction des Articles du Ticket OCR

## ✅ Nouvelle Fonctionnalité Déployée

Le scanner OCR **extrait maintenant les articles détaillés** du ticket! Plus besoin de tout encoder manuellement. 🎉

### 🚀 Ce Qui a Été Ajouté

#### 1. **Extraction Intelligente des Articles**

Le scanner reconnaît **4 formats de ticket différents**:

**Format 1**: Avec quantité explicite
```
1  PZ 4 Saisons      14,50   14,50 B
```
→ Quantité: 1, Nom: "PZ 4 Saisons", PU: 14,50€, Total: 14,50€

**Format 2**: Sans quantité (implicite = 1)
```
PZ Campericoise      14,50   14,50 B
```
→ Nom: "PZ Campericoise", PU: 14,50€, Total: 14,50€

**Format 3**: Format compact (2x Article)
```
2x Pain complet      4,80
```
→ Quantité: 2, Nom: "Pain complet", Total: 4,80€ (PU: 2,40€)

**Format 4**: Format simple
```
Café Con Panna  7,40
```
→ Nom: "Café Con Panna", Total: 7,40€

#### 2. **Affichage des Articles Extraits**

Dans l'étape "Vérifiez les informations", vous verrez maintenant:

✨ **Section "Articles détectés (X)"** avec:
- Liste scrollable des articles
- Nom de l'article
- Prix total
- Quantité (si >1)
- Prix unitaire (si différent du total)
- Design vert (= succès OCR)

---

## 🧪 Test avec le Ticket Fourni

### Ticket de Test (47,90€)

Votre ticket contient **5 articles**:
1. **PZ 4 Saisons** - 14,50€
2. **PZ Campericoise** - 14,50€
3. **1/2 San Rouge** - 9,00€
4. **Café Con Panna** - 7,40€
5. **Ristretto** - 2,50€

**Total**: 47,90€

### Résultats Attendus

Avec la nouvelle version, après le scan, vous devriez voir:

✅ **Montant**: 47,9€
✅ **Date**: 03/07/2019
✅ **Articles détectés (5)**:
- PZ 4 Saisons - 14,50€
- PZ Campericoise - 14,50€
- 1/2 San Rouge - 9,00€
- Café Con Panna - 7,40€
- Ristretto - 2,50€

---

## 📝 Procédure de Test

### 1. Attendez le Déploiement Vercel

⏳ **Temps estimé**: ~2-3 minutes
🔗 **URL**: [www.izzico.be](https://www.izzico.be)

Vérifiez que le déploiement est terminé sur le [Vercel Dashboard](https://vercel.com/dashboard)

### 2. Videz le Cache

**IMPORTANT**: Pour voir la nouvelle version:

**Option 1 - Navigation Privée** (recommandé):
- Chrome/Edge: `Ctrl+Shift+N` (Windows) ou `Cmd+Shift+N` (Mac)
- Firefox: `Ctrl+Shift+P` (Windows) ou `Cmd+Shift+P` (Mac)

**Option 2 - Vider le cache**:
1. Ouvrir DevTools (F12)
2. Clic droit sur rafraîchir
3. "Vider le cache et effectuer une actualisation forcée"

### 3. Scannez le Ticket

1. Allez sur **[www.izzico.be/hub/finances](https://www.izzico.be/hub/finances)**
2. Connectez-vous
3. Cliquez **"Scanner un ticket"**
4. Uploadez **le ticket de 47,90€**
5. **Ouvrez la console** (F12 → Console)

### 4. Vérifiez les Résultats

#### Dans la Console

Vous devriez voir les nouveaux logs:

```
[OCR] Extracting line items...
[OCR] ✅ Item found: PZ 4 Saisons - 14.5€ (qty: 1)
[OCR] ✅ Item found: PZ Campericoise - 14.5€ (qty: 1)
[OCR] ✅ Item found: 1/2 San Rouge - 9€ (qty: 1)
[OCR] ✅ Item found: Café Con Panna - 7.4€ (qty: 1)
[OCR] ✅ Item found: Ristretto - 2.5€ (qty: 1)
[OCR] ✅ Extracted 5 line items
```

#### Dans l'Interface

Après le scan, dans l'étape "Vérifiez les informations", vous devriez voir:

📋 **Formulaire pré-rempli**:
- Montant: 47,9€
- Date: 03/07/2019

📦 **Nouvelle section "Articles détectés (5)"**:
- Fond vert clair
- Icône ✨ Sparkles
- Liste des 5 articles avec prix
- Message "Ces articles ont été extraits automatiquement"

---

## 🎯 Scénarios de Test

### ✅ Scénario Idéal

1. **Upload** → ✅ Accepté
2. **Scan** → ✅ Réussi en 5-15 secondes
3. **Extraction**:
   - ✅ Montant: 47,90€
   - ✅ Date: 03/07/2019
   - ✅ 5 articles détectés
4. **Vérification**: Tous les articles sont corrects
5. **Catégorie** → Choisir (ex: Courses)
6. **Création** → Dépense créée avec détails

### ⚠️ Scénario Dégradé

Si OCR échoue:
1. Upload → ✅ Accepté
2. Scan → ⚠️ Échec (message clair)
3. **Saisie manuelle** possible
4. Pas d'articles détectés (section cachée)
5. Reste du flow identique

---

## 🔍 Logs de Debugging

### Nouveaux Logs OCR

Lors du scan, regardez ces logs dans la console:

```
[OCR] 📸 Starting receipt scan...
[OCR] 📄 File details: { name, size, type }
[OCR] ✅ Image converted to base64
[OCR] 🔍 Starting Tesseract recognition...
[OCR] ✅ Scan completed in 12453ms
[OCR] 📊 Confidence: 87.3%

[OCR] 🔍 Parsing receipt text...
[OCR] Raw text: [le texte complet du ticket]

[OCR] Extracting merchant from text...
[OCR] ✅ Known merchant found: ... (ou autre)

[OCR] Extracting total from text...
[OCR] ✅ Total found: 47.9

[OCR] Extracting date from text...
[OCR] ✅ Date found: 2019-07-24

[OCR] Extracting line items...
[OCR] ✅ Item found: PZ 4 Saisons - 14.5€ (qty: 1)
[OCR] ✅ Item found: PZ Campericoise - 14.5€ (qty: 1)
[OCR] ✅ Item found: 1/2 San Rouge - 9€ (qty: 1)
[OCR] ✅ Item found: Café Con Panna - 7.4€ (qty: 1)
[OCR] ✅ Item found: Ristretto - 2.5€ (qty: 1)
[OCR] ✅ Extracted 5 line items

[OCR] ✅ Parsed data: { merchant, total, date, items: [...] }
```

---

## ⚠️ Troubleshooting

### Si les Articles ne s'Affichent Pas

**Causes possibles**:

1. **Format de ticket non reconnu**:
   - Le pattern ne correspond à aucun des 4 formats supportés
   - Solution: Regarder les logs `[OCR] Raw text:` pour voir le format réel

2. **Articles filtrés**:
   - Les lignes contiennent des mots exclus (TOTAL, TVA, SOMME, etc.)
   - Les articles sont trop courts (<3 caractères) ou trop longs (>100)
   - Solution: Vérifier les logs pour voir si des items ont été détectés mais rejetés

3. **OCR de mauvaise qualité**:
   - Le texte est mal reconnu par Tesseract
   - Les colonnes ne sont pas bien alignées
   - Solution: Tester avec une photo plus nette

### Que Faire si Ça ne Fonctionne Pas?

1. **Partagez les logs**:
   - Copiez **tout** le log depuis `[OCR] 📸 Starting...` jusqu'à la fin
   - Partagez surtout:
     - `[OCR] Raw text:` (le texte brut extrait)
     - `[OCR] Extracting line items...` (les tentatives d'extraction)
     - Le nombre d'items extraits

2. **Vérifiez le raw text**:
   - Regardez `[OCR] Raw text:` dans la console
   - Est-ce que le texte est lisible?
   - Est-ce que les colonnes sont bien alignées?
   - Est-ce que les prix sont visibles?

3. **Testez avec un autre ticket**:
   - Prenez une photo nette d'un autre ticket récent
   - Essayez un format plus simple (supermarché classique)
   - Bon éclairage, ticket à plat

---

## 📊 Patterns de Tickets Supportés

| Pattern | Description | Exemple | Extraction |
|---------|-------------|---------|------------|
| **Format 1** | Qty + Name + PU + Total | `1 Pain 1.20 1.20` | Qty=1, Name="Pain", PU=1.20, Total=1.20 |
| **Format 2** | Name + PU + Total | `Pain 1.20 1.20` | Qty=1, Name="Pain", PU=1.20, Total=1.20 |
| **Format 3** | Qty×Name + Total | `2x Pain 2.40` | Qty=2, Name="Pain", Total=2.40, PU=1.20 |
| **Format 4** | Name + Total | `Pain 1.20` | Qty=1, Name="Pain", Total=1.20 |

**Mots exclus** (pas extraits comme articles):
- TOTAL, SOUS-TOTAL, SUBTOTAL
- TVA, TAX, SOMME, MONTANT
- CASH, CARTE, ESPECE
- CHANGE, RENDU
- QTE, PRIX, P.U., ARTICLE, DESIGNATION
- GRAND TOTAL

---

## 🎯 Résultats Attendus

### ✅ Succès Complet

- ✅ Scan réussi (5-15 secondes)
- ✅ Montant extrait: 47,9€
- ✅ Date extraite: 03/07/2019
- ✅ 5 articles détectés
- ✅ Tous les articles sont corrects
- ✅ Affichage clair dans l'interface
- ✅ Dépense créée avec tous les détails

### ⚠️ Succès Partiel

- ✅ Scan réussi
- ✅ Montant et date corrects
- ⚠️ 3-4 articles détectés sur 5
- → Certains articles ont pu être filtrés ou mal reconnus
- → Acceptable, l'essentiel (montant/date) est OK

### ❌ Échec

- ❌ Scan échoue
- **OU** ❌ 0 articles détectés
- → Regarder les logs pour diagnostic
- → Tester avec une photo plus nette
- → Utiliser la saisie manuelle en attendant

---

## 🚀 Prochaines Étapes

### Si ça Fonctionne ✅

1. **Testez avec d'autres tickets**:
   - Différents magasins (Delhaize, Carrefour, etc.)
   - Différents formats
   - Vérifiez la robustesse

2. **Partagez le résultat**:
   - Screenshot de la section "Articles détectés"
   - Logs de la console
   - Confirmez que c'est utile

3. **Proposez des améliorations**:
   - Manque-t-il des patterns de ticket?
   - Faut-il supporter d'autres formats?

### Si ça ne Fonctionne Pas ❌

1. **Diagnostic**:
   - Partagez les logs complets
   - Partagez le `[OCR] Raw text:`
   - Décrivez ce qui ne va pas

2. **Alternatives**:
   - Utiliser la saisie manuelle (toujours disponible)
   - Tester avec d'autres tickets
   - Envisager OCR côté serveur si problème persiste

---

**Le scanner est maintenant prêt avec l'extraction des articles!** 🎉

Attendez le déploiement (2-3 min), videz le cache, et testez avec votre ticket de 47,90€.
Vous devriez voir les **5 articles automatiquement extraits**! 🧾✨
