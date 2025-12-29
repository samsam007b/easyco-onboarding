# IzzIco AI Strategy - Application Boostée à l'IA

## Vision
Transformer IzzIco en application de nouvelle génération où l'IA assiste les colocataires dans leurs tâches quotidiennes, automatise les processus fastidieux et offre des insights intelligents.

---

## 1. Fournisseurs AI avec Tiers Gratuits

### Comparatif des options (Décembre 2025)

| Fournisseur | Tier Gratuit | Vision/OCR | Meilleur Usage |
|-------------|--------------|------------|----------------|
| **Google Gemini** | ~50 req/jour (Flash) | ✅ Excellent | OCR tickets, documents |
| **OpenAI** | $5 crédits initiaux | ✅ GPT-4o Vision | Analyse complexe |
| **Groq** | 14,400 req/jour | ⚠️ Limité | Texte rapide, chat |
| **Together AI** | $25 crédits | ✅ Llama Vision | Fallback OCR |
| **Mistral** | ~1B tokens/mois | ❌ | Texte, catégorisation |

### Stratégie Multi-Provider

```
Priorité OCR:
1. Google Gemini Flash (gratuit, rapide, bon OCR)
2. Together AI Llama Vision (backup avec crédits)
3. Tesseract.js (local, illimité, qualité moindre)

Priorité Texte:
1. Groq (très rapide, gratuit généreux)
2. Mistral (européen, RGPD-friendly)
3. Google Gemini (backup)
```

---

## 2. Fonctionnalités AI pour IzzIco

### 2.1 Scan OCR Intelligent (Priorité Haute)
**Statut**: À améliorer avec AI

**Actuel**: Tesseract.js (local, basique)
**Cible**: Multi-provider AI avec compréhension contextuelle

**Capacités**:
- Extraction intelligente des montants, dates, marchands
- Compréhension des tickets multi-langues (FR, NL, EN)
- Catégorisation automatique des dépenses
- Détection des articles pour split intelligent

---

### 2.2 Catégorisation Automatique des Dépenses (Priorité Haute)
**Statut**: À implémenter

**Description**: L'IA catégorise automatiquement les dépenses basées sur:
- Le nom du marchand
- Les articles détectés
- L'historique de l'utilisateur
- Les patterns de la colocation

**Catégories**:
- 🛒 Courses alimentaires
- 🧹 Ménage & Entretien
- 💡 Charges (électricité, eau, gaz)
- 📡 Internet & Télécom
- 🏠 Loyer & Charges communes
- 🎉 Sorties & Loisirs
- 🚗 Transport
- 🏥 Santé
- 📦 Autres

---

### 2.3 Assistant Chat IA (Priorité Moyenne)
**Statut**: À implémenter

**Description**: Un assistant conversationnel intégré qui aide les colocataires:

**Fonctionnalités**:
- Répondre aux questions sur les règles de la coloc
- Expliquer les dépenses et répartitions
- Suggérer des solutions aux conflits
- Aider à la planification des tâches
- Rappeler les échéances importantes

**Exemples de prompts**:
- "Combien dois-je à Paul ce mois-ci?"
- "Qui a payé le dernier loyer?"
- "Ajoute une dépense de 45€ chez Carrefour"
- "Rappelle-moi les règles sur le ménage"

---

### 2.4 Résolution de Conflits (Priorité Moyenne)
**Statut**: Concept

**Description**: L'IA analyse les situations conflictuelles et propose des solutions équitables:

- Répartition inégale des tâches ménagères
- Disputes sur les dépenses partagées
- Problèmes de bruit/respect des règles
- Suggestions de médiation

---

### 2.5 Insights Budgétaires Prédictifs (Priorité Basse)
**Statut**: Concept

**Description**: Analyse des patterns de dépenses pour prédire:
- Dépenses mensuelles moyennes
- Anomalies de consommation
- Recommandations d'économies
- Alertes préventives

---

### 2.6 Analyse de Documents (Priorité Moyenne)
**Statut**: À implémenter

**Description**: L'IA analyse les documents officiels:
- Contrats de bail → extraction des termes clés
- Factures → vérification et catégorisation
- États des lieux → suivi des conditions
- Règlements de copropriété → résumé des points importants

---

### 2.7 Commandes en Langage Naturel (Priorité Basse)
**Statut**: Concept

**Description**: Permettre aux utilisateurs d'interagir naturellement:

