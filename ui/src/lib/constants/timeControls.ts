import type { TimeControl } from '@/types/game';

export const RAPID_PRESETS: TimeControl[] = [
  { label: '10+0', minutes: 10, increment: 0 },
  { label: '10+5', minutes: 10, increment: 5 },
  { label: '15+10', minutes: 15, increment: 10 },
  { label: '25+10', minutes: 25, increment: 10 },
];

export const DEFAULT_TIME_CONTROL = RAPID_PRESETS[0];
