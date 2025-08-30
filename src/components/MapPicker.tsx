import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../styles/theme';

interface MapPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use the location picker.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      setUserLocation({ latitude, longitude });
      
      // Set initial location to user's current location if no initial location provided
      if (!initialLocation) {
        const address = await getAddressFromCoordinates(latitude, longitude);
        setLocation({ latitude, longitude, address });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (response.length > 0) {
        const address = response[0];
        return [
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean).join(', ');
      }
      
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error getting address:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      const address = await getAddressFromCoordinates(userLocation.latitude, userLocation.longitude);
      const newLocation = { ...userLocation, address };
      setLocation(newLocation);
    }
  };

  const handleManualLocation = async () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid latitude and longitude values.');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      Alert.alert('Error', 'Latitude must be between -90 and 90.');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      Alert.alert('Error', 'Longitude must be between -180 and 180.');
      return;
    }
    
    const address = await getAddressFromCoordinates(lat, lng);
    setLocation({ latitude: lat, longitude: lng, address });
  };

  const handleConfirmLocation = () => {
    if (location) {
      onLocationSelect(location);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.mapButtonIcon}>🗺️</Text>
        <View style={styles.mapButtonContent}>
          <Text style={styles.mapButtonTitle}>
            {location ? 'Location Selected' : 'Select Location'}
          </Text>
          <Text style={styles.mapButtonSubtitle}>
            {location ? location.address : 'Tap to select location'}
          </Text>
        </View>
        <Text style={styles.mapButtonArrow}>›</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmLocation}
              disabled={!location}
            >
              <Text style={[styles.confirmButtonText, !location && styles.confirmButtonTextDisabled]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Current Location Option */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Use Current Location</Text>
              <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={handleUseCurrentLocation}
              >
                <Text style={styles.currentLocationIcon}>📍</Text>
                <Text style={styles.currentLocationText}>Get My Current Location</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Coordinates Option */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Enter Coordinates Manually</Text>
              <View style={styles.coordinateInputs}>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 37.7749"
                    value={manualLatitude}
                    onChangeText={setManualLatitude}
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., -122.4194"
                    value={manualLongitude}
                    onChangeText={setManualLongitude}
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.manualLocationButton}
                onPress={handleManualLocation}
              >
                <Text style={styles.manualLocationText}>Set Location from Coordinates</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Location Display */}
            {location && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✅ Selected Location</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationInfoTitle}>Address:</Text>
                  <Text style={styles.locationInfoAddress}>{location.address}</Text>
                  <Text style={styles.locationInfoTitle}>Coordinates:</Text>
                  <Text style={styles.locationInfoCoords}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Instructions</Text>
              <Text style={styles.instructionsText}>
                • Use "Get My Current Location" to automatically get your current position{'\n'}
                • Or enter latitude and longitude coordinates manually{'\n'}
                • Latitude ranges from -90 to 90{'\n'}
                • Longitude ranges from -180 to 180{'\n'}
                • The app will automatically get the address for the selected coordinates
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mapButtonIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  mapButtonContent: {
    flex: 1,
  },
  mapButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  mapButtonSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  mapButtonArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  confirmButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  currentLocationIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  coordinateInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  coordinateInput: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  manualLocationButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  manualLocationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locationInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationInfoAddress: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationInfoCoords: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },
  instructionsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default MapPicker;
