# Scenario : Marc - Chambre a Louer

## Meta
- **Persona :** Marc
- **Contexte :** Une chambre se libere, Marc doit trouver un remplacant rapidement
- **Objectif du test :** Valider le parcours de publication et selection de candidat
- **Duree estimee :** 30-45 minutes (reparti sur plusieurs jours)

---

## Contexte Initial

### La Situation
Sophie, locataire de la chambre 3 depuis 18 mois, vient d'annoncer son depart (mutation professionnelle). Preavis de 2 mois. Marc a 6 semaines pour trouver un remplacant et eviter un mois de vacance locative (perte de 750EUR). Les 3 autres colocs sont stables et s'entendent bien.

### L'Etat d'Esprit
- **Emotion :** Leger stress - Sophie etait une bonne locataire, difficile a remplacer
- **Niveau d'attention :** Concentre, c'est samedi matin, son creneau "gestion immo"
- **Attentes :** Veut des candidats serieux, pas 50 messages dont 45 touristes

### L'Environnement
- **Lieu :** Son bureau a domicile (Brabant wallon)
- **Device :** PC Windows, grand ecran
- **Moment :** Samedi matin 9h
- **Contraintes :** A 2h devant lui avant les activites familiales

---

## Le Parcours

### Etape 1 : Mise a Jour du Statut de Chambre

**Action :** Se connecte a son dashboard IzzIco, trouve la chambre 3

**Pensee :** "Voyons si je peux juste changer le statut sans tout refaire"

**Emotion :** Pragmatique, veut aller vite

**Point de contact :** Dashboard proprio → Liste des chambres → Chambre 3

**Resultat attendu :**
- La chambre est facilement identifiable
- Un bouton "Marquer comme disponible" visible
- Date de disponibilite modifiable

**Point de friction potentiel :**
- Si doit re-creer l'annonce from scratch
- Si interface trop complexe pour une action simple

---

### Etape 2 : Verification de l'Annonce

**Action :** Verifie que les infos de l'annonce sont a jour (photos, description, prix)

**Pensee :** "Le loyer a ete indexe, je dois verifier le montant"

**Emotion :** Methodique

**Point de contact :** Page edition annonce

**Resultat attendu :**
- Photos existantes conservees
- Prix pre-rempli avec dernier montant
- Suggestion d'indexation si applicable
- Description existante editable

**Point de friction potentiel :**
- Photos perdues apres le dernier locataire
- Pas de gestion de l'indexation

---

### Etape 3 : Definition des Criteres de Candidat

**Action :** Configure les criteres de filtrage pour les candidatures

**Pensee :** "Cette fois je veux des gens avec un CDI ou equivalent stable"

**Emotion :** Prudent - ses 2 impayes precedents l'ont echauffe

**Point de contact :** Parametres de candidature

**Resultat attendu :**
- Filtres sur situation professionnelle
- Revenus minimum configurable
- Possibilite de demander documents specifiques
- Compatibilite avec colocs actuels prise en compte

**Point de friction potentiel :**
- Criteres trop limitatifs = pas de candidats
- Pas de transparence sur l'impact des filtres

---

### Etape 4 : Publication

**Action :** Publie l'annonce sur IzzIco

**Pensee :** "C'est parti. J'espere recevoir des candidatures de qualite"

**Emotion :** Optimisme prudent

**Point de contact :** Bouton publication → Confirmation

**Resultat attendu :**
- Confirmation claire de mise en ligne
- Estimation du nombre de candidats potentiels
- Rappel des prochaines etapes

**Point de friction potentiel :**
- Pas de feedback sur la visibilite de l'annonce
- Incertitude sur "et maintenant ?"

---

### Etape 5 : Reception des Candidatures (J+2)

**Action :** Recoit notification "8 nouvelles candidatures qualifiees"

**Pensee :** "8, c'est genable. Mieux que les 50 de Immoweb"

**Emotion :** Soulage - le filtre fonctionne

**Point de contact :** Notification push → Dashboard candidatures

**Resultat attendu :**
- Liste claire des candidats
- Statut KYC visible (verifie / en cours / incomplet)
- Score de solvabilite
- Score de compatibilite avec les colocs actuels

**Point de friction potentiel :**
- Candidatures non triees
- Informations cles cachees dans des sous-menus

---

### Etape 6 : Analyse des Profils

**Action :** Examine les 8 candidatures en detail

**Pensee :** "Celui-la a un score de 92% avec les colocs, interessant"

**Emotion :** Analytique, compare les profils

**Point de contact :** Fiches candidat detaillees

**Resultat attendu :**
- Resume visuel des infos cles
- Documents verifies accessibles
- Historique de paiement si ancien utilisateur IzzIco
- Compatibilite detaillee (pourquoi ce score)
- Notes des anciens proprios si disponible

**Point de friction potentiel :**
- Trop d'informations, pas hierarchisees
- Pas de moyen de comparer facilement 2-3 candidats

---

### Etape 7 : Selection et Invitation a Visiter

**Action :** Selectionne 3 candidats, leur propose des creneaux de visite

**Pensee :** "Je vais leur proposer samedi prochain, avec les autres colocs"

**Emotion :** Proactif

**Point de contact :** Systeme de reservation de visite

**Resultat attendu :**
- Selection multiple possible
- Proposition de creneaux avec calendrier
- Message personnalisable
- Les colocs actuels peuvent etre invites a la visite

