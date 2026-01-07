import { Profile } from './User';

export interface Match {
  id: string;
  userId: string;
  profileId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  profile: Profile;
}

export interface MatchStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}