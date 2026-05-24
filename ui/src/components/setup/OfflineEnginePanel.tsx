import styles from './OfflineEnginePanel.module.css';

type EngineStatus = 'not_installed' | 'ready' | 'downloading';

interface OfflineEnginePanelProps {
  status?: EngineStatus;
}

export function OfflineEnginePanel({ status = 'not_installed' }: OfflineEnginePanelProps) {
  const statusInfo = {
    not_installed: {
      icon: '⚙',
      title: 'Offline engine not installed',
      description:
        'Download the searchless transformer model checkpoints to play without an internet connection.',
      badge: { text: 'Not installed', cls: 'badge badge-muted' },
    },
    ready: {
      icon: '✓',
      title: 'Offline engine ready',
      description:
        'The local model is loaded and ready. You can play without an internet connection.',
      badge: { text: 'Ready', cls: 'badge badge-success' },
    },
    downloading: {
      icon: '⬇',
      title: 'Downloading model…',
      description: 'Please wait while the model checkpoints are being downloaded.',
      badge: { text: 'Downloading…', cls: 'badge badge-warning' },
    },
  }[status];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">{statusInfo.icon}</span>
        <div className={styles.titleRow}>
          <span className={styles.title}>{statusInfo.title}</span>
          <span className={statusInfo.badge.cls}>{statusInfo.badge.text}</span>
        </div>
      </div>

      <p className={styles.description}>{statusInfo.description}</p>

      {status === 'not_installed' && (
        <div className={styles.instructions}>
          <p className={styles.instructionsTitle}>To install the offline engine:</p>
          <ol className={styles.steps}>
            <li>
              Follow the{' '}
              <a
                href="https://github.com/google-deepmind/searchless_chess#installation"
                target="_blank"
                rel="noopener noreferrer"
              >
                installation instructions
              </a>{' '}
              in the repository README.
            </li>
            <li>
              Download model checkpoints (9M, 136M, or 270M parameters) as described
              in the README.
            </li>
            <li>Start the local engine server and select "Offline AI" as your provider.</li>
          </ol>
        </div>
      )}

      <div className={styles.note}>
        <span aria-hidden="true">ℹ</span>
        Real offline engine integration is coming in a future update. This panel is a placeholder
        for the offline AI mode.
      </div>
    </div>
  );
}
