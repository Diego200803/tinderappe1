import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { MatchProvider } from '../context/MatchContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MatchProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </MatchProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}