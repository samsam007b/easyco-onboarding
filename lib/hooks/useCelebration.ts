'use client';

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

type CelebrationType = 'success' | 'achievement' | 'milestone' | 'welcome';

interface CelebrationOptions {
  type?: CelebrationType;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
}

// Color schemes matching app variants
const COLORS = {
  searcher: ['#9c5698', '#9D7EE5', '#FFA040', '#FFD700'],
  resident: ['#e05747', '#ff651e', '#ff9014', '#FFD700'], // Option C palette
  default: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d'],
};

export function useCelebration(variant: 'searcher' | 'resident' = 'searcher') {
  const colors = COLORS[variant];

  const fireConfetti = useCallback((options: CelebrationOptions = {}) => {
    const { type = 'success', intensity = 'medium' } = options;

    const intensityConfig = {
      low: { particleCount: 30, spread: 50 },
      medium: { particleCount: 80, spread: 70 },
      high: { particleCount: 150, spread: 100 },
    };

    const config = intensityConfig[intensity];

    switch (type) {
      case 'success':
        // Simple burst from center
        confetti({
          particleCount: config.particleCount,
          spread: config.spread,
          origin: { y: 0.6 },
          colors,
        });
        break;

      case 'achievement':
        // Two-sided burst for achievements
        const count = Math.floor(config.particleCount / 2);
        confetti({
          particleCount: count,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: count,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        break;

      case 'milestone':
        // Continuous celebration for major milestones
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
        break;

      case 'welcome':
        // Stars/sparkles effect for welcome
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.5 },
          shapes: ['star'],
          colors,
        });
        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 80,
            origin: { y: 0.6 },
            shapes: ['circle'],
            colors,
          });
        }, 200);
        break;
    }
  }, [colors]);

  const celebrateSuccess = useCallback(() => {
    fireConfetti({ type: 'success', intensity: 'medium' });
  }, [fireConfetti]);

  const celebrateAchievement = useCallback(() => {
    fireConfetti({ type: 'achievement', intensity: 'high' });
  }, [fireConfetti]);

  const celebrateMilestone = useCallback(() => {
    fireConfetti({ type: 'milestone', intensity: 'high' });
  }, [fireConfetti]);

  const celebrateWelcome = useCallback(() => {
    fireConfetti({ type: 'welcome', intensity: 'medium' });
  }, [fireConfetti]);

  return {
    fireConfetti,
    celebrateSuccess,
    celebrateAchievement,
    celebrateMilestone,
    celebrateWelcome,
  };
}
