import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroIcon} aria-hidden="true">♟</span>
          <h1 className={styles.heroTitle}>Searchless Chess</h1>
          <p className={styles.heroSubtitle}>
            Grandmaster-level play without explicit search.
            <br />
            Powered by transformer models trained on 15 billion chess positions.
          </p>
          <div className={styles.heroCta}>
            <Link to="/play" className="btn btn-primary btn-lg">
              ▶ Play Rapid Chess
            </Link>
            <Link to="/settings" className="btn btn-secondary btn-lg">
              ⚙ Settings
            </Link>
          </div>
        </div>

        <div className={styles.heroBoard} aria-hidden="true">
          <div className={styles.miniBoard}>
            {Array.from({ length: 64 }, (_, i) => {
              const file = i % 8;
              const rank = Math.floor(i / 8);
              const isLight = (file + rank) % 2 === 0;
              const initPieces: Record<number, string> = {
                0: '♜', 1: '♞', 2: '♝', 3: '♛', 4: '♚', 5: '♝', 6: '♞', 7: '♜',
                8: '♟', 9: '♟', 10: '♟', 11: '♟', 12: '♟', 13: '♟', 14: '♟', 15: '♟',
                48: '♙', 49: '♙', 50: '♙', 51: '♙', 52: '♙', 53: '♙', 54: '♙', 55: '♙',
                56: '♖', 57: '♘', 58: '♗', 59: '♕', 60: '♔', 61: '♗', 62: '♘', 63: '♖',
              };
              return (
                <div
                  key={i}
                  className={[styles.miniSquare, isLight ? styles.miniLight : styles.miniDark].join(' ')}
                >
                  {initPieces[i] && (
                    <span className={styles.miniPiece}>{initPieces[i]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className={styles.features}>
        <div className={styles.featureGrid}>
          <div className="card">
            <div className={styles.featureIcon} aria-hidden="true">⏱</div>
            <h2 className={styles.featureTitle}>Rapid Chess First</h2>
            <p className={styles.featureDesc}>
              Jump into a 10-minute game immediately. Classic rapid time controls:
              10+0, 10+5, 15+10, and 25+10.
            </p>
            <Link to="/play" className={styles.featureLink}>
              Start a game →
            </Link>
          </div>

          <div className="card">
            <div className={styles.featureIcon} aria-hidden="true">✦</div>
            <h2 className={styles.featureTitle}>Gemini Default Provider</h2>
            <p className={styles.featureDesc}>
              Works out of the box using the default Gemini configuration.
              Bring your own API key or switch to the offline engine anytime.
            </p>
            <Link to="/settings" className={styles.featureLink}>
              Configure provider →
            </Link>
          </div>

          <div className="card">
            <div className={styles.featureIcon} aria-hidden="true">⚙</div>
            <h2 className={styles.featureTitle}>Offline AI</h2>
            <p className={styles.featureDesc}>
              Play without an internet connection using local transformer model
              checkpoints — the same research models that achieve 2895 Lichess Elo.
            </p>
            <Link to="/settings" className={styles.featureLink}>
              Set up offline mode →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className={styles.footer}>
        <p>
          Based on{' '}
          <a
            href="https://github.com/google-deepmind/searchless_chess"
            target="_blank"
            rel="noopener noreferrer"
          >
            google-deepmind/searchless_chess
          </a>{' '}
          — NeurIPS 2024.
        </p>
        <p className={styles.mockNote}>
          UI scaffold — mocked state, no live backend yet.
        </p>
      </footer>
    </div>
  );
}
