'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

// V2 Fun Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

interface MessagesLayoutProps {
  // Sidebar content (conversation list)
  sidebar: ReactNode;
  // Main content (chat window or empty state)
  children: ReactNode;
  // Whether a conversation is selected (for mobile responsive)
  hasSelectedConversation: boolean;
  // Callback when back button is clicked on mobile
  onBack?: () => void;
  // Header content (optional, for custom headers)
  header?: ReactNode;
  // Theme variant
  variant?: 'searcher' | 'owner' | 'hub';
  // Custom empty state
  emptyState?: ReactNode;
  // Show the chat panel (for mobile)
  showChat?: boolean;
}

// V3 Role-based color themes - exported for use in conversation list
export const messageVariantStyles = {
  searcher: {
    gradient: 'from-searcher-50/30 via-white to-searcher-50/30',
    accent: 'bg-gradient-searcher',
    accentGradient: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
    accentLight: 'from-searcher-50 to-searcher-100',
    border: 'border-searcher-200',
    text: 'text-searcher-600',
    shadow: 'rgba(245, 158, 11, 0.35)',
    primary: '#f59e0b',
    light: '#fef3c7',
    focusBorder: 'focus:border-searcher-300',
    hoverBg: 'hover:border-searcher-100',
    selectedBg: 'rgba(254, 243, 199, 0.5)',
    selectedBorder: 'rgba(245, 158, 11, 0.3)',
  },
  owner: {
    // V3 Owner mauve palette
    gradient: 'from-[#F8F0F7]/30 via-white to-[#FDF5F9]/30',
    accent: 'bg-gradient-to-br from-[#9c5698] to-[#c2566b]',
    accentGradient: 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)',
    accentLight: 'from-[#F8F0F7] to-[#FDF5F9]',
    border: 'border-[#D4B5D1]',
    text: 'text-[#9c5698]',
    shadow: 'rgba(156, 86, 152, 0.35)',
    primary: '#9c5698',
    light: '#F8F0F7',
    focusBorder: 'focus:border-[#D4B5D1]',
    hoverBg: 'hover:border-[#F8F0F7]',
    selectedBg: 'rgba(248, 240, 247, 0.8)',
    selectedBorder: 'rgba(156, 86, 152, 0.3)',
  },
  hub: {
    // Resident orange theme
    gradient: 'from-orange-50/30 via-white to-orange-50/30',
    accent: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
    accentGradient: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
    accentLight: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    shadow: 'rgba(255, 101, 30, 0.35)',
    primary: '#ff651e',
    light: '#fff7ed',
    focusBorder: 'focus:border-orange-300',
    hoverBg: 'hover:border-orange-100',
    selectedBg: 'rgba(255, 245, 243, 1)',
    selectedBorder: 'rgba(255, 91, 33, 0.3)',
  },
};

// Alias for internal use
const variantStyles = messageVariantStyles;

export function MessagesLayout({
  sidebar,
  children,
  hasSelectedConversation,
  onBack,
  header,
  variant = 'searcher',
  emptyState,
  showChat = false,
}: MessagesLayoutProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('min-h-screen bg-gradient-to-br', styles.gradient)}>
      {/* Optional Header */}
      {header && <div className="mb-6">{header}</div>}

      {/* Main Container - accounts for fixed header (pt-24 = 6rem in parent layout) */}
      <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)] max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="h-full bg-white superellipse-2xl md:superellipse-3xl shadow-xl border border-gray-100 overflow-hidden flex">
          {/* Sidebar - Conversation List */}
          <aside
            className={cn(
              'w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-gray-100',
              'flex flex-col bg-gray-50/50',
              // On mobile, hide sidebar when conversation is selected
              hasSelectedConversation ? 'hidden md:flex' : 'flex'
            )}
          >
            {sidebar}
          </aside>

          {/* Main Content - Chat Window */}
          <main
            className={cn(
              'flex-1 flex flex-col min-w-0',
              // On mobile, hide main content when no conversation is selected
              !hasSelectedConversation ? 'hidden md:flex' : 'flex'
            )}
          >
            <AnimatePresence mode="wait">
              {hasSelectedConversation ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  {children}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex items-center justify-center"
                >
                  {emptyState || (
                    <DefaultEmptyState variant={variant} styles={styles} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

interface DefaultEmptyStateProps {
  variant: 'searcher' | 'owner' | 'hub';
  styles: typeof variantStyles.searcher;
}

function DefaultEmptyState({ variant, styles }: DefaultEmptyStateProps) {
  // Get the proper gradient for each variant
  const accentGradient = styles.accentGradient || styles.accent;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center p-8"
    >
      {/* Animated icon with glow */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05, rotate: 3 }}
        className="relative mx-auto mb-6"
      >
        {/* Glow rings */}
        <motion.div
          className="absolute inset-0 superellipse-3xl opacity-30"
          style={{
            background: accentGradient,
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />

        {/* Main icon container */}
        <div
          className="relative w-24 h-24 superellipse-3xl flex items-center justify-center shadow-lg"
          style={{
            background: accentGradient,
            boxShadow: `0 8px 24px ${styles.shadow}`,
          }}
        >
          <MessageCircle className="w-12 h-12 text-white" />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 superellipse-3xl bg-white/20"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        </div>

        {/* Floating sparkles */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Sparkles className="w-6 h-6 text-amber-400" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className="text-xl font-bold text-gray-900 mb-2"
      >
        Sélectionnez une conversation
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className="text-gray-500 max-w-sm mx-auto"
      >
        Choisissez une conversation dans la liste pour commencer à discuter
      </motion.p>
    </motion.div>
  );
}

// Mobile back button component for use in chat headers
export function MobileBackButton({
  onBack,
  className,
}: {
  onBack: () => void;
  className?: string;
}) {
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className={cn(
          'md:hidden rounded-full hover:bg-gradient-to-r hover:from-[#e05747]/10 hover:to-[#ff9014]/10',
          className
        )}
        aria-label={ariaLabels?.back?.[language] || 'Back'}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
