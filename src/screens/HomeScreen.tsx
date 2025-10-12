import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import reportService, { ReportData } from '../services/reportService';
import tipsService, { TipData } from '../services/tipsService';
import { getCategoryTranslationKey } from '../utils/translationHelpers';

const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [userReports, setUserReports] = useState<ReportData[]>([]);
  const [tips, setTips] = useState<TipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyIssues, setNearbyIssues] = useState<ReportData[]>([]);

  useEffect(() => {
    fetchData();
  }, [state.user]);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch all data in parallel
      const [allReports, publishedTips, userLocation] = await Promise.all([
        reportService.getAllReports(100),
        tipsService.getPublishedTips(50),
        getUserLocation(),
      ]);

      setReports(allReports);
      setTips(publishedTips);

      // Get user's own reports if logged in
      if (state.user) {
        const myReports = await reportService.getUserReports(state.user.uid, 50);
        setUserReports(myReports);
      }

      // Calculate nearby issues
      if (userLocation) {
        const nearby = allReports
          .filter((r) => r.status !== 'resolved')
          .map((report) => ({
            ...report,
            distance: calculateDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              report.location.latitude,
              report.location.longitude
            ),
          }))
          .filter((r) => r.distance < 5) // Within 5km
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearbyIssues(nearby);
      }

      console.log(`🏠 Home loaded: ${allReports.length} reports, ${publishedTips.length} tips`);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('justNow');
    if (hours < 24) return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${t('ago')}`;
    if (days < 7) return `${days} ${days === 1 ? t('day') : t('days')} ${t('ago')}`;
    return date.toLocaleDateString();
  };

  // Get water quality status based on nearby issues
  const getWaterQualityStatus = () => {
    const highPriorityNearby = nearbyIssues.filter((r) => r.priority === 'High').length;
    const totalNearby = nearbyIssues.length;

    if (highPriorityNearby > 0) {
      return {
        status: 'Caution',
        color: theme.colors.error,
        message: `${highPriorityNearby} high priority issue${highPriorityNearby > 1 ? 's' : ''} reported nearby. Please be cautious.`,
      };
    } else if (totalNearby > 3) {
      return {
        status: 'Fair',
        color: theme.colors.warning,
        message: `${totalNearby} issues reported in your area. Water quality is fair.`,
      };
    } else if (totalNearby > 0) {
      return {
        status: 'Good',
        color: theme.colors.success,
        message: `${totalNearby} minor issue${totalNearby > 1 ? 's' : ''} in your area. Water quality is generally good.`,
      };
    }

    return {
      status: 'Excellent',
      color: theme.colors.success,
      message: 'No issues reported in your area. Water quality is excellent!',
    };
  };

  const waterQuality = getWaterQualityStatus();

  // Get recent activity from reports and tips
  const getRecentActivity = () => {
    const activities: any[] = [];

    // Add recent reports
    reports
      .slice(0, 5)
      .forEach((report) => {
        activities.push({
          id: `report-${report.id}`,
          type: report.status === 'resolved' ? 'issue_resolved' : 'issue_reported',
          title:
            report.status === 'resolved'
              ? `${t(getCategoryTranslationKey(report.category))} ${t('issueResolved')}`
              : `${t(getCategoryTranslationKey(report.category))} ${t('issueReported')}`,
          location: report.location.address,
          time: formatTimeAgo(report.createdAt),
          date: report.createdAt,
        });
      });

    // Add recent tips
    tips
      .slice(0, 3)
      .forEach((tip) => {
        activities.push({
          id: `tip-${tip.id}`,
          type: 'tip_shared',
          title: tip.title,
          location: `${t('by')} ${tip.createdByName}`,
          time: formatTimeAgo(tip.createdAt),
          date: tip.createdAt,
        });
      });

    // Sort by date and return top 5
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  const quickActions = [
    {
      id: 1,
      title: t('reportIssue'),
      icon: '🚰',
      description: t('reportWaterQualityIssues'),
      color: theme.colors.primary,
      screen: 'Report',
    },
    {
      id: 2,
      title: t('viewOnMap'),
      icon: '🗺️',
      description: t('seeReportedIssuesNearby'),
      color: theme.colors.secondary,
      screen: 'Explore',
    },
    {
      id: 3,
      title: t('waterTips'),
      icon: '💡',
      description: t('learnWaterConservation'),
      color: theme.colors.success,
      screen: 'Tips',
    },
    {
      id: 4,
      title: t('profile'),
      icon: '👤',
      description: t('viewYourDashboard'),
      color: theme.colors.warning,
      screen: 'Profile',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')}</Text>
          <Text style={styles.userName}>{state.user?.name || 'User'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{state.user?.name?.charAt(0) || 'U'}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userReports.length}</Text>
          <Text style={styles.statLabel}>{t('myReports')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.success }]}>
            {reports.filter((r) => r.status === 'resolved').length}
          </Text>
          <Text style={styles.statLabel}>{t('resolved')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {tips.length}
          </Text>
          <Text style={styles.statLabel}>{t('tipsAvailable')}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation?.navigate(action.screen)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
        {recentActivity.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('noRecentActivity')}</Text>
            <Text style={styles.emptySubtext}>{t('beFirstToReport')}</Text>
          </View>
        ) : (
          recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>
                  {activity.type === 'issue_reported'
                    ? '🚰'
                    : activity.type === 'issue_resolved'
                    ? '✅'
                    : '💡'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityLocation}>{activity.location}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Water Quality Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('waterQualityStatus')}</Text>
        <View style={[styles.qualityCard, { borderColor: waterQuality.color + '30' }]}>
          <View style={styles.qualityHeader}>
            <Text style={styles.qualityTitle}>{t('yourArea')} (5km)</Text>
            <View style={[styles.qualityBadge, { backgroundColor: waterQuality.color }]}>
              <Text style={styles.qualityBadgeText}>{waterQuality.status}</Text>
            </View>
          </View>
          <Text style={styles.qualityDescription}>{waterQuality.message}</Text>
          {nearbyIssues.length > 0 && (
            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={() => navigation?.navigate('Explore')}
            >
              <Text style={styles.viewMapButtonText}>{t('viewOnMap')} →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Nearby Issues Alert */}
      {nearbyIssues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⚠️ {t('nearbyIssues')} ({nearbyIssues.length})
          </Text>
          {nearbyIssues.slice(0, 3).map((issue) => (
            <View key={issue.id} style={styles.nearbyIssueCard}>
              <View style={styles.nearbyIssueHeader}>
                <Text style={styles.nearbyIssueTitle}>
                  {t(getCategoryTranslationKey(issue.category))}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(issue.priority) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: getPriorityColor(issue.priority) },
                    ]}
                  >
                    {issue.priority}
                  </Text>
                </View>
              </View>
              <Text style={styles.nearbyIssueDescription} numberOfLines={1}>
                {issue.description}
              </Text>
              <Text style={styles.nearbyIssueLocation}>
                📍 {issue.location.address} • 📏 {(issue as any).distance?.toFixed(1)} km
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
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
    borderWidth: 2,
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
    marginBottom: theme.spacing.md,
  },
  viewMapButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  viewMapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  nearbyIssueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nearbyIssueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  nearbyIssueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  nearbyIssueDescription: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  nearbyIssueLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen;
