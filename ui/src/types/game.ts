export type Color = 'w' | 'b';

export type PieceSymbol = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export interface Piece {
  type: PieceSymbol;
  color: Color;
}

export interface BoardSquare {
  square: string;
  piece: Piece | null;
}

export interface Move {
  from: string;
  to: string;
  promotion?: PieceSymbol;
  san: string;
  color: Color;
}

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'checkmate'
  | 'stalemate'
  | 'draw'
  | 'resigned'
  | 'timeout';

export interface TimeControl {
  minutes: number;
  increment: number;
  label: string;
}

export interface GameState {
  fen: string;
  moves: Move[];
  status: GameStatus;
  turn: Color;
  inCheck: boolean;
  timeLeft: { w: number; b: number };
  winner: Color | null;
}
