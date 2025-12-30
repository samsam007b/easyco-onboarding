'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const variantStyles = {
  searcher: {
    gradient: 'from-searcher-50/30 via-white to-searcher-50/30',
    accent: 'bg-gradient-searcher',
    accentLight: 'from-searcher-50 to-searcher-100',
    border: 'border-searcher-200',
    text: 'text-searcher-600',
    shadow: 'rgba(74, 144, 226, 0.35)',
    emoji: '💬',
  },
  owner: {
    gradient: 'from-purple-50/30 via-white to-indigo-50/30',
    accent: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    accentLight: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    shadow: 'rgba(124, 58, 237, 0.35)',
    emoji: '🏠',
  },
  hub: {
    gradient: 'from-orange-50/30 via-white to-orange-50/30',
    accent: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
    accentLight: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    shadow: 'rgba(238, 87, 54, 0.35)',
    emoji: '💬',
  },
};

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
        <div className="h-full bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex">
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
  const isHub = variant === 'hub';

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
          className="absolute inset-0 rounded-3xl opacity-30"
          style={{
            background: isHub
              ? 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
              : styles.accent,
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />

        {/* Main icon container */}
        <div
          className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
          style={{
            background: isHub
              ? 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
              : undefined,
            boxShadow: `0 8px 24px ${styles.shadow}`,
          }}
        >
          <MessageCircle className="w-12 h-12 text-white" />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-white/20"
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

      {/* Title with emoji */}
      <motion.h3
        variants={itemVariants}
        className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2"
      >
        <span>Sélectionnez une conversation</span>
        <span className="text-lg">{styles.emoji}</span>
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
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className={cn(
          'md:hidden rounded-full hover:bg-gradient-to-r hover:from-[#d9574f]/10 hover:to-[#ff8017]/10',
          className
        )}
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
