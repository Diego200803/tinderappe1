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
    } catch (error) {
      // Error silencioso
    }
  },

  removePhoto: async (id: string) => {
    const updatedPhotos = get().photos.filter(photo => photo.id !== id);
    set({ photos: updatedPhotos });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
    } catch (error) {
      // Error silencioso
    }
  },

  loadPhotos: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const photos = JSON.parse(stored);
        set({ photos });
      }
    } catch (error) {
      // Error silencioso
    }
  },

  clearGallery: async () => {
    set({ photos: [] });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Error silencioso
    }
  },
}));