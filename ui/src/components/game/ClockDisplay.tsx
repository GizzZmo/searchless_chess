import { formatTime } from '@/hooks/useClock';
import styles from './ClockDisplay.module.css';

interface ClockDisplayProps {
  timeMs: number;
  isActive: boolean;
}

export function ClockDisplay({ timeMs, isActive }: ClockDisplayProps) {
  const isLow = timeMs < 30_000;
  const isCritical = timeMs < 10_000;

  return (
    <div
      className={[
        styles.clock,
        isActive ? styles.active : styles.inactive,
        isLow ? styles.low : '',
        isCritical ? styles.critical : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${isActive ? 'Active' : 'Paused'} clock: ${formatTime(timeMs)}`}
      aria-live={isActive ? 'polite' : undefined}
    >
      {formatTime(timeMs)}
    </div>
  );
}
