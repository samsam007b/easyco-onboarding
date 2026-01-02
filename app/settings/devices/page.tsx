'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Globe,
  MapPin,
  Clock,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface Device {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location?: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function DevicesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.devices;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // In a real implementation, this would fetch from a sessions table
      // For now, we'll show mock data with the current session
      const mockDevices: Device[] = [
        {
          id: '1',
          deviceType: 'desktop',
          browser: 'Chrome 120',
          os: 'macOS',
          location: 'Paris, France',
          ipAddress: '192.168.1.1',
          lastActive: new Date().toISOString(),
          isCurrent: true
        }
      ];

      setDevices(mockDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutDevice = async (deviceId: string) => {
    if (!confirm(t?.confirmLogout?.[language] || 'Are you sure you want to log out this device?')) return;

    try {
      // In production, this would revoke the session
      setMessage({ type: 'success', text: t?.messages?.deviceLoggedOut?.[language] || 'Device logged out successfully' });
      setDevices(devices.filter(d => d.id !== deviceId));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Error logging out') });
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm(t?.confirmLogoutAll?.[language] || 'Are you sure you want to log out all other devices?')) return;

    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;

      setMessage({ type: 'success', text: t?.messages?.allLoggedOut?.[language] || 'All other devices have been logged out' });
      loadDevices();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Error logging out') });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return Monitor;
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Smartphone;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t?.time?.now?.[language] || 'Just now';
    if (diffMins < 60) return (t?.time?.minutes?.[language] || '{n} min ago').replace('{n}', String(diffMins));
    if (diffHours < 24) return (t?.time?.hours?.[language] || '{n}h ago').replace('{n}', String(diffHours));
    if (diffDays === 1) return t?.time?.yesterday?.[language] || 'Yesterday';
    return (t?.time?.days?.[language] || '{n} days ago').replace('{n}', String(diffDays));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50/30 via-white to-blue-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-white to-blue-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t?.back?.[language] || 'Back to settings'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-200/70 to-blue-200/70 flex items-center justify-center shadow-sm">
              <Smartphone className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Devices'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Manage your active sessions'}</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 rounded-xl flex items-center gap-3",
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* Logout All Button */}
        {devices.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Button
              onClick={handleLogoutAllDevices}
              variant="outline"
              className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t?.logoutAll?.[language] || 'Log out all other devices'}
            </Button>
          </motion.div>
        )}

        {/* Devices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {devices.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
              <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t?.noSessions?.[language] || 'No active sessions'}</p>
            </div>
          ) : (
            devices.map((device, index) => {
              const DeviceIcon = getDeviceIcon(device.deviceType);

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={cn(
                    "bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-sm",
                    device.isCurrent ? 'border-cyan-300 bg-cyan-50/30' : 'border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Device Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center",
                        device.isCurrent
                          ? 'bg-gradient-to-br from-cyan-200 to-blue-200'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      )}>
                        <DeviceIcon className="w-7 h-7 text-gray-700" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {device.browser} {t?.on?.[language] || 'on'} {device.os}
                          </h3>
                          {device.isCurrent && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-100 text-cyan-800 text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              {t?.thisDevice?.[language] || 'This device'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          {device.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{device.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{device.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{t?.lastActivity?.[language] || 'Last activity'}: {formatLastActive(device.lastActive)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    {!device.isCurrent && (
                      <Button
                        onClick={() => handleLogoutDevice(device.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl flex-shrink-0"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t?.logout?.[language] || 'Log out'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">{t?.info?.title?.[language] || 'Account security'}</p>
              <p className="text-blue-700">
                {t?.info?.description?.[language] || 'If you notice suspicious activity or a device you don\'t recognize, log it out immediately and change your password.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
