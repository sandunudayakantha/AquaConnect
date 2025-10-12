import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface TipData {
  id?: string;
  title: string;
  description: string;
  category: 'conservation' | 'quality' | 'safety' | 'maintenance' | 'general';
  icon: string;
  content: string;
  tags?: string[];
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  views?: number;
}

class TipsService {
  private tipsCollection = 'tips';

  /**
   * Create a new tip
   */
  async createTip(tipData: Omit<TipData, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const tip: Omit<TipData, 'id'> = {
        ...tipData,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      };

      const docRef = await addDoc(collection(db, this.tipsCollection), {
        ...tip,
        createdAt: Timestamp.fromDate(tip.createdAt),
        updatedAt: Timestamp.fromDate(tip.updatedAt),
      });

      console.log('✅ Tip created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating tip:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create tip');
    }
  }

  /**
   * Get all tips
   */
  async getAllTips(limitCount: number = 100): Promise<TipData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const q = query(
        collection(db, this.tipsCollection),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const tips: TipData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        tips.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as TipData);
      });

      console.log(`📚 Loaded ${tips.length} tips`);
      return tips;
    } catch (error) {
      console.error('❌ Error fetching tips:', error);
      throw new Error('Failed to fetch tips');
    }
  }

  /**
   * Get published tips only (for TipsScreen)
   */
  async getPublishedTips(limitCount: number = 50): Promise<TipData[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const allTips = await this.getAllTips(limitCount);
      return allTips.filter(tip => tip.isPublished);
    } catch (error) {
      console.error('❌ Error fetching published tips:', error);
      throw new Error('Failed to fetch published tips');
    }
  }

  /**
   * Get a single tip by ID
   */
  async getTipById(tipId: string): Promise<TipData | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const docRef = doc(db, this.tipsCollection, tipId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log('📭 No tip found with ID:', tipId);
        return null;
      }

      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as TipData;
    } catch (error) {
      console.error('❌ Error fetching tip by ID:', error);
      throw new Error('Failed to fetch tip');
    }
  }

  /**
   * Update a tip
   */
  async updateTip(tipId: string, updates: Partial<Omit<TipData, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      console.log(`📝 Updating tip ${tipId}...`);

      const tipRef = doc(db, this.tipsCollection, tipId);
      await updateDoc(tipRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log('✅ Tip updated successfully');
    } catch (error) {
      console.error('❌ Error updating tip:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update tip');
    }
  }

  /**
   * Delete a tip
   */
  async deleteTip(tipId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      console.log(`🗑️ Deleting tip ${tipId}...`);

      const tipRef = doc(db, this.tipsCollection, tipId);
      await deleteDoc(tipRef);

      console.log('✅ Tip deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting tip:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to delete tip');
    }
  }

  /**
   * Increment tip views
   */
  async incrementViews(tipId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const tip = await this.getTipById(tipId);
      if (!tip) return;

      const tipRef = doc(db, this.tipsCollection, tipId);
      await updateDoc(tipRef, {
        views: (tip.views || 0) + 1,
      });
    } catch (error) {
      console.error('❌ Error incrementing views:', error);
      // Don't throw error for view tracking
    }
  }

  /**
   * Toggle tip published status
   */
  async togglePublished(tipId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const tip = await this.getTipById(tipId);
      if (!tip) throw new Error('Tip not found');

      await this.updateTip(tipId, {
        isPublished: !tip.isPublished,
      });

      console.log(`✅ Tip ${tip.isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('❌ Error toggling published status:', error);
      throw new Error('Failed to toggle published status');
    }
  }
}

export const tipsService = new TipsService();
export default tipsService;

