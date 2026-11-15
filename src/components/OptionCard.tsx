import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

type Props = {
  label?: string;
  selected: boolean;
  onPress: () => void;
  /** radio = one answer, checkbox = several, none = value card without a control. */
  control?: 'radio' | 'checkbox' | 'none';
  children?: ReactNode;
};

/** Answer card from Figma: white, 16 radius; selected turns ink with inverse text. */
export function OptionCard({ label, selected, onPress, control = 'radio', children }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={control === 'checkbox' ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && !selected && { opacity: 0.85 }]}
    >
      {control !== 'none' && (
        <View style={[styles.control, control === 'checkbox' && { borderRadius: radius.control }, selected && styles.controlOn]}>
          {selected && <Icon name="check" size={16} color={colors.ink} strokeWidth={2.5} />}
        </View>
      )}
      <View style={{ flex: 1 }}>
        {children ?? (
          <Text variant="bodyMedium" color={selected ? colors.textInverse : colors.textPrimary}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 56,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  selected: { backgroundColor: colors.ink, borderColor: colors.ink },
  control: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  controlOn: { borderColor: '#fff' },
});
