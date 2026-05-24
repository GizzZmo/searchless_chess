import { useCallback } from 'react';
import { Chess } from 'chess.js';
import styles from './ChessBoard.module.css';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const PIECE_UNICODE: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

interface ChessBoardProps {
  fen: string;
  selectedSquare: string | null;
  legalTargets: string[];
  lastMove: { from: string; to: string } | null;
  flipped?: boolean;
  inCheck?: boolean;
  onSquareClick: (square: string) => void;
  showCoordinates?: boolean;
  disabled?: boolean;
}

export function ChessBoard({
  fen,
  selectedSquare,
  legalTargets,
  lastMove,
  flipped = false,
  inCheck = false,
  onSquareClick,
  showCoordinates = true,
  disabled = false,
}: ChessBoardProps) {
  const chess = new Chess(fen);
  const board = chess.board();
  const turn = chess.turn();

  const getSquareId = useCallback(
    (fileIdx: number, rankIdx: number): string => {
      const f = flipped ? FILES[7 - fileIdx] : FILES[fileIdx];
      const r = flipped ? RANKS[7 - rankIdx] : RANKS[rankIdx];
      return `${f}${r}`;
    },
    [flipped]
  );

  const isLightSquare = (fileIdx: number, rankIdx: number): boolean => {
    return (fileIdx + rankIdx) % 2 === 0;
  };

  // Find king square in check
  let checkSquare: string | null = null;
  if (inCheck) {
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === turn) {
          checkSquare = `${FILES[f]}${RANKS[r]}`;
        }
      }
    }
  }

  const ranks = flipped ? [...RANKS].reverse() : RANKS;
  const files = flipped ? [...FILES].reverse() : FILES;

  return (
    <div className={styles.boardWrapper}>
      {showCoordinates && (
        <div className={styles.rankLabels}>
          {ranks.map((r) => (
            <span key={r} className={styles.rankLabel}>
              {r}
            </span>
          ))}
        </div>
      )}
      <div className={styles.boardContainer}>
        <div className={styles.board} role="grid" aria-label="Chess board">
          {RANKS.map((_, rankIdx) =>
            FILES.map((_, fileIdx) => {
              const square = getSquareId(fileIdx, rankIdx);
              const actualRankIdx = flipped ? 7 - rankIdx : rankIdx;
              const actualFileIdx = flipped ? 7 - fileIdx : fileIdx;
              const piece = board[actualRankIdx][actualFileIdx];
              const isLight = isLightSquare(actualFileIdx, actualRankIdx);

              const isSelected = square === selectedSquare;
              const isTarget = legalTargets.includes(square);
              const isLastFrom = lastMove?.from === square;
              const isLastTo = lastMove?.to === square;
              const isInCheck = square === checkSquare;
              const hasPiece = piece !== null;

              const squareClasses = [
                styles.square,
                isLight ? styles.light : styles.dark,
                isSelected ? styles.selected : '',
                (isLastFrom || isLastTo) ? styles.lastMove : '',
                isInCheck ? styles.check : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={square}
                  className={squareClasses}
                  role="gridcell"
                  aria-label={`${square}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
                  onClick={() => !disabled && onSquareClick(square)}
                >
                  {isTarget && (
                    <div
                      className={hasPiece ? styles.captureTarget : styles.moveTarget}
                      aria-hidden="true"
                    />
                  )}
                  {piece && (
                    <span
                      className={[
                        styles.piece,
                        piece.color === 'w' ? styles.whitePiece : styles.blackPiece,
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {PIECE_UNICODE[`${piece.color}${piece.type}`]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
        {showCoordinates && (
          <div className={styles.fileLabels}>
            {files.map((f) => (
              <span key={f} className={styles.fileLabel}>
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
