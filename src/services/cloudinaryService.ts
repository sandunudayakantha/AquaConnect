/**
 * Cloudinary Image Upload Service
 * Handles image uploads to Cloudinary with automatic optimization
 */

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

class CloudinaryService {
  private config: CloudinaryConfig;

  constructor() {
    this.config = {
      cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
      apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
    };

    this.validateConfig();
  }

  private validateConfig() {
    if (!this.config.cloudName) {
      console.error('❌ Cloudinary Cloud Name is missing. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file');
    }
    if (!this.config.uploadPreset) {
      console.error('❌ Cloudinary Upload Preset is missing. Please set EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file');
    }
  }

  /**
   * Upload a single image to Cloudinary
   */
  async uploadImage(
    imageUri: string,
    options: {
      folder?: string;
      publicId?: string;
      tags?: string[];
    } = {}
  ): Promise<CloudinaryUploadResponse> {
    try {
      if (!this.config.cloudName || !this.config.uploadPreset) {
        throw new Error('Cloudinary not configured. Please check your environment variables.');
      }

      console.log('☁️ Starting Cloudinary upload...');
      console.log('Image URI:', imageUri);

      // Create FormData for upload
      const formData = new FormData();
      
      // Add the image file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: options.publicId ? `${options.publicId}.jpg` : 'upload.jpg',
      } as any);

      // Add upload parameters
      formData.append('upload_preset', this.config.uploadPreset);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }

      // Note: quality and fetch_format should be configured in upload preset for unsigned uploads
      // These parameters are not allowed in unsigned uploads

      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`;
      
      console.log('📤 Uploading to Cloudinary...');
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result: CloudinaryUploadResponse = await response.json();
      console.log('✅ Cloudinary upload successful:', result.secure_url);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      throw new Error(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadImages(
    imageUris: string[],
    options: {
      folder?: string;
      tags?: string[];
    } = {}
  ): Promise<CloudinaryUploadResponse[]> {
    try {
      console.log(`☁️ Starting batch upload of ${imageUris.length} images...`);
      
      const uploadPromises = imageUris.map(async (imageUri, index) => {
        const publicId = `image_${index}_${Date.now()}`;
        
        return this.uploadImage(imageUri, {
          ...options,
          publicId,
        });
      });

      const results = await Promise.all(uploadPromises);
      console.log(`🎉 Successfully uploaded ${results.length} images to Cloudinary`);
      
      return results;
    } catch (error) {
      console.error('❌ Error in batch upload:', error);
      throw error;
    }
  }

  /**
   * Upload report images with specific optimizations
   */
  async uploadReportImages(
    imageUris: string[],
    reportId: string
  ): Promise<string[]> {
    try {
      const uploadOptions = {
        folder: `aquaconnect/reports/${reportId}`,
        tags: ['report', 'water-quality', reportId],
        // Note: transformation removed - must be configured in upload preset for unsigned uploads
      };

      const results = await this.uploadImages(imageUris, uploadOptions);
      
      // Return the secure URLs
      return results.map(result => result.secure_url);
    } catch (error) {
      console.error('❌ Error uploading report images:', error);
      throw new Error(`Failed to upload report images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimized image URL with transformations
   */
  getOptimizedImageUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'limit' | 'scale';
      quality?: 'auto' | number;
      format?: 'auto' | 'jpg' | 'png' | 'webp';
    } = {}
  ): string {
    if (!this.config.cloudName) {
      console.warn('Cloudinary not configured, returning original publicId');
      return publicId;
    }

    let transformation = '';
    
    if (transformations.width) transformation += `w_${transformations.width},`;
    if (transformations.height) transformation += `h_${transformations.height},`;
    if (transformations.crop) transformation += `c_${transformations.crop},`;
    if (transformations.quality) transformation += `q_${transformations.quality},`;
    if (transformations.format) transformation += `f_${transformations.format},`;
    
    // Remove trailing comma
    transformation = transformation.replace(/,$/, '');
    
    const baseUrl = `https://res.cloudinary.com/${this.config.cloudName}/image/upload/`;
    return transformation ? `${baseUrl}${transformation}/${publicId}` : `${baseUrl}${publicId}`;
  }

  /**
   * Delete an image from Cloudinary (requires API key and secret - for admin use)
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      // Note: This requires server-side implementation with API secret
      // For now, we'll just log the intent
      console.log('🗑️ Delete request for image:', publicId);
      console.log('ℹ️ Image deletion requires server-side implementation with API secret');
      return true;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      return false;
    }
  }

  /**
   * Check if Cloudinary is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.cloudName && this.config.uploadPreset);
  }

  /**
   * Get configuration status
   */
  getConfigStatus(): {
    configured: boolean;
    cloudName: boolean;
    uploadPreset: boolean;
    apiKey: boolean;
  } {
    return {
      configured: this.isConfigured(),
      cloudName: !!this.config.cloudName,
      uploadPreset: !!this.config.uploadPreset,
      apiKey: !!this.config.apiKey,
    };
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
