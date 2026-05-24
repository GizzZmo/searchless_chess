export type ProviderMode = 'gemini_default' | 'gemini_user_key' | 'offline';

export interface ProviderStatus {
  mode: ProviderMode;
  available: boolean;
  modelName?: string;
  latencyMs?: number;
  error?: string;
}

export interface ProviderConfig {
  mode: ProviderMode;
  apiKey?: string;
}

export const PROVIDER_LABELS: Record<ProviderMode, string> = {
  gemini_default: 'Gemini (Default)',
  gemini_user_key: 'Gemini (My API Key)',
  offline: 'Offline AI',
};

export const PROVIDER_DESCRIPTIONS: Record<ProviderMode, string> = {
  gemini_default:
    'Uses the default Gemini configuration. Works out of the box when the service is available.',
  gemini_user_key:
    'Use your own Gemini API key. The key is stored locally on your device.',
  offline:
    'Use the local searchless transformer model. Requires model checkpoints to be downloaded.',
};
