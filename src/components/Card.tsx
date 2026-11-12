import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadow } from '@/theme/tokens';

type Props = ViewProps & { tone?: 'glass' | 'soft' };

/** Frosted white card used for the "Зараз" summary and module banners. */
export function Card({ tone = 'glass', style, ...rest }: Props) {
  return <View {...rest} style={[styles.base, tone === 'glass' ? styles.glass : styles.soft, style]} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  glass: { backgroundColor: colors.surfaceGlass, ...shadow.card },
  soft: { backgroundColor: colors.surfaceGlassSoft },
});
