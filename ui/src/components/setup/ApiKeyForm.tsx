import { useState } from 'react';
import styles from './ApiKeyForm.module.css';

interface ApiKeyFormProps {
  currentKey?: string;
  onSave: (key: string) => void;
  onClear: () => void;
}

type KeyStatus = 'idle' | 'saved' | 'cleared';

export function ApiKeyForm({ currentKey, onSave, onClear }: ApiKeyFormProps) {
  const [value, setValue] = useState(currentKey ?? '');
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<KeyStatus>('idle');

  const handleSave = () => {
    if (!value.trim()) return;
    onSave(value.trim());
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleClear = () => {
    setValue('');
    onClear();
    setStatus('cleared');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const masked = value ? value.slice(0, 4) + '•'.repeat(Math.min(value.length - 4, 24)) : '';

  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        <span className={styles.noticeIcon} aria-hidden="true">🔒</span>
        <p className={styles.noticeText}>
          Your API key is stored locally in your browser and is never transmitted to our servers.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="api-key-input" className="form-label">
          Gemini API key
        </label>
        <div className={styles.inputRow}>
          <input
            id="api-key-input"
            type={visible ? 'text' : 'password'}
            className={['form-input', styles.keyInput].join(' ')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste your API key here"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="api-key-hint"
          />
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide API key' : 'Show API key'}
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? '🙈' : '👁'}
          </button>
        </div>
        {currentKey && !value && (
          <p className={styles.currentKey}>Current key: {masked}</p>
        )}
        <p id="api-key-hint" className={styles.hint}>
          Get a free API key at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      {status === 'saved' && (
        <p className={styles.feedback} role="status">✓ API key saved</p>
      )}
      {status === 'cleared' && (
        <p className={styles.feedbackMuted} role="status">API key cleared</p>
      )}

      <div className={styles.actions}>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSave}
          disabled={!value.trim()}
        >
          Save key
        </button>
        {currentKey && (
          <button className="btn btn-ghost btn-sm" onClick={handleClear}>
            Clear key
          </button>
        )}
      </div>
    </div>
  );
}
