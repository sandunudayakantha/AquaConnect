import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';

const HomeScreen: React.FC = () => {
  const { state } = useAppContext();

  const quickActions = [
    {
      id: 1,
      title: 'Report Issue',
      icon: '🚰',
      description: 'Report water quality issues',
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: 'View Map',
      icon: '🗺️',
      description: 'See reported issues nearby',
      color: theme.colors.secondary,
    },
    {
      id: 3,
      title: 'Water Tips',
      icon: '💡',
      description: 'Learn about water conservation',
      color: theme.colors.success,
    },
    {
      id: 4,
      title: 'Community',
      icon: '👥',
      description: 'Connect with others',
      color: theme.colors.warning,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'issue_reported',
      title: 'Water quality issue reported',
      location: 'Central Park Area',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'issue_resolved',
      title: 'Issue resolved successfully',
      location: 'Downtown District',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'tip_shared',
      title: 'New water conservation tip shared',
      location: 'Community Forum',
      time: '3 days ago',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{state.user?.name || 'User'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {state.user?.name?.charAt(0) || 'U'}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Issues Reported</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Issues Resolved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Tips Shared</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>
                {activity.type === 'issue_reported' ? '🚰' :
                 activity.type === 'issue_resolved' ? '✅' : '💡'}
              </Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityLocation}>{activity.location}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Water Quality Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Quality Status</Text>
        <View style={styles.qualityCard}>
          <View style={styles.qualityHeader}>
            <Text style={styles.qualityTitle}>Your Area</Text>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityBadgeText}>Good</Text>
            </View>
          </View>
          <Text style={styles.qualityDescription}>
            Water quality in your area is currently good. No issues reported recently.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  activityLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  qualityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  qualityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  qualityBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  qualityBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  qualityDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
