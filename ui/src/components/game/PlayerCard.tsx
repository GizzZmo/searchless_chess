import styles from './PlayerCard.module.css';
import { ClockDisplay } from './ClockDisplay';
import type { Color } from '@/types/game';

interface PlayerCardProps {
  name: string;
  color: Color;
  timeMs: number;
  isActive: boolean;
  rating?: number;
}

export function PlayerCard({ name, color, timeMs, isActive, rating }: PlayerCardProps) {
  return (
    <div className={[styles.card, isActive ? styles.active : ''].join(' ')}>
      <div className={styles.info}>
        <span className={styles.colorDot} data-color={color} aria-hidden="true" />
        <span className={styles.name}>{name}</span>
        {rating !== undefined && (
          <span className={styles.rating}>{rating}</span>
        )}
      </div>
      <ClockDisplay timeMs={timeMs} isActive={isActive} />
    </div>
  );
}
