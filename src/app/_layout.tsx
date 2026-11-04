import '../global.css';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AkunProvider } from '../context/AkunContext';
import { PesananProvider } from '../context/PesananContext';

export default function RootLayout() {
  const [fontSiap] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontSiap) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AkunProvider>
        <PesananProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F7F9FB' },
            }}
          />
        </PesananProvider>
      </AkunProvider>
    </SafeAreaProvider>
  );
}
