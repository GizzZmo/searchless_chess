import { useState, useCallback } from 'react';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { PlayerCard } from '@/components/game/PlayerCard';
import { MoveList } from '@/components/game/MoveList';
import { GameControls } from '@/components/game/GameControls';
import { ProviderBadge } from '@/components/game/ProviderBadge';
import { RapidPresetPicker } from '@/components/setup/RapidPresetPicker';
import { useGameState } from '@/hooks/useGameState';
import { useClock } from '@/hooks/useClock';
import { useLocalSettings } from '@/hooks/useLocalSettings';
import type { Color } from '@/types/game';
import styles from './PlayPage.module.css';

export function PlayPage() {
  const { settings } = useLocalSettings();
  const [flipped, setFlipped] = useState(false);
  const [timeControl, setTimeControl] = useState(settings.defaultTimeControl);

  const {
    gameState,
    selectedSquare,
    legalTargets,
    lastMove,
    startGame,
    selectSquare,
    resign,
    updateClock,
  } = useGameState(timeControl);

  const handleTimeout = useCallback(
    (color: Color) => {
      updateClock(color, 0);
    },
    [updateClock]
  );

  useClock({
    active: gameState.status === 'playing',
    turn: gameState.turn,
    timeLeft: gameState.timeLeft,
    onTick: updateClock,
    onTimeout: handleTimeout,
  });

  const isPlaying = gameState.status === 'playing';
  const disabled =
    gameState.status !== 'playing' && gameState.status !== 'idle';

  return (
    <div className={styles.page}>
      {/* Left: board area */}
      <div className={styles.boardArea}>
        {/* Top player (opponent = black when not flipped) */}
        <PlayerCard
          name={flipped ? 'You' : 'AI Opponent'}
          color={flipped ? 'w' : 'b'}
          timeMs={gameState.timeLeft[flipped ? 'w' : 'b']}
          isActive={isPlaying && gameState.turn === (flipped ? 'w' : 'b')}
          rating={flipped ? undefined : 2895}
        />

        <ChessBoard
          fen={gameState.fen}
          selectedSquare={selectedSquare}
          legalTargets={legalTargets}
          lastMove={lastMove}
          flipped={flipped}
          inCheck={gameState.inCheck}
          onSquareClick={selectSquare}
          showCoordinates={settings.appearance.showCoordinates}
          disabled={disabled}
        />

        {/* Bottom player (you = white when not flipped) */}
        <PlayerCard
          name={flipped ? 'AI Opponent' : 'You'}
          color={flipped ? 'b' : 'w'}
          timeMs={gameState.timeLeft[flipped ? 'b' : 'w']}
          isActive={isPlaying && gameState.turn === (flipped ? 'b' : 'w')}
          rating={flipped ? 2895 : undefined}
        />
      </div>

      {/* Right: side panel */}
      <aside className={styles.sidePanel}>
        {/* Time control */}
        {gameState.status === 'idle' && (
          <section className={styles.section}>
            <RapidPresetPicker
              selected={timeControl}
              onChange={(tc) => {
                setTimeControl(tc);
              }}
            />
          </section>
        )}

        {/* Start / game controls */}
        <section className={styles.section}>
          <GameControls
            status={gameState.status}
            winner={gameState.winner}
            onNewGame={() => startGame(timeControl)}
            onFlipBoard={() => setFlipped((f) => !f)}
            onResign={resign}
          />
        </section>

        {/* Move list */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Moves</h2>
          <MoveList moves={gameState.moves} />
        </section>

        {/* Provider */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Provider</h2>
          <ProviderBadge
            mode={settings.provider.mode}
            modelName={
              settings.provider.mode === 'offline'
                ? 'searchless-270M (mock)'
                : 'gemini-2.0-flash (mock)'
            }
            available={false}
          />
          <p className={styles.mockNote}>
            AI moves are mocked — real provider integration is coming in a future update.
          </p>
        </section>
      </aside>
    </div>
  );
}
