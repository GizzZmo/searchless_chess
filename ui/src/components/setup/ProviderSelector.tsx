import type { ProviderMode } from '@/types/provider';
import { PROVIDER_LABELS, PROVIDER_DESCRIPTIONS } from '@/types/provider';
import { PROVIDER_OPTIONS } from '@/lib/constants/providers';
import styles from './ProviderSelector.module.css';

interface ProviderSelectorProps {
  selected: ProviderMode;
  onChange: (mode: ProviderMode) => void;
}

export function ProviderSelector({ selected, onChange }: ProviderSelectorProps) {
  return (
    <div className={styles.container}>
      <p className={styles.heading}>AI Provider</p>
      <div className={styles.options} role="radiogroup" aria-label="AI provider selection">
        {PROVIDER_OPTIONS.map(({ mode, icon }) => (
          <label
            key={mode}
            className={[styles.option, selected === mode ? styles.selected : ''].join(' ')}
          >
            <input
              type="radio"
              name="provider"
              value={mode}
              checked={selected === mode}
              onChange={() => onChange(mode)}
              className={styles.radio}
            />
            <span className={styles.icon} aria-hidden="true">{icon}</span>
            <div className={styles.text}>
              <span className={styles.label}>{PROVIDER_LABELS[mode]}</span>
              <span className={styles.desc}>{PROVIDER_DESCRIPTIONS[mode]}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
