import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { theme } from '../styles/theme';

const TipsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', title: 'All Tips', icon: '📚' },
    { id: 'conservation', title: 'Conservation', icon: '💧' },
    { id: 'quality', title: 'Quality', icon: '🚰' },
    { id: 'safety', title: 'Safety', icon: '🛡️' },
    { id: 'maintenance', title: 'Maintenance', icon: '🔧' },
  ];

  const tips = [
    {
      id: 1,
      title: 'Fix Leaky Faucets',
      category: 'conservation',
      description: 'A dripping faucet can waste up to 20 gallons of water per day. Fix leaks promptly to save water and money.',
      icon: '💧',
      difficulty: 'Easy',
      timeRequired: '15 minutes',
      savings: 'Up to 20 gallons/day',
    },
    {
      id: 2,
      title: 'Install Low-Flow Showerheads',
      category: 'conservation',
      description: 'Replace your showerhead with a low-flow model to reduce water usage by up to 50%.',
      icon: '🚿',
      difficulty: 'Medium',
      timeRequired: '30 minutes',
      savings: 'Up to 50% water',
    },
    {
      id: 3,
      title: 'Test Water Quality',
      category: 'quality',
      description: 'Regularly test your water for contaminants. Use home testing kits or contact your local water authority.',
      icon: '🧪',
      difficulty: 'Easy',
      timeRequired: '10 minutes',
      savings: 'Health benefits',
    },
    {
      id: 4,
      title: 'Clean Water Filters',
      category: 'maintenance',
      description: 'Clean or replace water filters every 3-6 months to ensure clean, safe drinking water.',
      icon: '🔍',
      difficulty: 'Easy',
      timeRequired: '5 minutes',
      savings: 'Better water quality',
    },
    {
      id: 5,
      title: 'Use Rain Barrels',
      category: 'conservation',
      description: 'Collect rainwater in barrels to water your garden and reduce municipal water usage.',
      icon: '🌧️',
      difficulty: 'Medium',
      timeRequired: '2 hours',
      savings: 'Up to 1,300 gallons/year',
    },
    {
      id: 6,
      title: 'Check for Lead Pipes',
      category: 'safety',
      description: 'If your home was built before 1986, check for lead pipes and consider replacement.',
      icon: '⚠️',
      difficulty: 'Hard',
      timeRequired: 'Professional',
      savings: 'Health safety',
    },
    {
      id: 7,
      title: 'Water Plants Efficiently',
      category: 'conservation',
      description: 'Water plants early morning or evening to reduce evaporation. Use drip irrigation for gardens.',
      icon: '🌱',
      difficulty: 'Easy',
      timeRequired: 'Varies',
      savings: 'Up to 30% water',
    },
    {
      id: 8,
      title: 'Insulate Water Pipes',
      category: 'maintenance',
      description: 'Insulate hot water pipes to reduce heat loss and save energy.',
      icon: '🧱',
      difficulty: 'Medium',
      timeRequired: '1 hour',
      savings: 'Energy savings',
    },
  ];

  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return theme.colors.success;
      case 'Medium':
        return theme.colors.warning;
      case 'Hard':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Water Tips</Text>
        <Text style={styles.subtitle}>Learn how to conserve and improve water quality</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tips..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextSelected,
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tips List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filteredTips.length} Tip{filteredTips.length !== 1 ? 's' : ''} Found
        </Text>
        {filteredTips.map((tip) => (
          <TouchableOpacity key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <View style={styles.tipMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(tip.difficulty) }]}>
                      {tip.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>⏱️ {tip.timeRequired}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.tipDescription}>{tip.description}</Text>
            <View style={styles.tipFooter}>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>💾 {tip.savings}</Text>
              </View>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>💡 Did You Know?</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.5</Text>
              <Text style={styles.statLabel}>Gallons saved per minute with low-flow showerhead</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>20</Text>
              <Text style={styles.statLabel}>Gallons wasted daily by a dripping faucet</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30%</Text>
              <Text style={styles.statLabel}>Water saved by fixing household leaks</Text>
            </View>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  searchButtonText: {
    fontSize: 18,
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
  categoriesScroll: {
    marginBottom: theme.spacing.md,
  },
  categoryButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  categoryButtonTextSelected: {
    color: theme.colors.primary,
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  tipDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsBadge: {
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  savingsText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600',
  },
  learnMoreButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  learnMoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
    minWidth: 50,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});

export default TipsScreen;
