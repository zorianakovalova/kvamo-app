import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadow } from '@/theme/tokens';

/** White glass card (surface/glass-strong, glass edge, ink-6 shadow). */
export function GlassCard({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    ...shadow.ink6,
  },
});
