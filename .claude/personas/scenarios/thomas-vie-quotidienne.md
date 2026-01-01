# Scenario : Thomas - Vie Quotidienne en Coloc

## Meta
- **Persona :** Thomas
- **Contexte :** Journee type utilisant le Hub Resident
- **Objectif du test :** Valider l'utilite et la simplicite du hub au quotidien
- **Duree estimee :** Interactions de 2-3 minutes reparties sur une journee

---

## Contexte Initial

### La Situation
C'est un mardi normal pour Thomas. Il doit payer son loyer (c'est le 5 du mois), c'est son tour de sortir les poubelles, et il a repere une fuite sous l'evier de la cuisine hier soir. En plus, Sophie propose un apero coloc samedi.

### L'Etat d'Esprit
- **Emotion :** Neutre, un peu fatigue (lundi soir tard)
- **Niveau d'attention :** Faible le matin, plus disponible le soir
- **Attentes :** Veut que tout se fasse en 2 taps maximum

### L'Environnement
- **Lieu :** Appartement coloc (Ixelles)
- **Device :** iPhone 100% du temps
- **Moment :** Interactions tout au long de la journee
- **Contraintes :** Travaille de chez lui (freelance), interruptions possibles

---

## Le Parcours

### Etape 1 : Rappel Poubelles (8h15)

**Action :** Recoit push notification au reveil

**Pensee :** "Ah oui, c'est mon tour. Je fais ca avant ma douche"

**Emotion :** Legere resignation (tache pas fun mais necessaire)

**Point de contact :** Notification push → Ecran verrouille

**Resultat attendu :**
- Notification claire et actionable
- Texte : "C'est ton tour de sortir les poubelles"
- Action rapide : "Fait" en un tap depuis la notif

**Point de friction potentiel :**
- Si la notification arrive trop tot (6h) ou trop tard (10h)
- Si pas de moyen de confirmer sans ouvrir l'app

---

### Etape 2 : Confirmation de la Tache (8h20)

**Action :** Sort les poubelles, marque comme fait dans l'app

**Pensee :** "Voila, c'est fait, on me lache maintenant"

**Emotion :** Petite satisfaction (tache accomplie)

**Point de contact :** App → Widget ou notification → Bouton "Fait"

**Resultat attendu :**
- Confirmation en 1 tap
- Pas de formulaire, pas de commentaire obligatoire
- Feedback : "Merci ! Prochaine tache dans 2 semaines"

**Point de friction potentiel :**
- Si doit ouvrir l'app, naviguer, trouver la tache...
- Si demande une photo ou une justification

---

### Etape 3 : Rappel Loyer (10h00)

**Action :** Recoit push notification pour le loyer

**Pensee :** "Ah oui, on est deja le 5. Allez, je fais ca maintenant"

**Emotion :** Neutre - c'est une habitude maintenant

**Point de contact :** Notification push → Ecran de paiement

**Resultat attendu :**
- Notification : "Ton loyer de 750EUR est du"
- Tap → Ecran de paiement pre-rempli
- Apple Pay ou Bancontact en 2 taps
- Confirmation immediate

**Point de friction potentiel :**
- Si doit re-saisir le montant
- Si process de paiement trop long
- Si pas de confirmation claire du paiement

---

### Etape 4 : Paiement du Loyer (10h01)

**Action :** Paie son loyer via Apple Pay

**Pensee :** "Done. 30 secondes chrono"

**Emotion :** Satisfaction - c'etait simple

**Point de contact :** Ecran paiement → Apple Pay → Confirmation

**Resultat attendu :**
- Apple Pay natif (Face ID)
- Confirmation animee (check vert)
- Notification : "Paiement de 750EUR recu par [Proprio]"
- Historique mis a jour automatiquement

**Point de friction potentiel :**
- Echec paiement sans explication claire
- Pas de trace dans l'historique

---

### Etape 5 : Signalement de la Fuite (12h30, pause dejeuner)

**Action :** Prend une photo de la fuite et signale le probleme

**Pensee :** "Autant le faire maintenant, comme ca le proprio est au courant"

**Emotion :** Proactif - content de pouvoir signaler facilement

**Point de contact :** App → Maintenance → Nouveau signalement

**Resultat attendu :**
- Acces rapide a "Signaler un probleme"
- Categories pre-definies (plomberie, electricite, etc.)
- Upload photo simple
- Description optionnelle (pas obligatoire)
- Confirmation : "Le proprio a ete notifie"

**Point de friction potentiel :**
- Categories trop complexes
- Photo obligatoire (pas toujours possible/pertinent)
- Pas de feedback sur le statut

---

### Etape 6 : Reponse du Proprio (14h30)

**Action :** Recoit notification : "Marc a repondu a ton signalement"

**Pensee :** "Cool, il a vu"

**Emotion :** Rassure - le probleme est pris en charge

**Point de contact :** Notification → Fil de discussion maintenance

**Resultat attendu :**
- Message du proprio visible directement
- "Plombier prevu demain 14h. Tu seras la ?"
- Possibilite de repondre dans le fil
- Pas de redirection vers email ou SMS

**Point de friction potentiel :**
- Message du proprio perdu dans les notifs
- Pas de moyen de confirmer sa presence

---

### Etape 7 : Consultation du Hub Coloc (20h00, apres diner)

