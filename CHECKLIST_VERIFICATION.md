# ✅ Checklist de Vérification Post-Déploiement

## 📅 Date: 13 Décembre 2025

---

## 🔴 ÉTAPE 1: Corriger la Base de Données (À FAIRE EN PREMIER)

### Action: Exécuter le SQL sur Production

- [ ] **Ouvrir Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] **Identifier le projet de production**: Vérifier que l'URL correspond à celle dans `.env.local`
- [ ] **Ouvrir SQL Editor**: Cliquer sur "SQL Editor" dans la barre latérale
- [ ] **Créer nouvelle requête**: Cliquer sur "New query"
- [ ] **Copier le SQL**: Ouvrir `FIX_ALL_DB_ERRORS.sql` et copier TOUT le contenu
- [ ] **Coller et exécuter**: Coller dans l'éditeur et cliquer "Run"
- [ ] **Vérifier le succès**: Voir les messages ✅ dans les résultats

### Vérification:

Après exécution du SQL, aller sur **www.izzico.be**:

- [ ] Ouvrir la console (F12 → Console)
- [ ] Rafraîchir la page (F5)
- [ ] Vérifier que ces erreurs ont **DISPARU**:
  - [ ] ❌ `Failed to load resource: 404 (get_unread_count)` → Devrait être ✅ DISPARU
  - [ ] ❌ `Failed to load resource: 400 (user_profiles)` → Devrait être ✅ DISPARU
  - [ ] ❌ `Failed to load resource: 400 (property_members)` → Devrait être ✅ DISPARU
  - [ ] ❌ `Failed to load resource: 400 (profiles)` → Devrait être ✅ DISPARU
  - [ ] ❌ `Failed to load resource: 500 (conversation_participants)` → Devrait être ✅ DISPARU

**Si les erreurs persistent**:
- [ ] Vérifier que vous avez exécuté sur le BON projet Supabase
- [ ] Vérifier que tout le SQL a été copié (du début à la fin)
- [ ] Essayer de vous déconnecter/reconnecter sur www.izzico.be
- [ ] Vider complètement le cache du navigateur

---

## 🔄 ÉTAPE 2: Vérifier le Déploiement Vercel

### Attendre le Déploiement

- [ ] Vérifier que le build Vercel est **terminé** (vous recevrez un email)
- [ ] Build terminé avec **succès** (pas d'erreur)
- [ ] Déploiement actif sur **www.izzico.be**

**Timing**: Le déploiement prend environ 3-5 minutes après le dernier commit (`d626bec`)

### Vider le Cache du Navigateur

Très important pour voir les nouvelles corrections:

- [ ] **Chrome/Edge**: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
- [ ] **Firefox**: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)
- [ ] **Safari**: Cmd+Option+R (Mac)

Ou alternativement:
- [ ] Ouvrir les DevTools (F12)
- [ ] Clic droit sur le bouton Rafraîchir
- [ ] Sélectionner "Vider le cache et actualiser de force"

---

## 🔍 ÉTAPE 3: Tester le Scanner OCR

### Navigation vers le Scanner

- [ ] Aller sur **www.izzico.be**
- [ ] Se connecter si nécessaire
- [ ] Aller dans **Hub** → **Finances**
- [ ] Cliquer sur **"Scanner un ticket"**

### Test avec une Photo

- [ ] Préparer une photo de ticket de caisse
  - Format: JPG, PNG, WEBP
  - Taille recommandée: < 5MB
  - Qualité: Bien éclairée, texte lisible

- [ ] Uploader la photo
- [ ] Observer la console (F12 → Console)

### Logs Attendus

Vous devriez voir cette séquence dans la console:

```
✅ [OCR] Initializing Tesseract worker...
✅ [OCR] Status: loading tesseract core
✅ [OCR] Status: initializing tesseract
✅ [OCR] ✅ Worker initialized successfully
✅ [OCR] 📸 Starting receipt scan...
✅ [OCR] 📄 Processing file: IMG_1234.jpg (234567 bytes)
✅ [OCR] Status: recognizing text 0%
✅ [OCR] Status: recognizing text 25%
✅ [OCR] Status: recognizing text 50%
✅ [OCR] Status: recognizing text 75%
✅ [OCR] Status: recognizing text 100%
✅ [OCR] ✅ Scan completed in 3456ms
✅ [OCR] 🔍 Parsing receipt text...
✅ [OCR] ✅ Parsed data: {...}
```

### Vérification du Résultat

- [ ] Le scan se termine **sans erreur**
- [ ] Les données sont extraites (même partiellement)
- [ ] Vous pouvez voir:
  - [ ] Le texte brut extrait
  - [ ] Le montant total (si détecté)
  - [ ] Le nom du magasin (si détecté)
  - [ ] La date (si détectée)

### ❌ Si le Scanner Échoue

**Erreur: "Error attempting to read image"**

Vérifier:
- [ ] Le déploiement Vercel est bien terminé
- [ ] Le cache du navigateur a été vidé
- [ ] Vous testez sur www.izzico.be (pas localhost)

