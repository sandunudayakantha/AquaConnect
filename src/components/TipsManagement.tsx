import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import tipsService, { TipData } from '../services/tipsService';
import { getCategoryTranslationKey } from '../utils/translationHelpers';

interface TipsManagementProps {
  visible: boolean;
  onClose: () => void;
}

const TipsManagement: React.FC<TipsManagementProps> = ({ visible, onClose }) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [tips, setTips] = useState<TipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTip, setEditingTip] = useState<TipData | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TipData['category']>('general');
  const [icon, setIcon] = useState('💡');
  const [isPublished, setIsPublished] = useState(true);

  const categories: { value: TipData['category']; label: string; icon: string }[] = [
    { value: 'conservation', label: t('conservation'), icon: '💧' },
    { value: 'quality', label: t('quality'), icon: '🚰' },
    { value: 'safety', label: t('safety'), icon: '⚠️' },
    { value: 'maintenance', label: t('maintenance'), icon: '🔧' },
    { value: 'general', label: t('general'), icon: '💡' },
  ];

  useEffect(() => {
    if (visible) {
      fetchTips();
    }
  }, [visible]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const allTips = await tipsService.getAllTips();
      setTips(allTips);
    } catch (error) {
      console.error('Error fetching tips:', error);
      Alert.alert('Error', 'Failed to load tips');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setCategory('general');
    setIcon('💡');
    setIsPublished(true);
    setEditingTip(null);
  };

  const handleEdit = (tip: TipData) => {
    setEditingTip(tip);
    setTitle(tip.title);
    setDescription(tip.description);
    setContent(tip.content);
    setCategory(tip.category);
    setIcon(tip.icon);
    setIsPublished(tip.isPublished);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!state.user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    try {
      if (editingTip) {
        // Update existing tip
        await tipsService.updateTip(editingTip.id!, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          icon,
          isPublished,
        });
        Alert.alert('Success', 'Tip updated successfully');
      } else {
        // Create new tip
        await tipsService.createTip({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          icon,
          isPublished,
          createdBy: state.user.uid,
          createdByName: state.user.name,
        });
        Alert.alert('Success', 'Tip created successfully');
      }

      resetForm();
      setShowForm(false);
      fetchTips();
    } catch (error) {
      console.error('Error saving tip:', error);
      Alert.alert('Error', 'Failed to save tip');
    }
  };

  const handleDelete = (tip: TipData) => {
    Alert.alert(
      'Delete Tip',
      `Are you sure you want to delete "${tip.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tipsService.deleteTip(tip.id!);
              Alert.alert('Success', 'Tip deleted successfully');
              fetchTips();
            } catch (error) {
              console.error('Error deleting tip:', error);
              Alert.alert('Error', 'Failed to delete tip');
            }
          },
        },
      ]
    );
  };

  const handleTogglePublished = async (tip: TipData) => {
    try {
      await tipsService.togglePublished(tip.id!);
      fetchTips();
    } catch (error) {
      console.error('Error toggling published:', error);
      Alert.alert('Error', 'Failed to update tip status');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('manageTips')}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {!showForm ? (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Text style={styles.addButtonText}>+ {t('addNewTip')}</Text>
            </TouchableOpacity>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              <ScrollView style={styles.tipsList}>
                {tips.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('noTipsYet')}</Text>
                    <Text style={styles.emptySubtext}>{t('createFirstTip')}</Text>
                  </View>
                ) : (
                  tips.map((tip) => (
                    <View key={tip.id} style={styles.tipCard}>
                      <View style={styles.tipHeader}>
                        <Text style={styles.tipIcon}>{tip.icon}</Text>
                        <View style={styles.tipHeaderInfo}>
                          <Text style={styles.tipTitle}>{tip.title}</Text>
                          <Text style={styles.tipCategory}>{t(getCategoryTranslationKey(tip.category))}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: tip.isPublished ? theme.colors.success : theme.colors.textSecondary }]}>
                          <Text style={styles.statusText}>{tip.isPublished ? t('published') : t('draft')}</Text>
                        </View>
                      </View>
                      <Text style={styles.tipDescription} numberOfLines={2}>{tip.description}</Text>
                      <View style={styles.tipActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleEdit(tip)}
                        >
                          <Text style={styles.actionButtonText}>{t('edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: tip.isPublished ? theme.colors.warning : theme.colors.success }]}
                          onPress={() => handleTogglePublished(tip)}
                        >
                          <Text style={styles.actionButtonText}>{tip.isPublished ? t('unpublish') : t('publish')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                          onPress={() => handleDelete(tip)}
                        >
                          <Text style={styles.actionButtonText}>{t('delete')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            )}
          </>
        ) : (
          <ScrollView style={styles.form}>
            <Text style={styles.formTitle}>{editingTip ? t('editTip') : t('createNewTip')}</Text>

            <Text style={styles.label}>{t('title')} *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('enterTipTitle')}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>{t('shortDescription')} *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('briefDescription')}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.label}>{t('category')} *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[styles.categoryButton, category === cat.value && styles.categoryButtonActive]}
                  onPress={() => {
                    setCategory(cat.value);
                    setIcon(cat.icon);
                  }}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryLabel, category === cat.value && styles.categoryLabelActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>{t('fullContent')} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('enterDetailedTipContent')}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.publishToggle}>
              <Text style={styles.label}>{t('publishImmediately')}</Text>
              <TouchableOpacity
                style={[styles.toggle, isPublished && styles.toggleActive]}
                onPress={() => setIsPublished(!isPublished)}
              >
                <View style={[styles.toggleThumb, isPublished && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, { backgroundColor: theme.colors.textSecondary }]}
                onPress={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                <Text style={styles.formButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSubmit}
              >
                <Text style={styles.formButtonText}>{editingTip ? t('update') : t('create')} {t('tip')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsList: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  tipHeaderInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tipCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tipDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  tipActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
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
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  categoryButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    minWidth: 100,
  },
  categoryButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  categoryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  categoryLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  publishToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  formActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  formButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TipsManagement;

