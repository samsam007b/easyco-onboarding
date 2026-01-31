'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface FAQProps {
  activeRole: Role;
}

// Couleurs sémantiques UI
const SEMANTIC_COLORS = {
  // Help/Questions - Lavender (aide, premium)
  help: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Contact/Mail - Dusty Rose (relationnel)
  contact: { bg: '#D08090', light: '#FDF2F4' },
};

// Couleurs de fond par rôle (tons très légers)
const ROLE_BG_COLORS = {
  searcher: {
    card: '#FFFBEB', // searcher-50
    cardDark: 'rgba(255, 160, 0, 0.08)',
    blob: '#FEF3C7', // searcher-100
    blobDark: 'rgba(255, 160, 0, 0.15)',
    text: '#A16300', // searcher-700 (accessible)
    border: 'rgba(255, 160, 0, 0.15)',
    gradient: 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)',
    primary: '#ffa000',
  },
  resident: {
    card: '#FEF2EE', // resident-50
    cardDark: 'rgba(224, 87, 71, 0.08)',
    blob: '#FDE0D6', // resident-100
    blobDark: 'rgba(224, 87, 71, 0.15)',
    text: '#9A362C', // resident-700 (accessible)
    border: 'rgba(224, 87, 71, 0.15)',
    gradient: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
    primary: '#e05747',
  },
  owner: {
    card: '#F8F0F7', // owner-50
    cardDark: 'rgba(156, 86, 152, 0.08)',
    blob: '#F0E0EE', // owner-100
    blobDark: 'rgba(156, 86, 152, 0.15)',
    text: '#633668', // owner-700 (accessible)
    border: 'rgba(156, 86, 152, 0.15)',
    gradient: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
    primary: '#9c5698',
  },
};

interface FAQItem {
  question: string;
  answer: string;
}

interface RoleContent {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
  contactTitle: string;
  contactSubtitle: string;
  contactButton: string;
}

