import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Profile, Match } from '../types/User';
import { matchService } from '../services/matchService';
import { useAuth } from './AuthContext';

interface MatchContextType {
  profiles: Profile[];
  pendingMatches: Match[];
  acceptedMatches: Match[];
  loading: boolean;
  loadProfiles: () => Promise<void>;
  swipe: (profileId: string, action: 'like' | 'dislike') => Promise<void>;
  loadPendingMatches: () => Promise<void>;
  loadAcceptedMatches: () => Promise<void>;
  respondToMatch: (matchId: string, action: 'accept' | 'reject') => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
  const [acceptedMatches, setAcceptedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await matchService.getProfiles(user.id);
      setProfiles(data);
    } catch (error) {
      console.error('Error al cargar perfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const swipe = async (profileId: string, action: 'like' | 'dislike') => {
    if (!user) return;

    try {
      await matchService.swipeProfile(user.id, profileId, action);
      // Remover el perfil de la lista
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      console.error('Error al hacer swipe:', error);
    }
  };

  const loadPendingMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await matchService.getPendingMatches(user.id);
      setPendingMatches(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAcceptedMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await matchService.getAcceptedMatches(user.id);
      setAcceptedMatches(data);
    } catch (error) {
      console.error('Error al cargar matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToMatch = async (matchId: string, action: 'accept' | 'reject') => {
    try {
      await matchService.respondToMatch(matchId, action);
      // Actualizar listas
      await loadPendingMatches();
      await loadAcceptedMatches();
    } catch (error) {
      console.error('Error al responder match:', error);
    }
  };

  return (
    <MatchContext.Provider value={{
      profiles,
      pendingMatches,
      acceptedMatches,
      loading,
      loadProfiles,
      swipe,
      loadPendingMatches,
      loadAcceptedMatches,
      respondToMatch
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch debe ser usado dentro de MatchProvider');
  }
  return context;
};