'use client';

import { useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Settings, RefreshCw, LogOut, User, Home, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

/**
 * DevTools component for development and testing
 * Only visible in development mode
 *
 * Features:
 * - Quick role switching without onboarding
 * - Reset onboarding
 * - Logout
 * - Navigate to dashboards
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const quickSwitchRole = async (role: 'searcher' | 'owner' | 'resident') => {
    setIsChangingRole(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error(getHookTranslation('devtools', 'notAuthenticated'));
        return;
      }

      // Update user type and mark onboarding as completed
      const { error } = await supabase
        .from('users')
        .update({
          user_type: role,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) {
        // FIXME: Use logger.error('Error switching role:', error);
        toast.error(getHookTranslation('devtools', 'switchRoleFailed'));
        return;
      }

      toast.success(`${getHookTranslation('devtools', 'switchedTo')} ${role}!`);
      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch (error) {
      // FIXME: Use logger.error('Error:', error);
      toast.error(getHookTranslation('devtools', 'errorOccurred'));
    } finally {
      setIsChangingRole(false);
    }
  };

  const resetOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error(getHookTranslation('devtools', 'notAuthenticated'));
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: false })
        .eq('id', user.id);

      if (error) {
        toast.error(getHookTranslation('devtools', 'resetOnboardingFailed'));
        return;
      }

      toast.success(getHookTranslation('devtools', 'onboardingReset'));
      router.push(`/onboarding/${userData?.user_type || 'searcher'}/basic-info`);
    } catch (error) {
      // FIXME: Use logger.error('Error:', error);
      toast.error(getHookTranslation('devtools', 'errorOccurred'));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(getHookTranslation('devtools', 'loggedOut'));
    router.push('/login');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Dev Tools"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h3 className="font-bold text-gray-900">Dev Tools</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Quick Role Switch */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">QUICK SWITCH ROLE</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => quickSwitchRole('searcher')}
                  disabled={isChangingRole}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Search className="w-3 h-3 mr-1" />
                  Searcher
                </Button>
                <Button
                  onClick={() => quickSwitchRole('owner')}
                  disabled={isChangingRole}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Home className="w-3 h-3 mr-1" />
                  Owner
                </Button>
                <Button
                  onClick={() => quickSwitchRole('resident')}
                  disabled={isChangingRole}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <User className="w-3 h-3 mr-1" />
                  Resident
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Switches role instantly without onboarding
              </p>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">QUICK ACTIONS</p>
              <div className="space-y-2">
                <Button
                  onClick={resetOnboarding}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Onboarding
                </Button>
                <Button
                  onClick={() => router.push('/profile')}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <User className="w-3 h-3 mr-1" />
                  Go to Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Development Mode Only
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
