import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { theme } from '../styles/theme';
import { ReportData } from '../services/reportService';

interface ReportCardProps {
  report: ReportData;
  onPress?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const getStatusColor = (status: ReportData['status']) => {
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

  const getPriorityColor = (priority: ReportData['priority']) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water_quality':
        return '🚰';
      case 'pressure':
        return '💧';
      case 'infrastructure':
        return '🏗️';
      case 'leakage':
        return '💦';
      case 'contamination':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(report.category)}</Text>
          <Text style={styles.categoryText}>{report.category.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
          <Text style={styles.statusText}>{report.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {report.location.address}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <View style={[styles.priorityBadge, { borderColor: getPriorityColor(report.priority) }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
              {report.priority}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
        </View>
      </View>

      {report.photos && report.photos.length > 0 && (
        <View style={styles.photoSection}>
          <Text style={styles.photoSectionTitle}>📷 {report.photos.length} photo{report.photos.length > 1 ? 's' : ''}</Text>
          <ScrollView horizontal style={styles.photoScrollView} showsHorizontalScrollIndicator={false}>
            {report.photos.map((photoUrl, index) => (
              <TouchableOpacity key={index} style={styles.photoThumbnail}>
                <Image 
                  source={{ uri: photoUrl }} 
                  style={styles.photoImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: theme.spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  photoSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  photoSectionTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  photoScrollView: {
    flexDirection: 'row',
  },
  photoThumbnail: {
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  photoImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
  },
});

export default ReportCard;
