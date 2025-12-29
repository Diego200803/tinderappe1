import { Profile, Match } from '../types/User';

// Perfiles simulados para hacer swipe
const MOCK_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'María',
    age: 24,
    bio: 'Amante del café y los gatos 🐱☕',
    photo: 'https://randomuser.me/api/portraits/women/10.jpg',
    interests: ['Viajes', 'Fotografía', 'Café'],
    distance: 2
  },
  {
    id: 'p2',
    name: 'Laura',
    age: 26,
    bio: 'Bailarina profesional 💃',
    photo: 'https://randomuser.me/api/portraits/women/20.jpg',
    interests: ['Baile', 'Música', 'Fitness'],
    distance: 5
  },
  {
    id: 'p3',
    name: 'Sofía',
    age: 23,
    bio: 'Aventurera y amante de la naturaleza 🌿',
    photo: 'https://randomuser.me/api/portraits/women/30.jpg',
    interests: ['Senderismo', 'Camping', 'Yoga'],
    distance: 3
  },
  {
    id: 'p4',
    name: 'Valentina',
    age: 27,
    bio: 'Chef y foodie apasionada 🍕',
    photo: 'https://randomuser.me/api/portraits/women/40.jpg',
    interests: ['Cocina', 'Vino', 'Restaurantes'],
    distance: 4
  },
  {
    id: 'p5',
    name: 'Isabella',
    age: 25,
    bio: 'Diseñadora gráfica y artista 🎨',
    photo: 'https://randomuser.me/api/portraits/women/50.jpg',
    interests: ['Arte', 'Diseño', 'Cine'],
    distance: 1
  },
  {
    id: 'p6',
    name: 'Camila',
    age: 22,
    bio: 'Estudiante de medicina y lectora 📚',
    photo: 'https://randomuser.me/api/portraits/women/60.jpg',
    interests: ['Lectura', 'Ciencia', 'Música'],
    distance: 6
  },
  {
    id: 'p7',
    name: 'Daniela',
    age: 28,
    bio: 'Ingeniera y gamer 🎮',
    photo: 'https://randomuser.me/api/portraits/women/70.jpg',
    interests: ['Gaming', 'Tecnología', 'Anime'],
    distance: 7
  },
  {
    id: 'p8',
    name: 'Andrea',
    age: 24,
    bio: 'Fotógrafa de viajes ✈️📷',
    photo: 'https://randomuser.me/api/portraits/women/80.jpg',
    interests: ['Viajes', 'Fotografía', 'Aventura'],
    distance: 8
  }
];

// Almacenamiento en memoria de matches
let matches: Match[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const matchService = {
  // Obtener perfiles disponibles
  getProfiles: async (userId: string): Promise<Profile[]> => {
    await delay(300);
    
    // Filtrar perfiles que ya fueron vistos
    const viewedProfileIds = matches
      .filter(m => m.userId === userId)
      .map(m => m.profileId);
    
    return MOCK_PROFILES.filter(p => !viewedProfileIds.includes(p.id));
  },

  // Hacer swipe (like o dislike)
  swipeProfile: async (userId: string, profileId: string, action: 'like' | 'dislike'): Promise<Match> => {
    await delay(200);

    const profile = MOCK_PROFILES.find(p => p.id === profileId);
    if (!profile) {
      throw new Error('Perfil no encontrado');
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      userId,
      profileId,
      status: action === 'like' ? 'pending' : 'rejected',
      createdAt: new Date().toISOString(),
      profile
    };

    matches.push(newMatch);
    return newMatch;
  },

  // Obtener solicitudes pendientes
  getPendingMatches: async (userId: string): Promise<Match[]> => {
    await delay(300);
    return matches.filter(m => m.userId === userId && m.status === 'pending');
  },

  // Obtener matches aceptados
  getAcceptedMatches: async (userId: string): Promise<Match[]> => {
    await delay(300);
    return matches.filter(m => m.userId === userId && m.status === 'accepted');
  },

  // Aceptar o rechazar una solicitud
  respondToMatch: async (matchId: string, action: 'accept' | 'reject'): Promise<Match> => {
    await delay(200);

    const match = matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match no encontrado');
    }

    match.status = action === 'accept' ? 'accepted' : 'rejected';
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
  }
};