'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  },
  owner: {
    gradient: 'from-purple-50/30 via-white to-indigo-50/30',
    accent: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    accentLight: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
  },
  hub: {
    gradient: 'from-orange-50/30 via-white to-orange-50/30',
    accent: 'bg-gradient-to-br from-orange-500 to-red-500',
    accentLight: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
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
  return (
    <div className="text-center p-8">
      <div
        className={cn(
          'w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg',
          styles.accent
        )}
      >
        <MessageCircle className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Sélectionnez une conversation
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Choisissez une conversation dans la liste pour commencer à discuter
      </p>
    </div>
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
    <Button
      variant="ghost"
      size="icon"
      onClick={onBack}
      className={cn('md:hidden rounded-full hover:bg-gray-100', className)}
      aria-label="Retour"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
