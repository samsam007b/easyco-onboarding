'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface SecurityError {
  id: string;
  error_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  route: string | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
}

export interface SecurityStats {
  totalErrors: number;
  errors24h: number;
  unresolvedErrors: number;
  activeAlerts: number;
  securityScore: number;
}

// ============================================================================
// HOOK
// ============================================================================

export function useSecurityRealtime(initialStats?: SecurityStats) {
  const supabase = createClient();
  const [stats, setStats] = useState<SecurityStats>(initialStats || {
    totalErrors: 0,
    errors24h: 0,
    unresolvedErrors: 0,
    activeAlerts: 0,
    securityScore: 85,
  });
  const [recentErrors, setRecentErrors] = useState<SecurityError[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SecurityAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const last24h = new Date(Date.now() - 86400000).toISOString();

      const [errorsRes, alertsRes, statsRes] = await Promise.all([
        supabase
          .from('security_errors')
          .select('id, error_type, severity, message, route, resolved, resolved_at, resolved_by, created_at')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('security_alerts')
          .select('id, severity, title, description, acknowledged, acknowledged_at, acknowledged_by, created_at')
          .eq('acknowledged', false)
          .order('created_at', { ascending: false })
          .limit(10),
        Promise.all([
          supabase.from('security_errors').select('*', { count: 'exact', head: true }),
          supabase.from('security_errors').select('*', { count: 'exact', head: true }).gte('created_at', last24h),
          supabase.from('security_errors').select('*', { count: 'exact', head: true }).eq('resolved', false),
          supabase.from('security_alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
          supabase.from('security_score_history').select('overall_score').order('calculated_at', { ascending: false }).limit(1),
        ]),
      ]);

      if (errorsRes.data) setRecentErrors(errorsRes.data);
      if (alertsRes.data) setActiveAlerts(alertsRes.data);

      const [total, last24, unresolved, alerts, score] = statsRes;
      setStats({
        totalErrors: total.count || 0,
        errors24h: last24.count || 0,
        unresolvedErrors: unresolved.count || 0,
        activeAlerts: alerts.count || 0,
        securityScore: score.data?.[0]?.overall_score || 85,
      });
    } catch (error) {
      console.error('[SecurityRealtime] Error loading data:', error);
    }
  }, [supabase]);

  // Subscribe to real-time updates
  const subscribe = useCallback(() => {
    if (channelRef.current) return;

    const channel = supabase
      .channel('security-realtime')
      // Security Errors
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_errors' },
        (payload) => {
          const newError = payload.new as SecurityError;
          setRecentErrors(prev => [newError, ...prev.slice(0, 9)]);
          setStats(prev => ({
            ...prev,
            totalErrors: prev.totalErrors + 1,
            errors24h: prev.errors24h + 1,
            unresolvedErrors: prev.unresolvedErrors + 1,
          }));

          // Show toast for critical/high errors
          if (newError.severity === 'critical' || newError.severity === 'high') {
            toast.error(`${getHookTranslation('security', 'newError')} (${newError.severity})`, {
              description: newError.message.slice(0, 100),
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'security_errors' },
        (payload) => {
          const updated = payload.new as SecurityError;
          setRecentErrors(prev => prev.map(e => e.id === updated.id ? updated : e));

          // Update unresolved count if status changed
          if (updated.resolved && !payload.old.resolved) {
            setStats(prev => ({
              ...prev,
              unresolvedErrors: Math.max(0, prev.unresolvedErrors - 1),
            }));
            toast.success(getHookTranslation('security', 'errorResolved'));
          }
        }
      )
      // Security Alerts
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setActiveAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
          setStats(prev => ({
            ...prev,
            activeAlerts: prev.activeAlerts + 1,
          }));

          // Always show toast for new alerts
          toast.warning(`${getHookTranslation('security', 'newAlert')}: ${newAlert.title}`, {
            description: newAlert.description.slice(0, 100),
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const updated = payload.new as SecurityAlert;

          if (updated.acknowledged) {
            setActiveAlerts(prev => prev.filter(a => a.id !== updated.id));
            setStats(prev => ({
              ...prev,
              activeAlerts: Math.max(0, prev.activeAlerts - 1),
            }));
          } else {
            setActiveAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
          }
        }
      )
      // Security Score
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_score_history' },
        (payload) => {
          const newScore = payload.new as { overall_score: number };
          setStats(prev => ({
            ...prev,
            securityScore: newScore.overall_score,
          }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
  }, [supabase]);

  // Unsubscribe
  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
  }, [supabase]);

  // Initialize
  useEffect(() => {
    loadData();
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [loadData, subscribe, unsubscribe]);

  return {
    stats,
    recentErrors,
    activeAlerts,
    isConnected,
    refresh: loadData,
  };
}
