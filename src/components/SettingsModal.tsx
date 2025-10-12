import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import settingsService, { AppSettings } from '../services/settingsService';
import { useLanguage } from '../context/LanguageContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { setLanguage: setAppLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentSettings = await settingsService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (language: AppSettings['language']) => {
    try {
      await setAppLanguage(language); // Update context (also saves to storage)
      setSettings((prev) => (prev ? { ...prev, language } : null));
      Alert.alert(
        t('language') + ' ' + t('save'),
        'Language updated successfully. The app will now use ' + settingsService.getLanguageName(language),
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update language');
    }
  };

  const handleToggleNotifications = async () => {
    if (!settings) return;
    try {
      await settingsService.toggleNotifications();
      setSettings({ ...settings, notifications: !settings.notifications });
    } catch (error) {
      Alert.alert('Error', 'Failed to update notifications setting');
    }
  };

  const handleToggleDarkMode = async () => {
    if (!settings) return;
    try {
      await settingsService.toggleDarkMode();
      setSettings({ ...settings, darkMode: !settings.darkMode });
      Alert.alert('Info', 'Dark mode will be available in a future update');
    } catch (error) {
      Alert.alert('Error', 'Failed to update dark mode setting');
    }
  };

  const handleDistanceUnitChange = async (unit: AppSettings['distanceUnit']) => {
    try {
      await settingsService.setDistanceUnit(unit);
      setSettings((prev) => (prev ? { ...prev, distanceUnit: unit } : null));
    } catch (error) {
      Alert.alert('Error', 'Failed to update distance unit');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await settingsService.resetSettings();
              await loadSettings();
              Alert.alert('Success', 'Settings reset to default');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings');
            }
          },
        },
      ]
    );
  };

  const languages: { code: AppSettings['language']; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  ];

  if (loading || !settings) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Language Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌐 {t('language')}</Text>
            <Text style={styles.sectionSubtitle}>{t('choosePreferredLanguage')}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  settings.language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                </View>
                {settings.language === lang.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 {t('notifications')}</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('pushNotifications')}</Text>
                <Text style={styles.settingDescription}>
                  {t('receiveUpdatesAboutReports')}
                </Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Display Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 {t('display')}</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('darkMode')}</Text>
                <Text style={styles.settingDescription}>{t('comingSoon')}</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="white"
                disabled={true}
              />
            </View>
          </View>

          {/* Distance Unit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📏 {t('distanceUnit')}</Text>
            <View style={styles.unitOptions}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  settings.distanceUnit === 'km' && styles.unitButtonActive,
                ]}
                onPress={() => handleDistanceUnitChange('km')}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.distanceUnit === 'km' && styles.unitTextActive,
                  ]}
                >
                  {t('kilometers')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  settings.distanceUnit === 'miles' && styles.unitButtonActive,
                ]}
                onPress={() => handleDistanceUnitChange('miles')}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.distanceUnit === 'miles' && styles.unitTextActive,
                  ]}
                >
                  {t('miles')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ {t('about')}</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>AquaConnect</Text>
              <Text style={styles.aboutVersion}>{t('version')} 1.0.0</Text>
              <Text style={styles.aboutDescription}>
                {t('appDescription')}
              </Text>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ {t('dangerZone')}</Text>
            <TouchableOpacity style={styles.dangerButton} onPress={handleResetSettings}>
              <Text style={styles.dangerButtonText}>{t('resetAllSettings')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: 50,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  saveButtonDisabled: {
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  changePhotoButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  changePhotoText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputDisabled: {
    backgroundColor: theme.colors.border + '30',
    color: theme.colors.textSecondary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  loadingOverlay: {
    padding: theme.spacing.xl,
  },
  section: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  languageName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  unitOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  unitButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  unitButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  unitText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  unitTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  aboutVersion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  aboutDescription: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  dangerButtonText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsModal;