**Exemples**:
- "J'ai payé 67€ de courses chez Delhaize hier"
- "Divise les 120€ de facture d'électricité entre tous"
- "Montre-moi les dépenses du mois dernier"
- "Crée une règle: poubelles le mardi"

---

### 2.8 Notifications Intelligentes (Priorité Moyenne)
**Statut**: Concept

**Description**: L'IA priorise et personnalise les notifications:
- Urgence contextuelle (rappel loyer vs info secondaire)
- Regroupement intelligent des alertes
- Moment optimal d'envoi
- Résumés quotidiens/hebdomadaires personnalisés

---

## 3. Architecture Technique

### 3.1 Service AI Unifié

```typescript
// lib/services/ai-service.ts

interface AIProvider {
  name: string;
  analyzeImage(image: File): Promise<AIResponse>;
  generateText(prompt: string): Promise<string>;
  categorize(description: string): Promise<Category>;
}

class AIService {
  private providers: AIProvider[];
  private usageTracker: UsageTracker;

  async analyzeReceipt(image: File): Promise<ReceiptData> {
    // Try providers in order until success
    for (const provider of this.providers) {
      if (await this.usageTracker.canUse(provider)) {
        try {
          return await provider.analyzeImage(image);
        } catch (error) {
          continue; // Try next provider
        }
      }
    }
    // Fallback to Tesseract
    return this.tesseractFallback(image);
  }
}
```

### 3.2 Tracking d'Usage

```typescript
// Suivi des quotas par provider
interface UsageQuota {
  provider: string;
  daily_limit: number;
  used_today: number;
  reset_at: Date;
}

// Table Supabase pour le tracking
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider TEXT NOT NULL,
  feature TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Configuration Environnement

```env
# AI Providers
GOOGLE_AI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
TOGETHER_API_KEY=your_together_key
MISTRAL_API_KEY=your_mistral_key

# Feature Flags
ENABLE_AI_OCR=true
ENABLE_AI_CATEGORIZATION=true
ENABLE_AI_CHAT=false
```

---

## 4. Roadmap d'Implémentation

### Phase 1 (Immédiate)
- [ ] Créer service AI unifié multi-provider
- [ ] Intégrer Google Gemini pour OCR
- [ ] Ajouter fallback Together AI
- [ ] Conserver Tesseract comme dernier recours
- [ ] Tracking d'usage basique

### Phase 2 (Court terme)
- [ ] Catégorisation automatique des dépenses
- [ ] Amélioration extraction OCR (items, TVA)
- [ ] Cache intelligent des résultats
- [ ] Dashboard usage AI (admin)

### Phase 3 (Moyen terme)
- [ ] Assistant chat IA basique
- [ ] Analyse de documents (baux, factures)
- [ ] Notifications intelligentes
- [ ] Suggestions de split

### Phase 4 (Long terme)
- [ ] Commandes langage naturel
- [ ] Prédictions budgétaires
- [ ] Résolution de conflits
- [ ] Personnalisation poussée

---

## 5. Considérations RGPD

### Données envoyées aux APIs
- Images de tickets (contiennent potentiellement des données personnelles)
- Descriptions de dépenses
- Noms de marchands

### Mesures de protection
1. **Anonymisation**: Retirer les données personnelles avant envoi
2. **Minimisation**: N'envoyer que le nécessaire
3. **Consentement**: Informer l'utilisateur de l'usage AI
4. **Rétention**: Ne pas stocker les données chez les providers
5. **Choix local**: Offrir option Tesseract (100% local)

### Providers européens préférés
- Mistral AI (France) - RGPD native
- OVH AI Endpoints (France) - Alternative européenne

---

## 6. Coûts Estimés

### Scenario: 1000 utilisateurs actifs

| Feature | Requêtes/mois | Provider | Coût estimé |
|---------|---------------|----------|-------------|
| OCR | 5000 scans | Gemini Free | 0€ |
| Catégorisation | 10000 | Groq Free | 0€ |
| Chat (future) | 2000 | Mistral Free | 0€ |
| **Total** | | | **~0€/mois** |

### Dépassement quotas
Si dépassement, coûts estimés:
- Gemini: ~$0.30/1M tokens
- OpenAI GPT-4o mini: ~$0.15/1M input
- Groq: ~$0.05/1M tokens

---

## Sources

- [Google Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Together AI Pricing](https://www.together.ai/pricing)
- [Mistral AI Pricing](https://mistral.ai/pricing)
