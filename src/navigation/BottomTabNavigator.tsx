import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReportScreen from '../screens/ReportScreen';
import TipsScreen from '../screens/TipsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const TabBarIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={styles.tabBarItem}>
    <Text style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}>
      {icon}
    </Text>
  </View>
);

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="🔍" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerTab}>
              <View style={[styles.centerTabButton, focused && styles.centerTabButtonFocused]}>
                <Text style={[styles.centerTabIcon, focused && styles.centerTabIconFocused]}>
                  📝
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="💡" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    fontSize: 28,
  },
  tabBarIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  centerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  centerTabButtonFocused: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  centerTabIcon: {
    fontSize: 28,
    color: 'white',
  },
  centerTabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
});

export default BottomTabNavigator;
