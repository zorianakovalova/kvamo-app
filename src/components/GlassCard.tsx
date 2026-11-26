import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius } from '@/theme/tokens';

/** White glass card (surface/glass-strong, glass edge). */
export function GlassCard({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
});
