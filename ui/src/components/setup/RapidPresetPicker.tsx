import type { TimeControl } from '@/types/game';
import { RAPID_PRESETS } from '@/lib/constants/timeControls';
import styles from './RapidPresetPicker.module.css';

interface RapidPresetPickerProps {
  selected: TimeControl;
  onChange: (tc: TimeControl) => void;
}

export function RapidPresetPicker({ selected, onChange }: RapidPresetPickerProps) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>Rapid presets</p>
      <div className={styles.presets} role="group" aria-label="Time control presets">
        {RAPID_PRESETS.map((tc) => (
          <button
            key={tc.label}
            className={[
              styles.preset,
              selected.label === tc.label ? styles.selected : '',
            ].join(' ')}
            onClick={() => onChange(tc)}
            aria-pressed={selected.label === tc.label}
            title={`${tc.minutes} minutes + ${tc.increment} second increment`}
          >
            <span className={styles.presetLabel}>{tc.label}</span>
            <span className={styles.presetDesc}>
              {tc.minutes}′{tc.increment > 0 ? ` +${tc.increment}″` : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
