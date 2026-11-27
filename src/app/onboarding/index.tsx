import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from '@/lib/insets';

import { GradientBackground } from '@/components/GradientBackground';

const splash = require('../../../assets/img/splash-frog.png');

/** 01 Splash: "квамо" wordmark and the frog, then Welcome. */
export default function Splash() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const next = () => router.replace('/onboarding/welcome');

  useEffect(() => {
    const t = setTimeout(next, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Pressable style={styles.screen} onPress={next} accessibilityLabel="Квамо" accessibilityRole="image">
      <GradientBackground />
      <Image source={splash} contentFit="cover" contentPosition="top" style={{ position: 'absolute', top: insets.top, left: 0, width, height: Math.max((width * 2379) / 1179, height - insets.top) }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, overflow: 'hidden' } });
