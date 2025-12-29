import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { MatchProvider } from '../context/MatchContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MatchProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </MatchProvider>
    </AuthProvider>
  );
}
