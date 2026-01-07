import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

// Base de datos simulada de usuarios
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'user1@tinder.com',
    password: '123456',
    name: 'Ana García',
    age: 25,
    bio: 'Amante de los viajes y la fotografía',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: '2',
    email: 'user2@tinder.com',
    password: '123456',
    name: 'Carlos López',
    age: 28,
    bio: 'Desarrollador y gamer',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Guardar sesión
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('✅ Usuario guardado en AsyncStorage');
    return user;
  },

  // Register
  register: async (email: string, password: string, name: string, age: number, gender: string): Promise<User> => {
    await delay(500);

    // Verificar si el email ya existe
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      throw new Error('El email ya está registrado');
    }

    // Generar foto aleatoria según el género
    const photoNumber = Math.floor(Math.random() * 80) + 1;
    let photoUrl = '';
    
    if (gender === 'male') {
      photoUrl = `https://randomuser.me/api/portraits/men/${photoNumber}.jpg`;
    } else if (gender === 'female') {
      photoUrl = `https://randomuser.me/api/portraits/women/${photoNumber}.jpg`;
    } else {
      // Para otros géneros, elegir aleatoriamente
      const isMale = Math.random() > 0.5;
      photoUrl = isMale 
        ? `https://randomuser.me/api/portraits/men/${photoNumber}.jpg`
        : `https://randomuser.me/api/portraits/women/${photoNumber}.jpg`;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      age,
      bio: '',
      photo: photoUrl,
      gender
    };

    MOCK_USERS.push(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    console.log('✅ Nuevo usuario registrado:', newUser.name, 'Género:', gender);
    return newUser;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      console.log('🚪 [authService] Iniciando logout...');
      
      // Método 1: Remover usuario específico
      await AsyncStorage.removeItem('user');
      
      // Método 2: Verificar múltiples veces
      for (let i = 0; i < 3; i++) {
        const check = await AsyncStorage.getItem('user');
        if (check === null) {
          console.log(`✅ [authService] Sesión eliminada (intento ${i + 1})`);
          break;
        } else {
          console.warn(`⚠️ [authService] Reintentando eliminar sesión (${i + 1})`);
          await AsyncStorage.removeItem('user');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Método 3: Si nada funciona, limpiar todo el storage
      const finalCheck = await AsyncStorage.getItem('user');
      if (finalCheck !== null) {
        console.warn('⚠️ [authService] Limpiando todo el storage');
        await AsyncStorage.clear();
      }
      
      console.log('✅ [authService] Logout completado');
      return Promise.resolve();
    } catch (error) {
      console.error('❌ [authService] Error:', error);
      // Intentar limpiar todo como último recurso
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error('❌ No se pudo limpiar el storage');
      }
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 Usuario encontrado en AsyncStorage:', user.name);
        return user;
      }
      
      console.log('👤 No hay usuario en AsyncStorage');
      return null;
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error);
      return null;
    }
  }
};