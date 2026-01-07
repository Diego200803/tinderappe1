import { Profile } from '../types/User';
import { Match } from '../types/Match';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Perfiles femeninos
const FEMALE_PROFILES: Profile[] = [
  {
    id: 'f1',
    name: 'María',
    age: 24,
    bio: 'Amante del café y los gatos 🐱☕',
    photo: 'https://randomuser.me/api/portraits/women/10.jpg',
    interests: ['Viajes', 'Fotografía', 'Café'],
    distance: 2,
    gender: 'female'
  },
  {
    id: 'f2',
    name: 'Laura',
    age: 26,
    bio: 'Bailarina profesional 💃',
    photo: 'https://randomuser.me/api/portraits/women/20.jpg',
    interests: ['Baile', 'Música', 'Fitness'],
    distance: 5,
    gender: 'female'
  },
  {
    id: 'f3',
    name: 'Sofía',
    age: 23,
    bio: 'Aventurera y amante de la naturaleza 🌿',
    photo: 'https://randomuser.me/api/portraits/women/30.jpg',
    interests: ['Senderismo', 'Camping', 'Yoga'],
    distance: 3,
    gender: 'female'
  },
  {
    id: 'f4',
    name: 'Valentina',
    age: 27,
    bio: 'Chef y foodie apasionada 🍕',
    photo: 'https://randomuser.me/api/portraits/women/40.jpg',
    interests: ['Cocina', 'Vino', 'Restaurantes'],
    distance: 4,
    gender: 'female'
  },
  {
    id: 'f5',
    name: 'Isabella',
    age: 25,
    bio: 'Diseñadora gráfica y artista 🎨',
    photo: 'https://randomuser.me/api/portraits/women/50.jpg',
    interests: ['Arte', 'Diseño', 'Cine'],
    distance: 1,
    gender: 'female'
  },
  {
    id: 'f6',
    name: 'Camila',
    age: 22,
    bio: 'Estudiante de medicina y lectora 📚',
    photo: 'https://randomuser.me/api/portraits/women/60.jpg',
    interests: ['Lectura', 'Ciencia', 'Música'],
    distance: 6,
    gender: 'female'
  },
  {
    id: 'f7',
    name: 'Daniela',
    age: 28,
    bio: 'Ingeniera y gamer 🎮',
    photo: 'https://randomuser.me/api/portraits/women/70.jpg',
    interests: ['Gaming', 'Tecnología', 'Anime'],
    distance: 7,
    gender: 'female'
  },
  {
    id: 'f8',
    name: 'Andrea',
    age: 24,
    bio: 'Fotógrafa de viajes ✈️📷',
    photo: 'https://randomuser.me/api/portraits/women/80.jpg',
    interests: ['Viajes', 'Fotografía', 'Aventura'],
    distance: 8,
    gender: 'female'
  }
];

// Perfiles masculinos
const MALE_PROFILES: Profile[] = [
  {
    id: 'm1',
    name: 'Carlos',
    age: 28,
    bio: 'Desarrollador y gamer apasionado 🎮💻',
    photo: 'https://randomuser.me/api/portraits/men/10.jpg',
    interests: ['Tecnología', 'Gaming', 'Música'],
    distance: 3,
    gender: 'male'
  },
  {
    id: 'm2',
    name: 'Diego',
    age: 26,
    bio: 'Músico y amante del rock 🎸',
    photo: 'https://randomuser.me/api/portraits/men/20.jpg',
    interests: ['Música', 'Conciertos', 'Viajes'],
    distance: 5,
    gender: 'male'
  },
  {
    id: 'm3',
    name: 'Alejandro',
    age: 30,
    bio: 'Arquitecto soñador 🏗️✨',
    photo: 'https://randomuser.me/api/portraits/men/30.jpg',
    interests: ['Arte', 'Diseño', 'Cine'],
    distance: 2,
    gender: 'male'
  },
  {
    id: 'm4',
    name: 'Miguel',
    age: 25,
    bio: 'Chef profesional y foodie 👨‍🍳',
    photo: 'https://randomuser.me/api/portraits/men/40.jpg',
    interests: ['Cocina', 'Gastronomía', 'Vino'],
    distance: 4,
    gender: 'male'
  },
  {
    id: 'm5',
    name: 'Santiago',
    age: 27,
    bio: 'Fotógrafo y viajero 📸✈️',
    photo: 'https://randomuser.me/api/portraits/men/50.jpg',
    interests: ['Fotografía', 'Viajes', 'Aventura'],
    distance: 6,
    gender: 'male'
  },
  {
    id: 'm6',
    name: 'Fernando',
    age: 29,
    bio: 'Entrenador personal fitness 💪',
    photo: 'https://randomuser.me/api/portraits/men/60.jpg',
    interests: ['Fitness', 'Deporte', 'Salud'],
    distance: 3,
    gender: 'male'
  },
  {
    id: 'm7',
    name: 'Andrés',
    age: 24,
    bio: 'Estudiante de derecho y lector 📚',
    photo: 'https://randomuser.me/api/portraits/men/70.jpg',
    interests: ['Lectura', 'Política', 'Café'],
    distance: 7,
    gender: 'male'
  },
  {
    id: 'm8',
    name: 'Roberto',
    age: 31,
    bio: 'Emprendedor y amante del café ☕',
    photo: 'https://randomuser.me/api/portraits/men/80.jpg',
    interests: ['Negocios', 'Café', 'Networking'],
    distance: 5,
    gender: 'male'
  }
];

