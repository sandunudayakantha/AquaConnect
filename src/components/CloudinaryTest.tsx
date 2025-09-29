import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cloudinaryService from '../services/cloudinaryService';
import { theme } from '../styles/theme';

/**
 * Test component for Cloudinary integration
 * Add this to any screen to test image uploads
 */
const CloudinaryTest: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);

  const testCloudinaryUpload = async () => {
    try {
      setIsUploading(true);

      // Check configuration
      const configStatus = cloudinaryService.getConfigStatus();
      console.log('Cloudinary config status:', configStatus);

      if (!configStatus.configured) {
        Alert.alert(
          'Configuration Error',
          `Cloudinary is not properly configured:\n\n${
            !configStatus.cloudName ? '• Missing EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME\n' : ''
          }${
            !configStatus.uploadPreset ? '• Missing EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET\n' : ''
          }\nPlease check your .env file and follow the CLOUDINARY_SETUP.md guide.`
        );
        return;
      }

      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access photos is required!');
        return;
      }

      // Pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const imageUri = result.assets[0].uri;
      console.log('Selected image:', imageUri);

      // Upload to Cloudinary
      console.log('🧪 Testing Cloudinary upload...');
      const uploadResult = await cloudinaryService.uploadImage(imageUri, {
        folder: 'aquaconnect/test',
        tags: ['test', 'mobile-app'],
      });

      console.log('✅ Upload successful:', uploadResult);

      Alert.alert(
        'Upload Successful! 🎉',
        `Image uploaded to Cloudinary successfully!\n\nPublic ID: ${uploadResult.public_id}\nURL: ${uploadResult.secure_url}\n\nSize: ${Math.round(uploadResult.bytes / 1024)}KB\nFormat: ${uploadResult.format}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Test upload failed:', error);
      Alert.alert(
        'Upload Failed',
        `Failed to upload image to Cloudinary.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck the console for more details.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Cloudinary Test</Text>
      <TouchableOpacity
        style={[styles.button, isUploading && styles.buttonDisabled]}
        onPress={testCloudinaryUpload}
        disabled={isUploading}
      >
        <Text style={styles.buttonText}>
          {isUploading ? 'Uploading...' : 'Test Image Upload'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.description}>
        This will pick an image and upload it to Cloudinary to test the integration.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CloudinaryTest;