**Point de friction potentiel :**
- Gestion calendrier trop complexe
- Pas de confirmation que les candidats ont vu l'invitation

---

### Etape 8 : Visite et Feedback (J+7)

**Action :** Fait visiter a 3 candidats, les colocs actuels participent

**Pensee :** "Les colocs ont bien accroche avec le 2eme candidat"

**Emotion :** Satisfait - le process est fluide

**Point de contact :** Checklist post-visite dans l'app

**Resultat attendu :**
- Feedback des colocs actuels collecte dans l'app
- Notation simple des candidats
- Historique des visites

**Point de friction potentiel :**
- Colocs pas impliques (n'utilisent pas l'app)
- Pas de moyen de garder trace des impressions

---

### Etape 9 : Selection Finale et Contrat

**Action :** Choisit le candidat, initie le contrat

**Pensee :** "Parfait, contrat genere automatiquement, juste a verifier"

**Emotion :** Soulage - la partie administrative est simplifiee

**Point de contact :** Workflow contrat

**Resultat attendu :**
- Contrat pre-rempli avec infos candidat + chambre
- Clauses personnalisables
- Signature electronique integree
- Etat des lieux digital

**Point de friction potentiel :**
- Contrat trop generique, pas adapte a la legislation belge
- Process signature trop long

---

### Etape 10 : Onboarding du Nouveau Locataire

**Action :** Le nouveau locataire signe et s'installe

**Pensee :** "Premier loyer paye avant meme l'emmenagement, parfait"

**Emotion :** Confiant - le systeme fonctionne

**Point de contact :** Finalisation et integration au hub

**Resultat attendu :**
- Premier loyer + garantie collectes
- Nouveau locataire ajoute automatiquement au hub coloc
- Les colocs actuels notifies
- Historique des documents accessible

**Point de friction potentiel :**
- Garantie pas geree correctement
- Integration au hub pas fluide

---

## Resolution

### Happy Path
Marc trouve un locataire verifie en 3 semaines :
- 8 candidatures qualifiees (pas 50 random)
- 3 visites, 2 no-show evites (rappels auto)
- 1 candidat ideal, valide par les colocs
- Contrat signe electroniquement
- Premier loyer encaisse avant emmenagement
- Aucun jour de vacance locative

### Unhappy Path(s)

1. **Si pas assez de candidatures**
   → Marc s'inquiete de la visibilite
   → Solution : Suggestions d'optimisation (meilleures photos, prix competitif)
   → Option : Boost payant de l'annonce

2. **Si candidat choisi se desiste**
   → Frustration, retour a la case depart
   → Solution : Shortlist conservee, 2eme choix contactable rapidement
   → Historique des echanges conserve

3. **Si les colocs actuels ne s'impliquent pas**
   → Marc decide seul, risque de tension
   → Solution : Notifications et rappels aux colocs pour donner leur avis

---

## Resultat Final

### Ce que Marc Obtient
- Chambre louee en 3 semaines au lieu de 6 habituellement
- Locataire verifie (KYC + solvabilite)
- Contrat conforme signe electroniquement
- Premier loyer securise
- Colocs contents du nouvel arrivant

### Ce que Marc Ressent
- Soulage : "Pour une fois j'ai pas passe 15h a filtrer des candidatures"
- En confiance : "Les verifications me rassurent"
- Satisfait : "Le process est pro, ca me fait gagner du temps"

### Ce que Marc Pense
"Si tous mes prochains recrutements de locataires se passent comme ca, je vais recommander IzzIco a tous les proprios que je connais."

---

## Points d'Attention Design

### A Optimiser
1. **Dashboard de candidatures** - Vue comparative des candidats (tableau, pas juste liste)
2. **Indicateurs de confiance** - Rendre le score de solvabilite comprehensible
3. **Integration colocs** - Faciliter leur participation au choix

### A Eviter
1. **Surcharge d'options** - Marc veut efficace, pas exhaustif
2. **Design trop "jeune"** - Interface pro, pas gamifiee
3. **Friction administrative** - Contrats et signatures doivent etre fluides

### Questions Ouvertes
1. Comment gerer le cas ou Marc veut voir les documents avant KYC complet ?
2. Faut-il permettre aux proprios de contacter des candidats non-matchs ?
3. Comment integrer la garantie locative dans le flux ?

---

## Variantes

### Variante A : Urgence extreme (coloc parti sans preavis)
**Difference :** Depart immediat, chambre vide demain
**Impact :**
- Mode "urgent" avec mise en avant
- Candidats disponibles immediatement privilegies
- Process accelere (moins de filtres)

### Variante B : Premiere mise en location (nouvel investissement)
**Difference :** Marc vient d'acheter, jamais utilise IzzIco
**Impact :**
- Onboarding complet necessaire
- Verification du bien par IzzIco
- Accompagnement sur la fixation du prix

---

## Metriques de Succes pour ce Scenario

| Metrique | Cible | Mesure |
|----------|-------|--------|
| Temps moyen avant 1ere candidature | < 48h | Tracking publication → 1er match |
| Nb de candidatures qualifiees | 5-15 | Filtre automatique |
| Taux de visites sans no-show | > 90% | Rappels + confirmations |
| Temps total avant signature | < 4 semaines | Publication → contrat signe |
| Satisfaction proprio post-process | > 4.5/5 | Survey post-signature |
