import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';
import reportService, { ReportData } from '../services/reportService';
import ReportCard from './ReportCard';

interface ReportsListProps {
  userId?: string; // If provided, shows reports for specific user, otherwise shows all
  status?: 'pending' | 'in_progress' | 'resolved' | 'rejected'; // Filter by status
  priority?: 'Low' | 'Medium' | 'High'; // Filter by priority
  limit?: number; // Limit number of reports
}

const ReportsList: React.FC<ReportsListProps> = ({ 
  userId, 
  status, 
  priority, 
  limit = 50 
}) => {
  const { state } = useAppContext();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let fetchedReports: ReportData[] = [];

      if (userId) {
        // Fetch reports for specific user
        fetchedReports = await reportService.getUserReports(userId, limit);
      } else if (status) {
        // Fetch reports by status
        fetchedReports = await reportService.getReportsByStatus(status, limit);
      } else if (priority) {
        // Fetch reports by priority
        fetchedReports = await reportService.getReportsByPriority(priority, limit);
      } else {
        // Fetch all reports
        fetchedReports = await reportService.getAllReports(limit);
      }

      setReports(fetchedReports);
      console.log(`📋 Loaded ${fetchedReports.length} reports with photos`);

      // Log photo statistics
      const reportsWithPhotos = fetchedReports.filter(report => report.photos && report.photos.length > 0);
      const totalPhotos = fetchedReports.reduce((sum, report) => sum + (report.photos?.length || 0), 0);
      console.log(`📷 ${reportsWithPhotos.length} reports have photos (${totalPhotos} total photos)`);

    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      Alert.alert(
        'Error Loading Reports',
        `Failed to load reports: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId, status, priority, limit]);

  const handleReportPress = (report: ReportData) => {
    // You can navigate to a detailed report view here
    Alert.alert(
      `Report: ${report.category.replace('_', ' ').toUpperCase()}`,
      `Status: ${report.status}\nPriority: ${report.priority}\nPhotos: ${report.photos?.length || 0}\nCreated: ${report.createdAt.toLocaleDateString()}`,
      [{ text: 'OK' }]
    );
  };

  const getListTitle = () => {
    if (userId === state.user?.uid) return 'My Reports';
    if (userId) return 'User Reports';
    if (status) return `${status.charAt(0).toUpperCase() + status.slice(1)} Reports`;
    if (priority) return `${priority} Priority Reports`;
    return 'All Reports';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getListTitle()}</Text>
        <Text style={styles.subtitle}>
          {reports.length} report{reports.length !== 1 ? 's' : ''} found
          {reports.some(r => r.photos && r.photos.length > 0) && 
            ` • ${reports.filter(r => r.photos && r.photos.length > 0).length} with photos`
          }
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchReports(true)}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptySubtitle}>
              {userId ? 'You haven\'t submitted any reports yet.' : 'No reports match the current filters.'}
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onPress={() => handleReportPress(report)}
            />
          ))
        )}
      </ScrollView>
    </View>
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
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ReportsList;
