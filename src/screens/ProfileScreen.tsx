import React from 'react';
import { useAppContext } from '../context/AppContext';
import UserDashboard from './UserDashboard';
import OrganizationDashboard from './OrganizationDashboard';

const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { state } = useAppContext();

  // Check user role and render appropriate dashboard
  if (state.user?.role === 'organization') {
    return <OrganizationDashboard navigation={navigation} />;
  }

  // Default to user dashboard for regular users
  return <UserDashboard navigation={navigation} />;
};

export default ProfileScreen;
