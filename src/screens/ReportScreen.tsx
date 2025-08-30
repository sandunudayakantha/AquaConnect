import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';

const ReportScreen: React.FC = () => {
  const { state } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const categories = [
    {
      id: 'water_quality',
      title: 'Water Quality',
      icon: '🚰',
      description: 'Report water quality issues',
    },
    {
      id: 'pressure',
      title: 'Water Pressure',
      icon: '💧',
      description: 'Report pressure problems',
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      icon: '🏗️',
      description: 'Report infrastructure issues',
    },
    {
      id: 'leakage',
      title: 'Leakage',
      icon: '💦',
      description: 'Report water leaks',
    },
    {
      id: 'contamination',
      title: 'Contamination',
      icon: '⚠️',
      description: 'Report contamination concerns',
    },
    {
      id: 'other',
      title: 'Other',
      icon: '📝',
      description: 'Other water-related issues',
    },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low', color: theme.colors.success },
    { value: 'Medium', label: 'Medium', color: theme.colors.warning },
    { value: 'High', label: 'High', color: theme.colors.error },
  ];

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please provide a location');
      return;
    }

    // Here you would typically submit to your backend
    Alert.alert(
      'Report Submitted',
      'Your report has been submitted successfully. We will review it and take appropriate action.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedCategory('');
            setDescription('');
            setLocation('');
            setPriority('Medium');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Report Issue</Text>
        <Text style={styles.subtitle}>Help improve water quality in your community</Text>
      </View>

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryTitle,
                selectedCategory === category.id && styles.categoryTitleSelected,
              ]}>
                {category.title}
              </Text>
              <Text style={[
                styles.categoryDescription,
                selectedCategory === category.id && styles.categoryDescriptionSelected,
              ]}>
                {category.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Priority Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {priorityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.priorityButton,
                priority === option.value && styles.priorityButtonSelected,
                { borderColor: option.color },
              ]}
              onPress={() => setPriority(option.value as 'Low' | 'Medium' | 'High')}
            >
              <Text style={[
                styles.priorityText,
                priority === option.value && { color: option.color },
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the location or address"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      {/* Description Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue in detail..."
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Photo Upload (Placeholder) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
        <TouchableOpacity style={styles.photoUpload}>
          <Text style={styles.photoUploadIcon}>📷</Text>
          <Text style={styles.photoUploadText}>Tap to add photos</Text>
          <Text style={styles.photoUploadSubtext}>Help us understand the issue better</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Reports</Text>
          <Text style={styles.tipsText}>
            • Be specific about the location{'\n'}
            • Include relevant details{'\n'}
            • Add photos if possible{'\n'}
            • Report urgent issues immediately
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryTitleSelected: {
    color: theme.colors.primary,
  },
  categoryDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  categoryDescriptionSelected: {
    color: theme.colors.primary,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  priorityButtonSelected: {
    backgroundColor: theme.colors.surface,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  photoUpload: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  photoUploadIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  photoUploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  photoUploadSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default ReportScreen;
