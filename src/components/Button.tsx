import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors, radius } from '@/theme/tokens';
import { Text } from './Text';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'chip';
};

export function Button({ label, variant = 'primary', style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text variant={variant === 'chip' ? 'caption' : 'label'} color={variant === 'primary' ? colors.textOnDark : colors.textPrimary} style={variant === 'chip' && { fontFamily: 'Onest_600SemiBold' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  primary: { backgroundColor: colors.ink, height: 56, paddingHorizontal: 24 },
  secondary: { backgroundColor: colors.surface, height: 56, paddingHorizontal: 24, borderWidth: 1, borderColor: colors.border },
  chip: { backgroundColor: 'rgba(255,255,255,0.75)', paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start' },
});
