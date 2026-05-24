import type { ProviderMode } from '@/types/provider';
import { PROVIDER_LABELS } from '@/types/provider';
import styles from './ProviderBadge.module.css';

interface ProviderBadgeProps {
  mode: ProviderMode;
  modelName?: string;
  available?: boolean;
}

const PROVIDER_ICONS: Record<ProviderMode, string> = {
  gemini_default: '✦',
  gemini_user_key: '🔑',
  offline: '⚙',
};

export function ProviderBadge({ mode, modelName, available = true }: ProviderBadgeProps) {
  return (
    <div className={[styles.badge, available ? styles.available : styles.unavailable].join(' ')}>
      <span className={styles.icon} aria-hidden="true">
        {PROVIDER_ICONS[mode]}
      </span>
      <div className={styles.info}>
        <span className={styles.label}>{PROVIDER_LABELS[mode]}</span>
        {modelName && <span className={styles.model}>{modelName}</span>}
        <span className={styles.status}>{available ? 'Ready' : 'Unavailable'}</span>
      </div>
      <span
        className={[styles.dot, available ? styles.dotGreen : styles.dotRed].join(' ')}
        aria-hidden="true"
      />
    </div>
  );
}
