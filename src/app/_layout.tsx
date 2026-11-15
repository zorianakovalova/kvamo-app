import { Unbounded_600SemiBold } from '@expo-google-fonts/unbounded';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProfileProvider, useProfile } from '@/store/profile';
import { ProgressProvider, useProgress } from '@/store/progress';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({ Unbounded_600SemiBold });
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <ProfileProvider>
          <StatusBar style="dark" />
          <Root />
        </ProfileProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const profile = useProfile();
  const progress = useProgress();
  const ready = profile.ready && progress.ready;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="account" options={{ animation: 'fade' }} />
      <Stack.Screen name="lesson/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
