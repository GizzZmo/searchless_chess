import type { ProviderConfig } from './provider';
import type { TimeControl } from './game';

export type BoardTheme = 'classic' | 'walnut' | 'tournament';
export type PieceStyle = 'staunton' | 'minimalist';

export interface AppearanceSettings {
  boardTheme: BoardTheme;
  pieceStyle: PieceStyle;
  showCoordinates: boolean;
  highlightMoves: boolean;
  soundEnabled: boolean;
}

export interface AppSettings {
  appearance: AppearanceSettings;
  defaultTimeControl: TimeControl;
  provider: ProviderConfig;
}

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    boardTheme: 'classic',
    pieceStyle: 'staunton',
    showCoordinates: true,
    highlightMoves: true,
    soundEnabled: false,
  },
  defaultTimeControl: {
    label: '10+0',
    minutes: 10,
    increment: 0,
  },
  provider: {
    mode: 'gemini_default',
  },
};
