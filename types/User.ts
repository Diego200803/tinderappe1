export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    age: number;
    bio: string;
    photo: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    age: number;
    bio: string;
    photo: string;
    interests: string[];
    distance: number;
  }
  
  export interface Match {
    id: string;
    userId: string;
    profileId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    profile: Profile;
  }