**Action :** Check les actus de la coloc sur le hub

**Pensee :** "Voyons ce que les autres ont poste"

**Emotion :** Decontracte, mode scrolling

**Point de contact :** App → Hub → Feed d'activite

**Resultat attendu :**
- Feed chronologique des actus
- Post de Sophie : "Apero samedi 18h ?"
- Reactions des autres colocs visibles
- Possibilite de reagir (like, commentaire)

**Point de friction potentiel :**
- Feed trop charge (notifs non lues, taches, messages...)
- Pas clair ce qui est nouveau

---

### Etape 8 : Reponse a l'Event (20h02)

**Action :** Confirme sa presence a l'apero

**Pensee :** "Je serai la, ca fait longtemps qu'on a pas fait ca"

**Emotion :** Enthousiasme - c'est ca qu'il aime dans la coloc

**Point de contact :** Event → Bouton "Je viens"

**Resultat attendu :**
- 1 tap pour confirmer
- Liste des participants visible
- Possibilite d'ajouter un commentaire ("J'amene des bieres")

**Point de friction potentiel :**
- Si doit creer un compte Doodle externe
- Si pas clair qui vient

---

## Resolution

### Happy Path
Thomas a gere sa journee coloc en moins de 10 minutes cumulees :
- Poubelles : 30 sec
- Loyer : 45 sec
- Signalement fuite : 2 min
- Check hub : 5 min
- Total : ~8 minutes

Le reste de sa journee est libre. Il peut se concentrer sur son travail freelance.

### Unhappy Path(s)

1. **Si le paiement echoue**
   → Stress : "Est-ce que le proprio va croire que j'ai pas paye ?"
   → Solution : Retry automatique + notification au proprio "Paiement en cours de traitement"

2. **Si le proprio ne repond pas au signalement**
   → Frustration : "Il a vu ou pas ?"
   → Solution : Rappel automatique au proprio apres 24h + notification a Thomas "Rappel envoye"

3. **Si les colocs ne repondent pas a l'event**
   → Sophie frustrée : "Personne utilise l'app ?"
   → Solution : Rappel aux colocs non-repondus

---

## Resultat Final

### Ce que Thomas Obtient
- Loyer paye, trace disponible
- Poubelles faites, plus de rappel
- Fuite signalee, plombier programme
- Apero confirme avec les colocs

### Ce que Thomas Ressent
- Libere : "La gestion coloc me prend plus la tete"
- Satisfait : "Tout est au meme endroit"
- Connecte : "L'app renforce les liens avec les colocs"

### Ce que Thomas Pense
"Avant, la gestion coloc c'etait des WhatsApp interminables et des virements oublies. Maintenant, ca prend 10 minutes par mois."

---

## Points d'Attention Design

### A Optimiser
1. **Actions depuis les notifications** - Thomas ne devrait presque jamais ouvrir l'app
2. **Minimalisme** - Chaque ecran doit avoir 1 action principale evidente
3. **Confirmations satisfaisantes** - Micro-animations, feedback clair

### A Eviter
1. **Notifications trop frequentes** - Thomas se desabonnera
2. **Fonctionnalites cachees** - Tout doit etre a 2 taps max
3. **Obligations quotidiennes** - L'app doit etre la quand on en a besoin, pas plus

### Questions Ouvertes
1. Widget iOS pour actions rapides (poubelles, paiement) ?
2. Integration avec les raccourcis Siri ?
3. Mode "Ne pas deranger" coloc pour les weekends ?

---

## Variantes

### Variante A : Nouveau coloc (1ere semaine)
**Difference :** Thomas vient d'arriver, decouvre les regles
**Impact :**
- Onboarding progressif des fonctionnalites
- Presentation des colocs et leurs habitudes
- Premiere tache guidee

### Variante B : Coloc en conflit (tensions sur le menage)
**Difference :** Un coloc ne fait jamais ses taches
**Impact :**
- Historique des taches visible (qui fait quoi)
- Pas de name & shame mais transparence
- Rappels plus frequents au coloc defaillant

### Variante C : Depart de Thomas (fin de bail)
**Difference :** Thomas s'en va dans 2 mois
**Impact :**
- Process de preavis dans l'app
- Coordination avec le proprio pour remplacement
- Transfert d'infos au nouveau

---

## Metriques de Succes pour ce Scenario

| Metrique | Cible | Mesure |
|----------|-------|--------|
| Temps moyen pour payer loyer | < 30 sec | Analytics |
| Taux de taches confirmees "a temps" | > 90% | Tracking taches |
| Signalements maintenance resolus | < 48h | Time to resolution |
| Sessions hub par semaine | > 3 | Analytics |
| NPS residents actifs | > 50 | Survey trimestriel |

---

## Schema des Interactions Journalieres

```
08h15  [PUSH] Poubelles           → 1 tap → Done
10h00  [PUSH] Loyer               → 2 taps → Paye
12h30  [PROACTIF] Signalement     → 2 min → Envoye
14h30  [PUSH] Reponse proprio     → Lu
20h00  [CONSULTE] Hub coloc       → 5 min scroll
20h02  [ACTION] Event             → 1 tap → Confirme
```

Total temps actif : ~8 minutes
Nombre d'ouvertures app : 3-4
Actions completees : 5
