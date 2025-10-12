import { TranslationKey } from '../i18n/translations';

// Helper function to translate status values
export const getStatusTranslationKey = (status: string): TranslationKey => {
  const statusMap: Record<string, TranslationKey> = {
    'pending': 'pending',
    'in_progress': 'inProgress',
    'resolved': 'resolved',
    'rejected': 'rejected',
  };
  return statusMap[status] || 'pending';
};

// Helper function to translate category values
export const getCategoryTranslationKey = (category: string): TranslationKey => {
  const categoryMap: Record<string, TranslationKey> = {
    'water_quality': 'waterQuality',
    'pressure': 'waterPressure',
    'infrastructure': 'infrastructure',
    'leakage': 'leakage',
    'contamination': 'contamination',
    'supply': 'waterSupply',
    'other': 'other',
    // Tip categories
    'conservation': 'conservation',
    'quality': 'quality',
    'safety': 'safety',
    'maintenance': 'maintenance',
    'general': 'general',
  };
  return categoryMap[category] || 'other';
};

// Helper function to translate priority values
export const getPriorityTranslationKey = (priority: string): TranslationKey => {
  const priorityMap: Record<string, TranslationKey> = {
    'High': 'high',
    'Medium': 'medium',
    'Low': 'low',
  };
  return priorityMap[priority] || 'medium';
};

