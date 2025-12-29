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
    return user;
  },

  // Register
  register: async (email: string, password: string, name: string, age: number): Promise<User> => {
    await delay(500);

    // Verificar si el email ya existe
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      throw new Error('El email ya está registrado');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      age,
      bio: '',
      photo: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50)}.jpg`
    };

    MOCK_USERS.push(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },

  // Logout
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<User | null> => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};