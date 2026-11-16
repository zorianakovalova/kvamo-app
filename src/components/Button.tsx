import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { colors, radius, shadow } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'link' | 'danger';
  icon?: IconName;
  loading?: boolean;
};

/** Action button from Figma: 56 px, full radius. Primary is ink, secondary is white with a soft shadow. */
export function Button({ label, variant = 'primary', icon, loading, disabled, style, ...rest }: Props) {
  const primary = variant === 'primary' || variant === 'danger';
  const off = disabled && !loading;
  const textColor = primary ? (off ? colors.textSecondary : colors.textInverse) : off ? colors.textTertiary : colors.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      {...rest}
      style={(state) => [
        styles.base,
        styles[variant],
        primary && off && styles.primaryOff,
        state.pressed && { opacity: 0.85 },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : icon ? (
        <View>
          <Icon name={icon} size={24} color={textColor} />
        </View>
      ) : null}
      <Text variant="headline" color={textColor} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.pill },
  primary: { backgroundColor: colors.ink, height: 56, paddingHorizontal: 16 },
  danger: { backgroundColor: colors.error, height: 56, paddingHorizontal: 16 },
  primaryOff: { backgroundColor: colors.border },
  secondary: { backgroundColor: colors.surface, height: 56, paddingHorizontal: 16, ...shadow.ink6 },
  outline: { backgroundColor: colors.surface, height: 56, paddingHorizontal: 16, borderWidth: 1.5, borderColor: colors.border },
  link: { height: 44, paddingHorizontal: 8, alignSelf: 'center' },
});
