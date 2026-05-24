import { useEffect, useRef } from 'react';
import type { Move } from '@/types/game';
import styles from './MoveList.module.css';

interface MoveListProps {
  moves: Move[];
  currentMoveIndex?: number;
}

export function MoveList({ moves, currentMoveIndex }: MoveListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves.length]);

  if (moves.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No moves yet</div>
      </div>
    );
  }

  const pairs: Array<{ moveNum: number; white: Move; black?: Move }> = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      moveNum: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className={styles.container} role="list" aria-label="Move list">
      <table className={styles.table}>
        <tbody>
          {pairs.map(({ moveNum, white, black }) => {
            const whiteIdx = (moveNum - 1) * 2;
            const blackIdx = whiteIdx + 1;
            return (
              <tr key={moveNum} className={styles.row} role="listitem">
                <td className={styles.moveNum}>{moveNum}.</td>
                <td
                  className={[
                    styles.move,
                    currentMoveIndex === whiteIdx ? styles.current : '',
                  ].join(' ')}
                >
                  {white.san}
                </td>
                <td
                  className={[
                    styles.move,
                    black && currentMoveIndex === blackIdx ? styles.current : '',
                  ].join(' ')}
                >
                  {black?.san ?? ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div ref={bottomRef} />
    </div>
  );
}
