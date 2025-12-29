export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    age: number;
    bio: string;
    photo: string;
  }
  
  export interface Match {
    id: string;
    userId: string;
    targetUserId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }