import type { GameStatus, Color } from '@/types/game';
import styles from './GameControls.module.css';

interface GameControlsProps {
  status: GameStatus;
  onNewGame: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  winner?: Color | null;
}

export function GameControls({
  status,
  onNewGame,
  onFlipBoard,
  onResign,
  winner,
}: GameControlsProps) {
  const isOver = ['checkmate', 'stalemate', 'draw', 'resigned', 'timeout'].includes(status);

  const resultText = () => {
    if (status === 'checkmate') return winner === 'w' ? 'White wins by checkmate' : 'Black wins by checkmate';
    if (status === 'stalemate') return 'Draw by stalemate';
    if (status === 'draw') return 'Draw';
    if (status === 'resigned') return winner === 'w' ? 'White wins — Black resigned' : 'Black wins — White resigned';
    if (status === 'timeout') return winner === 'w' ? 'White wins on time' : 'Black wins on time';
    return null;
  };

  return (
    <div className={styles.container}>
      {isOver && (
        <div className={styles.result} role="alert">
          {resultText()}
        </div>
      )}
      <div className={styles.buttons}>
        <button className="btn btn-primary" onClick={onNewGame} title="Start a new game (N)">
          ↺ New Game
        </button>
        <button className="btn btn-secondary" onClick={onFlipBoard} title="Flip board (F)">
          ⇅ Flip
        </button>
        {status === 'playing' && (
          <button className="btn btn-danger" onClick={onResign} title="Resign">
            ✕ Resign
          </button>
        )}
      </div>
    </div>
  );
}
