import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { useAppContext } from '../context/AppContext';

const ProfileScreen: React.FC = () => {
  const { state, logout } = useAppContext();

  const profileStats = [
    {
      id: 1,
      title: 'Reports Submitted',
      value: '12',
      icon: '📝',
    },
    {
      id: 2,
      title: 'Issues Resolved',
      value: '8',
      icon: '✅',
    },
    {
      id: 3,
      title: 'Tips Shared',
      value: '5',
      icon: '💡',
    },
    {
      id: 4,
      title: 'Community Points',
      value: '1,250',
      icon: '🏆',
    },
  ];

  const menuItems = [
    {
      id: 1,
      title: 'My Reports',
      icon: '📋',
      description: 'View your submitted reports',
    },
    {
      id: 2,
      title: 'Saved Tips',
      icon: '🔖',
      description: 'Access your saved water tips',
    },
    {
      id: 3,
      title: 'Notifications',
      icon: '🔔',
      description: 'Manage your notifications',
    },
    {
      id: 4,
      title: 'Settings',
      icon: '⚙️',
      description: 'App preferences and settings',
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: '❓',
      description: 'Get help and contact support',
    },
    {
      id: 6,
      title: 'About AquaConnect',
      icon: 'ℹ️',
      description: 'Learn more about the app',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {state.user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{state.user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{state.user?.email || 'user@example.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {state.user?.role === 'organization' ? '🏢 Organization' : '👤 Regular User'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsGrid}>
          {profileStats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.section}>
        <Text style={styles.versionText}>AquaConnect v1.0.0</Text>
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: theme.colors.primary,
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
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  menuDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
  },
  versionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;