// Almacenamiento en memoria de matches
let matches: Match[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const matchService = {
  // Obtener perfiles disponibles según el género del usuario
  getProfiles: async (userId: string): Promise<Profile[]> => {
    await delay(300);
    
    try {
      // Obtener el usuario actual para saber su género
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ No hay usuario logueado');
        return [];
      }
      
      const currentUser = JSON.parse(userStr);
      console.log('👤 Usuario actual:', currentUser.name, 'Género:', currentUser.gender);
      
      // Seleccionar perfiles según el género del usuario
      let availableProfiles: Profile[] = [];
      
      if (currentUser.gender === 'male') {
        // Si es hombre, mostrar mujeres
        availableProfiles = FEMALE_PROFILES;
        console.log('👨 Usuario masculino: mostrando perfiles femeninos');
      } else if (currentUser.gender === 'female') {
        // Si es mujer, mostrar hombres
        availableProfiles = MALE_PROFILES;
        console.log('👩 Usuario femenino: mostrando perfiles masculinos');
      } else {
        // Para otros géneros, mostrar todos
        availableProfiles = [...FEMALE_PROFILES, ...MALE_PROFILES];
        console.log('🌈 Otro género: mostrando todos los perfiles');
      }
      
      // Filtrar perfiles que ya fueron vistos
      const viewedProfileIds = matches
        .filter(m => m.userId === userId)
        .map(m => m.profileId);
      
      const filteredProfiles = availableProfiles.filter(p => !viewedProfileIds.includes(p.id));
      console.log(`📋 Perfiles disponibles: ${filteredProfiles.length}`);
      
      return filteredProfiles;
    } catch (error) {
      console.error('❌ Error al obtener perfiles:', error);
      return [];
    }
  },

  // Hacer swipe (like o dislike)
  swipeProfile: async (userId: string, profileId: string, action: 'like' | 'dislike'): Promise<Match> => {
    await delay(200);

    // Buscar en ambos arrays
    const allProfiles = [...FEMALE_PROFILES, ...MALE_PROFILES];
    const profile = allProfiles.find(p => p.id === profileId);
    
    if (!profile) {
      throw new Error('Perfil no encontrado');
    }

    // CORRECCIÓN: Los likes van como 'accepted' directamente
    const newMatch: Match = {
      id: Date.now().toString(),
      userId,
      profileId,
      status: action === 'like' ? 'accepted' : 'rejected',
      createdAt: new Date().toISOString(),
      profile
    };

    matches.push(newMatch);
    console.log('✅ Match creado:', {
      id: newMatch.id,
      profile: profile.name,
      status: newMatch.status
    });
    
    return newMatch;
  },

  // Obtener solicitudes pendientes (para la pantalla de Requests)
  getPendingMatches: async (userId: string): Promise<Match[]> => {
    await delay(300);
    const pending = matches.filter(m => m.userId === userId && m.status === 'pending');
    console.log('📋 Solicitudes pendientes:', pending.length);
    return pending;
  },

  // Obtener matches aceptados
  getAcceptedMatches: async (userId: string): Promise<Match[]> => {
    await delay(300);
    const accepted = matches.filter(m => m.userId === userId && m.status === 'accepted');
    console.log('💖 Matches aceptados:', accepted.length, accepted.map(m => m.profile.name));
    return accepted;
  },

  // Aceptar o rechazar una solicitud
  respondToMatch: async (matchId: string, action: 'accept' | 'reject'): Promise<Match> => {
    await delay(200);

    const match = matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match no encontrado');
    }

    match.status = action === 'accept' ? 'accepted' : 'rejected';
    console.log(`${action === 'accept' ? '✅' : '❌'} Match respondido:`, match.profile.name);
    return match;
  },

  // Obtener estadísticas
  getStats: async (userId: string) => {
    await delay(200);
    
    const userMatches = matches.filter(m => m.userId === userId);
    
    return {
      total: userMatches.length,
      pending: userMatches.filter(m => m.status === 'pending').length,
      accepted: userMatches.filter(m => m.status === 'accepted').length,
      rejected: userMatches.filter(m => m.status === 'rejected').length
    };
  },

  // Método para debugging - ver todos los matches
  getAllMatches: () => {
    console.log('🔍 Todos los matches:', matches);
    return matches;
  }
};