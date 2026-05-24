import { useState } from 'react';
import { ProviderSelector } from '@/components/setup/ProviderSelector';
import { ApiKeyForm } from '@/components/setup/ApiKeyForm';
import { OfflineEnginePanel } from '@/components/setup/OfflineEnginePanel';
import { RapidPresetPicker } from '@/components/setup/RapidPresetPicker';
import { useLocalSettings } from '@/hooks/useLocalSettings';
import type { ProviderMode } from '@/types/provider';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { settings, updateSettings } = useLocalSettings();
  const [saved, setSaved] = useState(false);

  const notify = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProviderChange = (mode: ProviderMode) => {
    updateSettings({ provider: { ...settings.provider, mode } });
    notify();
  };

  const handleApiKeySave = (apiKey: string) => {
    updateSettings({ provider: { ...settings.provider, apiKey } });
    notify();
  };

  const handleApiKeyClear = () => {
    const { apiKey: _removed, ...rest } = settings.provider;
    void _removed;
    updateSettings({ provider: rest });
    notify();
  };

  const handleTimeControlChange = (tc: typeof settings.defaultTimeControl) => {
    updateSettings({ defaultTimeControl: tc });
    notify();
  };

  const toggleCoordinates = () => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        showCoordinates: !settings.appearance.showCoordinates,
      },
    });
    notify();
  };

  const toggleHighlights = () => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        highlightMoves: !settings.appearance.highlightMoves,
      },
    });
    notify();
  };

  const toggleSound = () => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        soundEnabled: !settings.appearance.soundEnabled,
      },
    });
    notify();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        {saved && (
          <span className="badge badge-success" role="status">
            ✓ Saved
          </span>
        )}
      </div>

      <div className={styles.sections}>
        {/* Appearance */}
        <section className="card">
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <div className={styles.toggleList}>
            <label className={styles.toggle}>
              <span className={styles.toggleLabel}>
                <span>Show board coordinates</span>
                <span className={styles.toggleDesc}>Display file and rank labels on the board</span>
              </span>
              <input
                type="checkbox"
                checked={settings.appearance.showCoordinates}
                onChange={toggleCoordinates}
                className={styles.checkbox}
              />
            </label>

            <label className={styles.toggle}>
              <span className={styles.toggleLabel}>
                <span>Highlight legal moves</span>
                <span className={styles.toggleDesc}>Show dots on squares where a selected piece can move</span>
              </span>
              <input
                type="checkbox"
                checked={settings.appearance.highlightMoves}
                onChange={toggleHighlights}
                className={styles.checkbox}
              />
            </label>

            <label className={styles.toggle}>
              <span className={styles.toggleLabel}>
                <span>Sound effects</span>
                <span className={styles.toggleDesc}>Play sounds for moves and captures</span>
              </span>
              <input
                type="checkbox"
                checked={settings.appearance.soundEnabled}
                onChange={toggleSound}
                className={styles.checkbox}
              />
            </label>
          </div>
        </section>

        {/* Default time control */}
        <section className="card">
          <h2 className={styles.sectionTitle}>Default Time Control</h2>
          <p className={styles.sectionDesc}>
            This preset will be pre-selected when you start a new game.
          </p>
          <RapidPresetPicker
            selected={settings.defaultTimeControl}
            onChange={handleTimeControlChange}
          />
        </section>

        {/* Provider selection */}
        <section className="card">
          <h2 className={styles.sectionTitle}>AI Provider</h2>
          <p className={styles.sectionDesc}>
            Choose how the AI opponent generates moves.
          </p>
          <ProviderSelector
            selected={settings.provider.mode}
            onChange={handleProviderChange}
          />
        </section>

        {/* API key (only when relevant) */}
        {(settings.provider.mode === 'gemini_default' ||
          settings.provider.mode === 'gemini_user_key') && (
          <section className="card">
            <h2 className={styles.sectionTitle}>API Key</h2>
            <p className={styles.sectionDesc}>
              {settings.provider.mode === 'gemini_default'
                ? 'Optionally override the default provider with your own API key.'
                : 'Required for the "Gemini (My API Key)" provider mode.'}
            </p>
            <ApiKeyForm
              currentKey={settings.provider.apiKey}
              onSave={handleApiKeySave}
              onClear={handleApiKeyClear}
            />
          </section>
        )}

        {/* Offline engine */}
        <section className="card">
          <h2 className={styles.sectionTitle}>Offline Engine</h2>
          <p className={styles.sectionDesc}>
            Run AI locally using the searchless transformer model checkpoints.
          </p>
          <OfflineEnginePanel status="not_installed" />
        </section>
      </div>
    </div>
  );
}