**Erreur: "Failed to initialize worker"**

Vérifier:
- [ ] Les CDN Tesseract.js sont accessibles (pas de blocage réseau)
- [ ] Pas d'extension navigateur qui bloque les CDN
- [ ] Essayer en navigation privée

**Erreur: Rien ne se passe**

Vérifier:
- [ ] Le modal de scan s'ouvre bien
- [ ] Le bouton d'upload est visible
- [ ] Pas d'erreur JavaScript dans la console

---

## 🎨 ÉTAPE 4: Vérifier les 5 Fonctionnalités Resident

### Dashboard Hub

- [ ] Aller sur **www.izzico.be/hub**
- [ ] Vérifier que les 5 boutons sont présents:
  - [ ] 💰 **Finances** (fonctionne, ouvre /hub/finances)
  - [ ] ✅ **Tâches** (fonctionne, ouvre /hub/tasks)
  - [ ] 🔧 **Maintenance** (fonctionne, ouvre /hub/maintenance)
  - [ ] 📄 **Documents** (fonctionne, ouvre /hub/documents)
  - [ ] 🗳️ **Règles** (fonctionne, ouvre /hub/rules)

### Test Rapide de Chaque Page

#### 💰 Finances (/hub/finances)
- [ ] La page charge sans erreur
- [ ] Le bouton "Scanner un ticket" fonctionne
- [ ] Le bouton "Répartir une dépense" fonctionne
- [ ] Les dépenses existantes s'affichent (si présentes)

#### ✅ Tâches (/hub/tasks)
- [ ] La page charge sans erreur
- [ ] Les rotations de tâches s'affichent
- [ ] Possibilité de créer une nouvelle rotation

#### 🔧 Maintenance (/hub/maintenance)
- [ ] La page charge sans erreur
- [ ] Possibilité de créer une demande de maintenance

#### 📄 Documents (/hub/documents)
- [ ] La page charge sans erreur
- [ ] Les catégories de documents s'affichent
- [ ] Le bouton "Upload" fonctionne
- [ ] Les icônes de catégorie ont la bonne couleur (orange #ee5736 si sélectionnée, gris sinon)

#### 🗳️ Règles (/hub/rules)
- [ ] La page charge sans erreur
- [ ] Possibilité de créer un vote

---

## 📊 ÉTAPE 5: Vérification Générale

### Performance

- [ ] Les pages chargent rapidement (< 3 secondes)
- [ ] Pas de ralentissement notable
- [ ] Les animations sont fluides

### Console Navigateur

- [ ] Ouvrir F12 → Console
- [ ] Naviguer dans l'application
- [ ] Vérifier qu'il n'y a **AUCUNE** erreur rouge
- [ ] Les warnings (jaune) sont acceptables s'ils concernent Supabase Edge Runtime

### Responsive

- [ ] Tester sur mobile (responsive view dans DevTools)
- [ ] Les boutons sont cliquables
- [ ] Le texte est lisible
- [ ] Pas de débordement horizontal

---

## 🎯 Résumé des Résultats

### Erreurs de Base de Données
- État: ⬜ Pas encore testé / ✅ Corrigé / ❌ Toujours présent
- Notes: _______________________________________

### Scanner OCR
- État: ⬜ Pas encore testé / ✅ Fonctionne / ❌ Ne fonctionne pas
- Notes: _______________________________________

### 5 Fonctionnalités Resident
- Finances: ⬜ / ✅ / ❌
- Tâches: ⬜ / ✅ / ❌
- Maintenance: ⬜ / ✅ / ❌
- Documents: ⬜ / ✅ / ❌
- Règles: ⬜ / ✅ / ❌

### Problèmes Rencontrés
_________________________________________________
_________________________________________________
_________________________________________________

---

## 📞 Si Vous Avez Besoin d'Aide

### Informations à Fournir

Si quelque chose ne fonctionne pas, capturez:

1. **Erreurs de console**
   - F12 → Console
   - Copier les messages d'erreur en rouge
   - Capture d'écran si nécessaire

2. **URL de la page**
   - Sur quelle page le problème survient

3. **Étapes pour reproduire**
   - Qu'avez-vous fait juste avant l'erreur?

4. **Navigateur et système**
   - Chrome/Firefox/Safari/Edge?
   - Windows/Mac/Linux?
   - Version du navigateur

### Documents de Référence

- [GUIDE_FINAL_CORRECTIONS.md](GUIDE_FINAL_CORRECTIONS.md) - Guide détaillé
- [FIX_ALL_DB_ERRORS.sql](FIX_ALL_DB_ERRORS.sql) - Script SQL complet
- [SESSION_RESIDENT_IMPROVEMENTS.md](SESSION_RESIDENT_IMPROVEMENTS.md) - Documentation technique

---

**Date de vérification**: _________________
**Testé par**: _________________
**Résultat global**: ⬜ Tout fonctionne / ⬜ Problèmes mineurs / ⬜ Problèmes majeurs
