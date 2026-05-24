import type { ProviderMode } from '@/types/provider';

export const DEFAULT_PROVIDER: ProviderMode = 'gemini_default';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

export const PROVIDER_OPTIONS: Array<{
  mode: ProviderMode;
  label: string;
  icon: string;
}> = [
  { mode: 'gemini_default', label: 'Gemini (Default)', icon: '✦' },
  { mode: 'gemini_user_key', label: 'Gemini (My API Key)', icon: '🔑' },
  { mode: 'offline', label: 'Offline AI', icon: '⚙' },
];
