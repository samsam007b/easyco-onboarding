/**
 * AI ASSISTANT CHAT API ROUTE
 *
 * Handles chat messages for the IzzIco AI Assistant
 * Supports tool calls for navigation, filters, and settings
 */

import { openai } from '@ai-sdk/openai';
import { streamText, tool, zodSchema } from 'ai';
import { z } from 'zod';

// System prompt with app knowledge
const SYSTEM_PROMPT = `Tu es l'assistant IA d'IzzIco, une plateforme de colocation en Belgique. Tu aides les utilisateurs à comprendre et utiliser l'application.

## À propos d'IzzIco
IzzIco est une plateforme qui connecte propriétaires de colocations et chercheurs de logement. Elle propose :
- Un système de matching basé sur la personnalité et les préférences
- La gestion complète des colocations (finances, tâches, événements)
- Un système de vérification des profils
- Une messagerie intégrée

## Types d'utilisateurs
1. **Owner (Propriétaire)** - Gère une ou plusieurs propriétés, publie des annonces, sélectionne des colocataires
2. **Resident (Résident)** - Vit dans une colocation, participe à la gestion commune
3. **Searcher (Chercheur)** - Recherche une colocation

## Fonctionnalités principales
- **Dashboard** : Vue d'ensemble de la colocation
- **Propriétés** : Gestion des biens immobiliers (pour owners)
- **Recherche** : Trouver une colocation avec filtres avancés
- **Matching** : Algorithme de compatibilité entre colocataires
- **Finances** : Gestion des dépenses partagées, scan de tickets
- **Messages** : Communication entre membres
- **Profil** : Personnalisation et vérification

## Abonnements
- **Trial gratuit** : 3 mois pour owners, 6 mois pour residents
- **Owner** : 15,99€/mois ou 159,90€/an
- **Resident** : 7,99€/mois ou 79,90€/an
- Parrainage : jusqu'à 3 mois gratuits par ami invité

## Navigation
- /hub : Dashboard principal (résidents)
- /dashboard/owner : Dashboard propriétaire
- /properties : Liste des propriétés
- /properties/add : Ajouter une propriété
- /messages : Messagerie
- /settings : Paramètres du compte
- /dashboard/subscription : Gestion de l'abonnement
- /profile : Profil utilisateur

## Règles de réponse
1. Réponds toujours en français
2. Sois concis mais complet
3. Utilise des emojis avec modération pour rendre les réponses conviviales
4. Si tu ne connais pas une information spécifique, dis-le honnêtement
5. Propose des actions concrètes quand c'est pertinent (navigation, filtres)
6. Adapte ton ton : amical mais professionnel

## Actions disponibles
Tu peux aider l'utilisateur à :
- Naviguer vers différentes pages de l'application
- Configurer des filtres de recherche
- Expliquer les fonctionnalités
- Résoudre des problèmes courants`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        // Navigation tool
        navigate: tool({
          description: 'Navigue vers une page spécifique de l\'application. Utilise cet outil quand l\'utilisateur veut aller quelque part.',
          inputSchema: zodSchema(z.object({
            path: z.string().describe('Le chemin de la page (ex: /hub, /settings, /properties)'),
            description: z.string().describe('Description de la page pour l\'utilisateur'),
          })),
          execute: async ({ path, description }) => {
            return {
              action: 'navigate',
              path,
              message: `Je vous redirige vers ${description}`,
            };
          },
        }),

        // Search filters tool
        setSearchFilters: tool({
          description: 'Configure les filtres de recherche de colocation. Utilise cet outil quand l\'utilisateur veut affiner sa recherche.',
          inputSchema: zodSchema(z.object({
            priceMin: z.number().optional().describe('Prix minimum en euros'),
            priceMax: z.number().optional().describe('Prix maximum en euros'),
            city: z.string().optional().describe('Ville recherchée'),
            roomType: z.enum(['private', 'shared', 'any']).optional().describe('Type de chambre'),
            amenities: z.array(z.string()).optional().describe('Équipements souhaités'),
          })),
          execute: async (filters) => {
            return {
              action: 'setFilters',
              filters,
              message: 'Filtres de recherche mis à jour',
            };
          },
        }),

        // Settings tool
        updateSettings: tool({
          description: 'Modifie les paramètres de l\'utilisateur. Utilise cet outil pour aider à configurer le compte.',
          inputSchema: zodSchema(z.object({
            setting: z.enum([
              'notifications',
              'privacy',
              'language',
              'theme',
            ]).describe('Le paramètre à modifier'),
            action: z.enum(['enable', 'disable', 'navigate']).describe('L\'action à effectuer'),
          })),
          execute: async ({ setting, action }) => {
            const settingPaths: Record<string, string> = {
              notifications: '/settings/notifications',
              privacy: '/settings/privacy',
              language: '/settings/language',
              theme: '/settings',
            };
            return {
              action: 'updateSettings',
              setting,
              settingAction: action,
              path: settingPaths[setting],
              message: `Paramètre ${setting} : ${action}`,
            };
          },
        }),

        // Help topic tool
        explainFeature: tool({
          description: 'Explique une fonctionnalité spécifique de l\'application en détail.',
          inputSchema: zodSchema(z.object({
            feature: z.enum([
              'matching',
              'finances',
              'messaging',
              'verification',
              'subscription',
              'referral',
              'search',
              'property',
            ]).describe('La fonctionnalité à expliquer'),
          })),
          execute: async ({ feature }) => {
            const explanations: Record<string, string> = {
              matching: `🎯 **Matching IzzIco**\n\nNotre algorithme analyse votre personnalité, vos habitudes et vos préférences pour vous proposer des colocations compatibles.\n\n**Comment ça marche ?**\n1. Complétez votre profil de personnalité\n2. Indiquez vos préférences (horaires, propreté, etc.)\n3. L'algorithme calcule un score de compatibilité\n4. Vous voyez les colocations les plus adaptées en premier`,
              finances: `💰 **Gestion des finances**\n\nPartagez équitablement les dépenses de colocation :\n\n- **Scanner de tickets** : Photographiez vos reçus, l'IA extrait les infos\n- **Catégorisation auto** : Courses, charges, internet...\n- **Répartition équitable** : Calcul automatique des parts\n- **Historique** : Suivez toutes les dépenses`,
              messaging: `💬 **Messagerie**\n\nCommuniquez facilement avec vos colocataires et propriétaires :\n\n- Conversations privées et de groupe\n- Notifications en temps réel\n- Partage de fichiers\n- Historique des échanges`,
              verification: `✅ **Vérification de profil**\n\nGagnez en confiance avec un profil vérifié :\n\n- Vérification d'identité\n- Confirmation d'email et téléphone\n- Avis des anciens colocataires\n- Badge de confiance visible`,
              subscription: `💳 **Abonnements**\n\n**Trial gratuit :**\n- Owner : 3 mois\n- Resident : 6 mois\n\n**Tarifs :**\n- Owner : 15,99€/mois ou 159,90€/an (-17%)\n- Resident : 7,99€/mois ou 79,90€/an (-17%)`,
              referral: `🎁 **Programme de parrainage**\n\nInvitez vos amis et gagnez des mois gratuits !\n\n- Inviter un Owner → +3 mois pour vous\n- Inviter un Resident → +2 mois pour vous\n- Votre ami reçoit +1 mois\n- Maximum 24 mois accumulables`,
              search: `🔍 **Recherche de colocation**\n\nTrouvez le logement idéal :\n\n- Filtres avancés (prix, localisation, équipements)\n- Carte interactive\n- Score de compatibilité\n- Photos et visite virtuelle\n- Contact direct avec le propriétaire`,
              property: `🏠 **Gestion de propriété**\n\nPour les propriétaires :\n\n- Publiez vos annonces\n- Gérez plusieurs biens\n- Recevez et triez les candidatures\n- Signez les baux en ligne\n- Suivez les paiements`,
            };
            return {
              action: 'explain',
              feature,
              explanation: explanations[feature] || 'Fonctionnalité non documentée',
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Assistant chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
