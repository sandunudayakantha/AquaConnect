import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  language: 'en' | 'es' | 'fr' | 'si' | 'ta'; // English, Spanish, French, Sinhala, Tamil
  notifications: boolean;
  darkMode: boolean;
  mapType: 'standard' | 'satellite' | 'hybrid';
  distanceUnit: 'km' | 'miles';
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  notifications: true,
  darkMode: false,
  mapType: 'standard',
  distanceUnit: 'km',
};

const SETTINGS_KEY = '@aquaconnect_settings';

class SettingsService {
  /**
   * Get current app settings
   */
  async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        return { ...DEFAULT_SETTINGS, ...settings };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      console.log('✅ Settings saved:', newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Update language
   */
  async setLanguage(language: AppSettings['language']): Promise<void> {
    await this.saveSettings({ language });
  }

  /**
   * Toggle notifications
   */
  async toggleNotifications(): Promise<void> {
    const settings = await this.getSettings();
    await this.saveSettings({ notifications: !settings.notifications });
  }

  /**
   * Toggle dark mode
   */
  async toggleDarkMode(): Promise<void> {
    const settings = await this.getSettings();
    await this.saveSettings({ darkMode: !settings.darkMode });
  }

  /**
   * Set map type
   */
  async setMapType(mapType: AppSettings['mapType']): Promise<void> {
    await this.saveSettings({ mapType });
  }

  /**
   * Set distance unit
   */
  async setDistanceUnit(distanceUnit: AppSettings['distanceUnit']): Promise<void> {
    await this.saveSettings({ distanceUnit });
  }

  /**
   * Reset to default settings
   */
  async resetSettings(): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    console.log('✅ Settings reset to default');
  }

  /**
   * Get language name
   */
  getLanguageName(code: AppSettings['language']): string {
    const languages = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      si: 'සිංහල',
      ta: 'தமிழ்',
    };
    return languages[code] || 'English';
  }
}

export const settingsService = new SettingsService();
export default settingsService;

