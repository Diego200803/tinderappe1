import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login' as any);
    }
  }, [user]);

  if (!user) return null;

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
            <Text style={{ fontSize: 24, color }}>{String.fromCodePoint(0x1F525)}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>{String.fromCodePoint(0x1F48C)}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>{String.fromCodePoint(0x1F49D)}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>{String.fromCodePoint(0x1F464)}</Text>
          ),
        }}
      />
    </Tabs>
  );
}