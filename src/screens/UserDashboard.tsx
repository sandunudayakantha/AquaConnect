import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import reportService, { ReportData } from '../services/reportService';
import ProfileEditModal from '../components/ProfileEditModal';
import SettingsModal from '../components/SettingsModal';
import { getStatusTranslationKey, getCategoryTranslationKey, getPriorityTranslationKey } from '../utils/translationHelpers';

interface UserDashboardProps {
  navigation: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ navigation }) => {
  const { state, logout } = useAppContext();
  const { t } = useLanguage();
  const { user } = state;
  const [userReports, setUserReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportDetailVisible, setReportDetailVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async (isRefresh = false) => {
    if (!user) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const reports = await reportService.getUserReports(user.uid);
      setUserReports(reports);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const menuItems = [
    {
      id: 'report',
      title: t('reportIssue'),
      subtitle: t('reportWaterQualityProblems'),
      icon: '🚰',
      color: theme.colors.primary,
    },
    {
      id: 'map',
      title: t('waterMap'),
      subtitle: t('viewWaterSourcesAndReports'),
      icon: '🗺️',
      color: theme.colors.secondary,
    },
    {
      id: 'education',
      title: t('education'),
      subtitle: t('learnAboutWaterQuality'),
      icon: '📚',
      color: theme.colors.success,
    },
    {
      id: 'tracking',
      title: t('trackProgress'),
      subtitle: t('monitorReportedIssues'),
      icon: '📊',
      color: theme.colors.warning,
    },
  ];

  const handleMenuPress = (itemId: string) => {
    // Navigate to different screens based on menu item
    switch (itemId) {
      case 'report':
        navigation?.navigate('Report');
        break;
      case 'map':
        navigation?.navigate('Explore');
        break;
      case 'education':
        navigation?.navigate('Tips');
        break;
      case 'tracking':
        // Show my reports
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'in_progress':
        return theme.colors.primary;
      case 'resolved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
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

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'in_progress':
        return 50;
      case 'resolved':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('loadingDashboard')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const resolvedReports = userReports.filter((r) => r.status === 'resolved').length;
  const activeReports = userReports.filter((r) => r.status !== 'resolved' && r.status !== 'rejected').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')}</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Actions */}
      <View style={styles.profileActions}>
        <TouchableOpacity
          style={styles.profileActionButton}
          onPress={() => setProfileModalVisible(true)}
        >
          <Text style={styles.profileActionIcon}>✏️</Text>
          <Text style={styles.profileActionText}>{t('editProfile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileActionButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Text style={styles.profileActionIcon}>⚙️</Text>
          <Text style={styles.profileActionText}>{t('settings')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchUserData(true)} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userReports.length}</Text>
            <Text style={styles.statLabel}>{t('reportsMade')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>
              {resolvedReports}
            </Text>
            <Text style={styles.statLabel}>{t('issuesResolved')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
              {activeReports}
            </Text>
            <Text style={styles.statLabel}>{t('activeReports')}</Text>
          </View>
        </View>

        {/* My Reports Section */}
        <Text style={styles.sectionTitle}>📋 {t('myReports')} ({userReports.length})</Text>
        {userReports.length === 0 ? (
          <View style={styles.emptyReportsCard}>
            <Text style={styles.emptyReportsIcon}>📝</Text>
            <Text style={styles.emptyReportsText}>{t('noReportsYet')}</Text>
            <Text style={styles.emptyReportsSubtext}>
              {t('reportWaterQualityIssuesHelp')}
            </Text>
          </View>
        ) : (
          userReports.slice(0, 5).map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => {
                setSelectedReport(report);
                setReportDetailVisible(true);
              }}
            >
              <View style={styles.reportHeader}>
                <Text style={styles.reportCategory}>
                  {t(getCategoryTranslationKey(report.category))}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                  <Text style={styles.statusBadgeText}>
                    {t(getStatusTranslationKey(report.status))}
                  </Text>
                </View>
              </View>
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              <View style={styles.reportFooter}>
                <Text style={styles.reportDate}>
                  {new Date(report.createdAt).toLocaleDateString()}
                </Text>
                <View style={[styles.priorityBadge, { borderColor: getPriorityColor(report.priority) }]}>
                  <Text style={[styles.priorityBadgeText, { color: getPriorityColor(report.priority) }]}>
                    {t(getPriorityTranslationKey(report.priority))}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>🚰</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{t('reportedWaterQualityIssue')}</Text>
              <Text style={styles.activityTime}>2 {t('hours')} {t('ago')}</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{t('issueResolvedInYourArea')}</Text>
              <Text style={styles.activityTime}>1 {t('day')} {t('ago')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onUpdate={() => fetchUserData(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />

      {/* Report Detail Modal */}
      <Modal
        visible={reportDetailVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReportDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedReport && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t('reportDetails')}</Text>
                    <TouchableOpacity onPress={() => setReportDetailVisible(false)}>
                      <Text style={styles.modalClose}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Progress Tracker */}
                  <View style={styles.progressSection}>
                    <Text style={styles.progressTitle}>{t('progressTracker')}</Text>
                    <View style={styles.progressSteps}>
                      <View style={styles.progressStep}>
                        <View style={[styles.progressDot, styles.progressDotActive]}>
                          <Text style={styles.progressDotText}>1</Text>
                        </View>
                        <Text style={styles.progressLabel}>{t('submitted')}</Text>
                      </View>
                      <View style={[styles.progressLine, getStatusProgress(selectedReport.status) >= 50 && styles.progressLineActive]} />
                      <View style={styles.progressStep}>
                        <View style={[styles.progressDot, getStatusProgress(selectedReport.status) >= 50 && styles.progressDotActive]}>
                          <Text style={styles.progressDotText}>2</Text>
                        </View>
                        <Text style={styles.progressLabel}>{t('inProgress')}</Text>
                      </View>
                      <View style={[styles.progressLine, getStatusProgress(selectedReport.status) >= 100 && styles.progressLineActive]} />
                      <View style={styles.progressStep}>
                        <View style={[styles.progressDot, getStatusProgress(selectedReport.status) >= 100 && styles.progressDotActive]}>
                          <Text style={styles.progressDotText}>3</Text>
                        </View>
                        <Text style={styles.progressLabel}>{t('resolved')}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('category')}</Text>
                    <Text style={styles.modalValue}>
                      {t(getCategoryTranslationKey(selectedReport.category))}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('description')}</Text>
                    <Text style={styles.modalValue}>{selectedReport.description}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('location')}</Text>
                    <Text style={styles.modalValue}>{selectedReport.location.address}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('statusAndPriority')}</Text>
                    <View style={styles.modalRow}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) }]}>
                        <Text style={styles.statusBadgeText}>
                          {t(getStatusTranslationKey(selectedReport.status))}
                        </Text>
                      </View>
                      <View style={[styles.priorityBadge, { borderColor: getPriorityColor(selectedReport.priority) }]}>
                        <Text style={[styles.priorityBadgeText, { color: getPriorityColor(selectedReport.priority) }]}>
                          {t(getPriorityTranslationKey(selectedReport.priority))}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedReport.photos && selectedReport.photos.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>{t('photos')} ({selectedReport.photos.length})</Text>
                      <ScrollView horizontal style={styles.photoGallery}>
                        {selectedReport.photos.map((photoUrl: string, index: number) => (
                          <Image
                            key={index}
                            source={{ uri: photoUrl }}
                            style={styles.photoImage}
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('submitted')}</Text>
                    <Text style={styles.modalValue}>
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </Text>
                  </View>

                  {selectedReport.adminNotes && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>{t('organizationNotes')}</Text>
                      <View style={styles.adminNotesCard}>
                        <Text style={styles.adminNotesText}>{selectedReport.adminNotes}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileActions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  profileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileActionIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  profileActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
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
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: 2,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  menuItem: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recentActivity: {
    marginBottom: theme.spacing.xl,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
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
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyReportsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyReportsIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyReportsText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyReportsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reportCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  priorityBadge: {
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '90%',
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  progressSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
  },
  progressDotText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
  },
  progressLineActive: {
    backgroundColor: theme.colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: theme.spacing.lg,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  modalValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  modalRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  photoGallery: {
    flexDirection: 'row',
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  adminNotesCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  adminNotesText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default UserDashboard;
