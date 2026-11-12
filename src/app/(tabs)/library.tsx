import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { GradientBackground } from '@/components/GradientBackground';
import { Text } from '@/components/Text';
import { colors, space } from '@/theme/tokens';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#eef8e3', paddingTop: insets.top + space.md, paddingHorizontal: space.lg }}>
      <GradientBackground />
      <Text variant="screenTitle" accessibilityRole="header" style={{ paddingHorizontal: 4, paddingTop: space.md }}>
        Бібліотека
      </Text>
      <Card style={{ padding: space.lg, marginTop: space.lg }}>
        <Text variant="label">Скоро тут будуть статті, симуляції та тести</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
          Матеріали з усіх модулів, щоб повертатися до них у будь-який момент.
        </Text>
      </Card>
    </View>
  );
}
