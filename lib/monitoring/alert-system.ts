/**
 * IZZICO INTELLIGENT ALERT SYSTEM
 *
 * Système d'alertes intelligentes avec ML et prédictions
 * Détection d'anomalies et notifications multi-canal
 */

import { createClient } from '@/lib/auth/supabase-client';

export type AlertType = 'anomaly' | 'threshold' | 'pattern' | 'prediction';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type NotificationChannel = 'email' | 'slack' | 'sms' | 'webhook';

export interface Alert {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  sourceTable?: string;
  sourceId?: string;
  metadata?: Record<string, any>;
  notificationChannels?: NotificationChannel[];
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  timeWindow: string;
  severity: AlertSeverity;
  enabled: boolean;
  channels: NotificationChannel[];
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  score: number; // 0-1, où 1 = forte anomalie
  reason: string;
  expectedValue?: number;
  actualValue: number;
  deviationPercent: number;
}

class AlertSystem {
  private static instance: AlertSystem;
  private supabase = createClient();
  private alertQueue: Alert[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 5000; // 5 secondes

  // Baseline pour la détection d'anomalies
  private baselines: Map<string, { mean: number; stdDev: number; samples: number[] }> = new Map();

  private constructor() {
    this.startAutoFlush();
    this.loadBaselines();
  }

  public static getInstance(): AlertSystem {
    if (!AlertSystem.instance) {
      AlertSystem.instance = new AlertSystem();
    }
    return AlertSystem.instance;
  }

  /**
   * Créer une alerte
   */
  public async createAlert(alert: Alert): Promise<void> {
    try {
      this.alertQueue.push(alert);

      // Flush immédiat si critique
      if (alert.severity === 'critical') {
        await this.flush();
        // Envoyer des notifications immédiates
        await this.sendNotifications(alert);
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ALERT] ${alert.severity.toUpperCase()} - ${alert.title}:`, alert.description);
      }
    } catch (error) {
      console.error('[ALERT SYSTEM] Failed to create alert:', error);
    }
  }

  /**
   * Flush les alertes vers la base de données
   */
  private async flush(): Promise<void> {
    if (this.alertQueue.length === 0) return;

    const alerts = [...this.alertQueue];
    this.alertQueue = [];

    try {
      const formattedAlerts = alerts.map(alert => ({
        alert_type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        source_table: alert.sourceTable,
        source_id: alert.sourceId,
        metadata: alert.metadata || {},
        notification_channels: alert.notificationChannels || [],
      }));

      const { error } = await this.supabase.from('security_alerts').insert(formattedAlerts);

      if (error) {
        console.error('[ALERT SYSTEM] Failed to insert alerts:', error);
        this.alertQueue.unshift(...alerts);
      }
    } catch (error) {
      console.error('[ALERT SYSTEM] Flush failed:', error);
      this.alertQueue.unshift(...alerts);
    }
  }

  /**
   * Démarrer le flush automatique
   */
  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  /**
   * Envoyer des notifications
   */
  private async sendNotifications(alert: Alert): Promise<void> {
    const channels = alert.notificationChannels || ['email'];

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'email':
            await this.sendEmailNotification(alert);
            break;
          case 'slack':
            await this.sendSlackNotification(alert);
            break;
          case 'sms':
            await this.sendSMSNotification(alert);
            break;
          case 'webhook':
            await this.sendWebhookNotification(alert);
            break;
        }
      } catch (error) {
        console.error(`[ALERT SYSTEM] Failed to send ${channel} notification:`, error);
      }
    }

    // Marquer comme envoyée
    await this.supabase
      .from('security_alerts')
      .update({ notification_sent: true })
      .eq('title', alert.title)
      .eq('created_at', new Date().toISOString());
  }

  /**
   * Envoyer une notification email
   */
  private async sendEmailNotification(alert: Alert): Promise<void> {
    // TODO: Intégrer avec un service d'email (SendGrid, AWS SES, etc.)
    console.log('[EMAIL] Sending alert notification:', alert.title);
  }

  /**
   * Envoyer une notification Slack
   */
  private async sendSlackNotification(alert: Alert): Promise<void> {
    // TODO: Intégrer avec Slack webhook
    console.log('[SLACK] Sending alert notification:', alert.title);
  }

  /**
   * Envoyer une notification SMS
   */
  private async sendSMSNotification(alert: Alert): Promise<void> {
    // TODO: Intégrer avec Twilio ou AWS SNS
    console.log('[SMS] Sending alert notification:', alert.title);
  }

  /**
   * Envoyer une notification webhook
   */
  private async sendWebhookNotification(alert: Alert): Promise<void> {
    // TODO: Envoyer à un webhook personnalisé
    console.log('[WEBHOOK] Sending alert notification:', alert.title);
  }

  /**
   * Détecter des anomalies statistiques
   */
  public detectAnomaly(
    metric: string,
    value: number,
    options: {
      sensitivity?: number; // 1-5, où 5 = plus sensible
      updateBaseline?: boolean;
    } = {}
  ): AnomalyDetectionResult {
    const sensitivity = options.sensitivity || 3;
    const updateBaseline = options.updateBaseline ?? true;

    // Récupérer ou créer la baseline
    let baseline = this.baselines.get(metric);

    if (!baseline) {
      // Pas assez de données, pas d'anomalie
      if (updateBaseline) {
        this.baselines.set(metric, {
          mean: value,
          stdDev: 0,
          samples: [value],
        });
      }
      return {
        isAnomaly: false,
        score: 0,
        reason: 'Insufficient historical data',
        actualValue: value,
        deviationPercent: 0,
      };
    }

    // Calculer l'écart-type et la moyenne
    const { mean, stdDev, samples } = baseline;

    if (samples.length < 10) {
      // Pas assez d'échantillons
      if (updateBaseline) {
        samples.push(value);
        const newMean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const newStdDev = Math.sqrt(
          samples.reduce((sum, val) => sum + Math.pow(val - newMean, 2), 0) / samples.length
        );
        this.baselines.set(metric, { mean: newMean, stdDev: newStdDev, samples });
      }
      return {
        isAnomaly: false,
        score: 0,
        reason: 'Building baseline',
        actualValue: value,
        deviationPercent: 0,
      };
    }

    // Calculer le z-score
    const zScore = stdDev === 0 ? 0 : Math.abs((value - mean) / stdDev);

    // Seuil basé sur la sensibilité
    const threshold = 3 - (sensitivity - 3) * 0.5; // 3σ par défaut, ajusté par sensibilité

    const isAnomaly = zScore > threshold;
    const deviationPercent = mean === 0 ? 0 : ((value - mean) / mean) * 100;

    // Mettre à jour la baseline avec la nouvelle valeur
    if (updateBaseline && !isAnomaly) {
      samples.push(value);
      // Garder seulement les 100 dernières valeurs
      if (samples.length > 100) {
        samples.shift();
      }
      const newMean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const newStdDev = Math.sqrt(
        samples.reduce((sum, val) => sum + Math.pow(val - newMean, 2), 0) / samples.length
      );
      this.baselines.set(metric, { mean: newMean, stdDev: newStdDev, samples });
    }

    return {
      isAnomaly,
      score: Math.min(1, zScore / 5), // Normaliser entre 0 et 1
      reason: isAnomaly
        ? `Value deviates ${Math.round(deviationPercent)}% from baseline (${zScore.toFixed(2)}σ)`
        : 'Within normal range',
      expectedValue: mean,
      actualValue: value,
      deviationPercent: Math.round(deviationPercent),
    };
  }

  /**
   * Surveiller les métriques et créer des alertes
   */
  public async monitorMetric(
    metric: string,
    value: number,
    context: {
      category?: string;
      route?: string;
      userId?: string;
    } = {}
  ): Promise<void> {
    // Détecter les anomalies
    const anomaly = this.detectAnomaly(metric, value, { sensitivity: 4 });

    if (anomaly.isAnomaly) {
      await this.createAlert({
        type: 'anomaly',
        severity: anomaly.score > 0.8 ? 'critical' : 'warning',
        title: `Anomaly detected in ${metric}`,
        description: anomaly.reason,
        metadata: {
          metric,
          expectedValue: anomaly.expectedValue,
          actualValue: anomaly.actualValue,
          deviationPercent: anomaly.deviationPercent,
          score: anomaly.score,
          ...context,
        },
        notificationChannels: anomaly.score > 0.8 ? ['email', 'slack'] : ['email'],
      });
    }
  }

  /**
   * Prédire des problèmes potentiels basés sur les tendances
   */
  public async predictIssues(): Promise<
    Array<{
      prediction: string;
      probability: number;
      timeframe: string;
      preventiveActions: string[];
    }>
  > {
    const predictions: Array<{
      prediction: string;
      probability: number;
      timeframe: string;
      preventiveActions: string[];
    }> = [];

    try {
      // Analyser les tendances d'erreurs
      const { data: errorTrend } = await this.supabase
        .from('security_errors')
        .select('created_at, severity')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (errorTrend && errorTrend.length > 0) {
        // Compter les erreurs par jour
        const errorsByDay: Record<string, number> = {};
        errorTrend.forEach((error: any) => {
          const day = error.created_at.split('T')[0];
          errorsByDay[day] = (errorsByDay[day] || 0) + 1;
        });

        const days = Object.keys(errorsByDay).sort();
        const counts = days.map(day => errorsByDay[day]);

        // Calculer la tendance (régression linéaire simple)
        if (counts.length >= 3) {
          const avgGrowth = (counts[counts.length - 1] - counts[0]) / counts.length;

          if (avgGrowth > 5) {
            predictions.push({
              prediction: 'Error rate increasing significantly',
              probability: 0.75,
              timeframe: '3-7 days',
              preventiveActions: [
                'Review recent code changes',
                'Check for infrastructure issues',
                'Increase monitoring frequency',
              ],
            });
          }
        }
      }

      // Analyser les tendances de performance
      const { data: perfTrend } = await this.supabase
        .from('route_analytics')
        .select('response_time_ms, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (perfTrend && perfTrend.length > 100) {
        const responseTimes = perfTrend.map((r: any) => r.response_time_ms);
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

        // Comparer avec la baseline
        const baseline = this.baselines.get('avg_response_time');
        if (baseline && avgResponseTime > baseline.mean * 1.5) {
          predictions.push({
            prediction: 'Performance degradation likely to worsen',
            probability: 0.65,
            timeframe: '1-3 days',
            preventiveActions: [
              'Review database query performance',
              'Check for memory leaks',
              'Consider scaling infrastructure',
            ],
          });
        }
      }

      // Analyser les incidents de sécurité
      const { data: securityTrend } = await this.supabase
        .from('security_events')
        .select('event_type, created_at')
        .eq('severity', 'critical')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (securityTrend && securityTrend.length > 10) {
        predictions.push({
          prediction: 'Increased security threat activity',
          probability: 0.8,
          timeframe: 'Immediate',
          preventiveActions: [
            'Review and strengthen security policies',
            'Enable additional monitoring',
            'Consider temporary rate limiting',
          ],
        });
      }

      return predictions;
    } catch (error) {
      console.error('[ALERT SYSTEM] Failed to predict issues:', error);
      return [];
    }
  }

  /**
   * Charger les baselines depuis la base de données
   */
  private async loadBaselines(): Promise<void> {
    try {
      // Charger les métriques historiques pour établir les baselines
      const { data: perfData } = await this.supabase
        .from('performance_metrics')
        .select('metric_name, metric_value')
        .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1000);

      if (perfData) {
        const metricGroups: Record<string, number[]> = {};

        perfData.forEach((m: any) => {
          if (!metricGroups[m.metric_name]) {
            metricGroups[m.metric_name] = [];
          }
          metricGroups[m.metric_name].push(m.metric_value);
        });

        for (const [metric, values] of Object.entries(metricGroups)) {
          if (values.length >= 10) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(
              values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
            );
            this.baselines.set(metric, { mean, stdDev, samples: values.slice(-100) });
          }
        }
      }
    } catch (error) {
      console.error('[ALERT SYSTEM] Failed to load baselines:', error);
    }
  }

  /**
   * Obtenir les alertes non acquittées
   */
  public async getUnacknowledgedAlerts(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('security_alerts')
        .select('*')
        .eq('acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[ALERT SYSTEM] Failed to get unacknowledged alerts:', error);
      return [];
    }
  }

  /**
   * Acquitter une alerte
   */
  public async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('security_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: userId,
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('[ALERT SYSTEM] Failed to acknowledge alert:', error);
    }
  }
}

// Export singleton
export const alertSystem = AlertSystem.getInstance();
