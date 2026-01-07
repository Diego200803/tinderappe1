import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, age: number, gender: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      console.log('🔍 Usuario actual:', currentUser?.name || 'No hay usuario');
      setUser(currentUser);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await authService.login(email, password);
      console.log('✅ Login exitoso:', loggedUser.name);
      setUser(loggedUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, age: number, gender: string) => {
    try {
      const newUser = await authService.register(email, password, name, age, gender);
      console.log('✅ Registro exitoso:', newUser.name);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      // Primero eliminar del AsyncStorage
      await authService.logout();
      
      // Luego limpiar el estado
      setUser(null);
      
      console.log('✅ Logout completado exitosamente');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Forzar limpieza del estado aunque falle
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};