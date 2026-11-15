import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { GradientBackground } from '@/components/GradientBackground';
import { Text } from '@/components/Text';
import { colors, space } from '@/theme/tokens';

/** Placeholder until the Library screens are built from Figma. */
export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: space.lg }}>
      <GradientBackground />
      <Text variant="largeTitle" accessibilityRole="header" style={{ paddingHorizontal: 4, paddingVertical: space.md }}>
        Бібліотека
      </Text>
      <GlassCard style={{ padding: space.lg, marginTop: space.sm, gap: 4 }}>
        <Text variant="headline">Скоро тут будуть статті, симуляції та тести</Text>
        <Text variant="subheadline" color={colors.textSecondary}>
          Матеріали з усіх модулів, щоб повертатися до них у будь-який момент.
        </Text>
      </GlassCard>
    </View>
  );
}
