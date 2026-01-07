import React from 'react';
import { Tabs, useRouter, useRootNavigationState } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const hasCheckedAuth = React.useRef(false);

  React.useEffect(() => {
    // Esperar a que la navegación esté lista
    if (!rootNavigationState?.key) {
      return;
    }

    // Si está cargando, no hacer nada
    if (loading) {
      return;
    }

    // Si no hay usuario y no hemos verificado antes
    if (!user && !hasCheckedAuth.current) {
      console.log('🚫 [TabsLayout] No hay usuario, redirigiendo a login...');
      hasCheckedAuth.current = true;
      
      // Pequeño delay para asegurar que la navegación está lista
      setTimeout(() => {
        router.replace('/auth/login');
      }, 50);
    }

    // Si hay usuario, marcar como verificado
    if (user) {
      hasCheckedAuth.current = false;
    }
  }, [user, loading, rootNavigationState?.key, router]);

  // Mostrar loading mientras se verifica auth
  if (loading) {
    return null;
  }

  // No renderizar tabs si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FE3C72',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🔥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>💌</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>💝</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Cámara',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📸</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Galería',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🖼️</Text>
          ),
        }}
      />
    </Tabs>
  );
}