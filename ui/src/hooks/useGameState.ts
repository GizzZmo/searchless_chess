import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import type { GameState, Move, TimeControl, Color } from '@/types/game';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function buildInitialState(tc: TimeControl): GameState {
  const ms = tc.minutes * 60 * 1000;
  return {
    fen: INITIAL_FEN,
    moves: [],
    status: 'idle',
    turn: 'w',
    inCheck: false,
    timeLeft: { w: ms, b: ms },
    winner: null,
  };
}

export function useGameState(defaultTimeControl: TimeControl) {
  const chessRef = useRef(new Chess());
  const [gameState, setGameState] = useState<GameState>(() =>
    buildInitialState(defaultTimeControl)
  );
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const syncState = useCallback((chess: Chess, prev: GameState, tc: TimeControl) => {
    const history = chess.history({ verbose: true }) as Move[];
    let status: GameState['status'] = 'playing';
    let winner: Color | null = null;

    if (chess.isCheckmate()) {
      status = 'checkmate';
      winner = chess.turn() === 'w' ? 'b' : 'w';
    } else if (chess.isStalemate() || chess.isDraw()) {
      status = 'draw';
    }

    setGameState({
      fen: chess.fen(),
      moves: history,
      status,
      turn: chess.turn() as Color,
      inCheck: chess.inCheck(),
      timeLeft: prev.timeLeft,
      winner,
    });
    void tc; // tc used for future increment logic
  }, []);

  const startGame = useCallback(
    (tc: TimeControl) => {
      const chess = new Chess();
      chessRef.current = chess;
      setSelectedSquare(null);
      setLegalTargets([]);
      setLastMove(null);
      setGameState({ ...buildInitialState(tc), status: 'playing' });
    },
    []
  );

  const selectSquare = useCallback(
    (square: string) => {
      const chess = chessRef.current;
      if (gameState.status !== 'playing') return;

      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalTargets([]);
        return;
      }

      // If a square is already selected, try to make a move
      if (selectedSquare) {
        const moveResult = chess.move({ from: selectedSquare, to: square });
        if (moveResult) {
          setSelectedSquare(null);
          setLegalTargets([]);
          setLastMove({ from: selectedSquare, to: square });
          syncState(chess, gameState, defaultTimeControl);
          return;
        }
      }

      // Select new square if it has a piece of the right color
      const piece = chess.get(square as Parameters<typeof chess.get>[0]);
      if (piece && piece.color === chess.turn()) {
        const moves = chess.moves({ square: square as Parameters<typeof chess.moves>[0]['square'], verbose: true }) as Move[];
        setSelectedSquare(square);
        setLegalTargets(moves.map((m) => m.to));
      } else {
        setSelectedSquare(null);
        setLegalTargets([]);
      }
    },
    [selectedSquare, gameState, defaultTimeControl, syncState]
  );

  const resign = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: 'resigned',
      winner: prev.turn === 'w' ? 'b' : 'w',
    }));
  }, []);

  const updateClock = useCallback((color: Color, ms: number) => {
    setGameState((prev) => ({
      ...prev,
      timeLeft: { ...prev.timeLeft, [color]: ms },
    }));
  }, []);

  return {
    gameState,
    selectedSquare,
    legalTargets,
    lastMove,
    startGame,
    selectSquare,
    resign,
    updateClock,
  };
}
