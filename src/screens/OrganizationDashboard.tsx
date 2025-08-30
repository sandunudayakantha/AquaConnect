import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';

interface OrganizationDashboardProps {
  navigation: any;
}

const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({ navigation }) => {
  const { state, logout } = useAppContext();
  const { user } = state;
  const menuItems = [
    {
      id: 'reports',
      title: 'View Reports',
      subtitle: 'Review water quality reports',
      icon: '📋',
      color: theme.colors.primary,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Water quality trends & insights',
      icon: '📊',
      color: theme.colors.secondary,
    },
    {
      id: 'actions',
      title: 'Take Action',
      subtitle: 'Address reported issues',
      icon: '⚡',
      color: theme.colors.success,
    },
    {
      id: 'communication',
      title: 'Communicate',
      subtitle: 'Update community members',
      icon: '📢',
      color: theme.colors.warning,
    },
  ];

  const handleMenuPress = (itemId: string) => {
    // Navigate to different screens based on menu item
    switch (itemId) {
      case 'reports':
        // navigation.navigate('ViewReports');
        break;
      case 'analytics':
        // navigation.navigate('Analytics');
        break;
      case 'actions':
        // navigation.navigate('TakeAction');
        break;
      case 'communication':
        // navigation.navigate('Communication');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Organization!</Text>
          <Text style={styles.userName}>{user?.name || 'Organization'}</Text>
        </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Organization Tools</Text>
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

        <View style={styles.prioritySection}>
          <Text style={styles.sectionTitle}>Priority Issues</Text>
          <View style={styles.priorityItem}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>High</Text>
            </View>
            <View style={styles.priorityContent}>
              <Text style={styles.priorityTitle}>Contaminated water source in Downtown</Text>
              <Text style={styles.priorityTime}>Reported 2 hours ago</Text>
            </View>
          </View>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityBadge, { backgroundColor: theme.colors.warning + '20' }]}>
              <Text style={[styles.priorityText, { color: theme.colors.warning }]}>Medium</Text>
            </View>
            <View style={styles.priorityContent}>
              <Text style={styles.priorityTitle}>Low water pressure in West District</Text>
              <Text style={styles.priorityTime}>Reported 1 day ago</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Actions</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Resolved water quality issue in Central Park</Text>
              <Text style={styles.activityTime}>3 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>📢</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Sent update to community members</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  prioritySection: {
    marginBottom: theme.spacing.xl,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  priorityBadge: {
    backgroundColor: theme.colors.error + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.error,
  },
  priorityContent: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  priorityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
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
});

export default OrganizationDashboard;