// Contenu FAQ spécifique par rôle
const roleContent: Record<Role, RoleContent> = {
  searcher: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu dois savoir pour trouver ton co-living idéal',
    faqs: [
      {
        question: "C'est quoi un Living Persona ?",
        answer: "Ton Living Persona, c'est ton profil de coloc ! En répondant à quelques questions sur ton style de vie, tes habitudes et tes préférences, on crée un profil qui permet de te matcher avec des co-livings et des colocataires compatibles. C'est comme un CV, mais pour la vie en communauté.",
      },
      {
        question: 'Comment fonctionne le matching ?',
        answer: "Notre algorithme analyse ton Living Persona et le compare avec les profils des résidents actuels de chaque co-living. On prend en compte tes horaires, ton niveau de sociabilité, tes habitudes de vie, et plein d'autres critères pour te proposer des matchs pertinents. Plus le pourcentage est élevé, plus tu es compatible !",
      },
      {
        question: 'Les annonces sont-elles vérifiées ?',
        answer: "Oui, à 100% ! Chaque annonce est vérifiée par notre équipe avant publication. On vérifie l'identité du propriétaire, l'existence du bien, et la conformité des photos. Tu ne trouveras jamais d'arnaque sur Izzico.",
      },
      {
        question: "Combien ça coûte d'utiliser Izzico ?",
        answer: "La création de ton Living Persona et la recherche de co-livings sont totalement gratuites. Tu peux explorer, matcher et discuter sans frais. Seule la réservation d'une visite ou la signature d'un contrat peuvent impliquer des frais, clairement indiqués à l'avance.",
      },
      {
        question: 'Comment contacter un propriétaire ou des colocs ?',
        answer: "Une fois que tu as matché avec un co-living, tu peux directement envoyer un message aux résidents actuels ou au propriétaire via notre messagerie intégrée. C'est l'occasion de poser tes questions et de voir si le feeling passe avant de visiter !",
      },
      {
        question: 'Puis-je visiter avant de signer ?',
        answer: "Bien sûr ! On encourage toujours les visites avant de s'engager. Tu peux réserver un créneau directement via l'app, rencontrer les futurs colocs, et te faire une idée de l'ambiance. Certains co-livings proposent même des périodes d'essai.",
      },
    ],
    contactTitle: 'Une autre question ?',
    contactSubtitle: "Notre équipe est là pour t'aider à trouver ton co-living idéal",
    contactButton: 'Nous contacter',
  },
  resident: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu dois savoir pour profiter de ton co-living',
    faqs: [
      {
        question: 'Comment payer mon loyer via Izzico ?',
        answer: "C'est super simple ! Dans l'app, va dans la section 'Paiements', et tu peux payer ton loyer en quelques clics par carte ou virement. Tu peux même activer le prélèvement automatique pour ne plus jamais oublier. Ton propriétaire reçoit une notification instantanée.",
      },
      {
        question: 'Comment fonctionne le partage des dépenses ?',
        answer: "Avec la fonction 'Split & Scan', tu scannes un ticket de caisse (courses, resto, etc.) et l'app détecte automatiquement le montant. Tu sélectionnes les colocs concernés, et hop ! Chacun reçoit sa part à payer. Les remboursements se font directement dans l'app.",
      },
      {
        question: 'Comment signaler un problème dans le logement ?',
        answer: "Dans la section 'Issue Hub', tu peux créer un ticket en décrivant le problème, ajouter des photos, et l'envoyer directement à ton propriétaire. Tu peux suivre l'avancement de la résolution et recevoir des notifications à chaque mise à jour.",
      },
      {
        question: 'Puis-je inviter un nouveau colocataire ?',
        answer: "Oui ! Si une chambre se libère, tu peux recommander des candidats via l'app. Le propriétaire verra tes recommandations en priorité, et notre système de matching aide à trouver quelqu'un de compatible avec le groupe existant.",
      },
      {
        question: 'Mes paiements sont-ils sécurisés ?',
        answer: "Absolument. Tous les paiements passent par Stripe, le leader mondial du paiement sécurisé. Tes données bancaires ne sont jamais stockées sur nos serveurs. De plus, chaque transaction est protégée et tu reçois toujours une confirmation.",
      },
      {
        question: "L'app fonctionne-t-elle hors connexion ?",
        answer: "Les fonctionnalités principales comme consulter tes dépenses, voir les messages récents, et accéder à tes documents sont disponibles hors ligne. Les actions nécessitant une synchronisation (paiements, nouveaux messages) s'effectueront dès que tu retrouves une connexion.",
      },
    ],
    contactTitle: 'Besoin d\'aide ?',
    contactSubtitle: "Notre support est disponible 24/7 pour t'accompagner",
    contactButton: 'Contacter le support',
  },
  owner: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu dois savoir pour gérer tes biens efficacement',
    faqs: [
      {
        question: 'Combien coûte Izzico pour les propriétaires ?',
        answer: "Izzico fonctionne sur un modèle simple : tu paies uniquement quand tu trouves un résident. Pas de frais d'inscription, pas d'abonnement mensuel. Nos tarifs sont transparents et compétitifs par rapport aux agences traditionnelles, avec un service bien supérieur.",
      },
      {
        question: 'Comment sont sélectionnés les candidats ?',
        answer: "Chaque candidat crée un Living Persona vérifié. On analyse leur compatibilité avec tes résidents actuels, leur solvabilité (revenus, garant), et leur historique. Tu reçois un dossier complet avec un score de compatibilité pour chaque candidature.",
      },
      {
        question: 'Comment se passent les paiements de loyer ?',
        answer: "Les loyers sont collectés automatiquement chaque mois via prélèvement ou carte bancaire. L'argent est directement versé sur ton compte bancaire, généralement sous 2-3 jours ouvrés. Tu as un dashboard complet pour suivre tous les paiements.",
      },
      {
        question: 'Que se passe-t-il en cas d\'impayé ?',
        answer: "Notre système de prélèvement automatique réduit drastiquement les impayés. En cas de problème, tu es alerté immédiatement et notre équipe intervient pour trouver une solution. On propose aussi une assurance loyers impayés optionnelle pour une tranquillité totale.",
      },
      {
        question: 'Puis-je gérer plusieurs biens ?',
        answer: "Oui, tu peux gérer autant de propriétés que tu veux depuis un seul dashboard. Chaque bien a sa propre page avec ses résidents, ses paiements, et ses documents. Tu as une vue d'ensemble de ton parc immobilier et des alertes centralisées.",
      },
      {
        question: 'Comment fonctionne la signature électronique ?',
        answer: "Nos contrats sont générés automatiquement selon la législation belge et peuvent être signés électroniquement par toutes les parties. La signature est légalement valide et sécurisée. Plus besoin de rendez-vous physiques ou d'impression papier !",
      },
    ],
    contactTitle: 'Une question spécifique ?',
    contactSubtitle: 'Notre équipe propriétaires est là pour vous accompagner',
    contactButton: 'Nous contacter',
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function FAQ({ activeRole }: FAQProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const roleColors = ROLE_BG_COLORS[activeRole];
  const content = roleContent[activeRole];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Reset open index when role changes
  useEffect(() => {
    setOpenIndex(0);
  }, [activeRole]);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-24 transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: SEMANTIC_COLORS.help.bg }}
                >
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
              >
                {content.title}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {content.subtitle}
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 mb-16">
              {content.faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={`${activeRole}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group relative"
                  >
                    {/* FAQ Item Card with V3-fun design */}
                    <div
                      className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
                      style={{
                        background: isDark ? roleColors.cardDark : roleColors.card,
                        border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                      }}
                    >
                      {/* Decorative blob - top right (only when open) */}
                      {isOpen && (
                        <div
                          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-50"
                          style={{
                            background: isDark ? roleColors.blobDark : roleColors.blob,
                          }}
                        />
                      )}

                      {/* Question */}
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="relative z-10 w-full flex items-center justify-between p-6 text-left transition-all duration-200"
                      >
                        <span
                          className="font-bold pr-6 text-lg"
                          style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                        >
                          {item.question}
                        </span>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                          style={{
                            background: isOpen
                              ? roleColors.gradient
                              : isDark ? roleColors.blobDark : roleColors.blob,
                            boxShadow: isOpen ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                          }}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-all duration-300 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                            style={{ color: isOpen ? 'white' : roleColors.text }}
                          />
                        </div>
                      </button>

                      {/* Answer */}
                      <div
                        className={`relative z-10 overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-6">
                          <div
                            className="pt-4"
                            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}
                          />
                          <p className={`leading-relaxed text-base mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact CTA with V3-fun design */}
            <div className="relative group">
              <div
                className="relative overflow-hidden text-center p-10 sm:p-12 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: isDark ? roleColors.cardDark : roleColors.card,
                  border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                }}
              >
                {/* Decorative blob - top right */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: isDark ? roleColors.blobDark : roleColors.blob,
                  }}
                />

                {/* Decorative blob - bottom left */}
                <div
                  className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-40"
                  style={{
                    background: isDark ? roleColors.blobDark : roleColors.blob,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform duration-300"
                    style={{ background: SEMANTIC_COLORS.contact.bg }}
                  >
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                  >
                    {content.contactTitle}
                  </h3>
                  <p className={`mb-8 text-lg max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {content.contactSubtitle}
                  </p>
                  {/* CTA - gradient réservé au CTA principal */}
                  <a
                    href="mailto:hello@izzico.be"
                    className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
                    style={{ background: roleColors.gradient }}
                  >
                    {content.contactButton}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
