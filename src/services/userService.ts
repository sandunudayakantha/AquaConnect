import { doc, updateDoc, getDoc, DocumentData } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from './firebase';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
}

class UserService {
  private usersCollection = 'users';

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      console.log(`📝 Updating profile for user ${userId}...`);

      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });

      // Update Firebase Auth display name if name is changed
      if (updates.name && auth?.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
        });
      }

      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized. Please check your configuration.');
      }

      const userRef = doc(db, this.usersCollection, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('📭 No user profile found');
        return null;
      }

      const data = userSnap.data() as DocumentData;
      return {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        location: data.location || '',
      };
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Update user email (requires re-authentication)
   */
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      if (!auth?.currentUser) {
        throw new Error('No user logged in');
      }

      await updateEmail(auth.currentUser, newEmail);
      console.log('✅ Email updated successfully');
    } catch (error) {
      console.error('❌ Error updating email:', error);
      if (error instanceof Error && error.message.includes('requires-recent-login')) {
        throw new Error('Please log out and log in again to change your email');
      }
      throw new Error('Failed to update email');
    }
  }

  /**
   * Update user password (requires re-authentication)
   */
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!auth?.currentUser) {
        throw new Error('No user logged in');
      }

      await updatePassword(auth.currentUser, newPassword);
      console.log('✅ Password updated successfully');
    } catch (error) {
      console.error('❌ Error updating password:', error);
      if (error instanceof Error && error.message.includes('requires-recent-login')) {
        throw new Error('Please log out and log in again to change your password');
      }
      throw new Error('Failed to update password');
    }
  }
}

export const userService = new UserService();
export default userService;

