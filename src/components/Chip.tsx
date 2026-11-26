import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme/tokens';
import { Text } from './Text';

type Props = { label: string; tone?: 'glass' | 'glassLight' | 'ink'; size?: 'sm' | 'md'; style?: ViewStyle };

/** Small pill label: glass (0.88), light glass (0.72) or ink. */
export function Chip({ label, tone = 'glass', size = 'sm', style }: Props) {
  const ink = tone === 'ink';
  return (
    <View style={[styles.base, styles[tone], size === 'md' && styles.md, style]}>
      <Text
        variant={size === 'md' ? 'text14' : tone === 'glassLight' ? 'captionMedium' : 'captionStrong'}
        color={ink ? colors.textInverse : colors.textPrimary}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  md: { paddingHorizontal: 12, paddingVertical: 4 },
  glass: { backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.borderGlass },
  glassLight: { backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glass, paddingVertical: 2 },
  ink: { backgroundColor: colors.ink },
});
