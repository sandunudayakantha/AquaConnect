import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import cloudinaryService from './cloudinaryService';

export interface ReportData {
  id?: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos?: string[]; // URLs of uploaded photos
  userId: string;
  userEmail: string;
  userName: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string; // For organizations
  adminNotes?: string;
}

class ReportService {
  private reportsCollection = 'reports';

  /**
   * Submit a new report to Firestore
   */
  async submitReport(reportData: Omit<ReportData, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const report: Omit<ReportData, 'id'> = {
        ...reportData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, this.reportsCollection), {
        ...report,
        createdAt: Timestamp.fromDate(report.createdAt),
        updatedAt: Timestamp.fromDate(report.updatedAt),
      });

      console.log('✅ Report submitted successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error submitting report:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to submit report');
    }
  }

  /**
   * Update a report with photo URLs after successful upload
   */
  async updateReportWithPhotos(reportId: string, photoUrls: string[]): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      console.log(`📝 Updating report ${reportId} with ${photoUrls.length} photo URLs...`);

      const reportRef = doc(db, this.reportsCollection, reportId);
      await updateDoc(reportRef, {
        photos: photoUrls,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('✅ Report updated with photo URLs successfully');
    } catch (error) {
      console.error('❌ Error updating report with photos:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update report with photos');
    }
  }

  /**
   * Submit a complete report with photos
   */
  async submitReportWithPhotos(
    reportData: Omit<ReportData, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'photos'>,
    photoUris: string[] = []
  ): Promise<{ reportId: string; photoUrls: string[] }> {
    try {
      console.log('🚀 Starting complete report submission with photos...');

      // Step 1: Submit the report to Firestore (without photos initially)
      const reportId = await this.submitReport(reportData);
      console.log(`✅ Report submitted with ID: ${reportId}`);

      let photoUrls: string[] = [];

      // Step 2: Upload photos to Cloudinary if provided
      if (photoUris.length > 0) {
        try {
          console.log(`📤 Uploading ${photoUris.length} photos to Cloudinary...`);
          photoUrls = await this.uploadPhotos(photoUris, reportId);
          console.log(`✅ Photos uploaded successfully: ${photoUrls.length} URLs`);

          // Step 3: Update the report with photo URLs
          await this.updateReportWithPhotos(reportId, photoUrls);
          console.log('✅ Report updated with photo URLs');
        } catch (photoError) {
          console.warn('⚠️ Photo upload failed, but report was submitted:', photoError);
          // Don't throw error here - report is already submitted
          // The calling code can handle this gracefully
        }
      }

      return { reportId, photoUrls };
    } catch (error) {
      console.error('❌ Error in complete report submission:', error);
      throw error;
    }
  }

  /**
   * Upload photos to Cloudinary
   */
  async uploadPhotos(photos: string[], reportId: string): Promise<string[]> {
    try {
      if (!cloudinaryService.isConfigured()) {
        throw new Error('Cloudinary not configured. Please check your environment variables (EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET).');
      }

      console.log('☁️ Starting Cloudinary photo upload process...');
      console.log('Photos to upload:', photos.length);
      console.log('Cloudinary config status:', cloudinaryService.getConfigStatus());

      // Use Cloudinary service to upload report images
      const photoUrls = await cloudinaryService.uploadReportImages(photos, reportId);
      
      console.log('🎉 All photos uploaded to Cloudinary successfully:', photoUrls.length);
      return photoUrls;
    } catch (error) {
      console.error('❌ Error uploading photos to Cloudinary:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
        });
        
        // Check for common Cloudinary errors
        if (error.message.includes('Invalid cloud name')) {
          throw new Error('Invalid Cloudinary cloud name. Please check your EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.');
        } else if (error.message.includes('Invalid upload preset')) {
          throw new Error('Invalid upload preset. Please check your EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variable.');
        } else if (error.message.includes('Upload failed: 401')) {
          throw new Error('Cloudinary authentication failed. Please check your upload preset settings.');
        } else if (error.message.includes('Upload failed: 400')) {
          throw new Error('Invalid image format or size. Please try with different images.');
        }
      }
      
      throw new Error(`Failed to upload photos to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single report by ID with photos
   */
  async getReportById(reportId: string): Promise<ReportData | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const reportRef = doc(db, this.reportsCollection, reportId);
      const reportSnap = await getDocs(query(collection(db, this.reportsCollection), where('__name__', '==', reportId)));

      if (reportSnap.empty) {
        console.log('📭 No report found with ID:', reportId);
        return null;
      }

      const reportDoc = reportSnap.docs[0];
      const data = reportDoc.data() as DocumentData;
      
      const report: ReportData = {
        id: reportDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        photos: data.photos || [], // Ensure photos array exists
      };

      console.log(`📄 Retrieved report ${reportId} with ${report.photos?.length || 0} photos`);
      return report;
    } catch (error) {
      console.error('❌ Error fetching report by ID:', error);
      throw new Error('Failed to fetch report');
    }
  }

  /**
   * Get reports for a specific user with photos
   */
  async getUserReports(userId: string, limitCount: number = 50): Promise<ReportData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const q = query(
        collection(db, this.reportsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reports: ReportData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          photos: data.photos || [], // Ensure photos array exists
        } as ReportData);
      });

      return reports;
    } catch (error) {
      console.error('❌ Error fetching user reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  /**
   * Get all reports (for organizations/admins)
   */
  async getAllReports(limitCount: number = 100): Promise<ReportData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const q = query(
        collection(db, this.reportsCollection),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reports: ReportData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          photos: data.photos || [], // Ensure photos array exists
        } as ReportData);
      });

      return reports;
    } catch (error) {
      console.error('❌ Error fetching all reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  /**
   * Get reports by priority level
   */
  async getReportsByPriority(priority: 'Low' | 'Medium' | 'High', limitCount: number = 50): Promise<ReportData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const q = query(
        collection(db, this.reportsCollection),
        where('priority', '==', priority),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reports: ReportData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          photos: data.photos || [], // Ensure photos array exists
        } as ReportData);
      });

      return reports;
    } catch (error) {
      console.error('❌ Error fetching reports by priority:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  /**
   * Get reports by status
   */
  async getReportsByStatus(status: 'pending' | 'in_progress' | 'resolved' | 'rejected', limitCount: number = 50): Promise<ReportData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const q = query(
        collection(db, this.reportsCollection),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reports: ReportData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          photos: data.photos || [], // Ensure photos array exists
        } as ReportData);
      });

      return reports;
    } catch (error) {
      console.error('❌ Error fetching reports by status:', error);
      throw new Error('Failed to fetch reports');
    }
  }
}

export const reportService = new ReportService();
export default reportService;
