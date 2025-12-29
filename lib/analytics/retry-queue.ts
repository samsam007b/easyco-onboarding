/**
 * Analytics Retry Queue
 *
 * Handles failed analytics requests with exponential backoff retry.
 * Stores failed events in memory and retries them automatically.
 *
 * Features:
 * - Exponential backoff (1s, 2s, 4s, 8s, 16s)
 * - Maximum 5 retry attempts
 * - Automatic queue processing
 * - Memory-based queue (survives tab close via localStorage backup)
 */

import type { EventProperties } from './event-tracker';

interface QueuedEvent {
  id: string;
  eventName: string;
  properties: EventProperties;
  timestamp: number;
  retryCount: number;
  nextRetryAt: number;
}

class AnalyticsRetryQueue {
  private queue: QueuedEvent[] = [];
  private isProcessing = false;
  private maxRetries = 5;
  private baseDelay = 1000; // 1 second
  private storageKey = 'izzico_analytics_queue';

  constructor() {
    if (typeof window !== 'undefined') {
      // Load persisted queue from localStorage
      this.loadQueue();
      // Start processing
      this.startProcessing();
      // Save queue before page unload
      window.addEventListener('beforeunload', () => this.saveQueue());
    }
  }

  /**
   * Add a failed event to the retry queue
   */
  add(eventName: string, properties: EventProperties): void {
    const event: QueuedEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventName,
      properties,
      timestamp: Date.now(),
      retryCount: 0,
      nextRetryAt: Date.now() + this.baseDelay,
    };

    this.queue.push(event);
    this.saveQueue();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Queue] Added event to retry queue:', eventName);
    }
  }

  /**
   * Get the delay for the next retry (exponential backoff)
   */
  private getRetryDelay(retryCount: number): number {
    return this.baseDelay * Math.pow(2, retryCount);
  }

  /**
   * Try to send an event
   */
  private async sendEvent(event: QueuedEvent): Promise<boolean> {
    try {
      // Send to custom analytics endpoint
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: event.eventName,
          properties: event.properties,
          timestamp: new Date(event.timestamp).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Queue] Successfully sent event:', event.eventName);
      }

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics Queue] Failed to send event:', event.eventName, error);
      }
      return false;
    }
  }

  /**
   * Process the retry queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const now = Date.now();
    const eventsToProcess = this.queue.filter((event) => event.nextRetryAt <= now);

    for (const event of eventsToProcess) {
      const success = await this.sendEvent(event);

      if (success) {
        // Remove from queue
        this.queue = this.queue.filter((e) => e.id !== event.id);
      } else {
        // Increment retry count
        event.retryCount++;

        if (event.retryCount >= this.maxRetries) {
          // Max retries reached, remove from queue
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[Analytics Queue] Max retries reached for event:',
              event.eventName
            );
          }
          this.queue = this.queue.filter((e) => e.id !== event.id);
        } else {
          // Schedule next retry with exponential backoff
          event.nextRetryAt = now + this.getRetryDelay(event.retryCount);
        }
      }
    }

    this.saveQueue();
    this.isProcessing = false;
  }

  /**
   * Start automatic queue processing
   */
  private startProcessing(): void {
    // Process queue every 5 seconds
    setInterval(() => {
      this.processQueue();
    }, 5000);

    // Also process immediately
    this.processQueue();
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics Queue] Failed to save queue:', error);
      }
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.queue = JSON.parse(saved);

        // Clean up old events (older than 24 hours)
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        this.queue = this.queue.filter((event) => event.timestamp > dayAgo);

        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics Queue] Loaded queue with', this.queue.length, 'events');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics Queue] Failed to load queue:', error);
      }
    }
  }

  /**
   * Get queue size (for monitoring)
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Clear the queue (for testing)
   */
  clear(): void {
    this.queue = [];
    this.saveQueue();
  }
}

// Export singleton instance
export const retryQueue = new AnalyticsRetryQueue();
