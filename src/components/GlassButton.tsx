import { Pressable, StyleSheet } from 'react-native';

import { colors, shadow } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';

type Props = { icon: IconName; label: string; onPress: () => void };

/** 44 px round glass button for Back / Close in the nav bar. */
export function GlassButton({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    ...shadow.ink6,
  },
});
