// types/User.ts

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  gender?: string; // Agregado campo género
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  interests: string[];
  distance: number;
  gender?: string; // Agregado campo género
}

export interface Match {
  id: string;
  userId: string;
  profileId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  profile: Profile;
}