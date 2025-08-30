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

const ExploreScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      title: 'Water Quality',
      icon: '🚰',
      description: 'Check water quality in your area',
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: 'Conservation',
      icon: '💧',
      description: 'Learn water conservation tips',
      color: theme.colors.secondary,
    },
    {
      id: 3,
      title: 'Infrastructure',
      icon: '🏗️',
      description: 'Report infrastructure issues',
      color: theme.colors.warning,
    },
    {
      id: 4,
      title: 'Community',
      icon: '👥',
      description: 'Connect with local community',
      color: theme.colors.success,
    },
  ];

  const trendingTopics = [
    {
      id: 1,
      title: 'Water Conservation Week',
      description: 'Join the community challenge to save water',
      participants: 1.2,
      icon: '🌱',
    },
    {
      id: 2,
      title: 'Infrastructure Updates',
      description: 'Latest updates on water infrastructure projects',
      participants: 0.8,
      icon: '🔧',
    },
    {
      id: 3,
      title: 'Quality Monitoring',
      description: 'Real-time water quality monitoring in your area',
      participants: 2.1,
      icon: '📊',
    },
  ];

  const nearbyIssues = [
    {
      id: 1,
      title: 'Water Pressure Low',
      location: 'Central Park Area',
      distance: '0.5 km',
      status: 'In Progress',
      priority: 'Medium',
    },
    {
      id: 2,
      title: 'Water Quality Concern',
      location: 'Downtown District',
      distance: '1.2 km',
      status: 'Reported',
      priority: 'High',
    },
    {
      id: 3,
      title: 'Infrastructure Maintenance',
      location: 'Westside Community',
      distance: '2.1 km',
      status: 'Resolved',
      priority: 'Low',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.colors.error;
      case 'Medium':
        return theme.colors.warning;
      case 'Low':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return theme.colors.success;
      case 'In Progress':
        return theme.colors.warning;
      case 'Reported':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover water-related information</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for topics, issues, or locations..."
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
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trending Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        {trendingTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard}>
            <View style={styles.topicHeader}>
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </View>
            <View style={styles.topicFooter}>
              <Text style={styles.participantsText}>
                {topic.participants}k participants
              </Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nearby Issues */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Issues</Text>
        {nearbyIssues.map((issue) => (
          <TouchableOpacity key={issue.id} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <Text style={styles.issueTitle}>{issue.title}</Text>
              <View style={styles.issueBadges}>
                <View style={[styles.badge, { backgroundColor: getPriorityColor(issue.priority) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getPriorityColor(issue.priority) }]}>
                    {issue.priority}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getStatusColor(issue.status) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(issue.status) }]}>
                    {issue.status}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.issueDetails}>
              <Text style={styles.issueLocation}>📍 {issue.location}</Text>
              <Text style={styles.issueDistance}>📏 {issue.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>567</Text>
            <Text style={styles.statLabel}>Issues Reported</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Issues Resolved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Tips Shared</Text>
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
  categoryDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  topicCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  topicHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  topicIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  topicDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  topicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  issueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  issueBadges: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  issueDetails: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  issueLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  issueDistance: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default ExploreScreen;
