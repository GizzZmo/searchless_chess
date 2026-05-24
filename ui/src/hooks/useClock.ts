import { useEffect, useRef, useCallback } from 'react';
import type { Color } from '@/types/game';

interface UseClockOptions {
  active: boolean;
  turn: Color;
  onTick: (color: Color, ms: number) => void;
  timeLeft: { w: number; b: number };
  onTimeout?: (color: Color) => void;
}

export function useClock({ active, turn, onTick, timeLeft, onTimeout }: UseClockOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    stop();
    if (!active) return;

    intervalRef.current = setInterval(() => {
      const current = timeLeftRef.current[turn];
      const next = current - 100;
      if (next <= 0) {
        stop();
        onTick(turn, 0);
        onTimeout?.(turn);
      } else {
        onTick(turn, next);
      }
    }, 100);

    return stop;
  }, [active, turn, onTick, onTimeout, stop]);
}

export function formatTime(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
