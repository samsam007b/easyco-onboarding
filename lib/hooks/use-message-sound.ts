/**
 * Hook for playing message notification sounds
 * Uses Web Audio API to generate a simple notification tone
 */

import { useRef, useCallback } from 'react';

export function useMessageSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const now = audioContext.currentTime;

      // Create oscillator (tone generator)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the tone (pleasant notification sound)
      oscillator.frequency.setValueAtTime(800, now); // 800 Hz
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1); // Descend to 400 Hz

      // Configure volume envelope (fade in and out)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Fade in
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Fade out

      // Play the sound
      oscillator.start(now);
      oscillator.stop(now + 0.3);

      // Cleanup
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.log('Could not play notification sound:', error);
      // Fallback: use system beep (not all browsers support this)
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  }, []);

  return { playSound };
}
