import { useState, useEffect } from 'react';

export type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const PATTERNS = {
  '4-7-8': { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  'box': { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  'relax': { inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
} as const;

export type BreathingPattern = keyof typeof PATTERNS;

interface UseBreathingCycleProps {
  pattern: BreathingPattern;
  speedMultiplier?: number;
  isActive: boolean;
}

export const useBreathingCycle = ({ pattern, speedMultiplier = 1, isActive }: UseBreathingCycleProps) => {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState<number>(PATTERNS[pattern].inhale);
  // Progress from 0 to 1 for the current phase
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase('inhale');
      setTimeLeft(PATTERNS[pattern].inhale);
      setProgress(0);
      return;
    }

    const { inhale, holdIn, exhale, holdOut } = PATTERNS[pattern];
    const sequence: { p: BreathingPhase; d: number }[] = [
      { p: 'inhale', d: inhale },
      ...(holdIn > 0 ? [{ p: 'hold-in' as const, d: holdIn }] : []),
      { p: 'exhale', d: exhale },
      ...(holdOut > 0 ? [{ p: 'hold-out' as const, d: holdOut }] : []),
    ];

    let currentStepIndex = sequence.findIndex((s) => s.p === phase);
    if (currentStepIndex === -1) currentStepIndex = 0;

    const currentDuration = sequence[currentStepIndex]!.d;
    const tickMs = 100 / speedMultiplier; // 10 updates per second adjusted by speed

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - (0.1 * speedMultiplier);
        
        if (newTime <= 0) {
          // Move to next phase
          const nextIndex = (currentStepIndex + 1) % sequence.length;
          setPhase(sequence[nextIndex]!.p);
          setProgress(0);
          return sequence[nextIndex]!.d;
        }
        
        // Calculate progress
        setProgress(1 - (newTime / currentDuration));
        return newTime;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isActive, phase, pattern, speedMultiplier]);

  return { phase, timeLeft, progress };
};
