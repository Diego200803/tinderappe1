import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Photo {
  id: string;
  uri: string;
  timestamp: number;
}

interface GalleryStore {
  photos: Photo[];
  addPhoto: (uri: string) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  loadPhotos: () => Promise<void>;
  clearGallery: () => Promise<void>;
}

const STORAGE_KEY = '@findlove_gallery';

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  photos: [],

  addPhoto: async (uri: string) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      uri,
      timestamp: Date.now(),
    };

    const updatedPhotos = [newPhoto, ...get().photos];
    set({ photos: updatedPhotos });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
      console.log('✅ Photo saved to gallery:', newPhoto.id);
    } catch (error) {
      console.error('Error saving photo to storage:', error);
    }
  },

  removePhoto: async (id: string) => {
    const updatedPhotos = get().photos.filter(photo => photo.id !== id);
    set({ photos: updatedPhotos });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
      console.log('🗑️ Photo removed from gallery:', id);
    } catch (error) {
      console.error('Error removing photo from storage:', error);
    }
  },

  loadPhotos: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const photos = JSON.parse(stored);
        set({ photos });
        console.log('📂 Loaded photos from storage:', photos.length);
      }
    } catch (error) {
      console.error('Error loading photos from storage:', error);
    }
  },

  clearGallery: async () => {
    set({ photos: [] });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('🧹 Gallery cleared');
    } catch (error) {
      console.error('Error clearing gallery:', error);
    }
  },
}));