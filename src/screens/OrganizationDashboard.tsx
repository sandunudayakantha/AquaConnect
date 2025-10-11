import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import reportService, { ReportData } from '../services/reportService';
import TipsManagement from '../components/TipsManagement';
import ProfileEditModal from '../components/ProfileEditModal';
import SettingsModal from '../components/SettingsModal';
import { getStatusTranslationKey, getCategoryTranslationKey, getPriorityTranslationKey } from '../utils/translationHelpers';

interface OrganizationDashboardProps {
  navigation: any;
}

const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({ navigation }) => {
  const { state, logout } = useAppContext();
  const { t } = useLanguage();
  const { user } = state;
  
  // State management
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [tipsModalVisible, setTipsModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  // Fetch reports
  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const allReports = await reportService.getAllReports(100);
      setReports(allReports);
      filterReports(allReports, selectedTab);

      console.log(`📋 Loaded ${allReports.length} reports for organization`);
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      Alert.alert('Error', 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter reports by status
  const filterReports = (allReports: ReportData[], tab: typeof selectedTab) => {
    if (tab === 'all') {
      setFilteredReports(allReports);
    } else {
      setFilteredReports(allReports.filter(report => report.status === tab));
    }
  };

  // Handle tab change
  const handleTabChange = (tab: typeof selectedTab) => {
    setSelectedTab(tab);
    filterReports(reports, tab);
  };

  // Open report detail modal
  const handleReportPress = (report: ReportData) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setModalVisible(true);
  };

  // Update report status
  const handleStatusUpdate = async (status: 'pending' | 'in_progress' | 'resolved' | 'rejected') => {
    if (!selectedReport) return;

    try {
      await reportService.updateReportStatus(selectedReport.id!, status, adminNotes);
      
      Alert.alert(
        'Success',
        `Report status updated to ${status}`,
        [{ text: 'OK', onPress: () => {
          setModalVisible(false);
          fetchReports(true);
        }}]
      );
    } catch (error) {
      console.error('❌ Error updating status:', error);
      Alert.alert('Error', 'Failed to update report status. Please try again.');
    }
  };

  // Calculate statistics
  const getStatistics = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const inProgress = reports.filter(r => r.status === 'in_progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const highPriority = reports.filter(r => r.priority === 'High' && r.status !== 'resolved').length;

    return { total, pending, inProgress, resolved, highPriority };
  };

  const stats = getStatistics();

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return theme.colors.error;
      case 'Medium': return theme.colors.warning;
      case 'Low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.colors.warning;
      case 'in_progress': return theme.colors.primary;
      case 'resolved': return theme.colors.success;
      case 'rejected': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('justNow');
    if (hours < 24) return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${t('ago')}`;
    if (days < 7) return `${days} ${days === 1 ? t('day') : t('days')} ${t('ago')}`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{t('organizationDashboard')}</Text>
          <Text style={styles.userName}>{user?.name || 'Organization'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setProfileModalVisible(true)}
          >
            <Text style={styles.headerButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setSettingsModalVisible(true)}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>{t('total')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.warning }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>{t('pending')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>{t('inProgress')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.success }]}>{stats.resolved}</Text>
          <Text style={styles.statLabel}>{t('resolved')}</Text>
        </View>
      </View>

      {/* Manage Tips Button */}
      <View style={styles.manageTipsContainer}>
        <TouchableOpacity
          style={styles.manageTipsButton}
          onPress={() => setTipsModalVisible(true)}
        >
          <Text style={styles.manageTipsIcon}>💡</Text>
          <Text style={styles.manageTipsText}>{t('manageTips')}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
            onPress={() => handleTabChange('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
              {t('all')} ({reports.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
            onPress={() => handleTabChange('pending')}
          >
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>
              {t('pending')} ({stats.pending})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'in_progress' && styles.tabActive]}
            onPress={() => handleTabChange('in_progress')}
          >
            <Text style={[styles.tabText, selectedTab === 'in_progress' && styles.tabTextActive]}>
              {t('inProgress')} ({stats.inProgress})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'resolved' && styles.tabActive]}
            onPress={() => handleTabChange('resolved')}
          >
            <Text style={[styles.tabText, selectedTab === 'resolved' && styles.tabTextActive]}>
              {t('resolved')} ({stats.resolved})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchReports(true)} />
        }
      >
        {filteredReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>{t('noReportsFound')}</Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => handleReportPress(report)}
            >
              <View style={styles.reportHeader}>
                <View style={styles.reportCategory}>
                  <Text style={styles.reportCategoryText}>
                    {t(getCategoryTranslationKey(report.category))}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {t(getStatusTranslationKey(report.status))}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              
              <View style={styles.reportFooter}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportInfoText}>📍 {report.location.address}</Text>
                  <Text style={styles.reportInfoText}>👤 {report.userName}</Text>
                  <Text style={styles.reportInfoText}>🕒 {formatDate(report.createdAt)}</Text>
                </View>
                <View style={[styles.priorityBadge, { borderColor: getPriorityColor(report.priority) }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
                    {t(getPriorityTranslationKey(report.priority))}
                  </Text>
                </View>
              </View>

              {report.photos && report.photos.length > 0 && (
                <View style={styles.photoIndicator}>
                  <Text style={styles.photoIndicatorText}>📷 {report.photos.length} {report.photos.length === 1 ? t('photo') : t('photos')}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Tips Management Modal */}
      <TipsManagement
        visible={tipsModalVisible}
        onClose={() => setTipsModalVisible(false)}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onUpdate={() => fetchReports(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />

      {/* Report Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedReport && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t('reportDetails')}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={styles.modalClose}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('category')}</Text>
                    <Text style={styles.modalValue}>{t(getCategoryTranslationKey(selectedReport.category))}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('description')}</Text>
                    <Text style={styles.modalValue}>{selectedReport.description}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('location')}</Text>
                    <Text style={styles.modalValue}>{selectedReport.location.address}</Text>
                    <Text style={styles.modalSubValue}>
                      {selectedReport.location.latitude.toFixed(6)}, {selectedReport.location.longitude.toFixed(6)}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('reportedBy')}</Text>
                    <Text style={styles.modalValue}>{selectedReport.userName}</Text>
                    <Text style={styles.modalSubValue}>{selectedReport.userEmail}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('priorityAndStatus')}</Text>
                    <View style={styles.modalRow}>
                      <View style={[styles.priorityBadge, { borderColor: getPriorityColor(selectedReport.priority) }]}>
                        <Text style={[styles.priorityText, { color: getPriorityColor(selectedReport.priority) }]}>
                          {t(getPriorityTranslationKey(selectedReport.priority))}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                          {t(getStatusTranslationKey(selectedReport.status))}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedReport.photos && selectedReport.photos.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>{t('photos')} ({selectedReport.photos.length})</Text>
                      <ScrollView horizontal style={styles.photoGallery}>
                        {selectedReport.photos.map((photoUrl, index) => (
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
                    <Text style={styles.modalLabel}>{t('adminNotes')}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('addNotesAboutReport')}
                      value={adminNotes}
                      onChangeText={setAdminNotes}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>{t('updateStatus')}</Text>
                    <View style={styles.actionButtons}>
                      {selectedReport.status !== 'in_progress' && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleStatusUpdate('in_progress')}
                        >
                          <Text style={styles.actionButtonText}>{t('markInProgress')}</Text>
                        </TouchableOpacity>
                      )}
                      {selectedReport.status !== 'resolved' && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                          onPress={() => handleStatusUpdate('resolved')}
                        >
                          <Text style={styles.actionButtonText}>✓ {t('markAsFixed')}</Text>
                        </TouchableOpacity>
                      )}
                      {selectedReport.status !== 'rejected' && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                          onPress={() => handleStatusUpdate('rejected')}
                        >
                          <Text style={styles.actionButtonText}>{t('reject')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
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
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
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
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  manageTipsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  manageTipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  manageTipsIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  manageTipsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  tab: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  reportCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reportCategory: {
    flex: 1,
  },
  reportCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  reportInfo: {
    flex: 1,
  },
  reportInfoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  priorityBadge: {
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  photoIndicator: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  photoIndicatorText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
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
  modalSubValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
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
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrganizationDashboard;
