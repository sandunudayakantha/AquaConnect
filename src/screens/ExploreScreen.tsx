import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import reportService, { ReportData } from '../services/reportService';
import tipsService, { TipData } from '../services/tipsService';
import { getStatusTranslationKey, getCategoryTranslationKey, getPriorityTranslationKey } from '../utils/translationHelpers';

const { width } = Dimensions.get('window');

const ExploreScreen: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'issues' | 'tips'>('all');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [tips, setTips] = useState<TipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    fetchData();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      console.log('📍 User location obtained:', location.coords);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch reports and tips in parallel
      const [allReports, publishedTips] = await Promise.all([
        reportService.getAllReports(100),
        tipsService.getPublishedTips(50),
      ]);

      setReports(allReports);
      setTips(publishedTips);

      console.log(`🔍 Loaded ${allReports.length} reports and ${publishedTips.length} tips`);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
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

  // Get nearby reports
  const getNearbyReports = () => {
    if (!userLocation) return reports;

    return reports
      .map((report) => ({
        ...report,
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          report.location.latitude,
          report.location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Show top 10 nearest
  };

  // Filter data based on search
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    
    let filteredReports = reports;
    let filteredTips = tips;

    if (query) {
      filteredReports = reports.filter(
        (report) =>
          report.category.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.location.address.toLowerCase().includes(query)
      );

      filteredTips = tips.filter(
        (tip) =>
          tip.title.toLowerCase().includes(query) ||
          tip.description.toLowerCase().includes(query) ||
          tip.content.toLowerCase().includes(query) ||
          tip.category.toLowerCase().includes(query)
      );
    }

    if (searchType === 'issues') {
      return { reports: filteredReports, tips: [] };
    } else if (searchType === 'tips') {
      return { reports: [], tips: filteredTips };
    }

    return { reports: filteredReports, tips: filteredTips };
  };

  const { reports: filteredReports, tips: filteredTips } = getFilteredData();
  const nearbyReports = getNearbyReports();

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
      case 'resolved':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.primary;
      case 'pending':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getMarkerColor = (report: ReportData) => {
    if (report.status === 'resolved') return '#4CAF50';
    if (report.priority === 'High') return '#F44336';
    if (report.priority === 'Medium') return '#FF9800';
    return '#2196F3';
  };

  // Get safe water locations (resolved issues)
  const getSafeWaterLocations = () => {
    return reports.filter((r) => r.status === 'resolved');
  };

  // Get nearby safe locations
  const getNearbySafeLocations = () => {
    if (!userLocation) return getSafeWaterLocations();

    return getSafeWaterLocations()
      .map((report) => ({
        ...report,
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          report.location.latitude,
          report.location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  };

  const safeLocations = getSafeWaterLocations();
  const nearbySafeLocations = getNearbySafeLocations();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading explore data...</Text>
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
        <Text style={styles.title}>{t('explore')}</Text>
        <Text style={styles.subtitle}>
          {reports.length} {t('issues')} • {tips.length} {t('tips')} • {safeLocations.length} {t('safeWaterLocations')}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchIssuesTipsLocations')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Type Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'all' && styles.filterButtonActive]}
          onPress={() => setSearchType('all')}
        >
          <Text style={[styles.filterText, searchType === 'all' && styles.filterTextActive]}>
            {t('all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'issues' && styles.filterButtonActive]}
          onPress={() => setSearchType('issues')}
        >
          <Text style={[styles.filterText, searchType === 'issues' && styles.filterTextActive]}>
            {t('issues')} ({filteredReports.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, searchType === 'tips' && styles.filterButtonActive]}
          onPress={() => setSearchType('tips')}
        >
          <Text style={[styles.filterText, searchType === 'tips' && styles.filterTextActive]}>
            {t('tips')} ({filteredTips.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map View Toggle */}
      <View style={styles.mapToggleContainer}>
        <TouchableOpacity
          style={styles.mapToggleButton}
          onPress={() => setShowMap(!showMap)}
        >
          <Text style={styles.mapToggleText}>
            {showMap ? `📋 ${t('showList')}` : `🗺️ ${t('showMap')}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {showMap && userLocation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('nearbyIssuesMap')}</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* User location */}
              <Marker
                coordinate={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />

              {/* 5km radius circle */}
              <Circle
                center={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                radius={5000}
                strokeColor="rgba(33, 150, 243, 0.3)"
                fillColor="rgba(33, 150, 243, 0.1)"
              />

              {/* Active Issue markers (not resolved) */}
              {nearbyReports
                .filter((r) => r.status !== 'resolved')
                .slice(0, 20)
                .map((report) => (
                  <Marker
                    key={`issue-${report.id}`}
                    coordinate={{
                      latitude: report.location.latitude,
                      longitude: report.location.longitude,
                    }}
                    title={`⚠️ ${t(getCategoryTranslationKey(report.category))}`}
                    description={`${t(getPriorityTranslationKey(report.priority))} ${t('priority')} • ${t(getStatusTranslationKey(report.status))}`}
                    pinColor={getMarkerColor(report)}
                  />
                ))}

              {/* Safe Water Location markers (resolved issues) */}
              {safeLocations.slice(0, 30).map((report) => (
                <Marker
                  key={`safe-${report.id}`}
                  coordinate={{
                    latitude: report.location.latitude,
                    longitude: report.location.longitude,
                  }}
                  title={`✅ ${t('safe')}: ${t(getCategoryTranslationKey(report.category))}`}
                  description={`${t('issueResolved')} • ${t('safeWaterAvailable')}`}
                  pinColor="#4CAF50"
                >
                  <View style={styles.safeMarker}>
                    <Text style={styles.safeMarkerText}>✅</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.legendText}>{t('highPriority')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.legendText}>{t('medium')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.legendText}>{t('lowPriority')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>{t('safeWater')}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Search Results - Tips */}
      {(searchType === 'all' || searchType === 'tips') && filteredTips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            💡 {t('tips')} ({filteredTips.length})
          </Text>
          {filteredTips.slice(0, 5).map((tip) => (
            <TouchableOpacity key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipInfo}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipCategory}>{tip.category.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.tipDescription} numberOfLines={2}>
                {tip.description}
              </Text>
            </TouchableOpacity>
          ))}
          {filteredTips.length > 5 && (
            <Text style={styles.moreText}>
              +{filteredTips.length - 5} more tips. Go to Tips tab to see all.
            </Text>
          )}
        </View>
      )}

      {/* Nearby Issues */}
      {(searchType === 'all' || searchType === 'issues') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📍 {t('nearbyIssues')} ({nearbyReports.length})
          </Text>
          {nearbyReports.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyText}>{t('noIssuesNearby')}</Text>
              <Text style={styles.emptySubtext}>{t('yourAreaLooksGreat')}</Text>
            </View>
          ) : (
            nearbyReports.slice(0, 10).map((report) => (
              <TouchableOpacity key={report.id} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <Text style={styles.issueTitle}>
                    {t(getCategoryTranslationKey(report.category))}
                  </Text>
                  <View style={styles.issueBadges}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getPriorityColor(report.priority) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.badgeText, { color: getPriorityColor(report.priority) }]}
                      >
                        {t(getPriorityTranslationKey(report.priority))}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: getStatusColor(report.status) + '20' },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: getStatusColor(report.status) }]}>
                        {t(getStatusTranslationKey(report.status))}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.issueDescription} numberOfLines={2}>
                  {report.description}
                </Text>
                <View style={styles.issueDetails}>
                  <Text style={styles.issueLocation}>📍 {report.location.address}</Text>
                  {userLocation && (
                    <Text style={styles.issueDistance}>
                      📏 {report.distance ? report.distance.toFixed(1) : '?'} km
                    </Text>
                  )}
                </View>
                {report.photos && report.photos.length > 0 && (
                  <Text style={styles.photoIndicator}>
                    📷 {report.photos.length} photo{report.photos.length > 1 ? 's' : ''}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Safe Water Locations (Resolved Issues) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ✅ {t('safeWaterLocations')} ({safeLocations.length})
        </Text>
        <Text style={styles.sectionSubtitle}>
          {t('areasWhereIssuesResolved')}
        </Text>
        {nearbySafeLocations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('noResolvedIssuesYet')}</Text>
            <Text style={styles.emptySubtext}>
              {t('checkBackLaterForSafeWater')}
            </Text>
          </View>
        ) : (
          nearbySafeLocations.slice(0, 10).map((report) => (
            <View key={report.id} style={styles.safeLocationCard}>
              <View style={styles.safeLocationHeader}>
                <Text style={styles.safeLocationIcon}>✅</Text>
                <View style={styles.safeLocationInfo}>
                  <Text style={styles.safeLocationTitle}>
                    {t(getCategoryTranslationKey(report.category))} - {t('fixed')}
                  </Text>
                  <Text style={styles.safeLocationAddress}>
                    📍 {report.location.address}
                  </Text>
                  <View style={styles.safeLocationFooter}>
                    <Text style={styles.safeLocationDate}>
                      {t('resolved')} {new Date(report.updatedAt).toLocaleDateString()}
                    </Text>
                    {userLocation && report.distance !== undefined && (
                      <Text style={styles.safeLocationDistance}>
                        📏 {report.distance.toFixed(1)} km away
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('communityStats')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{reports.length}</Text>
            <Text style={styles.statLabel}>{t('totalReports')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
              {reports.filter((r) => r.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>{t('pending')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>
              {reports.filter((r) => r.status === 'resolved').length}
            </Text>
            <Text style={styles.statLabel}>{t('resolved')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {tips.length}
            </Text>
            <Text style={styles.statLabel}>{t('tipsAvailable')}</Text>
          </View>
        </View>
      </View>

      {/* Priority Issues Alert */}
      {reports.filter((r) => r.priority === 'High' && r.status !== 'resolved').length > 0 && (
        <View style={styles.section}>
          <View style={styles.alertCard}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{t('highPriorityIssues')}</Text>
              <Text style={styles.alertText}>
                {reports.filter((r) => r.priority === 'High' && r.status !== 'resolved').length}{' '}
                {t('highPriorityWaterIssuesNeedAttention')}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
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
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
  mapToggleContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  mapToggleButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  mapToggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  mapContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  map: {
    width: '100%',
    height: 300,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: 12,
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
    marginBottom: theme.spacing.sm,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tipCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  tipDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  issueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
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
  issueDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  issueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  issueLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  issueDistance: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  photoIndicator: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  safeLocationCard: {
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success + '30',
  },
  safeLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeLocationIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  safeLocationInfo: {
    flex: 1,
  },
  safeLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  safeLocationAddress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  safeLocationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  safeLocationDate: {
    fontSize: 12,
    color: theme.colors.success,
  },
  safeLocationDistance: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  safeMarker: {
    backgroundColor: theme.colors.success,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  safeMarkerText: {
    fontSize: 16,
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
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
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
  },
  alertCard: {
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
  },
  alertIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  alertText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  moreText: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
});

export default ExploreScreen;
